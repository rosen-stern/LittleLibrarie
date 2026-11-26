export { LevelManager };


class LevelManager {

  items = [];
  shelves = [];

  ball = null;

  constructor() {

    world.gravity.y = 10;

    this.ball = new Sprite();
    this.ball.diameter = 50;
    this.ball.img = ':)';

    let groundA = new Sprite();
    groundA.x = -120;
    groundA.width = 220;
    groundA.rotation = 30;
    groundA.physics = STATIC;
    groundA.stroke = 'black';
    groundA.strokeWeight = 1;

    let groundB = new Sprite();
    groundB.x = 120;
    groundB.width = 220;
    groundB.rotation = -30;
    groundB.physics = STATIC;
    groundB.stroke = 'black';
    groundB.strokeWeight = 1;

    let ground = new Sprite();
    ground.y = 300;
    ground.width = 1920 + 48;
    ground.physics = STATIC;
    ground.stroke = 'black';
    ground.strokeWeight = 1;

    let wallA = new Sprite();
    wallA.w = 40;
    wallA.h = 3240;
    wallA.x = -700 - 24;
    wallA.y = -1080;
    wallA.physics = STATIC;

    let wallB = new Sprite();
    wallB.w = 40;
    wallB.h = 3240;
    wallB.x = 700 + 24;
    wallB.y = -1080;
    wallB.physics = STATIC;

  }

  addShelf() {

  }
  
}