var coordinateModule = (function (x, y) {

    let xCoordinate = x;
    let yCoordinate = y;

    return {
        equals: function (other) {
            return other.getX() == xCoordinate && other.getY() == yCoordinate;
        },
        getX: function() {
            return xCoordinate;
        },
        getY: function() {
            return yCoordinate;
        },
        setX: function(x) {
            xCoordinate = x;
        },
        setY: function(y) {
            yCoordinate = y;
        },
        addDirection: function (direction) {
            switch (direction) {
                case Direction.East:
                    xCoordinate++;
                    break;
                case Direction.North:
                    yCoordinate--;
                    break;
                case Direction.West:
                    xCoordinate--;
                    break;
                case Direction.South:
                    yCoordinate++;
                    break;
            }
        },
        subtractCoordinate: function (otherCoordinate) {
            xCoordinate -= otherCoordinate.getX();
            yCoordinate -= otherCoordinate.getY();
        }
    }
});

// var newCoordinate = new coordinateModule(3, 1);
// console.log(newCoordinate.getX());
// newCoordinate.setX(25);
// console.log(newCoordinate.getX());
