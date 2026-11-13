export { Patron, requestsContainer };

class Patron {
    element = null;
    detector = null;
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
        this.element = el;
        let img = createImg('assets/genrePattern.png');
        img.style.margin = '16px';
        this.element.appendChild(img);
        this.element.appendChild(createEl('div', this.request));
        //let box = new Sprite(0, 0, 300, 100, STATIC);
        //box.color = '#FFFFFF20';
        return this.element;
    }
}

function renderPatronArt(imageString) {
    return load('assets/genrePattern.png');
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