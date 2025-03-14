/*******************************************************
| Script/Function: createChildElecGenerator() - (ID7)
| Created by: Mike Buell
| Created on: 19Oct20
| Usage: On submit If ASI "Residential Electric Generator" is checked Then create child record of type "Building/Residential/Electrical/Generator", copy 
| APO, contacts, and ASI ignoring groups "PROJECT TYPE", "ENVIRONMENTAL HEALTH", "IF REFERRED TO EH", "SEPTIC SYSTEM", "PLANNING", "CIVIL DRAINAGE", 
| "GEOTECH", "FIRE", "PUBLIC WORKS", "SHOW STOPPER QUESTIONS"
| Modified by: ()
*********************************************************/
(function () {
    var elecGen = String(getAppSpecific("Residential Electric Generator", capId));
    Avo_LogDebug("Elec Generator(" + elecGen + ")", 2);    //debug

    if (elecGen.toUpperCase() != "CHECKED") {
        return;
    }

    var groupsIgnoreArray = ["PROJECT TYPE", "ENVIRONMENTAL HEALTH", "IF REFERRED TO EH", "SEPTIC SYSTEM", "PLANNING", "CIVIL DRAINAGE", "GEOTECH", "FIRE",
        "PUBLIC WORKS", "SHOW STOPPER QUESTIONS"];

    eval(getScriptText("BLD_CreateChildBuildingPermit"));
    var childCapId = createChildBuildingPermit("Building", "Residential", "Electrical", "Generator", "Residential Electric Generator", groupsIgnoreArray);
})();