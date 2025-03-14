/*******************************************************
| Script/Function: setDetailDesc(ID406)
| Created by: Nicolaj Bunting
| Created on: 3Jun22
| Usage: On submit in ACA set description to all checked fieldnames in ASI subgroup "Encroachment Type" separated by '; '
| Modified by: ()
*********************************************************/
(function () {
    var allFieldNames = ["Drainage Facility", "Driveway", "Landscaping", "Sidewalk", "Transportation", "Traffic Control",
        "Open Trench", "Trenchless", "Storage Container", "Special Events", "Filming", "Other"];

    var subgroupName = "Encroachment Type";
    useAppSpecificGroupName = true;

    var desc = '';
    for (var i in allFieldNames) {
        var fieldName = allFieldNames[i];
        var fieldVal = String(getAppSpecific(subgroupName + "." + fieldName, capId));
        Avo_LogDebug(fieldName + "(" + fieldVal + ")", 2);  //debug

        if (fieldVal != "CHECKED") {
            continue;
        }

        if (desc.length > 0) {
            desc += '; ';
        }

        desc += fieldName;
    }

    useAppSpecificGroupName = false;

    var success = updateWorkDesc(desc, capId);
    if (success === false) {
        Avo_LogDebug("Failed to set description", 1);
        return;
    }

    Avo_LogDebug('Set description to "' + desc + '"', 1);
})();