function addAppConditionCustom(cType, cStatus, cDesc, cComment, cImpact, conditionOfApproval) {
    var addCapCondResult;
    if (arguments.length > 5) {
        addCapCondResult = aa.capCondition.addCapCondition(capId, cType, cDesc, cComment, sysDate, null, sysDate, null, null, cImpact, systemUserObj, systemUserObj, cStatus, currentUserID, "A", conditionOfApproval);
    } else {
        addCapCondResult = aa.capCondition.addCapCondition(capId, cType, cDesc, cComment, sysDate, null, sysDate, null, null, cImpact, systemUserObj, systemUserObj, cStatus, currentUserID, "A");
    }

    if (addCapCondResult.getSuccess()) {
        logDebug("Successfully added condition (" + cImpact + ") " + cDesc);
    } else {
        logDebug("**ERROR: adding condition (" + cImpact + "): " + addCapCondResult.getErrorMessage());
    }
}
/*----------------------------------------------------------------------------------------------------/
| Green Halo Notification Functions
| Functions used to create new or attach records to Waste Management Plans
| Created by Accela 06/12/2015
/----------------------------------------------------------------------------------------------------*/
