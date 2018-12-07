var shipModule = (function (length, coordinate, direction, id, startLeft) {
    let lengthShip = length;
    let coordinateShip = coordinate;
    let directionShip = direction;
    let isPartOfShipBombed = []; //// [0] -> coordinateShip
    let movingState = false;
    let movingX = 0;
    let movingY = 0;
    let idShip = id;
    const leftStart = startLeft;
    const topStart = 70;


    let divElement = document.createElement("div");
    divElement.className = "ship-" + length;
    divElement.id = "ship-" + id;
    divElement.style.top = 70 + "%";
    divElement.style.left = startLeft + "%";
    divElement.onmousedown = function (event) {
        movingState = true;
        movingX = event.x;
        console.log("this is x in Ships:" + event.x);
        movingY = event.y;
        console.log("this is y in Ships:" + event.y);
    };


    divElement.onmouseup = function (event) {
        if (movingState) {
            movingState = false;
            coordinateShip = gameBoard.getCoordinateFleet(new coordinateModule(divElement.getBoundingClientRect().left, divElement.getBoundingClientRect().top));
            if (coordinateShip.getX() > 9 || coordinateShip.getY() > 9 || coordinateShip.getX() < 0 || coordinateShip.getY() < 0) {
                coordinateShip = null;
            }
            drawShip();
            for (let i = 0; i < ships.length; i++) {
                if (ships[i].getId() == idShip) {
                    continue;
                }

                let coordinatesOtherShip = ships[i].getCoordinatesFleet();
                let coordinatesThisShip = getCoordinatesFleet();

                for (let j = 0; j < coordinatesThisShip.length; j++) {
                    console.log("This ship: " + coordinatesThisShip[j].getX() + ", " + coordinatesThisShip[j].getY());
                    for (let k = 0; k < coordinatesOtherShip.length; k++) {
                        if (j == 0) {
                            console.log("Other ship: " + coordinatesOtherShip[k].getX() + ", " + coordinatesOtherShip[k].getY());
                        }
                        if (coordinatesThisShip[j].equals(coordinatesOtherShip[k])) {
                            coordinateShip = null;
                            console.log("BOTST");
                            drawShip();
                            return;
                        }
                    }
                }
            }
        }
    };

    function drawShip() {
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

divElement.style.transformOrigin = "20px 20px";
        if (coordinateShip != null) {
            divElement.style.left = coordinateShip.getX() * 40 + gameBoard.originOnScreen().getX() + 'px';
            divElement.style.top = coordinateShip.getY() * 40 + gameBoard.originOnScreen().getY() + 'px';
            switch (directionShip) {
                case Direction.East:
                    divElement.style.transform = "rotate(90deg)";
                    break;
                case Direction.North:
                    divElement.style.transform = "rotate(180deg)";
                    break;
                case Direction.West:
                    divElement.style.transform = "rotate(270deg)";
                    break;
                case Direction.South:
                    divElement.style.transform = null;
                    break;
            }

        } else {
            divElement.style.left = leftStart + "%";
            divElement.style.top = topStart + "%"
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
        drawShip();
    }

    return {
        rotate: function () {
            directionShip = (directionShip + 1) % 4;
            drawShip();
        },
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
        getCoordinatesFleet: function () {
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
        },
        getId: function () {
            return idShip;
        },
        movingState: movingState,   
        movingX: movingX,
        movingY: movingY,
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
