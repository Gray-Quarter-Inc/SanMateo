/*******************************************************
| Script/Function: balanceDueBlockIssuance() - (ID199)
| Created by: Tom Grzegorczyk
| Created on: 05Aug21
| Usage: Block submit of the status with a message "Cannot issue permit until the fees have been paid"
|        If balance due => 0 AND the workflow task "Planning Review" is set to "Passed" or Passed with Condition
|        If balance due => 0 AND the workflow task "Ready to Issue Permit" is set to "Permit Issued" or "Permit Re-Issued"
| Modified by: ()
*********************************************************/
(function balanceDueBlockIssuance() {
    if (balanceDue > 0) {
        /*
        var block = false;
        var result = aa.workflow.getTasks(capId);
        if (result.getSuccess() != true) {
            Avo_LogDebug("Failed to get all tasks. " + result.errorType + ": " + result.errorMessage, 1);
            return;
        }

        
        var allTasks = result.getOutput();
        for (var i in allTasks) {
            var taskName = allTasks[i].taskDescription;
            var status = allTasks[i].disposition;
            if (taskName != "Planning Review" && taskName != "Ready to Issue Permit") {
                continue;
            }
            Avo_LogDebug("Found task: '" + taskName + "' with status '" + status + "'", 1);
            if (taskName == "Planning Review" && (status == "Passed" || status == "Passed with Conditions")) {
                block = true;
                break;
            }
            if (taskName == "Ready to Issue Permit" && (status == "Permit Issued" || status == "Permit Re-Issued")) {
                block = true;
                break;
            }
        } 
        if (!block)
            return;
        */



        cancel = true;
        showMessage = true;
        comment("Cannot issue permit until the fees have been paid");
    
    }
})();
