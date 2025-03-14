//BLD_367_WTUA_ReviewConsolidation
/*******************************************************
| Script/Function: reviewConsolidation() - (ID367)
| Created by: Jei Yang
| Created on: 19Aug21
| Usage: if current task is one of the following; "Building Review", "Planning Review", "Public Works", "Civil and Drainage Review",
         "Environmental Health Review", "Sewer Review", "Water Review", "Fire Review", "Additional Review"
         AND current status is one of the following; "Additional Information Required" or "Resubmittal Required" or "Recommend Cancellation" or "Passed with Conditions" or "Passed" or "No Comment" or "Recommend Denial",
         AND none of the tasks are active,
         Set the Review Consolidation task, and Record status to the status of Review Consolidation 
| Modified by: ()
*********************************************************/
(function () {
    var reviewList = ["Building Review", "Planning Review", "Public Works", "Civil and Drainage Review",
         "Environmental Health Review", "Sewer Review", "Water Review", "Fire Review", "Additional Review", "Review Consolidation"];
    var altId = aa.cap.getCap(capId).getOutput().capModel.altID;

    for (var i in reviewList) {
        var reviewTaskName = reviewList[i];
        var result = aa.workflow.getTask(capId, reviewTaskName);
        if (result.getSuccess() != true) {
            Avo_LogDebug('Failed to get ' + reviewTaskName + ' task on record ' + altId + '. ' + result.errorType + ": " + result.errorMessage, 1);
            continue;
        }

        var taskItem = result.getOutput();

        var status = taskItem.disposition;
        Avo_LogDebug(reviewTaskName + ' Status(' + status + ")", 2);	//debug

        var isActive = taskItem.activeFlag == "Y";
        Avo_LogDebug("Active(" + String(isActive) + ")", 2);	//debug

        var isComplete = taskItem.completeFlag == "Y";
        Avo_LogDebug("Complete(" + String(isComplete) + ")", 2);	//debug

        //if any of the review task is still active, exit.
        if (isActive && !isComplete) {
            return;
        }
    }
    
    var reviewConsolidation = "Review Consolidation"
    var success = updateTask(reviewConsolidation, reviewConsolidation, "Updated by ID367 reviewConsolidation", "", wfProcess, capId);
    if (success === false) {
        Avo_LogDebug('Failed to update task "' + reviewConsolidation + '" with status of "' + reviewConsolidation + '"', 1);
        return;
    }
    
    Avo_LogDebug('Updated task "' + reviewConsolidation + '" with status of "' + reviewConsolidation + '"', 1);

})();
