function addRoofingSysReqCondition(capId) {
    var altId = aa.cap.getCap(capId).getOutput().capModel.altID;
    Avo_LogDebug("addRoofingSysReqCondition(" + altId + ")", 1);

    // check record type
    var cap = aa.cap.getCap(capId).getOutput();
    var recordType = String(cap.capType);
    Avo_LogDebug("Record Type(" + recordType + ")", 2); //debug

    if (recordType != "Building/OTC/Reroof/NA" && recordType != "Building/Full Review/NA/NA") {
        return false;
    }

    // Check if condition has already been added
    var condition = "Minimum Class A Roofing System Required";
    var conType = "Hazard";
    var conSeverity = "Notice";

    var hasCondition = appHasCondition(conType, null, condition, conSeverity);
    if (hasCondition === true) {
        return true;
    }

    // check fire severity
    var result = aa.parcel.getParcelandAttribute(capId, aa.util.newQueryFormat());
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get parcel on record " + altId + ". " + result.errorType + ": " + result.errorMessage, 1);
        return false;
    }

    var allParcels = result.getOutput().toArray();
    for (var i in allParcels) {
        var parcelModel = allParcels[i];
        // printLine(serialize(parcelModel));

        var allAttrs = parcelModel.parcelAttribute.toArray();
        for (var j in allAttrs) {
            var attr = allAttrs[j];
            // printLine(serialize(parcelAttr));

            var attrName = String(attr.b1AttributeName);
            Avo_LogDebug("Attribute(" + attrName + ")", 2);	//debug

            if (attrName != "FIRE_SEVERITY_ZONE") {
                continue;
            }

            var attrValue = String(attr.b1AttributeValue);
            Avo_LogDebug("Value(" + attrValue + ")", 2);	//debug

            if (attrValue != "LRA Very High") {
                continue;
            }

            // add condition
            addStdCondition(conType, condition, capId);
            return true;
        }
    }

    return false;
}
/*----------------------------------------------------------------------------------------------------/
| GIS Related Functions
/----------------------------------------------------------------------------------------------------*/
