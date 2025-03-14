/*******************************************************
| Script/Function: createChildEnergyStorage() - (ID12)
| Created by: Mike Buell
| Created on: 19Oct20
| Usage: On submit If ASI "Residential Energy storage systems" is checked Then create child record of type
| "Building/Residential/Electrical/Stoarge Systems", copy APO, contacts, and ASI ignoring groups "PROJECT TYPE", "ENVIRONMENTAL HEALTH", 
| "IF REFERRED TO EH", "SEPTIC SYSTEM", "PLANNING", "CIVIL DRAINAGE", "GEOTECH", "FIRE", "PUBLIC WORKS", "SHOW STOPPER QUESTIONS"
| Modified by: ()
*********************************************************/
(function () {
    var energyStorage = String(getAppSpecific("Residential Energy storage systems", capId));
    Avo_LogDebug("Energy Storage(" + energyStorage + ")", 2);    //debug

    if (energyStorage.toUpperCase() != "CHECKED") {
        return;
    }

    var groupsIgnoreArray = ["PROJECT TYPE", "ENVIRONMENTAL HEALTH", "IF REFERRED TO EH", "SEPTIC SYSTEM", "PLANNING", "CIVIL DRAINAGE", "GEOTECH", "FIRE",
        "PUBLIC WORKS", "SHOW STOPPER QUESTIONS"];

    eval(getScriptText("BLD_CreateChildBuildingPermit"));
    var childCapId = createChildBuildingPermit("Building", "Residential", "Electrical", "Storage Systems", "Residential Energy Storage Systems",
        groupsIgnoreArray);
})();