/*******************************************************
| Script/Function: waterHeaterAutoIssuance() - (ID110)
| Created by: Jei Yang
| Created on: 7Dec20
| Usage: If ASI "Is this a replacement water heater in the same location?"= Y, 
         OR ASI "If new location, where located" = "Not within garage",
         set workflow task "Ready to Issue Permit" to "Permit Issued"
         and set the workflow task "Application Submittal" to the status of "Complete"
         Set the workflow task 'Ready to issue Permit" to status of "Permit issued"
         Do not activate the next task after Application Submittal. The only task that should be open is "Inspections"
| Modified by: ()
*********************************************************/
(function () {

    var resOrComm = String(AInfo["Residential or Commercial"]);
    Avo_LogDebug("Residential or Commercial(" + resOrComm + ")", 2); //debug

    var replacement = String(getAppSpecific("Is this a replacement water heater in the same location?", capId));
    Avo_LogDebug("Is this a replacement water heater in the same location?(" + replacement + ")", 2); //debug

    var whereLocated = String(getAppSpecific("If new location, where located?", capId));
    Avo_LogDebug("If new location, where located?(" + whereLocated + ")", 2); //debug

    //if (resOrComm.toUpperCase() == "RESIDENTIAL" && (replacement.toUpperCase() == "YES" || whereLocated.toLowerCase() == "not within garage")) {
    if (replacement.toUpperCase() == "YES" || whereLocated.toLowerCase() == "not within garage") {
        Avo_LogDebug("Residential", 2); //debug
    } else {
        return;
    }
    /* else if (resOrComm.toUpperCase() == "COMMERCIAL" && replacement.toUpperCase() == "YES") {
        Avo_LogDebug("Commercial", 2); //debug
    } */



    var username = "ONLINE PERMITS";
    var taskName, status, success;

    // Update status and complete task
    taskName = "Application Submittal";
    status = "Complete";
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

aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC Prod: BLD_110_ASA_CTRCA_WaterHeaterAutoIssuance", debug); //debug