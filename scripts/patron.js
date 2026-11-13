export { Patron };

class Patron {
    element = null;
    detector = null;
    mouseover = false;
    mousedownWhileHover = false;
    manager = null;
    fulfilled = false;
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
        el.size(300, 100);
        el.style.fontSize = '18px';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'start';
        el.style.backgroundColor = 'white';
        el.style.color = '#808080';
        el.style.borderRadius = '8px';
        el.style.margin = '6px';
        el.style.padding = '0 0 0 8px';
        el.style.minWidth = '300px';
        el.addEventListener('mouseover', () => {
            if (this.fulfilled) { return; }
            else { el.style.backgroundColor = 'cyan'; }
            this.mouseover = true;
            this.manager.checkForBook();
        });
        el.addEventListener('mouseout', () => {
            if (this.fulfilled) { return; }
            else { el.style.backgroundColor = 'white'; }
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
        let img = createImg('assets/genrePattern.png');
        img.style.margin = '16px';
        this.element.appendChild(img);
        this.element.appendChild(createEl('div', this.request));
        return this.element;
    }
    fulfillRequest() {
        this.element.style.backgroundColor = '#FFFFFF40';
        this.fulfilled = true;
    }
}

function renderPatronArt(imageString) {
    return load('assets/genrePattern.png');
}