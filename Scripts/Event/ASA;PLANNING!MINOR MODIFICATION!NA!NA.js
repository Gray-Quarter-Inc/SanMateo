try {
    if (!publicUser) {
        var rpr = AInfo["Related Planning Record"];
        if (rpr && rpr != "") {
            parentCapId = getApplication(rpr);
            if (parentCapId) {
                var childRecordArray = getChildren("Planning/Minor Modification/NA/NA", parentCapId);
                var numberOfChildren = 0;
                if (childRecordArray) 
                    numberOfChildren = childRecordArray.length;
                logDebug("Number of children " + numberOfChildren);
                var parentAltIdPrefix = rpr + "-MOD";
                var updateResult = aa.cap.updateCapAltID(capId, parentAltIdPrefix + numberOfChildren);
                if (updateResult.getSuccess()) {
                    logDebug("Updated alt id to " + ("" + parentAltIdPrefix + numberOfChildren));
                }
                else {
                    logDebug(updateResult.getErrorMessage());
                }
                addParent(parentCapId);
            }
        }
    }    
} catch (err) {
    logDebug("An error occurred in ASA;PLANNING!MINOR MODIFICATION!NA!NA: " + err.message);
    logDebug(err.stack);
}