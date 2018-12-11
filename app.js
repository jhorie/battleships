var express = require("express");
var http = require("http");
var websocket = require("ws");

directionModule = require('./public/javascripts/Direction');
shipModule = require('./public/javascripts/Ship');

var Game = require("./public/javascripts/Game");
var Message = require("./public/javascripts/Message");
var GameBoard = require("./public/javascripts/GameBoard");

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
        game.playerA.send(JSON.stringify(Message.O_WAIT_FOR_PLAYER));
        game.playerB.send(JSON.stringify(Message.O_WAIT_FOR_PLAYER));
    }


    ws.on("message", function incoming(message) {

        let msg = JSON.parse(message);
        if (msg.type === Message.O_IM_READY.type) {
            let gameObj = connections[ws.id];

            let gameBoardA = new GameBoard();
            gameBoardA.getShips();

        }
    });

    ws.on("close", function (code) {
        console.log(ws.id + " disconnected");
        if (code === "1001") {
            let gameObj = connections[ws.id];
            if (gameObj.isValidTransition(gameObj.gameState, "ABORTED")) {
                gameObj.setStatus("ABORTED");

                try {
                    gameObj.playerA.close();
                    gameObj.playerA = null;
                } catch (e) {
                    console.log("Player A closing: " + e);
                }

                try {
                    gameObj.playerB.close();
                    gameObj.playerB = null;
                } catch (e) {
                    console.log("Player B closing: " + e);
                }
            }
        }
    })
});

server.listen(port);