/*******************************************************
| Script/Function: BB_011_INCREVSUBCYCLE
| Created by: Tom Grzegorczyk   
| Created on: 18 Dec 2020
| Usage: Increments review submittal cycle ASI for current cap
| Modified by: ()
*********************************************************/
(function () {
    try {
        var subCycle = getAppSpecific("Revision Number");
        Avo_LogDebug("Current Revision Number: " + subCycle);
        subCycle++;
        editAppSpecific("Revision Number", subCycle);
        Avo_LogDebug("Revision Number successfully incremented to: " + subCycle);
        return true;
    } catch (ex) {
        Avo_LogDebug("**Error in BB_011_INCREVSUBCYCLE: " + ex.message, 1);
        return false;
    }
})();
