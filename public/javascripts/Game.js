var Message = require("./Message");

var game = function (gameId) {
    this.playerA = {ws: null, ships: null, field: this.createField()};
    this.playerB = {ws: null, ships: null, field: this.createField()};
    this.gameState = "0 JOINT";
};

game.prototype.createField = function () {
    let field = [];
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (j === 0) {
                field[i] = [];
            }
            field[i][j] = 1;
        }
    }
    return field;
};

game.prototype.transitionStates = {};
game.prototype.transitionStates["0 JOINT"] = 0;
game.prototype.transitionStates["1 JOINT"] = 1;
game.prototype.transitionStates["2 JOINT"] = 2;
game.prototype.transitionStates["PLAYER A READY"] = 3;
game.prototype.transitionStates["PLAYER B READY"] = 4;
game.prototype.transitionStates["TURN A"] = 5;
game.prototype.transitionStates["TURN B"] = 6;
game.prototype.transitionStates["WON A"] = 7;
game.prototype.transitionStates["WON B"] = 8;
game.prototype.transitionStates["ABORTED"] = 9;

game.prototype.transitionMatrix = [
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0], // 0 JOINT
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0], // 1 JOINT
    [0, 0, 0, 1, 1, 1, 0, 0, 0, 1], // 2 JOINT
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 1], // WAITING FOR A
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 1], // WAITING FOR B
    [0, 0, 0, 0, 0, 0, 1, 1, 0, 1], // TURN A
    [0, 0, 0, 0, 0, 1, 0, 0, 1, 1], // TURN B
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // WON A
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // WON B
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // ABORTED
];

game.prototype.isValidTransition = function (from, to) {

    let i, j;
    if (!(from in game.prototype.transitionStates)) {
        return false;
    } else {
        i = game.prototype.transitionStates[from];
    }

    if (!(to in game.prototype.transitionStates)) {
        return false;
    } else {
        j = game.prototype.transitionStates[to];
    }

    return game.prototype.transitionMatrix[i][j] === 1;
};

game.prototype.isValidState = function (s) {
    return (s in game.prototype.transitionStates);
};

game.prototype.setStatus = function (w) {
    if (game.prototype.isValidState(w) && game.prototype.isValidTransition(this.gameState, w)) {
        this.gameState = w;
        console.log(this.gameState);

        switch (this.gameState) {
            case "TURN A":
                this.playerA.ws.send(JSON.stringify(Message.O_YOUR_TURN));
                this.playerB.ws.send(JSON.stringify(Message.O_OTHER_TURN));
                break;
            case "TURN B":
                this.playerB.ws.send(JSON.stringify(Message.O_YOUR_TURN));
                this.playerA.ws.send(JSON.stringify(Message.O_OTHER_TURN));
                break;
        }

    } else {
        console.log("ERROR state");
        return new Error("ERROR invalid gamestate");
    }
};

game.prototype.addPlayer = function (p) {
    if (this.gameState !== "0 JOINT" && this.gameState !== "1 JOINT") {
        return new Error("ERROR");
    }


    if (this.playerA.ws === null) {
        this.playerA.ws = p;
        this.setStatus("1 JOINT");
        return this.gameState;
    } else {
        this.playerB.ws = p;
        this.setStatus("2 JOINT");
        return this.gameState;
    }
};

game.prototype.setShips = function (coordinates, wsId) {
    if (this.gameState !== "2 JOINT" && this.gameState !== "PLAYER A READY" && this.gameState !== "PLAYER B READY") {
        return new Error("ERROR");
    }

    if (this.gameState === "2 JOINT") {
        if (wsId === this.playerA.ws.id) {
            this.playerA.ships = coordinates;
            this.setStatus("PLAYER A READY");
        } else if (wsId === this.playerB.ws.id) {
            this.playerB.ships = coordinates;
            this.setStatus("PLAYER B READY");
        }
        return this.gameState;
    } else if (this.gameState === "PLAYER A READY") {
        if (wsId === this.playerB.ws.id) {
            this.playerB.ships = coordinates;
            this.setStatus("TURN A");
        }
        return this.gameState;
    } else if (this.gameState === "PLAYER B READY") {
        if (wsId === this.playerA.ws.id) {
            this.playerA.ships = coordinates;
            this.setStatus("TURN A");
        }
        return this.gameState;
    }
    return new Error("ERROR");
};

game.prototype.fire = function (coordinate, wsId) {
    if (this.gameState !== "TURN A" || this.gameState !== "TURN B") {
        return new Error("ERROR");
    }

    if (this.gameState === "TURN A" && this.playerA.ws.id === wsId) {
        if (fieldCheck(this.playerB.field, coordinate)) {
            if (fireCheck(this.playerB.ships)) {

            }
        }
    } else if (this.gameState === "TURN B" && this.playerB.ws.id === wsId) {

    }

    function fieldCheck(field, fireCoordinate) {
        if (field[fireCoordinate.x][fireCoordinate.y] === 1) {
            field[fireCoordinate.x][fireCoordinate.y] = 0;
            console.log("fieldCheck HIT");
            return true;
        }
    }

    function fireCheck(ships, fireCoordinate) {
        for (let j = 0; j < ships.length; j++) {
            for (let i = 0; i < ships[j].length; i++) {
                if (ships[j][i].x === fireCoordinate.x && ships[j][i].y === fireCoordinate.y) {
                    ships[j].splice(i, 1);
                    console.log("fireCheck HIT");
                    return true;
                }
            }
        }
    }
};

module.exports = game;