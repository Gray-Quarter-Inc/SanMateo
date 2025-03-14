/*******************************************************
| Script/Function: ComAddTotalSQFoot(ID451)
| Created by: Sheryll Tabamo
| Created on: Dec 19 2022
| Usage: For Record type Building/commercial/Add Alt Imp/NA, if ASI "Addition" is checked, populate the ASI "Total Square Footage" with the total of the following fields:
|       Residential Square Footage
|       Industrial Square Footage
|       Accessory Square Footage
|       Warehouses Square Footage
|       Assembly Square Footage
|       Facilities Square Footage
|       Parking Square Footage
|       Agricultural Square Footage
|       Barns Square Footage
|       Bathrooms Square Footage
| Modified by: ()
*********************************************************/
(function () {
    var asiArray = ["Residential Square Footage", "Industrial Square Footage", "Accessory Square Footage", "Warehouses Square Footage", "Assembly Square Footage", "Facilities Square Footage", "Parking Square Footage", "Agricultural Square Footage", "Barns Square Footage", "Bathrooms Square Footage"];
    var isAddition = String(getAppSpecific("Addition")) == "CHECKED" ? true : false;
    if (!isAddition){
        return;
    }
    var total = 0;
    for (a = 0; a < asiArray.length; a++){
        var asiField = asiArray[a];
        var asiFieldValue = getAppSpecific(asiField);
        if (asiFieldValue == null){
            continue;
        }
        total += Number(asiFieldValue);
    }
    var asiTotalSquareFootage = getAppSpecific("Total Square Footage");
    if(total == Number(asiTotalSquareFootage)){
        return;
    }
    editAppSpecific("Total Square Footage", total);

    var agr = getAppSpecific("Agricultural Square Footage");
    var barns = getAppSpecific("Barns Square Footage");
    var bathrooms = getAppSpecific("Bathrooms Square Footage");
    var totalAgr = 0;
    var totalBath = 0;

    totalAgr = Number(agr) + Number(barns);
    totalBath = Number(bathrooms);

    editAppSpecific("Total Square Footage of Agriculture Building", totalAgr);
    editAppSpecific("Office Bathroom Retail Space", totalBath);
    

})();