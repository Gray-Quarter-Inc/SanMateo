/*******************************************************
| Script/Function: copyParcelAttrToAsi(ID392)
| Created by: Nicolaj Bunting
| Created on: 3Dec21
| Usage: On submit copy Parcel attributes to ASI
| Parcel Attr                   ASI Field Name
| LCP MIDCOAST PROJECT AREA     LCP MIDCOAST PROJECT AREA
| BOARD OF SUPERVISORY DISTRICT BOARD OF SUPERVISORY DISTRICT
| Modified by: ()
*********************************************************/
(function () {
    var attrMapping = {
        "LCP MIDCOAST PROJECT AREA": "LCP MIDCOAST PROJECT AREA",
        "BOARD OF SUPERVISORY DISTRICT": "BOARD OF SUPERVISORY DISTRICT"
    }

    var result = aa.parcel.getParcelandAttribute(capId, aa.util.newQueryFormat());
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get parcels. " + result.errorType + ": " + result.errorMessage, 1);
        return;
    }

    var allParcels = result.getOutput().toArray();
    if (allParcels.length == 0) {
        Avo_LogDebug("No parcels on record", 1);
        return;
    }

    var asiUpdated = 0;
    for (var i in allParcels) {
        var parcelModel = allParcels[i];

        var allAttrs = parcelModel.parcelAttribute.toArray();
        for (var j in allAttrs) {
            var attrModel = allAttrs[j];

            var attrName = attrModel.name;
            if (!(attrName in attrMapping)) {
                continue;
            }

            var attrVal = attrModel.value;
            //Avo_LogDebug(attrName + "(" + attrVal + ")", 2);    //debug

            if (matches(attrVal, null, 'null', undefined, "") == true) {
                continue;
            }

            var fieldName = attrMapping[attrName];

            var success = editAppSpecific(fieldName, attrVal, capId);
            if (success === false) {
                continue;
            }

            asiUpdated++;
            Avo_LogDebug('Set "' + fieldName + '" to "' + attrVal + '"', 1);
        }

        if (asiUpdated == 0) {
            continue;
        }

        break;
    }

    Avo_LogDebug('Updated ' + asiUpdated + ' ASI with GIS Parcel Attributes', 1);
})();