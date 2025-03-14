/*******************************************************
| Script/Function: servUpgradeAutoIssuance() - (ID53)
| Created by: Jei Yang
| Created on: 29Oct20
| Usage: On submit If ASI "Is the service upgrade less than 300 Amps" is "Yes" Then update task "Application Submittal" with status "Complete" as user 
| "ONLINE PERMITS" and complete task, close task "Ready to Issue Permit" with status of "Permit Issued" as same user, call ID54
| Modified by: ()
*********************************************************/
(function () {
    if (!publicUser) {
        return;
    }
    var lessThan300Amps = String(getAppSpecific("Is the service upgrade less than 300 Amps", capId));
    Avo_LogDebug("<300 A(" + lessThan300Amps + ")", 2); //debug

    if (lessThan300Amps.toUpperCase() != "YES") {
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

// aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC Test: BLD_053_ASA_CTRCA_ServUpgradeAutoIssuance", debug); //debug