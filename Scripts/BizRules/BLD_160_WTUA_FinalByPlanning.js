/*******************************************************
| Script/Function: finalByPlanning() - (ID160)
| Created by: Jei Yang
| Created on: 21Dec20
| Usage: When task "Planning Review" has status set to "Passed with Conditions" ,
|        Add pending inspection "Final by Planning" from the "BLD10" inspection group.
| Modified by: ()
*********************************************************/
(function () {

    var inspectionGroup = "BLD10";
    var inspectionName = "Final by Planning";

    // Schedule a pending inspection from the inspection group BLD10.
    var success = createPendingInspection(inspectionGroup, inspectionName, capId);
    if (success != true) {
        Avo_LogDebug("Failed to schedule '" + inspectionName + "'", 1);
        return;
    }

    Avo_LogDebug("Pending '" + inspectionName + "' inspection scheduled", 2); //debug

})();