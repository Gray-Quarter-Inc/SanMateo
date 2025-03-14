/*******************************************************
| Script/Function: aaInspectionScheduleBalanceDueBlock() - (ID232)
| Created by: Jei Yang
| Created on: 9Mar21
| Usage: On inspection scheduled, block inspection schedule request from ACA with the message "Inspection cannot be scheduled because there is a balance due on the record. The balance due is " + balanceDue + "."
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
                Avo_LogDebug("Current user ID found in the list", 2);    //debug
                return;
            }
            //currentUserID does not match the list on the standard choice 'Inspectors'
        } else if (value == "Inspections") {
            if (String(stdChoiceArray[i].description).indexOf('"' + inspType + '"') != -1) {
                Avo_LogDebug("Current inspType found in the list", 2);    //debug
                return;
            }
            //current inspType does not match the list on the standard choice 'Inspections'
        }
    }

    cancel = true;
    showMessage = true;
    Avo_LogDebug("aaInspectionScheduleBalanceDueBlock", 1);
    comment("Inspection cannot be scheduled because there is a balance due on the record. The balance due is " + balanceDue + ".");
    //comment(debug); //debug
})();