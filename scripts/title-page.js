


window.setScreenName = function() {
    localStorage.setItem('screenname', document.getElementById("screenName").value)
}


window.setPlayerColor = function() {
localStorage.setItem('playerColor', document.getElementById("playerColor").value);
}


window.joinRoom = function() {

window.location.replace("gameplay.html"+"?room="+document.getElementById("room").value);
console.log("moving pages...")
}