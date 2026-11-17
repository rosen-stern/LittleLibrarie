import { Patron } from './patron.js';
import { Book } from './book.js';
export { LibraryManager, requestsContainer }

class LibraryManager {

    shared = null;
    patrons = [];
    books = [];
    selectedBook = null;
    suggestedBook = null;
    requestsBox = null;

    constructor(sharedData, isHost) {

        this.shared = sharedData;

        // If player is host, initialize sharedData
        if (isHost) {
            console.log("Player is host. Generating shared data via LibraryManager")
            generatePatrons(this.shared, 2);
            generateBooks(this.shared, 5);
        }

        // Else, load data from sharedData
        else {
            console.log("Player is guest. Loading shared data to LibraryManager")
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
        this.patrons.push(patron);
        this.requestsBox.appendChild(patron.display());
    }
    addBook(book) {
        this.books.push(book);
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
            this.suggestedBook.checkOut();
            patron.fulfillRequest(this.suggestedBook);
            this.clearAnySuggested();
            // Add code to update Shared info
        }
        return;
    }
    selectBook(book) { this.selectedBook = book; }
    deselect() { this.selectedBook = null; }
}

function generatePatron(i) {
    return { id: i, image: "z", request: "Trying some request text", data: [0] }
}

function generatePatrons(shared, n = -1) {
    if (n == -1) {
        shared.patrons = {
            1: { id: 1, image: "teststr", request: "Trying some request text", data: [0] },
            2: { id: 2, image: "default", request: "Another request", data: [0] }
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
        title: "", author: "", genre: "green", x: 10, y: -80
    }
}

function generateBooks(shared, n=-1) {
    if (n == -1) {
        shared.books = {
            1: { id: 1, length: 20, height: 50, title: "", author: "", genre: "green", x: 10, y: -20 },
            2: { id: 2, length: 15, height: 40, title: "", author: "", genre: "red", x: 0, y: 0 }
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
    requests.style.display = 'flex';
    requests.style.flexWrap = 'wrap';
    requests.style.alignContent = 'start';
    requests.style.justifyContent = 'center';
    requests.style.border = '2px solid #FFFFFF20';  // Remove this after debugging?
    return requests;
}