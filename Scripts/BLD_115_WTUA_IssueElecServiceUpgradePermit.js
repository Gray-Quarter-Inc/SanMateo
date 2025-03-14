/*******************************************************
| Script/Function: issueElecServiceUpgradePermit() - (ID115)
| Created by: Nicolaj Bunting
| Created on: 2Dec20
| Usage: When task "Planning Review" has status set to "Passed" or "Passed with Conditions" Or task "Building Review" has status set to 
| "Passed" or "Passed with Conditions" If other review task is closed Then close task "Review Consolidation" with status of "Approved", 
| close task "Ready to Issue Permit" with status of "Permit Issued", call ID54
| Modified by: ()
*********************************************************/
(function () {
    // Check other task is also closed
    var taskName;

    if (wfTask == "Planning Review") {
        taskName = "Building Review";
    }
    if (wfTask == "Building Review") {
        taskName = "Planning Review";
    }

    var result = aa.workflow.getTasks(capId, taskName);
    if (result.getSuccess() != true) {
        Avo_LogDebug('Failed to get task "' + taskName + '". ' + result.errorType + ": " + result.errorMessage, 1);
        return;
    }

    var task = result.getOutput()[0];

    if (!("disposition" in task)) {
        Avo_LogDebug('No status yet set for task"' + taskName + '"', 1);
        return;
    }

    var taskStatus = String(task.disposition);
    Avo_LogDebug(taskName + "(" + taskStatus + ")", 2);	//debug

    if (taskStatus != "Passed" && taskStatus != "Passed with Conditions") {
        return;
    }

    taskName = "Review Consolidation";
    var status = "Approved";
    var success = closeTask(taskName, status, "", "");
    if (success === false) {
        Avo_LogDebug('Failed to close task "' + taskName + '" with status of "' + status + '"', 1);
        return;
    }

    Avo_LogDebug('Closed task "' + taskName + '" with status of "' + status + '"', 1);

    taskName = "Ready to Issue Permit";
    status = "Permit Issued";
    success = branchTask(taskName, status, "", "");
    if (success === false) {
        Avo_LogDebug('Failed to close task "' + taskName + '" with status of "' + status + '"', 1);
        return;
    }

    Avo_LogDebug('Closed task "' + taskName + '" with status of "' + status + '"', 1);

    //Script 54 Send Permit Issued Email
    include("BLD_054_ASA_CTRCA_SendPermitIssuedEmail");
})();