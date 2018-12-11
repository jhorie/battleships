var shipModule = (function (length, coordinate, id, startLeft) {
    let lengthShip = length;
    let coordinateShip = coordinate;
    let directionShip = directionModule.Direction.South;
    let isPartOfShipBombed = []; //// [0] -> coordinateShip
    let movingState = false;
    let wasMoving = false;
    let idShip = id;
    const leftStart = startLeft;
    const topStart = 70;

    if (document !== 'undefined') {
        let divElement = document.createElement("div");
        divElement.className = "ship-" + length;
        divElement.id = "ship-" + id;
        divElement.style.top = topStart + "%";
        divElement.style.left = startLeft + "%";
        divElement.style.transformOrigin = "20px 20px";
    }

    function allShipCoordinatesAreInField(newCoordinate) {
        let movingCoordinate = new coordinateModule(newCoordinate.getX(), newCoordinate.getY());

        if (!gameBoard.isFieldCoordinateValid(movingCoordinate)) {
            return false;
        }

        for (let i = 1; i < lengthShip; i++) {
            movingCoordinate.addDirection(directionShip);
            if (!gameBoard.isFieldCoordinateValid(movingCoordinate)) {
                return false;
            }
        }
        return true;
    }

    function drawShip() {

        if (coordinateShip != null) {
            divElement.style.left = coordinateShip.getX() * 40 + gameBoard.originOnScreen().getX() + 'px';
            divElement.style.top = coordinateShip.getY() * 40 + gameBoard.originOnScreen().getY() + 'px';
        } else {
            divElement.style.left = leftStart + "%";
            divElement.style.top = topStart + "%"
        }

        coordinatesThisShip = getCoordinatesFleet();

        switch (directionShip) {
            case Direction.East:
                divElement.style.transform = "rotate(270deg)";
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
        directionShip = (directionShip + 1) % 2;
    }

    return {
        rotate: rotate,
        getDirection: function () {
            return directionShip;
        },
        setDirection: function (direction) {
            directionShip = direction;
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
        },
        getWasMovingState: function () {
            return wasMoving;
        },
        setCoordinateShip: function (coordinate) {
            coordinateShip = coordinate;
        },
        getCoordinateShip: function () {
            return coordinateShip;
        },
        drawShip: drawShip,
        getLengthShip: function () {
            return lengthShip;
        }
    }
})();


module.exports = shipModule;