/*******************************************************
| Script/Function: createChildRetainWall() - (ID9)
| Created by: Mike Buell
| Created on: 19Oct20
| Usage: On submit If ASI "Residential Retaining Walls" is checked Then create child record of type "Building/Residential/Retaining Walls/NA", copy APO, 
| contacts, and ASI ignoring groups "PROJECT TYPE", "ENVIRONMENTAL HEALTH", "IF REFERRED TO EH", "SEPTIC SYSTEM", "PLANNING", "CIVIL DRAINAGE", "GEOTECH", 
| "FIRE", "PUBLIC WORKS", "SHOW STOPPER QUESTIONS"
| Modified by: ()
*********************************************************/
(function () {
    var poolSpa = String(getAppSpecific("Residential Retaining Walls", capId));
    Avo_LogDebug("(" + poolSpa + ")", 2);    //debug

    if (poolSpa.toUpperCase() != "CHECKED") {
        return;
    }

    var groupsIgnoreArray = ["PROJECT TYPE", "ENVIRONMENTAL HEALTH", "IF REFERRED TO EH", "SEPTIC SYSTEM", "PLANNING", "CIVIL DRAINAGE", "GEOTECH", "FIRE",
        "PUBLIC WORKS", "SHOW STOPPER QUESTIONS"];

    eval(getScriptText("BLD_CreateChildBuildingPermit"));
    var childCapId = createChildBuildingPermit("Building", "Residential", "Retaining Walls", "NA", "Residential Retaining Walls", groupsIgnoreArray);
})();