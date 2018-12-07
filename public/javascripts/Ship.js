var shipModule = (function (length, coordinate, direction, id, startLeft) {
    let lengthShip = length;
    let coordinateShip = coordinate;
    let directionShip = direction;
    let isPartOfShipBombed = []; //// [0] -> coordinateShip
    let movingState = false;
    let wasMoving = false;
    let idShip = id;
    const leftStart = startLeft;
    const topStart = 70;


    let divElement = document.createElement("div");
    divElement.className = "ship-" + length;
    divElement.id = "ship-" + id;
    divElement.style.top = topStart + "%";
    divElement.style.left = startLeft + "%";
    divElement.style.transformOrigin = "20px 20px";

    function onmouseup() {
        if (movingState && wasMoving) {
            movingState = false;
            console.log("onmouse up");
            coordinateShip = gameBoard.getCoordinateFleet(new coordinateModule(divElement.getBoundingClientRect().left, divElement.getBoundingClientRect().top));
            if (!allShipCoordinatesAreInField(coordinateShip)) {
                coordinateShip = null;
            }

            drawShip();
        }
    }

    divElement.onclick = function () {
        if (!wasMoving) {
            rotate();
        } else {
            wasMoving = false;
        }
    };

    function allShipCoordinatesAreInField(newCoordinate) {
        let movingCoordinate = new coordinateModule(newCoordinate.getX(), newCoordinate.getY());
        for (let i = 1; i < lengthShip; i++) {
            movingCoordinate.addDirection(directionShip);
            if (!gameBoard.isFieldCoordinateValid(movingCoordinate)) {
                return false;
            }
        }
        return true;
    }

    function drawShip(rotating = false) {
        firstFor:
            for (let i = 0; i < ships.length; i++) {
                if (ships[i].getId() == idShip) {
                    continue;
                }

                let coordinatesOtherShip = ships[i].getCoordinatesFleet();
                let coordinatesThisShip = getCoordinatesFleet();

                for (let j = 0; j < coordinatesThisShip.length; j++) {

                    for (let k = 0; k < coordinatesOtherShip.length; k++) {

                        if (coordinatesThisShip[j].equals(coordinatesOtherShip[k])) {
                            coordinateShip = null;
                            console.log("BOTST");

                            break firstFor;
                        }
                    }
                }
            }


        if (coordinateShip != null) {
            if (rotating === false) {
                divElement.style.left = coordinateShip.getX() * 40 + gameBoard.originOnScreen().getX() + 'px';
                divElement.style.top = coordinateShip.getY() * 40 + gameBoard.originOnScreen().getY() + 'px';
            }
        } else {
            divElement.style.left = leftStart + "%";
            divElement.style.top = topStart + "%"
        }

        coordinatesThisShip = getCoordinatesFleet();
        for (let i = 0; i < coordinatesThisShip.length; i++) {
            console.log("This ship: " + coordinatesThisShip[i].getX() + ", " + coordinatesThisShip[i].getY());
        }

        switch (directionShip) {
            case Direction.East:
                divElement.style.transform = "rotate(270deg)";
                break;
            case Direction.North:
                divElement.style.transform = "rotate(180deg)";
                break;
            case Direction.West:
                divElement.style.transform = "rotate(90deg)";
                break;
            case Direction.South:
                divElement.style.transform = "rotate(0deg)";
                break;
        }
    }


    divElement.innerHTML = "<img src=\"images/plain-triangle.png\" draggable=\"false\" class=\"img-ship\">";


    for (let i = 0; i < lengthShip; i++) {
        isPartOfShipBombed.push(false)
    }

    function getCoordinatesFleet() {
        if (coordinateShip == null) {
            return [];
        }
        let coordinates = [coordinateShip];
        let movingCoordinate = new coordinateModule(coordinateShip.getX(), coordinateShip.getY());
        for (let i = 1; i < lengthShip; i++) {
            movingCoordinate.addDirection(directionShip);
            coordinates.push(new coordinateModule(movingCoordinate.getX(), movingCoordinate.getY()));
        }
        return coordinates;
    }

    function rotate() {
        directionShip = (directionShip + 1) % 4;
        drawShip(true);
    }

    return {
        onmouseup: function () {
            return onmouseup();
        },
        rotate: rotate,
        getDirection: function () {
            return directionShip;
        },
        fireAtShip: function (coordinate) {
            let coordinateMovingOverShip = new coordinateModule(coordinateShip.getX(), coordinateShip.getY());
            for (let i = 0; i < lengthShip; i++) {
                if (coordinate.equals(coordinateMovingOverShip)) {
                    if (!isPartOfShipBombed[i]) {
                        console.log("HIT");
                        isPartOfShipBombed[i] = true;
                        return true;
                    } else {
                        console.log("ALREADY HIT");
                        return false;
                    }
                }
                coordinateMovingOverShip.addDirection(directionShip);
            }
            console.log("SPLASH");
            return false;
        },
        getDivElement: function () {
            return divElement;
        },
        getCoordinatesFleet: getCoordinatesFleet,
        getId: function () {
            return idShip;
        },
        getMovingState: function () {
            return movingState;
        },
        setMovingState: function (newState) {
            movingState = newState;
        },
        setWasMovingState: function (newState) {
            wasMoving = newState;
        }
    }
});


var ship1 = new shipModule(2, null, Direction.South, 1, 4);
var ship2 = new shipModule(3, null, Direction.South, 2, 8);
var ship3 = new shipModule(3, null, Direction.South, 3, 12);
var ship4 = new shipModule(4, null, Direction.South, 4, 16);
var ship5 = new shipModule(5, null, Direction.South, 5, 20);
var ships = [ship1, ship2, ship3, ship4, ship5];

function initShips() {

    let catalogue = document.getElementById("catalogue");

    catalogue.appendChild(ship1.getDivElement());
    catalogue.appendChild(ship2.getDivElement());
    catalogue.appendChild(ship3.getDivElement());
    catalogue.appendChild(ship4.getDivElement());
    catalogue.appendChild(ship5.getDivElement());


    console.log("One ship added");
}
