require("./Message");

var game = function (gameId) {
    this.playerA = null;
    this.playerB = null
    this.gameState = "0 JOINT";
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
                this.playerA.send(JSON.stringify(Message.O_YOUR_TURN));
                this.playerB.send(JSON.stringify(Message.O_OTHER_TURN));
                break;
            case "TURN B":
                this.playerB.send(JSON.stringify(Message.O_YOUR_TURN));
                this.playerA.send(JSON.stringify(Message.O_OTHER_TURN));
                break;

        }

    } else {
        return new Error("ERROR invalid gamestate");
    }
};

game.prototype.addPlayer = function (p) {
    if (this.gameState !== "0 JOINT" && this.gameState !== "1 JOINT") {
        return new Error("ERROR");
    }


    if (this.playerA === null) {
        this.playerA = p;
        this.setStatus("1 JOINT");
        return this.gameState;
    } else {
        this.playerB = p;
        this.setStatus("2 JOINT");
        return this.gameState;
    }
};

module.exports = game;