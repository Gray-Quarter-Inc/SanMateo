/*******************************************************
| Script/Function: sidingStuccoReviewSkip() - (ID163)
| Created by: Jei Yang
| Created on: 21Dec20
| Usage: When task "Planning Review has status set to "Passed" or "Passed with Conditions" 
|        Complete task "Review Consolidation" with the status of "Approved" and complete the task "Ready to Issue Permit" with the status of "Permit Issued"
|        and call script 54 and open task "Inspections".
| Modified by: ()
*********************************************************/
(function () {
    var taskName, status, success;

    // Update status and complete task
    taskName = "Review Consolidation";
    status = "Approved";
    success = closeTask(taskName, status, "", "");
    if (success === false) {
        Avo_LogDebug('Failed to close task "' + taskName + '" with status of "' + status + '"', 1);
        return;
    }

    Avo_LogDebug('Closed task "' + taskName + '" with status of "' + status + '"', 1);

    taskName = "Ready to Issue Permit";
    status = "Permit Issued";
    success = closeTask(taskName, status, "", "");
    if (success === false) {
        Avo_LogDebug('Failed to close task "' + taskName + '" with status of "' + status + '"', 1);
        return;
    }

    Avo_LogDebug('Closed task "' + taskName + '" with status of "' + status + '"', 1);

    //Open up the task
    taskName = "Inspections";
    success = activateTask(taskName);
    if (success === false) {
        Avo_LogDebug('Failed to activate task "' + taskName + '"', 1);
        return;
    }

    Avo_LogDebug('Activated task "' + taskName + '"', 1);


    //Script 54 Send Permit Issued Email
    include("BLD_054_ASA_CTRCA_SendPermitIssuedEmail");
})();

aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC Supp: BLD_024_ASA_CTRCA_HvacAutoIssuance", debug); //debug