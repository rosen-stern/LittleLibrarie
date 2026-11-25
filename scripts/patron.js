export { Patron };

class Patron {
    element = null;
    detector = null;
    mouseover = false;
    mousedownWhileHover = false;
    manager = null;
    fulfilled = false;
    bookID = -1;
    constructor(ID, imageString, request, data) {
        this.ID = ID;
        this.imageString = imageString;
        this.request = request;
        this.data = data;
        this.image = renderPatronArt(this.imageString);
        this.timer = -1.0;  // If positive and not paused, counts down via browser clock
    }
    display() {
        let el = createEl('div', '');
        el.classList.add("patron-request");
        el.addEventListener('mouseover', () => {
            if (this.fulfilled) { return; }
            this.mouseover = true;
            this.manager.checkForBook();
        });
        el.addEventListener('mouseout', () => {
            if (this.fulfilled) { return; }
            this.mouseover = false;
            this.mousedownWhileHover = false;
            this.manager.clearAnySuggested();
        });
        el.addEventListener('mousedown', () => {
            if (this.fulfilled) { return; }
            this.mousedownWhileHover = true;
        });
        el.addEventListener('mouseup', () => {
            if (this.fulfilled) { return; }
            if (this.mousedownWhileHover) { return; }
            else { this.manager.tryFulfillingRequest(this); }
        });
        this.element = el;
        let img = createImg('assets/avatar.png');
        img.classList.add("patron-avatar")
        this.element.appendChild(img);

        let speech_bubble = createEl('div', '');
        speech_bubble.classList.add("speech-bubble");

        let request_div = createEl('div', this.request);
        request_div.classList.add("request");
        speech_bubble.appendChild(request_div);

        this.element.appendChild(speech_bubble);

        this.element.classList.add("show")

        return this.element;
    }
    fulfillRequest(bookID) {


        this.element.classList.remove('show');
        this.element.addEventListener('transitionend', () => {
            this.element.classList.add('fulfilled');
            this.element.remove();
        }, { once: true });

        this.fulfilled = true;
        this.bookID = bookID;

        console.log("Patron request fulfilled")
    }
}

function renderPatronArt(imageString) {
    return load('assets/genrePattern.png');
}