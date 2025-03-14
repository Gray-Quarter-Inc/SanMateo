/*******************************************************
| Script/Function: setInspArea()
| Created by: Nicolaj Bunting
| Created on: 18Aug20
| Usage: on submit If "ASI "Inspection Area" is blank Then set to value of "BUILDING INSPECTION AREA" parcel attribute
| Modified by: ()
*********************************************************/
(function () {
    var fieldName = "Inspection Area";

    var inspArea = getAppSpecific(fieldName, capId);
    Avo_LogDebug(fieldName + "(" + inspArea + ")", 2);  //debug

    if (inspArea) {
        return;
    }

    editAppSpecific(fieldName, parcelArr["ParcelAttribute.BUILDING INSPECTION AREA"], capId);
})();