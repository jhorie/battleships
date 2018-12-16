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
                for(let j = 0; j < 10; j++){
                    var Row = document.getElementById("enemyTableCell Row " + j);
                    let cells = Row.getElementsByTagName("td");
                    for (let i = 0; i < 10; i++) {
                        if (cells[i].getAttribute('xdata') == msg.coordinate.x && cells[i].getAttribute('ydata') == msg.coordinate.y) {
                            cells[i].innerHTML = "<img src=\"images/splash.png\" width=\"39px\" height=\"39px\">";
                        }
                    }
                }
        }
        
        if( gameState == "HAVE_HIT") {
            for(let j = 0; j < 10; j++){
                var Row = document.getElementById("enemyTableCell Row " + j);
                let cells = Row.getElementsByTagName("td");
                for (let i = 0; i < 10; i++) {
                    if (cells[i].getAttribute('xdata') == msg.coordinate.x && cells[i].getAttribute('ydata') == msg.coordinate.y) {
                        cells[i].innerHTML = "<img src=\"images/explosion.png\" width=\"39px\" height=\"39px\">";
                    }
                }
            }
        }
        if( gameState == "ARE_MISSED") {
            for(let j = 0; j < 10; j++){
                var Row = document.getElementById("friendlyTableCell Row " + j);
                let cells = Row.getElementsByTagName("td");
                for (let i = 0; i < 10; i++) {
                    if (cells[i].getAttribute('xdata') == msg.coordinate.x && cells[i].getAttribute('ydata') == msg.coordinate.y) {
                        cells[i].innerHTML = "<img src=\"images/splash.png\" width=\"39px\" height=\"39px\">";
                    }
                }
            }          
        }
        if( gameState == "ARE_HIT") {
            for(let j = 0; j < 10; j++){
                var Row = document.getElementById("friendlyTableCell Row " + j);
                let cells = Row.getElementsByTagName("td");
                for (let i = 0; i < 10; i++) {
                    if (cells[i].getAttribute('xdata') == msg.coordinate.x && cells[i].getAttribute('ydata') == msg.coordinate.y) {
                        cells[i].innerHTML = "<img src=\"images/explosion.png\" width=\"39px\" height=\"39px\">";
                    }
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