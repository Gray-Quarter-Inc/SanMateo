/*******************************************************
| Script/Function: otcAutoIssuance() - (ID18)
| Created by: Nicolaj Bunting
| Created on: 21Oct20
| Usage: On submit update task "Application Submittal" with status "Complete" as user "ONLINE PERMITS" and complete task, close task "Ready to Issue Permit" 
| with status of "Permit Issued" as same user, call ID54
| Modified by: ()
*********************************************************/
(function () {
    if (!publicUser) {
        return;
    }
    var username = "ONLINE PERMITS";

    var taskName, status, success;

    taskName = "Application Submittal";
    status = "Complete";

    // Update status and complete task
    success = Avo_CloseTaskAsUser(taskName, status, "", "", username, false, null, capId);
    if (success === false) {
        return;
    }

    // Branch task
    taskName = "Ready to Issue Permit";
    status = "Permit Issued";
    success = Avo_BranchTaskAsUser(taskName, status, "", "", username, null, capId);
    if (success === false) {
        return;
    }

    //Script 384 Send Permit Auto Issued Email
    include("BLD_384_ASA_CTRCA_SendPermitAutoIssuedEmail");
})();

// aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC Test: BLD_018_ASA_CTRCA_OtcAutoIssuance", debug); //debug