/*******************************************************
| Script/Function: noHardHoldResult() - (ID167)
| Created by: Nicolaj Bunting
| Created on: 18Dec20
| Usage: On inspection result If inspection type is "081 No Hard Hold" and inspection result is "No Hard Hold" Then update task 
| "Inspections" with status of "081 No Hard Hold Revision", call ID136
| Modified by: ()
*********************************************************/
(function () {
    var taskName = "Inspections";

    var processCode = aa.workflow.getTask(capId, taskName).getOutput().processCode;

    var status = "081 No Hard Hold Revision";
    var success = updateTask(taskName, status, "", "", processCode, capId);
    if (success === false) {
        Avo_LogDebug('Failed to update task "' + taskName + '" with status of "' + status + '"', 1);
        return;
    }

    Avo_LogDebug('Updated task "' + taskName + '" with status of "' + status + '"', 1);

    //Script 136 No Hard Hold Revision
    include("BLD_136_WTUA_NoHardHoldRevision");
})();