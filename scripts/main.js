import { Book } from './book.js';
import { Patron } from './patron.js';
import { LibraryManager } from './manager.js'
import { me, guests, showCursors, updateMyCursorPosition, cursorSetup } from './cursors.js';
import { LevelManager } from './level.js'


// load the shared object
// and provide starting values for the object to be used
// if there are no clients already connected to the room
const shared = await p5party.loadShared("shared", { x: 100, y: 100, books:[], patrons:[], updateCount:0 });


// Set up canvas and objects

await Canvas(1920, 1080);

let libManager = null;
let lvlManager = null;


// Game mechanics

var currentx = shared.x;
var currenty = shared.y;

canvas.addEventListener("pointerdown", (e) => {
  // write shared data
  shared.x = e.offsetX;
  shared.y = e.offsetY;

});


q5.setup = function () {

  cursorSetup()

  lvlManager = new LevelManager();

  // Manage books, patrons, and (some parts of) GUI
  libManager = new LibraryManager(shared, p5party.isHost(), me);
  libManager.requestsBox.position(20, 40);
  libManager.requestsBox.size(316, 500);


}


q5.update = function () {
  background('skyblue');
  text('click to jump!', 0, -50);

  if (shared.x != currentx || shared.y != currenty) {
    lvlManager.ball.vel.y = -5;

    currentx = shared.x;
    currenty = shared.y;
  }

  showCursors();

  libManager.update();
};


p5.mouseMoved = function () {
  updateMyCursorPosition();
}

p5.mouseDragged = function () {
  updateMyCursorPosition();
} 