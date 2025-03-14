/*******************************************************
| Script/Function: addAduRevFlag(ID363)
| Created by: Nicolaj Bunting
| Created on: 21Jul21
| Usage: On sumbit If ASI "What type of residential structure is being constructed?" is "ADU (Detached)" Then add condition "ADU Review" 
| of type "Permit Issuance"
| Modified by: ()
*********************************************************/
(function () {
    var structType = String(getAppSpecific("What type of residential structure is being constructed?", capId));
    Avo_LogDebug("Struct Type(" + structType + ")", 2);  //debug

    if (structType != "ADU (Detached)") {
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