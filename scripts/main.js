import { Book } from './book.js';
import { Patron, requestsContainer } from './patron.js';

// load the shared object
// and provide starting values for the object to be used
// if there are no clients already connected to the room
const shared = await p5party.loadShared("shared", { x: 100, y: 100, books:[] });

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


// GUI

let requests = requestsContainer();
requests.position(20, 40);
requests.size(316, 500);

var patron1 = new Patron(0, "teststring", "Trying some request text", [0]);
var patron2 = new Patron(1, "teststring", "Another request", [0]);
requests.appendChild(patron1.display());
requests.appendChild(patron2.display());


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
