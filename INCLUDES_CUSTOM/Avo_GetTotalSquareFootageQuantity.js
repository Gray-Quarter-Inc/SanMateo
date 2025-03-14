function Avo_GetTotalSquareFootageQuantity(recordId) {
    logDebug("Avo_GetTotalSquareFootageQuantity(recordId)");

    var sum = 0;

    var table = loadASITable("FLOOR_INFO");
    if (!table) {
        return sum;
    }
    if (table.length == 0) {
        logDebug("FLOOR_INFO table is empty");
        return sum;
    }

    for (a in table) {
        var floor = table[a]["Floor Number"];
        var field = table[a]["Square Footage"];
        var area = parseFloat(field.fieldValue);

        if (isNaN(area) == true) {
            continue;
        }

        if (area < 25000) {
            continue;
        }

        var quantity = Math.ceil(area / 25000) - 1;
        logDebug("Floor(" + floor + "), Area(" + area + "), Quantity(" + quantity + ")");   //debug

        if (quantity <= 0) {
            continue;
        }

        sum += quantity;
    }

    return sum;
}
/*******************************************************
| Script/Function: Avo_LogDebug(debug, [importance])
| Created by: Nicolaj Bunting
| Created on: 05Feb18
| Usage: Display debug output based on importance and current debug level
| Modified by: Nic Bunting (2May18)
*********************************************************/
