// get the room name from the query string
const room = new URLSearchParams(location.search).get("room");
console.log("room:", room);

if (room) {
  document.getElementById("room").value = room;
}

// connect to the party server
await p5party.connect("wss://demoserver.p5party.org", "little_librarie_lis534", room);

// load the shared object
// and provide starting values for the object to be used
// if there are no clients already connected to the room
const shared = await p5party.loadShared("shared", { x: 100, y: 100, books:[] });


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


// Set up canvas and world

await Canvas();
world.gravity.y = 10;

let ball = new Sprite();
ball.diameter = 50;
ball.img = ':)';

let groundA = new Sprite();
groundA.x = -120;
groundA.width = 220;
groundA.rotation = 30;
groundA.physics = STATIC;

let groundB = new Sprite();
groundB.x = 120;
groundB.width = 220;
groundB.rotation = -30;
groundB.physics = STATIC;

let ground = new Sprite();
ground.y = 240;
ground.width = 660;
ground.physics = STATIC;


// Set up books
// Maybe this should live inside a function called by the host to generate the books?
shared.books = {
	1: { id: 1, length: 20, height: 50, title: "", author: "", genre: "green", x: 10, y: -20 },
	2: { id: 2, length: 15, height: 40, title: "", author: "", genre: "red", x: 0, y: 0 }
}
var books = [];
for (var key in shared.books) {
	var b = shared.books[key];
	books.push(new Book(b.id, b.length, b.height, b.title, b.author, b.genre, b.x, b.y));
}


// Game mechanics

var currentx = shared.x;
var currenty = shared.y;

canvas.addEventListener("pointerdown", (e) => {
  // write shared data
  shared.x = e.offsetX;
  shared.y = e.offsetY;

});

q5.update = function () {
	background('skyblue');
	text('click to jump!', 0, -50);

    if(shared.x != currentx || shared.y != currenty){
    ball.vel.y = -5;

    currentx = shared.x;
    currenty = shared.y;
    }

	
};
