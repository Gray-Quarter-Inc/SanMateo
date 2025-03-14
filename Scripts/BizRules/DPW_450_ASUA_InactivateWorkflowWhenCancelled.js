/*******************************************************
| Script/Function: inactivateWorkflowWhenCancelled()
| Created by: Tom Grzegorczyk
| Created on: 22Nov22
| Usage: Inactivate all active workflow tasks, when record status is updated to "Cancelled".
| Modified by: ()
*********************************************************/
(function () {
    var capToCheck = aa.cap.getCap(capId).getOutput();
    var recordStatus = String(capToCheck.capStatus);
    Avo_LogDebug("RecordStatus(" + recordStatus + ")", 2);  //debug
    if (recordStatus != "Cancelled") {
        return;
    }
    Avo_LogDebug("Deactivating Workflow Tasks...", 2);
    var allTasks = aa.workflow.getTasks(capId).getOutput();
    var success = true;
	for (var i in allTasks) {
		var task = allTasks[i];
        var taskName = task.getTaskDescription();
        Avo_LogDebug("TaskName(" + taskName + ")", 2);
        try {
            deactivateTask(taskName);
        } catch (err) {
            Avo_LogDebug("**ERROR: Failed to deactivate task '" + taskName + "', error message: " + err.message, 1);
            success = false;
        }
    }
    if (success == true) {
        Avo_LogDebug("All tasks deactivated successfully!", 2);
    }
})();