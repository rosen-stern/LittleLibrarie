export { LibraryManager, requestsContainer }

class LibraryManager {
    patrons = [];
    books = [];
    selectedBook = null;
    suggestedBook = null;
    requestsBox = null;
    constructor() {
        this.requestsBox = requestsContainer();
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

function requestsContainer() {
    let requests = createEl('div', '');
    requests.style.display = 'flex';
    requests.style.flexWrap = 'wrap';
    requests.style.alignContent = 'start';
    requests.style.justifyContent = 'center';
    requests.style.border = '2px solid #FFFFFF20';  // Remove this after debugging?
    return requests;
}