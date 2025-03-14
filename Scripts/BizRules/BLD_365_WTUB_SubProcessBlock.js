//BLD_365_WTUB_SubProcessBlock

/*******************************************************
| Script/Function: subProcessBlock() - (ID365)
| Created by: Jei Yang
| Created on: 12Aug21
| Usage: For Planning Review Task, if any of the subprocess's task other than "Planning Review Distribution" are open,
|        For Public Works Review Task, if any of the subprocess's task other than "Public Works Review Distribution" are open,
|        For Environmental Health Review task, if any of the subprocess's task other than "Environmental Health Review Distribution" are open,
|        For Geotechnical Review task, if any of the subprocess's task other than "Geotechnical Review Distribution" are open,
|        block status update to "Passed" or "Passed with Conditions" with the message "The subprocess needs to be completed before the review can be passed"
| Modified by: ()
*********************************************************/
(function () {
    var subprocessList = null;

    if (wfTask == "Civil and Drainage Review") {
        subprocessList = ["Drainage Review", "Erosion Control Review", "Stormwater Treatment Review", "Civil Review Consolidation"];
    
    } else if (wfTask == "Planning Review") {
        subprocessList = ["Landscape Review", "Zoning and Land use Review", "Grading Review", "Arborist Review", "Planning Review Consolidation"];
    
    } else if (wfTask == "Public Works") {
        subprocessList = ["Traffic Review", "Off-site Drainage Review", "Encroachment Permit Review", "Sewer Section Review", "Public Works Review Consolidation"];

    } else if (wfTask == "Environmental Health Review") {
        subprocessList = ["Land Use Review", "Commercial Kitchens Review", "Hazardous Materials Review", "Environmental Health Review Consolidation"];

    } else if (wfTask == "Geotechnical Review") {
        subprocessList = ["In House Geotechnical", "Out of House Geotechnical", "Out of House Geological", "Geotechnical Review Consolidation"];

    } else {
        return;
    }


    var result = aa.workflow.getTaskItems(capId, wfTask, wfProcess, null, null, null);
    if (result.getSuccess() != true) {
        //Avo_LogDebug("Failed to get task items. " + result.errorType + ': ' + result.errorMessage, 1);
        Avo_LogDebug('Failed to get "' + wfTask + '" task. ' + result.errorType + ": " + result.errorMessage, 1);
        return;
    }
    var allTaskItems = result.getOutput();
    var processCode = "";
    for (var i in allTaskItems) {
        var taskItem = allTaskItems[i];
        Avo_LogDebug('Main Task: ' + taskItem.taskDescription + " - " + taskItem.processCode, 2);
    }

    Avo_LogDebug("---subprocess---", 2);
    var subprocessOpen = false;
    for (var i in subprocessList) {
        var subprocessName = subprocessList[i];
        var result = aa.workflow.getTaskItems(capId, subprocessName, processCode, null, null, null);
        if (result.getSuccess() != true) {
            //Avo_LogDebug("Failed to get task items. " + result.errorType + ': ' + result.errorMessage, 1);
            Avo_LogDebug('Failed to get "' + subprocessName + '" task. ' + result.errorType + ": " + result.errorMessage, 1);
            return;
        }
        var allSubtaskItems = result.getOutput();
        var subtaskItem = allSubtaskItems[0];

        if (!subtaskItem) {
            Avo_LogDebug('Sub-task "' + subprocessName + '" does not exist in current workflow', 1);
            continue;
        }

        Avo_LogDebug('taskItem: ' + subtaskItem.taskDescription, 2);
        var isActive = subtaskItem.activeFlag == "Y";
        Avo_LogDebug("Active(" + String(isActive) + ")", 2);	//debug
    
        var isComplete = subtaskItem.completeFlag == "Y";
        Avo_LogDebug("Complete(" + String(isComplete) + ")", 2);	//debug

        if (isActive && !isComplete) {
            subprocessOpen = true;
            break;
        }
    
    }

    if (!subprocessOpen) {
        return;
    }


    cancel = true;
    showMessage = true;

    var msg = "The subprocess needs to be completed before the review can be passed";
    comment(msg);
    Avo_LogDebug(msg, 1);
})();
