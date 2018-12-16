var express = require("express");
var http = require("http");
var websocket = require("ws");
var cookies = require("cookie-parser");

var Game = require("./public/javascripts/Game");
var Message = require("./public/javascripts/Message");

var port = process.argv[2];
var app = express();

var connectionId = 0;
var connections = {};
var games = [new Game(connectionId)];

app.set("view engine", "ejs");
app.use(cookies(1234));
app.get("/", (req, res) => {
    var amount = 0;
    if (typeof req.cookies["game_accessed"] == "undefined") {
        res.cookie("game_accessed", 1);
        amount = 1;
    } else {
        res.cookie("game_accessed", parseInt(req.cookies["game_accessed"]) + 1);
        amount = parseInt(req.cookies["game_accessed"]) + 1;
    }
    res.render("splash.ejs", {gamesInitialized: games.length, gamesCompleted: countGamesFinished(), gameAccessed: amount});
});

app.use(express.static(__dirname + "/public"));

var server = http.createServer(app);

const wss = new websocket.Server({server});


wss.on("connection", function (ws) {

    ws.id = connectionId++;


    console.log("New player connecting...");
    if (games[games.length - 1].gameState === "ABORTED") {
        games[games.length - 1] = new Game(connectionId);
    } else if (games[games.length - 1].gameState !== "0 JOINT" && games[games.length - 1].gameState !== "1 JOINT") {
        console.log("New game created");
        games.push(new Game(connectionId));
    }

    var game = games[games.length - 1];
    connections[ws.id] = game;

    let gameState = game.addPlayer(ws);
    console.log(gameState);
    if (gameState === "1 JOINT") {
        ws.send(JSON.stringify(Message.O_WAIT_FOR_NEW_PLAYER));
    } else {
        /// gameState === "2 JOIN";
        console.log("Game state should be 2 JOINT: " + gameState);
        game.playerA.ws.send(JSON.stringify(Message.O_WAIT_FOR_PLAYER));
        game.playerB.ws.send(JSON.stringify(Message.O_WAIT_FOR_PLAYER));
    }


    ws.on("message", function incoming(message) {

        let msg = JSON.parse(message);
        if (msg.type === Message.O_IM_READY.type) {
            console.log("IM READY MESSAGE received");
            let gameObj = connections[ws.id];
            let gameState = gameObj.setShips(msg.coordinatesFleet, ws.id);

            if (gameState === "PLAYER A READY" || gameState === "PLAYER B READY") {
                return;
            }
            if (gameState === "TURN A") {
                gameObj.playerA.ws.send(JSON.stringify(Message.O_YOUR_TURN));
                gameObj.playerB.ws.send(JSON.stringify(Message.O_OTHER_TURN));
            }
        } else if (msg.type === Message.O_FIRE.type) {
            let gameObj = connections[ws.id];
            console.log(msg.coordinate);
            let gameState = gameObj.fire(msg.coordinate, ws.id);

            if (gameState === "TURN A") {
                gameObj.playerA.ws.send(JSON.stringify(Message.O_YOUR_TURN));
                gameObj.playerB.ws.send(JSON.stringify(Message.O_OTHER_TURN));
            } else if (gameState === "TURN B") {
                gameObj.playerA.ws.send(JSON.stringify(Message.O_OTHER_TURN));
                gameObj.playerB.ws.send(JSON.stringify(Message.O_YOUR_TURN));
            }
        }
    });

    ws.on("close", function (code) {
        console.log(ws.id + " disconnected");
        //if (code === "1001") {
        let gameObj = connections[ws.id];

        if (gameObj.isValidTransition(gameObj.gameState, "ABORTED")) {
            gameObj.setStatus("ABORTED");
            console.log("ABORTED: " + gameObj.gameState);
            try {
                gameObj.playerA.ws.send(JSON.stringify(Message.O_ABORTED));
                gameObj.playerA.ws.close();
                gameObj.playerA = null;
            } catch (e) {
                console.log("Player A closing: " + e);
            }

            try {
                gameObj.playerB.ws.send(JSON.stringify(Message.O_ABORTED));
                gameObj.playerB.ws.close();
                gameObj.playerB = null;
            } catch (e) {
                console.log("Player B closing: " + e);
            }
        }
        //}
    })
});

server.listen(port);


function countGamesFinished() {
    let count = 0;
    for (let i = 0; i < games.length; i++) {
        console.log("i: " + games[i].gameState);
        if (games[i].gameState === "WON A" || games[i].gameState === "WON B") {
            count++;
        }
    }
    return count;
}