export {room}
// get the room name from the query string
const room = new URLSearchParams(location.search).get("room");


// connect to the party server
await p5party.connect("wss://demoserver.p5party.org", "little_librarie_lis534", room);
