/*******************************************************
| Script/Function: revisionInspectionBlock() - (ID396)
| Created by: Jei Yang
| Created on: 14Dec21
| Usage: On inspection scheduled block inspections to be scheduled on the record type Building/Revision/NA/NA with a message “Please schedule all inspections on the main permit.”
| Modified by: ()
*********************************************************/
(function () {
    Avo_LogDebug("Inspections cannot be scheduled for a Revision permit. Please schedule all inspections on the main permit.", 2);   //debug

    cancel = true;
    showMessage = true;
    if (publicUser == true) {
        showDebug = false;  // Hide debug in ACA
    }

    comment("Please schedule all inspections on the main permit.");
})();



//aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC Supp: BLD_396_ISB_RevisionInspectionBlock", debug); //debug