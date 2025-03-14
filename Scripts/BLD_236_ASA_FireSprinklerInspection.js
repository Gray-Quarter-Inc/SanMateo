/*******************************************************
| Script/Function: fireSprinklerInspection() - (ID236)
| Created by: Jei Yang
| Created on: 22Dec20
| Usage: Add inspection type "Final by Fire" in the pending status
| Modified by: ()
*********************************************************/
(function () {
    var inspectionGroup, inspectionName;

    inspectionGroup = "BLD10";
    inspectionName = "Final by Fire";

    // Schedule a pending inspection from the inspection group BLD10.
    var success = createPendingInspection(inspectionGroup, inspectionName, capId);
    if (success != true) {
        Avo_LogDebug("Failed to schedule '" + inspectionName + "'", 1);
        return;
    }

    Avo_LogDebug("Pending '" + inspectionName + "' inspection scheduled", 2); //debug




})();