/*******************************************************
| Script/Function: preSiteInspectionBlock() - (ID271)
| Created by: Jei Yang
| Created on: 26Apr20
| Usage: If any inspection is set to the status "Pass" and the task "EC Pre-Construction" is active
|        Block with the message "EC Pre-Construction must be approved before inspections can be passed"
| Modified by: ()
*********************************************************/
(function () {

    var result = aa.workflow.getTask(capId, "EC Pre-Construction");
    if (result.getSuccess() != true) {
        Avo_LogDebug('Failed to get "EC Pre-Construction" task. ' + result.errorType + ": " + result.errorMessage, 1);
        return;
    }

    var taskItem = result.getOutput();
    var isActive = taskItem.activeFlag == "Y";
    Avo_LogDebug("Active(" + String(isActive) + ")", 2);	//debug

    var isComplete = taskItem.completeFlag == "Y";
    Avo_LogDebug("Complete(" + String(isComplete) + ")", 2);	//debug

    if (!isActive) {
        return;
    }

    cancel = true;
    if (publicUser == true) {
        showDebug = false;
    }

    showMessage = true;
    comment("EC Pre-Construction must be approved before inspections can be passed");
})();