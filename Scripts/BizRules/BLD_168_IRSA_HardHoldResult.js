/*******************************************************
| Script/Function: hardHoldResult() - (ID168)
| Created by: Nicolaj Bunting
| Created on: 18Dec20
| Usage: On inspection result If inspection type is "091 Revision Required No Inspection" and inspection result is "Hard Hold" Then 
| update task "Inspections" with status of "091 Hard Hold Revision", call ID137
| Modified by: ()
*********************************************************/
(function () {
    var taskName = "Inspections";

    var processCode = aa.workflow.getTask(capId, taskName).getOutput().processCode;

    var status = "091 Hard Hold Revision";
    var success = updateTask(taskName, status, "", "", processCode, capId);
    if (success === false) {
        Avo_LogDebug('Failed to update task "' + taskName + '" with status of "' + status + '"', 1);
        return;
    }

    Avo_LogDebug('Updated task "' + taskName + '" with status of "' + status + '"', 1);

    //Script 137 Hard Hold Revision
    include("BLD_137_WTUA_HardHoldRevision");
})();