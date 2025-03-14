/*******************************************************
| Script/Function: finalStampingReview() - (ID266)
| Created by: Jei Yang
| Created on: 20Apr21
| Usage: If workflow task "Ready to Issue Permit" is set to the status of "Permit Issued" or "Permit Reissued" and the following tasks are still open:
|        Waste Mangement, PCB Monitoring, EC Pre-Construction, Grading Permit
| Modified by: ()
*********************************************************/
(function () {

    // #workflow, #comment, #taskComment, #taskComments
    var result = aa.workflow.getTasks(capId);
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get all tasks. " + result.errorType + ": " + result.errorMessage, 1);
        return;
    }
    var allClosed = true;
    var taskChecklist = ["Waste Management Review", "PCB Monitoring", "EC Pre-Construction", "Grading Permit"];

    var allTaskItems = result.getOutput();
    for (var i in allTaskItems) {
        var taskName = allTaskItems[i].taskDescription;

        var taskFoundInChecklist = false;
        for (var j in taskChecklist) {
            if (taskChecklist[j] == taskName) {
                taskFoundInChecklist = true;
                break;
            }
        }

        if (taskFoundInChecklist) {
            var isActive = allTaskItems[i].activeFlag == "Y";
            Avo_LogDebug(taskName + "Active(" + String(isActive) + ")", 2);	//debug
    
            if (isActive) {
                allClosed = false;
                break;
            }
        }
    }

    if(allClosed) {
        return;
    }
    
    cancel = true;
    showMessage = true;
    comment("One or more review tasks must be resolved before this permit can be issued");

})();
