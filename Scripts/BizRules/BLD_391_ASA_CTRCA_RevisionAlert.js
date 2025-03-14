/*******************************************************
| Script/Function: revisionAlert(ID391)
| Created by: Jei Yang
| Created on: 26Nov21
| Usage: On submit of Revision record, set parent record status to 'Revision Requested'
| Modified by: ()
*********************************************************/
(function () {
    // Get parent
    if (!parentCapId) {
        parentCapId = getParent();
        Avo_LogDebug("1. Parent(" + parentCapId + ")", 2);  //debug
    }
    if (!parentCapId) {
        var result = aa.cap.getProjectByChildCapID(capId, null, null);
        if (result.getSuccess() != true) {
            Avo_LogDebug("Failed to get parent record. " + result.errorType + ': ' + result.errorMessage, 1);
            return;
        }
        
        var allParentRecords = result.getOutput();
        for (var i in allParentRecords) {
            parentCapId = allParentRecords[i].projectID;
            Avo_LogDebug("2. Parent(" + parentCapId + ")", 2);  //debug
        }
    }

    var capIdStrArr = String(parentCapId).split("-");
    var result = aa.cap.getCap(capIdStrArr[0], capIdStrArr[1], capIdStrArr[2]);

    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get cap " + parentCapId + ". " + result.errorType + ": " + result.errorMessage, 1);
    }
    var parentCap = result.getOutput();

    if (!parentCap) {
        parentCap = aa.cap.getCap(parentCapId).getOutput();
    }
    var parentAltId = String(parentCap.capModel.altID); //parentCap.getCapID().getCustomID();
    Avo_LogDebug("Parent(" + parentAltId + ")", 2);  //debug

    updateAppStatus("Revision Requested", "Updated by ID391 revisionAlert", parentCapId);
})();
