gameState = "";

var socketModule = (function initSocket() {

    socket = new WebSocket("ws://localhost:3000");
    socket.onmessage = function (event) {
        gameState = JSON.parse(event.data).type;
    };

    socket.onopen = function () {
        let msg = Message.O_NAME;
        console.log(Message.O_NAME.type);

        const urlParams = new URLSearchParams(window.location.search);
        const myParam = urlParams.get('name');

        msg.data = myParam;
        socket.send(JSON.stringify(msg));
        document.getElementById("hello").innerHTML = "Sending a first message to the server ...";
    };
})();