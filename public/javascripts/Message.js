(function (exports) {
    exports.O_WAIT_FOR_NEW_PLAYER = {type: "WAIT_FOR_NEW_PLAYER", message: "Waiting for other player to join..."};
    exports.O_WAIT_FOR_PLAYER = {type: "WAIT_FOR_PLAYER", message: "Waiting for both players to place ships..."};
    exports.O_NAME = {type: "Name", data: ""};
    exports.O_YOUR_TURN = {type: "Your turn", message: "It is your turn!"};
    exports.O_OTHER_TURN = {type: "Opponent turn", message: "It is opponent's turn"};
    exports.O_IM_READY = {type: "IM_READY", coordinatesFleet: []};
    exports.O_INVALID_COORDINATE = {type: "INVALID_COORDINATE"};
    exports.O_FIRE = {type: "FIRE", coordinate: {x: null, y: null}};
    exports.O_HAVE_HIT = {type: "HAVE_HIT", coordinate: {x: null, y: null}};
    exports.O_HAVE_MISSED = {type: "HAVE_MISSED", coordinate: {x: null, y: null}};
    exports.O_ARE_HIT = {type: "ARE_HIT", coordinate: {x: null, y: null}};
    exports.O_ARE_MISSED = {type: "ARE_MISSED", coordinate: {x: null, y: null}};
    exports.O_ABORTED = {type: "ABORTED", message: "Game aborted..."};
    exports.O_YOU_WON = {type: "You won", message: "You won!"};
    exports.O_YOU_LOST = {type: "You lost", message: "You lost..."};


})(typeof exports === "undefined" ? this.Message = {} : exports);
