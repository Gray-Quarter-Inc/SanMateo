/*******************************************************
| Script/Function: createChildDetachAccNonHab() - (ID11)
| Created by: Mike Buell
| Created on: 19Oct20
| Usage: On submit If ASI "Residential Detached Structure - Not Habitable" is checked Then create child record of type 
| "Building/Residential/Detached Structure/Full Utilities", copy APO, contacts, and ASI ignoring groups "PROJECT TYPE", "ENVIRONMENTAL HEALTH", 
| "IF REFERRED TO EH", "SEPTIC SYSTEM", "PLANNING", "CIVIL DRAINAGE", "GEOTECH", "FIRE", "PUBLIC WORKS", "SHOW STOPPER QUESTIONS"
| Modified by: ()
*********************************************************/
(function () {
    var nonHab = String(getAppSpecific("Residential Detached Structure - Not Habitable", capId));
    Avo_LogDebug("Detatched Non Hab(" + nonHab + ")", 2);    //debug

    if (nonHab.toUpperCase() != "CHECKED") {
        return;
    }

    var groupsIgnoreArray = ["PROJECT TYPE", "ENVIRONMENTAL HEALTH", "IF REFERRED TO EH", "SEPTIC SYSTEM", "PLANNING", "CIVIL DRAINAGE", "GEOTECH", "FIRE",
        "PUBLIC WORKS", "SHOW STOPPER QUESTIONS"];

    eval(getScriptText("BLD_CreateChildBuildingPermit"));
    var childCapId = createChildBuildingPermit("Building", "Residential", "Detached Structure", "Full Utilities",
        "Residential Detached Structure - Not Habitable", groupsIgnoreArray);
})();