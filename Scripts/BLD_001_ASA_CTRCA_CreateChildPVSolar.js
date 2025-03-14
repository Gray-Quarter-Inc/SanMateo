/*******************************************************
| Script/Function: createChildPVSolar() - (ID1)
| Created by: Mike Buell
| Created on: 19Oct20
| Usage: On submit If ASI "Residential PV Solar" is checked Then create child record of type "Building/Residential/Electrical/PV Solar", copy APO, 
| contacts, and ASI ignoring groups "PROJECT TYPE", "ENVIRONMENTAL HEALTH", "IF REFERRED TO EH", "SEPTIC SYSTEM", "PLANNING", "CIVIL DRAINAGE", "GEOTECH", 
| "FIRE", "PUBLIC WORKS", "SHOW STOPPER QUESTIONS"
| Modified by: ()
*********************************************************/
(function () {
    var pvSolar = String(getAppSpecific("Residential PV Solar", capId));
    Avo_LogDebug("PV Solar(" + pvSolar + ")", 2);    //debug

    if (pvSolar.toUpperCase() != "CHECKED") {
        return;
    }

    var groupsIgnoreArray = ["PROJECT TYPE", "ENVIRONMENTAL HEALTH", "IF REFERRED TO EH", "SEPTIC SYSTEM", "PLANNING", "CIVIL DRAINAGE", "GEOTECH", "FIRE",
        "PUBLIC WORKS", "SHOW STOPPER QUESTIONS"];

    eval(getScriptText("BLD_CreateChildBuildingPermit"));
    var childCapId = createChildBuildingPermit("Building", "Residential", "Electrical", "PV Solar", "Residential PV Solar", groupsIgnoreArray);
})();