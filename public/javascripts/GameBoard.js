var gameStateModule = (function () {
    return 1;
});


function initTables(){
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





console.log(gameStateModule);