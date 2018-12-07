var gameBoardModule = (function () {

    let friendlyFleet = document.getElementById("friendly-fleet");
    let enemyFleet = document.getElementById("enemy-fleet");


    var Table = "<table>"
    for (let y = 0; y < 10; y++) {
        Table = Table + "<tr class='fleetRow'>";
        for (let x = 0; x < 10; x++) {
            Table = Table + "<td class='fleetCell' xdata='" + x + "' ydata='" + y + "' onmouseover='onmouseenterTableCell(event)' onmouseout='onmouseoutTableCell(event)'> <div xdata='" + x + "' ydata='" + y + "' onclick='printcoor(event)'>" + "</div></td>";
        }
        Table = Table + "</tr>";
    }
    Table = Table + "</table>"
    friendlyFleet.innerHTML = Table;
    enemyFleet.innerHTML = Table;

    let divElement = document.getElementById("main");

    divElement.onmousedown = function (event) {
        for (let i = 0; i < ships.length; i++) {
            let shipsbounding = ships[i].getDivElement().getBoundingClientRect();
            if(shipsbounding.left >= event.x && (shipsbounding.width + shipswounding.left) <= event.x && shipsbounding.top <= event.y && (shipsbounding.top + shipsbounding.height) >= event.y){
                ships[i].movingState = true;
                ships[i].movingX = event.x;
                console.log("this is x in Ships:" + event.x);
                ships[i].movingY = event.y;
                console.log("this is y in Ships:" + event.y);
            }
        }
    };

    divElement.onmousemove = function (event) {
        for (let i = 0; i < ships.length; i++) {
            if (ships[i].getMovingState()){
                ships[i].getDivElement().style.left = (ships[i].getDivElement().getBoundingClientRect().left - (ships[i].movingX - event.x)) + 'px';
                ships[i].getDivElement().style.top = (ships[i].getDivElement().getBoundingClientRect().top - (ships[i].movingY - event.y)) + 'px';
                console.log("this is x in gameBoard:" + event.x);
                console.log("this is y in gameBoard:" + event.y);
                ships[i].movingX = event.x;
                ships[i].movingY = event.y;
            }
        }
    }

    


    return {
        getCoordinateOnScreen: function (coordinateField) {
            console.log(friendlyFleet.getBoundingClientRect().left);
            console.log(friendlyFleet.getBoundingClientRect().top);
        },
        getCoordinateFleet: function (coordinateOnScreen) {

            let coordinateFriendlyFleet = new coordinateModule(friendlyFleet.getBoundingClientRect().left, friendlyFleet.getBoundingClientRect().top);
            coordinateOnScreen.subtractCoordinate(coordinateFriendlyFleet);
            console.log(coordinateFriendlyFleet.getX());
            console.log(coordinateFriendlyFleet.getY());
            let x = Math.floor(coordinateOnScreen.getX() / 40);
            let y = Math.floor(coordinateOnScreen.getY() / 40);
            return new coordinateModule(x, y);
        },
        originOnScreen: function () {
            return new coordinateModule(friendlyFleet.getBoundingClientRect().left, friendlyFleet.getBoundingClientRect().top);
        },
    };
});

function onmouseenterTableCell(e) {
    e.target.style.backgroundColor = "#00F";
}

function onmouseoutTableCell(e) {
    e.target.style.backgroundColor = "#FFF";
}

function printcoor(e) {
    let x = e.x;
    let y = e.y;
    coor = "Coordinates: (" + x + "," + y + ")";
    document.getElementById("coor").innerHTML = coor;
    gameBoard.getCoordinateFleet(new coordinateModule(x, y));
}

function clearCoor() {
    //document.getElementById("friendly-fleet").innerHTML = "";
}

var gameBoard;
function initGameBoard() {
    gameBoard = new gameBoardModule();

}

