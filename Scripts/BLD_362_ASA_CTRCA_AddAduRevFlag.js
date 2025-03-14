/*******************************************************
| Script/Function: addAduRevFlag(ID362)
| Created by: Nicolaj Bunting
| Created on: 21Jul21
| Usage: On submit If ASI "Are you adding an ADU or JADU within the proposed addition or alteration?" is "ADU", "JADU", "Both" Then add 
| condition "ADU Review" of type "Permit Issuance"
| Modified by: ()
*********************************************************/
(function () {
    var addingAdu = String(getAppSpecific("Are you adding an ADU or JADU within the proposed addition or alteration?", capId));
    Avo_LogDebug("Adding ADU/JADU(" + addingAdu + ")", 2);  //debug

    if (addingAdu != "ADU" && addingAdu != "JADU" && addingAdu != "Both") {
        return;
    }

    var type = "Permit Issuance";
    var flag = "ADU Review";

    var hasFlag = appHasCondition(type, "Applied", flag, null);
    Avo_LogDebug("Has Flag(" + hasFlag + ")", 2);   //debug

    if (hasFlag == true) {
        return;
    }

    addStdCondition(type, flag, capId);
})();