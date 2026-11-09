// connect to the party server
await p5party.connect("wss://demoserver.p5party.org", "little_librarie_demo_lis534");

// load the shared object
// and provide starting values for the object to be used
// if there are no clients already connected to the room
const shared = await p5party.loadShared("shared", { x: 100, y: 100 });


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