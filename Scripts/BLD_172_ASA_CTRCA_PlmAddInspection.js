/*******************************************************
| Script/Function: plmAddInspection() - (ID172)
| Created by: Jei Yang
| Created on: 22Dec20
| Usage: If ASI "Is a new clean out being installed or replaced" = "Y", add inspection type "Final by Sewer" in the pending status
|        If ASI "Is the work done in the public right of way" = "Y" add inspection "Final by Public Works" in the pending status
| Modified by: ()
*********************************************************/
(function () {
    var inspectionGroup, inspectionName;

    var cleanOut = String(getAppSpecific("Is a new clean out being installed or replaced", capId));
    Avo_LogDebug("Clean Out(" + cleanOut + ")", 2); //debug

    if (cleanOut.toUpperCase() == "YES") {
        inspectionGroup = "BLD10";
        inspectionName = "Final by Sewer District";

        // Schedule a pending inspection from the inspection group BLD10.
        var success = createPendingInspection(inspectionGroup, inspectionName, capId);
        if (success != true) {
            Avo_LogDebug("Failed to schedule '" + inspectionName + "'", 1);
            return;
        }

        Avo_LogDebug("Pending '" + inspectionName + "' inspection scheduled", 2); //debug

    }

    var publicRightOfWay = String(getAppSpecific("Is the work done in the public right of way", capId));
    Avo_LogDebug("Public Right of Way(" + publicRightOfWay + ")", 2); //debug

    if (publicRightOfWay.toUpperCase() == "YES") {
        inspectionGroup = "BLD10";
        inspectionName = "Final by Public Works";

        // Schedule a pending inspection from the inspection group BLD10.
        var success = createPendingInspection(inspectionGroup, inspectionName, capId);
        if (success != true) {
            Avo_LogDebug("Failed to schedule '" + inspectionName + "'", 1);
            return;
        }

        Avo_LogDebug("Pending '" + inspectionName + "' inspection scheduled", 2); //debug

    }

})();