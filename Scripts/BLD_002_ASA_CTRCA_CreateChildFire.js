/*******************************************************
| Script/Function: createChild() - (ID2)
| Created by: Mike Buell
| Created on: 19Oct20
| Usage: On submit If ASI "Residential Fire (sprinklers, alarms, detectors, hydrants)" is checked Then create child record of type
"Building/Residential/Fire/NA", copy APO, contacts, and ASI ignoring groups "PROJECT TYPE", "ENVIRONMENTAL HEALTH", 
| "IF REFERRED TO EH", "SEPTIC SYSTEM", "PLANNING", "CIVIL DRAINAGE", "GEOTECH", "FIRE", "PUBLIC WORKS", "SHOW STOPPER QUESTIONS"
| Modified by: ()
*********************************************************/
(function () {
    var fire = String(getAppSpecific("Residential Fire (sprinklers, alarms, detectors, hydrants)", capId));
    Avo_LogDebug("Fire(" + fire + ")", 2);    //debug

    if (fire.toUpperCase() != "CHECKED") {
        return;
    }

    var groupsIgnoreArray = ["PROJECT TYPE", "ENVIRONMENTAL HEALTH", "IF REFERRED TO EH", "SEPTIC SYSTEM", "PLANNING", "CIVIL DRAINAGE", "GEOTECH", "FIRE",
        "PUBLIC WORKS", "SHOW STOPPER QUESTIONS"];

    eval(getScriptText("BLD_CreateChildBuildingPermit"));
    var childCapId = createChildBuildingPermit("Building", "Residential", "Fire Systems", "NA", "Fire Systems", groupsIgnoreArray);
})();