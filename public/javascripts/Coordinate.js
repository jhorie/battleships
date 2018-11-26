var coordinateModule = (function (x, y) {

    let xCoordinate = x;
    let yCoordinate = y;

    return {
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
        }
    }
});

var newCoordinate = new coordinateModule(3, 1);
console.log(newCoordinate.getX());
newCoordinate.setX(25);
console.log(newCoordinate.getX());
