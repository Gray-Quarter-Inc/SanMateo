function Avo_GetTotalNumberOfHeadsQuantity(recordId) {
    logDebug("Avo_GetTotalNumberOfHeadsQuantity(recordId)");

    var sum = 0;

    var table = loadASITable("FLOOR_INFO");
    if (!table) {
        return sum;
    }
    if (table.length == 0) {
        logDebug("FLOOR_INFO table is empty");
        return sum;
    }

    var floors = 0;
    var totalHeads = 0;

    for (a in table) {
        var floor = table[a]["Floor Number"];
        var field = table[a]["Number of Heads"];
        var heads = parseInt(field.fieldValue, 10);

        if (isNaN(heads) == true) {
            continue;
        }

        if (heads < 200) {
            continue;
        }

        var quantity = Math.ceil(heads / 200) - 1;
        logDebug("Floor(" + floor + "), Heads(" + heads + "), Quantity(" + quantity + ")");   //debug

        if (quantity <= 0) {
            continue;
        }

        sum += quantity;
    }

    return sum;
}
/*******************************************************
| Script/Function: Avo_GetTotalSquareFootageQuantity(recordId)
| Created by: Nicolaj Bunting
| Created on: 26Jun17
| Usage: For each row in ASIT "FLOOR_INFO" get the "Square Footage" value Then for each additional 25000 sq ft or fraction thereof add 1 to the sum
| Modified by: ()
*********************************************************/
