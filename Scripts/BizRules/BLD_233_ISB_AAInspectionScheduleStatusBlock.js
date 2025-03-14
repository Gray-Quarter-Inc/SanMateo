//BLD_233_ISB_AAInspectionScheduleStatusBlock
/*******************************************************
| Script/Function: aaInspectionScheduleStatusBlock() - (ID233)
| Created by: Jei Yang
| Created on: 10Mar21
| Usage: On inspection scheduled, if currentUserID does not match the list on the standard choice "Inspection Schedule Exceptions" 
|        if the inspection type does not match the list on the standard choice "Inspection Schedule Exceptions"
|        and if status does not match the list on the standard choice "Inspection Schedule Exceptions",
|        and if the app type does not match the list on the standard choice "Inspection Schedule Eceptions",
|        block scheudling of the inspection in the back office with the message ("An inspection cannot be scheduled until the permit has been issued."
| Modified by: ()
*********************************************************/
(function () {
    //showDebug = true;   //testing
    
    // Get all values in a standard choice
    // #StandardChoice, #Standard Choice, #StdChoice, #Std Choice
    var stdChoice = "Inspection Schedule Exceptions";

    var result = aa.bizDomain.getBizDomain(stdChoice);
    if (result.getSuccess() !== true) {
        Avo_LogDebug("Failed to retrieve values from standard choice " + stdChoice + ". " + result.errorType + ": " + result.errorMessage, 1);
        return;
    }
    var stdChoiceArray = result.getOutput().toArray();

    for (var i in stdChoiceArray) {
        var value = String(stdChoiceArray[i].bizdomainValue);
        if (value == "Inspectors") {
            if (String(stdChoiceArray[i].description).indexOf('"' + currentUserID + '"') != -1) {
                Avo_LogDebug("Current user ID '" + currentUserID + "' found in the list", 2);    //debug
                return;
            }
            //currentUserID does not match the list on the standard choice 'Inspectors'
        } else if (value == "Inspections") {
            if (String(stdChoiceArray[i].description).indexOf('"' + inspType + '"') != -1) {
                Avo_LogDebug("Current inspType '" + inspType + "' found in the list", 2);    //debug
                return;
            }
            //current inspType does not match the list on the standard choice 'Inspections'
        } else if (value == "Status") {
            var capToCheck = aa.cap.getCap(capId).getOutput();
            var status = String(capToCheck.getCapStatus());
            if (String(stdChoiceArray[i].description).indexOf('"' + status + '"') != -1) {
                Avo_LogDebug("Current status '" + status + "' found in the list", 2);    //debug
                return;
            }
            //current status does not match the list on the standard choice 'Status'
        } else if (value == "Record Types") {
            var result = aa.cap.getCap(capId);
            if (result.getSuccess() != true) {
                Avo_LogDebug("Failed to get cap. " + result.errorType + ': ' + result.errorMessage, 1);
                return;
            }
            var cap = result.getOutput();
            var appType = cap.getCapType();
            var appTypeString = String(appType);

            if (String(stdChoiceArray[i].description).indexOf('"' + appTypeString + '"') != -1) {
                Avo_LogDebug("Current record type '" + appTypeString + "' found in the list", 2);    //debug
                return;
            }
            //current record type does not match the list on the standard choice 'Record Types'
        }
    }

    cancel = true;
    showMessage = true;
    Avo_LogDebug("aaInspectionScheduleStatusBlock", 1);
    comment("An inspection cannot be scheduled until the permit has been issued.");
    //comment(debug); //debug
})();