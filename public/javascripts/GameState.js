var socket = new WebSocket("ws://localhost:3000");
socket.onmessage = function(event){
    document.getElementById("hello").innerHTML = event.data;
}

socket.onopen = function(){
    socket.send("Hello from the client!");
    document.getElementById("hello").innerHTML = "Sending a first message to the server ...";
};

var gameStateModule = (function (gameId) {
    this.playerAWebsocket = null;
    this.playerBWebsocket = null;
    this.playerAGameBoard = null;
    this.playerBGameBoard = null;
    this.gameId = gameId;
    this.playersTurn = this.playerA;
});

var test = new gameStateModule(1);
console.log(test.playersTurn);