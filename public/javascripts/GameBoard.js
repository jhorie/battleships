var gameStateModule = (function () {
    return 1;
});
let body = document.getElementById("body");

body.onload = function table(){
    let friendlyFleet = document.getElementById("friendly-fleet");
    let enemyFleet = document.getElementById("enemy-fleet");
    var Table = "<table>"  
    for(x=0; x<10;x++){
        Table = Table + "<tr>";
        for(y=0; y<10;y++){
            Table = Table + "<td> <div x="+x+" y="+y+">" + "(" + x + "," + y + ")" + "</div></td>";
        }
        Table = Table + "</tr>";  
    }
    Table = Table + "</table>"
    friendlyFleet.innerHTML = Table;
    enemyFleet.innerHTML = Table;
}

let body2 = document.getElementById("body");






console.log(gameStateModule);