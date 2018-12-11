var express = require("express");
var http = require("http");
var websocket = require("ws");

var Game = require("./public/javascripts/Game");
var Message = require("./public/javascripts/Message");

var port = process.argv[2];
var app = express();

app.use(express.static(__dirname + "/public"));

var server = http.createServer(app);

const wss = new websocket.Server({server});

var game = new Game();

var connectionId = 0;
var connections = {};


wss.on("connection", function (ws) {

    ws.id = connectionId++;
    connections[ws.id] = game;

    console.log("New player connecting...");

    let gameState = game.addPlayer(ws);
    console.log(gameState);
    if (gameState === "1 JOINT") {
        ws.send(JSON.stringify(Message.O_WAIT_FOR_NEW_PLAYER));
    } else {
        /// gameState === "2 JOIN";
        game.playerA.ws.send(JSON.stringify(Message.O_WAIT_FOR_PLAYER));
        game.playerB.ws.send(JSON.stringify(Message.O_WAIT_FOR_PLAYER));
    }


    ws.on("message", function incoming(message) {

        let msg = JSON.parse(message);
        if (msg.type === Message.O_IM_READY.type) {
            let gameObj = connections[ws.id];
            let gameState = gameObj.setShips(msg.O_IM_READY.coordinatesFleet, ws.id);

            if (gameState === "PLAYER A READY" || gameState === "PLAYER B READY") {
                return;
            }
            if (gameState === "TURN A") {
                gameObj.playerA.ws.send(JSON.stringify(Message.O_YOUR_TURN));
                gameObj.playerB.ws.send(JSON.stringify(Message.O_OTHER_TURN));
            }
        } else if (msg.type === Message.O_FIRE) {
            let gameObj = connections[ws.id];
            let gameState = gameObj.fire(msg.O_FIRE.coordinate, ws.id);

        }
    });

    ws.on("close", function (code) {
        console.log(ws.id + " disconnected");
        if (code === "1001") {
            let gameObj = connections[ws.id];
            if (gameObj.isValidTransition(gameObj.gameState, "ABORTED")) {
                gameObj.setStatus("ABORTED");

                try {
                    gameObj.playerA.ws.close();
                    gameObj.playerA = null;
                } catch (e) {
                    console.log("Player A closing: " + e);
                }

                try {
                    gameObj.playerB.ws.close();
                    gameObj.playerB = null;
                } catch (e) {
                    console.log("Player B closing: " + e);
                }
            }
        }
    })
});

server.listen(port);