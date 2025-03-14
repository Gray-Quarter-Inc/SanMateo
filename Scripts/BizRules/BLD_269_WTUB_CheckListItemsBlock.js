/*******************************************************
| Script/Function: finalStampingReview() - (ID266)
| Created by: Jei Yang
| Created on: 20Apr21
| Usage: If workflow task "Ready to Issue Permit" is set to the status of "Permit Issued" or "Permit Reissued" and the following tasks are still open:
|        J#, School fees, Water verification / permit, Fire sprinkler permit, Temporary power pole permit, PG&E letter of disconnect,
|        Sewer verification / permit, Encroachment permit, Demolition permit, Additional
| Modified by: Tom Grzegorczyk on 3Aug22 - added "Green Halo" to asiList
*********************************************************/
(function () {

    // #workflow, #comment, #taskComment, #taskComments
    var result = aa.workflow.getTasks(capId);
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get all tasks. " + result.errorType + ": " + result.errorMessage, 1);
        return;
    }
    var allPassed = true;
    var asiList = ["J#", "School fees", "Water verification", "Fire sprinkler permit", "Temporary power pole permit", "PG&E letter of disconnect",
        "Sewer verification", "Encroachment permit", "Demolition permit", "Additional", "Encroachment permit (Other Jurisdictions)", "Encroachment permit (SMC DPW Roads)", "Green Halo"];

    for (var i in asiList) {
        var asiValue = String(AInfo[asiList[i]]);
        Avo_LogDebug(asiList[i]+ "(" +  asiValue + ")", 2); //debug

        if (asiValue == "Required") {
            allPassed = false;
            break;
        }
        
    }

    if(allPassed) {
        return;
    }
    
    cancel = true;
    showMessage = true;
    comment("Permit cannot be issued until outstanding checklist items have been resolved");

})();
