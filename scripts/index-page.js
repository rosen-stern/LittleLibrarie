import { v4 as uuid } from "https://unpkg.com/uuid@14.0.3/dist/index.js"; //UUID generator to give every player a unique ID

const room = new URLSearchParams(location.search).get("room");

    document.getElementById("room").value = room;

    console.log(document.getElementById("room").value == "");

    var tempMyID = uuid();

    localStorage.setItem('myID', tempMyID);

    document.getElementById("screenName").value = "guest #" + tempMyID.substring(0, 4);


window.joinRoom = function() {

    localStorage.setItem('screenName', document.getElementById("screenName").value)

    localStorage.setItem('playerColor', document.getElementById("playerColor").value);

window.location.replace("gameplay.html"+"?room="+document.getElementById("room").value);
}