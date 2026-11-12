export { Book };

// Constructor for book sprite
// This is for rendering the books and listening for clicks/grabs
// The information keeping track of book attributes/status should stay in shared
// TO DO: track position/physics of book in shared?
const Book = class {
	constructor(id, length, height, title, author, genre, x, y) {

		// Book attributes copied here in case we want to reference them from this
		// instance of the object directly (as opposed to from shared)
		this.id = id;
		this.length = length;
		this.height = height;
		this.title = title;
		this.author = author;
		this.genre = genre;

		// Generate book art here using title+author+genre
		let img = renderBookArt(this.genre);

		// Use attributes to prepare Book for rendering
		let bookSprite = new Sprite();
		bookSprite.draw = function () {
			fill(bookSprite.color);
			rect(-bookSprite.width/2, -bookSprite.height/2, bookSprite.width, bookSprite.height);
			image(bookSprite.img);
		};
		this.sprite = bookSprite;
		this.sprite.width = length;
		this.sprite.height = height;
		this.sprite.img = img;
		this.sprite.color = genre;
		this.sprite.grabbable = true;
		this.sprite.x = x;
		this.sprite.y = y;
		//this.sprite.color = "#FF000020";
	}
	update() {
		// Update sprite if its status changes (e.g. give to patron)
	}
};

function renderBookArt(genre) {
	if (genre == "red") { return '@'; }
	else if (genre == "green") { return load('assets/genrePattern.png'); }
	else if (genre == "orange") { return '$'; }
	return 'O';
}
