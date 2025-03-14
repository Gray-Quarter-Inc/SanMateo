function Avo_CloseTaskAsUser(taskName, taskStatus, taskComment, taskNote, username, promoteTask) {
    if (!taskStatus || String(taskStatus).length == 0) {
        taskStatus = "NA";
    }

    var result = aa.people.getPublicUserByUserName(username);
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get user " + username + ". " + result.errorType + ": " + result.errorMessage, 1);
        return false;
    }

    var userModel = result.getOutput();

    var useProcess = false;
    var processName = "";
    if (arguments.length > 6 && arguments[6] && String(arguments[6]).length > 0) {
        processName = arguments[5]; // subprocess
        useProcess = true;
    }

    var recordId = capId;
    if (arguments.length > 7 && arguments[7]) {
        recordId = arguments[7]; // use cap ID specified in args
    }

    var altId = aa.cap.getCap(recordId).getOutput().capModel.altID;

    var workflowResult = aa.workflow.getTaskItems(recordId, taskName, processName, null, null, null);
    if (workflowResult.getSuccess() != true) {
        Avo_LogDebug("Failed to get workflow items on record " + altId + ". " + workflowResult.errorType + ': ' + workflowResult.errorMessage, 1);
        return false;
    }

    var tasksUpdated = 0;

    var allTaskItems = workflowResult.getOutput();
    for (var i in allTaskItems) {
        var taskItem = allTaskItems[i];
        if (!taskItem.getTaskDescription().toUpperCase().equals(taskName.toUpperCase()) || (useProcess && !taskItem.getProcessCode().equals(processName))) {
            continue;
        }

        var taskStatusDate = aa.date.getCurrentDate();
        var stepnumber = taskItem.getStepNumber();
        var processId = taskItem.getProcessID();

        var result;
        if (promoteTask !== true) {
            if (useProcess) {
                result = aa.workflow.handleDisposition(recordId, stepnumber, processId, taskStatus, taskStatusDate, taskNote, taskComment, userModel, "U");
            } else {
                result = aa.workflow.handleDisposition(recordId, stepnumber, taskStatus, taskStatusDate, taskNote, taskComment, userModel, "U");
            }

            var result = aa.workflow.getTask(recordId, taskName);
            if (result.getSuccess() != true) {
                Avo_LogDebug('Failed to get updated workflow item "' + taskName + '". ' + result.errorType + ": " + result.errorMessage, 1);
            } else {
                var updatedTaskItem = result.getOutput();

                updatedTaskItem.activeFlag = "N";
                updatedTaskItem.completeFlag = "Y";

                var editResult = aa.workflow.editTask(updatedTaskItem);
                if (editResult.getSuccess() != true) {
                    Avo_LogDebug('Failed to complete task "' + taskName + '" on record ' + altId + '. ' + result.errorType + ': ' + result.errorMessage, 1);
                } else {
                    Avo_LogDebug('Completed task "' + taskName + '" as user "' + username + '" on record ' + altId, 1);
                }
            }
        } else {
            if (useProcess) {
                result = aa.workflow.handleDisposition(recordId, stepnumber, processId, taskStatus, taskStatusDate, taskNote, taskComment, userModel, "Y");
            } else {
                result = aa.workflow.handleDisposition(recordId, stepnumber, taskStatus, taskStatusDate, taskNote, taskComment, userModel, "Y");
            }
        }

        if (result.getSuccess() != true) {
            Avo_LogDebug('Failed to close task "' + taskName + '" with status "' + taskStatus + '" on record ' + altId + '. '
                + result.errorType + ': ' + result.errorMessage, 1);
            continue;
        }

        tasksUpdated++;
        Avo_LogDebug('Closed task "' + taskName + '" with status "' + taskStatus + '" as user "' + username + '" on record ' + altId, 1);
    }

    return tasksUpdated;
}
/*******************************************************
| Script/Function: Avo_GenerateReportAndAttachToRecord(itemCap, reportName, module, parameters)
| Usage: Generates the report reportName using parameters and attaches it to record itemCap if "save to EDMS" is enabled and "EDMS Object" is "Record" in report manager
| Modified by: ()
*********************************************************/
