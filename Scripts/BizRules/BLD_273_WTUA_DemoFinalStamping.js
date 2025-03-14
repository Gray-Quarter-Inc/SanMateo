/*******************************************************
| Script/Function: demoStampingReview() - (ID273)
| Created by: Jei Yang
| Created on: 30Apr21
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
    //var dueDate = Avo_GetDateFromAccelaDateString(dueDateStr);

/*    
    taskName = "Plan Preparation for Issuance";
    var status = "Final Stamping";
    success = updateTask(taskName, status, "", "", "");
    if (success === false) {
        Avo_LogDebug('Failed to update task "' + taskName + '" with status of "' + status + '"', 1);
        return;
    }
*/
    // Activate task
    taskName = "Planning Review";
    success = activateTask(taskName);
    if (success === false) {
        Avo_LogDebug('Failed to activate task "' + taskName + '"', 1);
    }
    editTaskDueDate(taskName, dueDate);

})();
