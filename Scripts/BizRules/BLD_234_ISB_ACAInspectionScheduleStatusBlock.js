/*******************************************************
| Script/Function: acaInspectionScheduleStatusBlock() - (ID234)
| Created by: Jei Yang
| Created on: 11Mar21
| Usage: On inspection scheduled, if user is an ACA user AND status does not match the list on the standard choice "Inspection Schedule Exceptions"
|        Block scheudling of the inspection in the back office with the message ("An inspection cannot be scheduled until the permit has been issued."
| Modified by: ()
*********************************************************/
(function () {
    //showDebug = true;   //testing
    
    // Get all values in a standard choice
    // #StandardChoice, #Standard Choice, #StdChoice, #Std Choice
    var stdChoice = "Inspection Schedule Exceptions";
    var stdValue = "Status";

    var result = aa.bizDomain.getBizDomainByValue(stdChoice, stdValue);
    if (result.getSuccess() != true) {
        Avo_LogDebug('Failed to get key "' + stdValue + '" in std choice "' + stdChoice + '". '
            + result.errorType + ': ' + result.errorMessage, 1);
        return;
    }
    var bizDomain = result.getOutput();
    
    //List of Statuses
    var statusList = String(bizDomain.description);
    Avo_LogDebug("Status List(" + statusList + ")", 2);    //debug
    //Current CAP status
    var capToCheck = aa.cap.getCap(capId).getOutput();
    var status = String(capToCheck.getCapStatus());

    if (statusList.indexOf('"' + status + '"') != -1) {
        Avo_LogDebug("Current status '" + status + "' found in the list", 2);    //debug
        return;
    }

    cancel = true;
    showMessage = true;
    Avo_LogDebug("acaInspectionScheduleStatusBlock", 1);
    comment("An inspection cannot be scheduled until the permit has been issued.");
    //comment(debug); //debug
})();