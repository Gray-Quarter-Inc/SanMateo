/*******************************************************
| Script/Function: setTotalSqFootage(ID474)
| Created by: Nicolaj Bunting
| Created on: 15May23
| Usage: On submit set ASI "Total Square footage" to sum of "Industrial Square Footage",
| "Accessory Square Footage", "Warehouses Square Footage", "Assembly Square Footage",
| "Facilities Square Footage", "Agricultural Square Footage",
| "High Density Residential Square Footage", "Building Square Footage", "Barns Square Footage"
| Modified by: ()
*********************************************************/
(function () {
    var sum = 0;

    var allFieldNames = ["Industrial Square Footage", "Accessory Square Footage",
        "Warehouses Square Footage", "Assembly Square Footage", "Facilities Square Footage",
        "Agricultural Square Footage", "High Density Residential Square Footage",
        "Building Square Footage", "Barns Square Footage"];

    for (var i in allFieldNames) {
        var fieldName = allFieldNames[i];

        var sqFootage = parseFloat(getAppSpecific(fieldName, capId));
        Avo_LogDebug(fieldName + "(" + sqFootage + ")", 2);    //debug

        if (isNaN(sqFootage) == true || sqFootage < 0) {
            continue;
        }

        sum += sqFootage;
    }

    editAppSpecific("Total Square footage", sum, capId);
})();