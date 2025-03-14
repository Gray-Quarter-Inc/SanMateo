/*******************************************************
| Script/Function: checkInspTask() - (ID56)
| Created by: Nicolaj Bunting
| Created on: 2Nov20
| Usage: On inspection scheduled If user is Not "IVRUSER" And task "Inspections" is not active And If in AA Then if inspection type is 
| Not in std choice "BLD_InspectionBackOfficeBlockExemption" and not contain "Final" Then block submittal and display message
| "Inspections cannot be scheduled until the permit is issued"
| Modified by: ()
*********************************************************/
(function () {
    // Check user
    if (matches(currentUserID, "IVRUSER") == true) {
        return;
    }

    if (publicUser != true) {
        var stdChoice = "BLD_InspectionBackOfficeBlockExemption";

        // Check inspection type
        if (String(inspType).toUpperCase().indexOf('FINAL') != -1) {
            Avo_LogDebug("Final inspection. Ignoring", 1);
            return;
        }

        var exemption = lookup(stdChoice, String(inspType));
        Avo_LogDebug("Insp Exemption(" + exemption + ")", 2);   //debug

        if (exemption && String(exemption).length > 0) {
            Avo_LogDebug("Inspection exemption", 1);
            return;
        }
    }

    var result = aa.workflow.getTask(capId, "Inspections");
    if (result.getSuccess() != true) {
        Avo_LogDebug('Failed to get "Inspections" task. ' + result.errorType + ": " + result.errorMessage, 1);
        return;
    }

    var taskItem = result.getOutput();

    var status = taskItem.disposition;
    Avo_LogDebug("Status(" + status + ")", 2);	//debug

    var statusDateArr = String(taskItem.statusDate).split(" ");
    var statusDate = new Date(statusDateArr[2] + " " + statusDateArr[1] + " " + statusDateArr[5] + " " + statusDateArr[3]
        + " " + statusDateArr[4]);
    Avo_LogDebug("Status Date(" + aa.util.formatDate(statusDate, "MM/dd/yyyy") + ")", 2);	//debug

    var isActive = taskItem.activeFlag == "Y";
    Avo_LogDebug("Active(" + String(isActive) + ")", 2);	//debug

    var isComplete = taskItem.completeFlag == "Y";
    Avo_LogDebug("Complete(" + String(isComplete) + ")", 2);	//debug

    if (isActive == true && isComplete != true) {
        return;
    }

    cancel = true;

    if (publicUser == true) {
        showDebug = false;
    }

    showMessage = true;
    comment("Inspections cannot be scheduled until the permit is issued");
})();