import { v4 as uuid } from "https://unpkg.com/uuid@14.0.3/dist/index.js"; //UUID generator to give every player a unique ID
export { me, guests, showCursors, updateMyCursorPosition };

let me = await p5party.loadMyShared({ x: 200, y: 200 });

let guests = await p5party.loadGuestShareds();




q5.setup = function () {
me.id = uuid();
setMyScreenName();
setMyPlayerColor();

}


function showCursors(){

 fill(me.color);
  ellipse(me.x, me.y, 15, 15);

      // draw each guests cursor
  for (const p of guests) {

    if(p.id != me.id){
      fill('white');
      rect(p.x-textWidth(p.screenname)/2-10, p.y+15, textWidth(p.screenname)+20, 15);
    	
      fill('black');
      text(p.screenname, p.x-textWidth(p.screenname)/2, p.y+25);

      fill(p.color);
      ellipse(p.x, p.y, 20, 20);
    }
  }
  

}


function updateMyCursorPosition(){
me.x = mouseX;
  me.y = mouseY;
}


function setMyScreenName(name){
var localStorageScreenName = localStorage.getItem('screenname');
    
if(localStorageScreenName){
 me.screenname = localStorageScreenName;
} else {
    me.screenname = prompt("Please enter your screen name:", "guest #" + me.id.substring(0, 4));
}
 
}

function setMyPlayerColor(color){
    var localStorageColor = localStorage.getItem('playerColor');

    if(localStorageColor){
        me.color = localStorageColor;
        console.log("my color is: " + me.color);
    } else {
        me.color = prompt("Please enter your player color:", "#5393b8");
    }
}

