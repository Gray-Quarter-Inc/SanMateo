/*******************************************************
| Script/Function: finalStampingReview() - (ID266)
| Created by: Jei Yang
| Created on: 20Apr21
| Usage: Workflow task "Plan Preparation for Issuance" is set to the status of "Final Stamping"
|        Keep the "Plan Preperation for Issuance" Task open also open up the following Review Tasks:
|        Building Review, Planning Review, Fire Review.
|        Also, update the workflow due date to 5 business days from now.
| Modified by: ()
*********************************************************/
(function () {
    var taskName, success;

    var currentDateTime = new Date();
    var currentDateTimeStr = aa.util.formatDate(currentDateTime, "MM/dd/yyyy");

    var dueDate = dateAdd(currentDateTimeStr, 5, "Y");
    Avo_LogDebug("Add 5 business days to the current date(" + dueDate  + ")", 2);	//debug

    var taskList = ["Building Review", "Planning Review", "Fire Review"];

    for (var i in taskList) {
        taskName = taskList[i];
        var result = aa.workflow.getWorkflowHistory(capId, taskName, aa.util.newQueryFormat());
        
        if (result.getSuccess() != true) {
            Avo_LogDebug("Failed to get status history. " + result.errorType + ': ' + result.errorMessage, 1);
            return;
        }
        var statusHistory = result.getOutput();

        for(var j in statusHistory) {
            var statusModel = statusHistory[j];
            Avo_LogDebug(taskName + " Active Flag (" + statusModel.activeFlag+ ")", 2);
            Avo_LogDebug(taskName + " Complete Flag (" + statusModel.completeFlag+ ")", 2);

            var isActive = statusModel.activeFlag == "Y";
            var status = statusModel.disposition;
            if (isActive || status == "Passed" || status == "Passed with Conditions") {
                //If the task has been opened (Active), activate the task.
                success = activateTask(taskName);
                if (success === false) {
                    Avo_LogDebug('Failed to activate task "' + taskName + '"', 1);
                }
                editTaskDueDate(taskName, dueDate);
            }
        }

    }


})();
