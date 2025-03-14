function addStdConditionCustom(cType, cDesc, cComment) // optional cap ID
{
    var itemCap = capId;
    if (arguments.length == 4) {
        itemCap = arguments[3]; // use cap ID specified in args
    }
    if (!aa.capCondition.getStandardConditions) {
        logDebug("addStdCondition function is not available in this version of Accela Automation.");
    } else {
        standardConditions = aa.capCondition.getStandardConditions(cType, cDesc).getOutput();
        for (i = 0; i < standardConditions.length; i++)
        // deactivate strict match for indy
        //if (standardConditions[i].getConditionType().toUpperCase() == cType.toUpperCase() && standardConditions[i].getConditionDesc().toUpperCase() == cDesc.toUpperCase()) //EMSE Dom function does like search, needed for exact match
        {
            standardCondition = standardConditions[i];

            var addCapCondResult = aa.capCondition.addCapCondition(itemCap, standardCondition.getConditionType(), standardCondition.getConditionDesc(), cComment, sysDate, null, sysDate, null, null, standardCondition.getImpactCode(), systemUserObj, systemUserObj, "Applied", currentUserID, "A", null, standardCondition.getDisplayConditionNotice(), standardCondition.getIncludeInConditionName(), standardCondition.getIncludeInShortDescription(), standardCondition.getInheritable(), standardCondition.getLongDescripton(), standardCondition.getPublicDisplayMessage(), standardCondition.getResolutionAction(), null, null, standardCondition.getConditionNbr(), standardCondition.getConditionGroup(), standardCondition.getDisplayNoticeOnACA(), standardCondition.getDisplayNoticeOnACAFee(), standardCondition.getPriority(), standardCondition.getConditionOfApproval());

            if (addCapCondResult.getSuccess()) {
                logDebug("Successfully added condition (" + standardCondition.getConditionDesc() + ")");
            } else {
                logDebug("**ERROR: adding condition (" + standardCondition.getConditionDesc() + "): " + addCapCondResult.getErrorMessage());
            }
        }
    }
}
/*******************************************************
| Script/Function: Avo_BranchTaskAsUser(taskName, taskStatus, taskComment, taskNote, username, [processName], [recordId])
| Created by: Nicolaj Bunting
| Created on: 20Nov20
| Usage: update task taskName with status taskStatus as username, include taskComment, taskNote, promote to the next task
| Modified by: ()
*********************************************************/
