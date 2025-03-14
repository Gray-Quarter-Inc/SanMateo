/*******************************************************
| Script/Function: expInspPassExt(ID356)
| Created by: Nicolaj Bunting
| Created on: 16Jul21
| Usage: On Insp result If task "Inspections" is active And result is "Pass" And insp type is not in "IGNORE_LIST" in std choice 
| "ACA_INSPECTION_LIMIT" Then set ASI "Date of Expiration" to 180 days from today
| Modified by: ()
*********************************************************/
(function () {
    if (inspResult != "Pass") {
        return;
    }

    var taskName = "Inspections";
    var result = aa.workflow.getTaskItems(capId, taskName, null, null, null, null);
    if (result.getSuccess() != true) {
        Avo_LogDebug('Failed to get task "' + taskName + '". ' + result.errorType + ": " + result.errorMessage, 1);
        return;
    }

    var allTaskItems = result.getOutput();
    for (var i in allTaskItems) {
        var taskItem = allTaskItems[i];
        if (!taskItem.getTaskDescription().toUpperCase().equals(taskName.toUpperCase())) {
            continue;
        }

        var isActive = taskItem.activeFlag == "Y";
        Avo_LogDebug("Active(" + String(isActive) + ")", 2);	//debug

        if (isActive != true) {
            return;
        }

        var isComplete = taskItem.completeFlag == "Y";
        Avo_LogDebug("Complete(" + String(isComplete) + ")", 2);	//debug

        if (isComplete == true) {
            return;
        }

        Avo_LogDebug('Task "' + taskName + '" is active', 1);
        break;
    }

    // Check Inspection isn't in ignore list
    var stdChoice = "ACA_INSPECTION_LIMIT";
    var ignoreTypes = String(lookup(stdChoice, "IGNORE_LIST"));
    //Avo_LogDebug("Ignore Types(" + ignoreTypes + ")", 2);   //debug

    var ignoreTypesArr = ignoreTypes.split(",");
    for (var i in ignoreTypesArr) {
        var type = ignoreTypesArr[i];
        Avo_LogDebug("Type to Ignore(" + type + ")", 2);    //debug

        if (type != inspType) {
            continue;
        }

        Avo_LogDebug('Inspection "' + inspType + '" is included in ignore list', 1);
        return;
    }

    var expDate = Avo_GetToday();
    expDate.setDate(expDate.getDate() + 180);
    var expDateStr = aa.util.formatDate(expDate, "MM/dd/yyyy");

    var success = editAppSpecific("Date of Expiration", expDateStr, capId);
    if (success === false) {
        Avo_LogDebug('Failed to set "Date of Expiration"', 1);
        return;
    }

    Avo_LogDebug('Set "Date of Expiration" to "' + expDateStr + '"', 1);
})();