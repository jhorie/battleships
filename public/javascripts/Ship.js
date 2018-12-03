var shipModule = (function (length, coordinate, direction, id) {
    let lengthShip = length;
    let coordinateShip = coordinate;
    let directionShip = direction;
    let isPartOfShipBombed = []; //// [0] -> coordinateShip
    let movingState = false;
    let movingX = 0;
    let movingY = 0;


    let divElement = document.createElement("div");
    divElement.className = "ship-" + length;
    divElement.id = "ship-" + id;
    divElement.onmousedown = function (event) {
        movingState = true;
        movingX = event.x;
        movingY = event.y;
    };
    divElement.onmouseup = function (event) {
        movingState = false;
    }
    divElement.onmousemove = function (event) {
        if (movingState) {
            console.log(divElement.style.left);
            console.log(divElement.style.top);

            divElement.style.left = (divElement.getBoundingClientRect().left - (movingX - event.x)) + 'px';
            divElement.style.top = (divElement.getBoundingClientRect().top - (movingY - event.y)) + 'px';
            movingX = event.x;
            movingY = event.y;
        }
    }

    divElement.innerHTML = "<img src=\"images/plain-triangle.png\" draggable=\"false\" class=\"img-ship\">";


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
        getDivElement: function () {
            return divElement;
        },
    }
});
var ship1 = new shipModule(2, null, Direction.South, 1);
var ship2 = new shipModule(3, null, Direction.South, 2);
var ship3 = new shipModule(3, null, Direction.South, 3);
var ship4 = new shipModule(4, null, Direction.South, 4);
var ship5 = new shipModule(5, null, Direction.South, 5);
function initShips() {

    let catalogue = document.getElementById("catalogue");

    catalogue.appendChild(ship1.getDivElement());



    console.log("One ship added");
}
