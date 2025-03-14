function Avo_BranchTaskAsUser(taskName, taskStatus, taskComment, taskNote, username) // optional process name
{
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
    if (arguments.length > 5 && arguments[5] && String(arguments[5]).length > 0) {
        processName = arguments[5]; // subprocess
        useProcess = true;
    }

    var recordId = capId;
    if (arguments.length > 6 && arguments[6]) {
        recordId = arguments[6]; // use cap ID specified in args
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

        var dispositionDate = aa.date.getCurrentDate();
        var stepnumber = taskItem.getStepNumber();
        var processId = taskItem.getProcessID();

        var result;
        if (useProcess) {
            result = aa.workflow.handleDisposition(recordId, stepnumber, processId, taskStatus, dispositionDate, taskNote, taskComment, userModel, "B");
        } else {
            result = aa.workflow.handleDisposition(recordId, stepnumber, taskStatus, dispositionDate, taskNote, taskComment, userModel, "B");
        }

        if (result.getSuccess() != true) {
            Avo_LogDebug('Failed to branch task "' + taskName + '" with status "' + taskStatus + '" on record ' + altId + '. '
                + result.errorType + ': ' + result.errorMessage, 1);
            continue;
        }

        tasksUpdated++;
        Avo_LogDebug('Branched task "' + taskName + '" with status "' + taskStatus + '" as user "' + username + '" on record ' + altId, 1);
    }

    return tasksUpdated;
}
/*******************************************************
| Script/Function: Avo_CheckRevisionFeePaid()
| Created by: Jei Yang
| Created on: 10Dec21
| Usage: Check if Revision Fee (BLD_083) has been invoiced and paid.
         When the function returns true, revision fee is paid which means this new Revision record has been successfully created and converted to CAP record.
         This is an alternative to CTRCA event which is currently having a timing issue. 
| Modified by: ()
*********************************************************/
