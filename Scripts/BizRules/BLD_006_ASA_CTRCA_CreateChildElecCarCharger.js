/*******************************************************
| Script/Function: createChildElecCarCharger() - (ID6)
| Created by: Mike Buell
| Created on: 19Oct20
| Usage: On submit If ASI "Residential Electric car charger" is checked Then create child record of type "Building/Residential/Electrical/Car Charger", 
| copy APO, contacts, and ASI ignoring groups "PROJECT TYPE", "ENVIRONMENTAL HEALTH", "IF REFERRED TO EH", "SEPTIC SYSTEM", "PLANNING", "CIVIL DRAINAGE", 
| "GEOTECH", "FIRE", "PUBLIC WORKS", "SHOW STOPPER QUESTIONS"
| Modified by: ()
*********************************************************/
(function () {
    var carCharger = String(getAppSpecific("Residential Electric car charger", capId));
    Avo_LogDebug("Elec Car Charger(" + carCharger + ")", 2);    //debug

    if (carCharger.toUpperCase() != "CHECKED") {
        return;
    }

    var groupsIgnoreArray = ["PROJECT TYPE", "ENVIRONMENTAL HEALTH", "IF REFERRED TO EH", "SEPTIC SYSTEM", "PLANNING", "CIVIL DRAINAGE", "GEOTECH", "FIRE",
        "PUBLIC WORKS", "SHOW STOPPER QUESTIONS"];

    eval(getScriptText("BLD_CreateChildBuildingPermit"));
    var childCapId = createChildBuildingPermit("Building", "Residential", "Electrical", "Car Charger", "Residential Electric Car Charger",
        groupsIgnoreArray);
})();