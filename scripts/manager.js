import { Patron } from './patron.js';
import { Book, genres, bookLengths, bookHeights } from './book.js';
export { LibraryManager, requestsContainer }


let trackObjectsWithHost = true;
let resolveObjectsWithHost = false;


class LibraryManager {

    // Networking
    shared = null;
    isHost = false;
    me = null;
    playerIDs = [];
    lastUpdateCount = 0;

    // Library stuff
    patrons = {};
    books = {};
    selectedBook = null;
    suggestedBook = null;
    requestsBox = null;

    constructor(sharedData, isHost, me) {

        this.shared = sharedData;
        this.isHost = isHost;
        this.me = me;

        // If player is host, initialize sharedData
        if (this.isHost) {
            console.log("Player is host. Generating shared data via LibraryManager");
            generatePatrons(this.shared, 2);
            generateBooks(this.shared, 5);
        }

        // Else, load data from sharedData
        else {
            console.log("Player is guest. Loading shared data to LibraryManager");
        }

        // Displaying of patron requests can be down client-side
        // Since LibraryManager already handles patron objects, let it handle the
        // displaying of patrons too 
        this.requestsBox = requestsContainer();

        // Generate local objects from sharedData
        for (var key in this.shared.patrons) {
            var p = this.shared.patrons[key];
            this.addPatron(new Patron(p.id, p.image, p.request, p.data));
        }
        for (var key in this.shared.books) {
            var b = this.shared.books[key];
            this.addBook(new Book(b.id, b.length, b.height, b.title, b.author, b.genre, b.x, b.y));
        }

    }
    addPatron(patron) {
        patron.manager = this;
        //this.patrons.push(patron);
        this.patrons[patron.ID] = patron;
        this.requestsBox.appendChild(patron.display());
    }
    addBook(book) {
        //this.books.push(book);
        this.books[book.id] = book;
        book.manager = this;
    }
    checkForBook() {
        console.log("Checking for book")
        if (this.selectedBook == null) { return false; }
        else {
            this.suggestedBook = this.selectedBook;
        }
    }
    clearAnySuggested() { this.suggestedBook = null; }
    tryFulfillingRequest(patron) {
        console.log("Attempting to fulfill patron request");
        if (this.suggestedBook == null) { return false; }
        else {
            console.log("Fulfilling request");
            // Update Shared info
            this.shared.books[this.suggestedBook.id].checkedout = true;
            this.shared.patrons[patron.ID].fulfilled = this.suggestedBook.id;
            this.shared.updateCount += 1;
            // Local info will be udpated in next call to update()
            // For now, clear suggested so that the game doesn't think a book is still
            // being suggested, and wait for update() to resolve this action.
            this.clearAnySuggested();
        }
        return;
    }
    selectBook(book) {
        this.shared.books[book.id].selected = [this.me.id, "", this.me.color];
        this.shared.updateCount += 1;
        console.log("update count:", this.shared.updateCount);
        console.log("Player ID:", this.me.id); 
        this.selectedBook = book;
    }
    deselect() {
        if (this.selectedBook != null) {
            this.shared.books[this.selectedBook.id].selected = ["", "", ""];
            this.shared.updateCount += 1;
            console.log("update count:", this.shared.updateCount);
            console.log("Book deselected by me");
            this.selectedBook = null;
        }
    }
    update() {
        // If request fulfilled locally but doesn't show up in shared, try updating shared again
        for (var i in this.patrons) {
            let p = this.patrons[i];
            if (p.fulfilled && (this.shared.patrons[p.ID].fulfilled == -1)) { 
                this.shared.patrons[p.ID].fulfilled = p.bookID; 
                this.shared.updateCount += 1;
            }
        }

        // If host is tracking physics, they must broadcast book positions continuously
        // and guests must reposition books based on host's broadcasts
        if (trackObjectsWithHost) {

            for (var i in this.books) {

                let b = this.books[i];

                if (this.isHost && !b.grabbedByOther) {
                    this.shared.books[b.id].x = b.x;
                    this.shared.books[b.id].y = b.y;
                    this.shared.books[b.id].rotation = b.rotation;
                }

                //else if (!this.isHost && b.grabbed && !b.grabbedByOther) {
                //    this.shared.books[b.id].x = b.x;
                //    this.shared.books[b.id].y = b.y;
                //    this.shared.books[b.id].rotation = b.rotation;
                //}

                else {
                    b.x = this.shared.books[b.id].x;
                    b.y = this.shared.books[b.id].y;
                    b.rotation = this.shared.books[b.id].rotation;
                }
            }
        }

        // For all other actions/events, only update when updateCount increases
        if (this.shared.updateCount > this.lastUpdateCount) {
            this.lastUpdateCount = this.shared.updateCount;
            for (var i in this.patrons) {
                let p = this.patrons[i];
                if (this.shared.patrons[p.ID].fulfilled > -1) {
                    let bookID = this.shared.patrons[p.ID].fulfilled;
                    let b = this.books[bookID];
                    b.checkOut();
                    p.fulfillRequest();
                    console.log("Updated patron:", p.ID);
                    console.log("Updated book:", b.id);
                }
            }
            for (var i in this.books) {

                let b = this.books[i];

                // If book flagged as deselected, free it up so anyone can grab it
                if (this.shared.books[b.id].selected[0] == "") {
                    if (b.grabbedByOther) {
                        console.log("Book deselected by other");
                        b.grabbable = true;
                        b.grabbedByOther = false;
                    }

                }

                // If book is flagged as selected find out which player should have control
                else if (this.shared.books[b.id].selected[0] != "") {

                    // If trackObjectsWithHost set to true, host does all tracking
                    if (resolveObjectsWithHost) {

                        // Only the host should resolve who has selected book
                        if (this.isHost && (this.shared.books[b.id].selected[1] == "")) {
                            this.shared.books[b.id].selected[1] = "yes";
                            this.shared.updateCount += 1;
                        }

                        // After resolving player control (selected[1] -> 1), set book display properties and physics
                        if (this.shared.books[b.id].selected[1] == "yes") {
                            if (this.shared.books[b.id].selected[0] == this.me.id) {
                                console.log("Book selected by me. My ID:", this.me.id);
                                b.strokeColorMe = validColor(this.me.color);
                            }
                            else {
                                console.log("Book selected by another player. Their ID:", this.shared.books[b.id].selected[0]);
                                if (this.selectedBook != null) {
                                    if (this.selectedBook.id == b.id) { this.selectedBook = null; }
                                }
                                b.grabbable = false;
                                b.grabbedByOther = true;
                                b.strokeColorOther = validColor(this.shared.books[b.id].selected[2]);
                            }
                        }
                    }

                    // If trackObjectsWithHost set to false, everyone tries to modify "shared" and whoever wins gets control
                    else {

                        let pid = this.shared.books[b.id].selected[0];

                        if (pid == this.me.id) {
                            console.log("Book " + b.id + " selected by me. My ID:", this.me.id);
                            b.strokeColorMe = validColor(this.shared.books[b.id].selected[2]);
                        }
                        else if (typeof pid === 'string' || pid instanceof String) {
                            console.log("Book " + b.id + " selected by another player. Their ID:", this.shared.books[b.id].selected[0]);
                            if (this.selectedBook != null) {
                                if (this.selectedBook.id == b.id) { this.selectedBook = null; }
                            }
                            b.grabbable = false;
                            b.grabbedByOther = true;
                            b.strokeColorOther = validColor(this.shared.books[b.id].selected[2]);
                        }
                        else {
                            //console.log{ "Player id not recognized" };
                        }
                    }
                }
            }
        }
    }
}


