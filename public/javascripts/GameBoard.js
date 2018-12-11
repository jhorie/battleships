var gameBoard = (function (exports) {

    let ship1 = new shipModule(2, null, 1, 4);
    // let ship2 = new shipModule(3, null, 2, 8);
    // let ship3 = new shipModule(3, null, 3, 12);
    // let ship4 = new shipModule(4, null, 4, 16);
    // let ship5 = new shipModule(5, null, 5, 20);
    let ships = [ship1]; //, ship2, ship3, ship4, ship5];
    // let ships = [ship1, ship2, ship3, ship4, ship5];
    let catalogue = document.getElementById("catalogue");
    catalogue.appendChild(ship1.getDivElement());
    // catalogue.appendChild(ship2.getDivElement());
    // catalogue.appendChild(ship3.getDivElement());
    // catalogue.appendChild(ship4.getDivElement());
    // catalogue.appendChild(ship5.getDivElement());

    let friendlyFleet = document.getElementById("friendly-fleet");
    let enemyFleet = document.getElementById("enemy-fleet");


    friendlyFleet.innerHTML = createTable("friendlyTableCell");
    enemyFleet.innerHTML = createTable("enemyTableCell");

    function createTable(idTableCell) {
        var Table = "<table>";
        for (let y = 0; y < 10; y++) {
            Table = Table + "<tr class='fleetRow'>";
            for (let x = 0; x < 10; x++) {
                Table = Table + "<td class='fleetCell' id='" + idTableCell + "' xdata='" + x + "' ydata='" + y + "' onclick='enemyTableCellClicked(event)' onmouseover='onmouseenterTableCell(event)' onmouseout='onmouseoutTableCell(event)'> <div xdata='" + x + "' ydata='" + y + "' onclick='printcoor(event)'>" + "</div></td>";
            }
            Table = Table + "</tr>";
        }
        Table = Table + "</table>";
        return Table;
    }

    let divElement = document.getElementById("main");

    divElement.onmousedown = function (event) {
        console.log("Onmousedown in gameboard");
        console.log(gameState);
        if (gameState === Message.O_WAIT_FOR_PLAYER.type || gameState === Message.O_WAIT_FOR_NEW_PLAYER.type) {
            for (let i = 0; i < ships.length; i++) {
                let shipbounding = ships[i].getDivElement().getBoundingClientRect();
                if (shipbounding.left <= event.x && (shipbounding.width + shipbounding.left) >= event.x && shipbounding.top <= event.y && (shipbounding.top + shipbounding.height) >= event.y) {
                    ships[i].setMovingState(true);
                    ships[i].movingX = event.x;
                    ships[i].movingY = event.y;

                }
            }
        }
    };

    divElement.onmousemove = function (event) {
        for (let i = 0; i < ships.length; i++) {
            if (ships[i].getMovingState()) {
                ships[i].setWasMovingState(true);
                ships[i].getDivElement().style.left = (ships[i].getDivElement().getBoundingClientRect().left - (ships[i].movingX - event.x)) + 'px';
                ships[i].getDivElement().style.top = (ships[i].getDivElement().getBoundingClientRect().top - (ships[i].movingY - event.y)) + 'px';
                ships[i].movingX = event.x;
                ships[i].movingY = event.y;
            }
        }
    };

    divElement.onmouseup = function (event) {
        for (let i = 0; i < ships.length; i++) {
            if (ships[i].getMovingState()) {
                if (ships[i].getWasMovingState()) {
                    console.log("onmouse up");
                    var coordinateShip = getCoordinateFleet(new coordinateModule(ships[i].getDivElement().getBoundingClientRect().left, ships[i].getDivElement().getBoundingClientRect().top));
                    ships[i].setCoordinateShip(coordinateShip);
                    ships[i].setWasMovingState(false);
                } else {
                    ships[i].rotate();
                    var coordinateShip = ships[i].getCoordinateShip();
                }

                firstFor:
                    for (let j = 0; j < ships.length; j++) {
                        if (i === j) {
                            continue;
                        }

                        let coordinatesOtherShip = ships[j].getCoordinatesFleet();
                        let coordinatesThisShip = ships[i].getCoordinatesFleet();

                        for (let k = 0; k < coordinatesThisShip.length; k++) {

                            for (let l = 0; l < coordinatesOtherShip.length; l++) {

                                if (coordinatesThisShip[k].equals(coordinatesOtherShip[l])) {
                                    coordinateShip = null;
                                    console.log("BOTST");

                                    break firstFor;
                                }
                            }
                        }
                    }
                console.log("Lets check if coordinates are valid");
                if (coordinateShip != null && !allShipCoordinatesAreInField(ships[i], coordinateShip)) {
                    coordinateShip = null;
                    ships[i].setDirection(directionModule().South);
                }
                ships[i].setCoordinateShip(coordinateShip);

                ships[i].drawShip();

                ships[i].setMovingState(false);
                ships[i].setWasMovingState(false);
            }
        }
        checkinField();
    };

    function checkinField() {
        let shipsinfield = 0;
        if (gameState === Message.O_WAIT_FOR_PLAYER.type) {
            for (let i = 0; i < ships.length; i++) {
                if (ships[i].getCoordinateShip() !== null) {
                    shipsinfield = shipsinfield + 1;
                }
            }
            if (shipsinfield === ships.length) {
                let buttonchange = document.getElementById("ready-button");
                buttonchange.style.visibility = "visible";
            } else {
                let buttonchange = document.getElementById("ready-button");
                buttonchange.style.visibility = "hidden";
            }
        }
    }


    function onclickPlayerReadyButton() {
        let msg = Message.O_IM_READY;
        for (let i = 0; i < ships.length; i++) {
            msg.coordinatesFleet[i] = ships[i].getCoordinatesFleetInXAndY();
        }
        console.log("dit sturen we: " + JSON.stringify(msg));
        socket.send(JSON.stringify(msg));
        let buttonchange = document.getElementById("ready-button");
        buttonchange.style.visibility = "hidden";
    }

    function allShipCoordinatesAreInField(ship, newCoordinate) {
        let movingCoordinate = new coordinateModule(newCoordinate.getX(), newCoordinate.getY());

        if (!isFieldCoordinateValid(movingCoordinate)) {
            return false;
        }

        for (let i = 1; i < ship.getLengthShip(); i++) {
            movingCoordinate.addDirection(ship.getDirection());
            console.log("x: " + movingCoordinate.getX() + ", y: " + movingCoordinate.getY());
            if (!isFieldCoordinateValid(movingCoordinate)) {
                return false;
            }
        }

        return true;
    }

    function isFieldCoordinateValid(fieldCoordinate) {
        if (fieldCoordinate.getX() >= 0 && fieldCoordinate.getX() <= 9 &&
            fieldCoordinate.getY() >= 0 && fieldCoordinate.getY() <= 9) {
            return true;
        }

        return false;
    }

    function getCoordinateFleet(coordinateOnScreen) {
        let coordinateFriendlyFleet = new coordinateModule(friendlyFleet.getBoundingClientRect().left, friendlyFleet.getBoundingClientRect().top);
        coordinateOnScreen.subtractCoordinate(coordinateFriendlyFleet);
        let x = Math.floor(coordinateOnScreen.getX() / 40);
        let y = Math.floor(coordinateOnScreen.getY() / 40);
        return new coordinateModule(x, y);
    }

    return {
        originOnScreen: function () {
            return new coordinateModule(friendlyFleet.getBoundingClientRect().left, friendlyFleet.getBoundingClientRect().top);
        },
        isFieldCoordinateValid: isFieldCoordinateValid,
        onclickPlayerReadyButton: onclickPlayerReadyButton,
        getShips: function () {
            return ships;
        },
    };
})();

