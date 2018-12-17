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
                case directionModule().East:
                    xCoordinate++;
                    break;
                case directionModule().South:
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

