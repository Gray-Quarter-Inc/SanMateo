/*******************************************************
| Script/Function: issuePermit() - (ID82)
| Created by: Nicolaj Bunting
| Created on: 12Nov20
| Usage: When task "Planning Review" has status set to "Passed" close task "Review Consolidation" with status of "Approved", close task "Ready to Issue Permit"
| with status of "Permit Issued", call ID54
| Modified by: ()
*********************************************************/
(function () {
    var taskName = "Review Consolidation";
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