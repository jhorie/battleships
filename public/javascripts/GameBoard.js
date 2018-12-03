var gameStateModule = (function () {
    return 1;
});


function initTables(){
    let friendlyFleet = document.getElementById("friendly-fleet");
    let enemyFleet = document.getElementById("enemy-fleet");
    var Table = "<table width='400'>"  
    for(x=0; x<10;x++){
        Table = Table + "<tr>";
        for(y=0; y<10;y++){
            Table = Table + "<td height='38'> <div x="+x+" y="+y+">" + "(" + x + "," + y + ")" + "</div></td>";
        }
        Table = Table + "</tr>";  
    }
    Table = Table + "</table>"
    friendlyFleet.innerHTML = Table;
    enemyFleet.innerHTML = Table;
}

function printcoor(e){
    x = e.x;
    y = e.y;
    coor = "Coordinates: (" + x + "," + y + ")";
    document.getElementById("friendly-fleet").innerHTML = coor
}

function clearCoor(){
    document.getElementById("friendly-fleet").innerHTML = "";
}




console.log(gameStateModule);