function validColor(strColor) {
    const s = new Option().style;
    s.color = strColor;
    if (s.color == '') { return '#ffffff'; }
    return strColor;
}

function generatePatron(i) {
    let bookLength = getRandomInt(3);
    let bookHeight = getRandomInt(3);
    let bookGenre = genres[getRandomInt(4)];
    let requestText = "A " + bookHeights[bookHeight] + " " + bookGenre + " " + bookLengths[bookLength];
    let requestInfo = { length: bookLength, height: bookHeight, genre: bookGenre };
    return { id: i, image: "z", request: requestText, requestInfo: requestInfo, fulfilled: -1, patience: 100, score: -1 }
}

function generatePatrons(shared, n = -1) {
    if (n == -1) {
        shared.patrons = {
            1: { id: 1, image: "teststr", request: "Trying some request text", fulfilled: -1, patience: 100, score: -1 },
            2: { id: 2, image: "default", request: "Another request", fulfilled: -1, patience: 100, score: -1 }
        };
    }
    else {
        let total_keys = Object.keys(shared.patrons).length;
        if (total_keys == 0) {
            shared.patrons = {};
        }
        for (let i = total_keys + 1; i < total_keys + n + 1; i++) {
            shared.patrons[i] = generatePatron(i);
        }
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function generateBook(i) {
    return {
        id: i,
        length: (getRandomInt(3) + 2) * 20,
        height: (getRandomInt(3) + 3) * 40,
        title: "", author: "",
        genre: genres[getRandomInt(4)],
        x: 10, y: -80,
        rotation: 0,
        selected: false,
        checkedout: false
    }
}

function generateBooks(shared, n=-1) {
  if (n == -1) {
    shared.books = {
      1: { id: 1, length: 20, height: 50, title: "", author: "", genre: "green", x: 10, y: -20, rotation: 0, selected: ["", "", ""], checkedout: false },
      2: { id: 2, length: 15, height: 40, title: "", author: "", genre: "red", x: 0, y: 0, rotation: 0, selected: ["", "", ""], checkedout: false }
    }
  }
  else {
    let total_keys = Object.keys(shared.books).length;
    if (total_keys == 0) {
      shared.books = {};
    }
    for (let i = total_keys + 1; i < total_keys + n + 1; i++) {
      shared.books[i] = generateBook(i);
      console.log("Generated book:", shared.books[i]);
    }

  }
}

function requestsContainer() {
    let requests = createEl('div', '');
    requests.classList.add("patron-requests-wrapper");
    return requests;
}