export { Book };

// Constructor for book sprite
// This is for rendering the books and listening for clicks/grabs
// The information keeping track of book attributes/status should stay in shared
// TO DO: track position/physics of book in shared?
class Book extends class { constructor() { return new Sprite(); } } {
	constructor(id, length, height, title, author, genre, x, y) {

		super();

		// Book attributes copied here in case we want to reference them from this
		// instance of the object directly (as opposed to from shared)
		this.id = id;
		this.length = length;
		this.height = height;
		this.title = title;
		this.author = author;
		this.genre = genre;

		// Additional attributes
		this.grabbed = false;
		this.grabber = "";  // name of the user grabbing book
		this.loaned = false;
		this.patron = -1;   // ID of patron

		// Generate book art here using title+author+genre
		let img = renderBookArt(this.genre);

		// Set Sprite attributes needed for Book
		this.width = length;
		this.color = genre;
		this.grabbable = true;
		this.x = x;
		this.y = y;
		this.img = img;

		// Use attributes to render Book
		this.draw = function () {
			fill(this.genre);
			if (this.grabbed) {
				stroke('orange');
				strokeWeight(5);
			}
			else {
				stroke('black');
				strokeWeight(1);
			}
			rect(-this.width / 2, -this.height / 2, this.width, this.height);
			image(this.img);
			// Set stroke back to defaults for other objects after drawing book
			stroke('');
			strokeWeight(1);
		}

		this.update = function () {
			if (this.joints.length > 0) {
				if (this.grabbed == false) { this.updateCallback(); }
				this.grabbed = true;
			}
			else { this.grabbed = false; }
		}

		this.updateCallback = function () { console.log("Called updateCallback.") }

	}
	updateToShared() {
		// Update shared info if Book status changes (e.g. give to patron)
		// Call callback function from here?
		return null;
	}
	updateFromShared(info) {
		if (info.fulfilled) {
			this.grabbable = false;
			this.loaned = true;
			this.patron = info.patron;
		}
		else if (info.returned) {
			this.grabbable = true;
			this.loaned = false;
			this.patron = -1;
			// Add code to put in Return Bin
		}
		else if (info.grabbed) {
			this.grabbable = false;
			this.grabbed = true;
			this.grabber = info.grabber;
		}
		else {
			this.grabbable = true;
			this.grabbed = false;
			this.grabber = "";
		}
	}
};

function renderBookArt(genre) {
	if (genre == "red") { return '@'; }
	else if (genre == "green") { return load('assets/genrePattern.png'); }
	else if (genre == "orange") { return '$'; }
	return 'O';
}
