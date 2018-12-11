gameState = "";

var socketModule = (function initSocket() {

    socket = new WebSocket("ws://localhost:3000");
    socket.onmessage = function (event) {
        gameState = JSON.parse(event.data).type;
        let msg = JSON.parse(event.data);
        document.getElementById("hello").innerHTML = JSON.parse(event.data).type;

        if (gameState == "INVALID_COORDINATE") {
            alert("INVALID COORDINATE, pick new one");
        }

        if (gameState == "HAVE_MISSED") {
            let cells = document.getElementById("enemy-fleet").getElementsByTagName("xdata");
            console.log(msg.coordinate);
            for (let i = 0; i < cells.length; i++) {
                if (cells[i].getAttribute('xdata') == msg.coordinate.x && cells[i].getAttribute('ydata') == msg.coordinate.y) {
                    console.log("MISS");
                    cells[i].innerHTML = "MISS";
                }
            }
        }
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
    return {
        firedCoordinate: function (x, y) {
            console.log("MESSAGE fire send");
            let msg = Message.O_FIRE;
            msg.coordinate = {x: x, y: y};
            console.log("we sturen dit: " + JSON.stringify(msg));
            socket.send(JSON.stringify(msg));
        }
    }
})();