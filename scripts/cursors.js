import { room } from './server-connection.js';
export { me, guests, showCursors, updateMyCursorPosition, cursorSetup };



let me = await p5party.loadMyShared({ x: 200, y: 200 });

let guests = await p5party.loadGuestShareds();

var guestsNumber = guests.length;

  var localStorageScreenName = localStorage.getItem('screenName');

  var localStorageColor = localStorage.getItem('playerColor');
  
    var localStorageID = localStorage.getItem('myID');



function cursorSetup() {
  // me.id = localStorageID;
  // me.screenName = "guest #" + me.id.substring(0, 4);
  // me.color = "#298fc2";


  if (!localStorageScreenName || !localStorageColor) {
    window.location.replace("index.html" + "?room=" + room);
  }
  me.id = localStorageID;
  me.screenName = localStorageScreenName;
  me.color = localStorageColor;


}

async function checkGuestNumber() {
  if (guestsNumber != guests.length) {
    guests = await p5party.loadGuestShareds();
  }
}


async function showCursors() {
  strokeWeight(0);

 await checkGuestNumber();


  // draw each guests cursor
  for (const p of guests) {

    if (p.id != me.id) {
      fill('white');
      rect(p.x - textWidth(p.screenName) / 2 - 10, p.y + 15, textWidth(p.screenName) + 20, 15);

      fill('black');
      text(p.screenName, p.x - textWidth(p.screenName) / 2, p.y + 25);


      strokeWeight(1);
      stroke('black');

      fill(p.color);
      ellipse(p.x, p.y, 15, 15);
    }
  }

  fill(me.color);
  ellipse(me.x, me.y, 15, 15);

}


function updateMyCursorPosition() {
  me.x = mouseX;
  me.y = mouseY;
}




