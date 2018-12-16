// const Message = {
//     "WAIT_FOR_PLAYER": 0,
//     "FOUND_PLAYER": 1,
//     "YOUR_TURN": 2,
//     "OTHER_TURN": 3,
//     "YOU_WON": 4,
//     "OPPONENT_WON": 5,
//     "ABORTED": 6,
//     "NAME": 7
// };



(function (exports) {
    exports.O_WAIT_FOR_NEW_PLAYER = {type: "WAIT_FOR_NEW_PLAYER"};
    exports.O_WAIT_FOR_PLAYER = {type: "WAIT_FOR_PLAYER"};
    exports.O_NAME = {type: "Name", data: ""};
    exports.O_YOUR_TURN = {type: "Your turn"};
    exports.O_OTHER_TURN = {type: "Opponent turn"};
    exports.O_IM_READY = {type: "IM_READY", coordinatesFleet: []};
    exports.O_INVALID_COORDINATE = {type: "INVALID_COORDINATE"};
    exports.O_FIRE = {type: "FIRE", coordinate: {x: null, y: null}};
    exports.O_HAVE_HIT = {type: "HAVE_HIT", coordinate: {x: null, y: null}};
    exports.O_HAVE_MISSED = {type: "HAVE_MISSED", coordinate: {x: null, y: null}};
    exports.O_ARE_HIT = {type: "ARE_HIT", coordinate: {x: null, y: null}};
    exports.O_ARE_MISSED = {type: "ARE_MISSED", coordinate: {x: null, y: null}};
    exports.O_ABORTED = {type: "ABORTED"};
    exports.O_YOU_WON = {type: "You won"};
    exports.O_YOU_LOST = {type: "You lost"};


})(typeof exports === "undefined" ? this.Message = {} : exports);
