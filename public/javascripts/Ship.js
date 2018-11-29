var shipModule = (function (length, coordinate, direction) {
    let lengthShip = length;
    let coordinateShip = coordinate;
    let directionShip = direction;
    let isPartOfShipBombed = []; //// [0] -> coordinateShip
    let divElement;

    for (let i = 0; i < lengthShip; i++) {
        isPartOfShipBombed.push(false)
    }

    return {
        rotate: function () {
            directionShip = (directionShip + 1) % 4;
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
    }
});

function initShips() {

    let catalogue = document.getElementById("catalogue");


    catalogue.innerHTML += getShipHTML(2, 1);
    catalogue.innerHTML += getShipHTML(3, 2);
    catalogue.innerHTML += getShipHTML(3, 3);
    catalogue.innerHTML += getShipHTML(4, 4);
    catalogue.innerHTML += getShipHTML(5, 5);


    console.log("One ship added");
}

function getShipHTML(shipLength, id) {
    return "<div class=\"ship-" + shipLength + "\" id='ship-" + id + "'>" +
        "<img src=\"images/plain-triangle.png\" class=\"img-ship\">" +
        "</div>"
}