/*******************************************************
| Script/Function: createChildDetachAccElec() - (ID10)
| Created by: Mike Buell
| Created on: 19Oct20
| Usage: On submit If ASI "Residential Detached Accessory Structure - Electrical Only" is checked Then create child record of type 
| "Building/Residential/Detached Structure/Electrical Only", copy APO, contacts, and ASI ignoring groups "PROJECT TYPE", "ENVIRONMENTAL HEALTH", 
| "IF REFERRED TO EH", "SEPTIC SYSTEM", "PLANNING", "CIVIL DRAINAGE", "GEOTECH", "FIRE", "PUBLIC WORKS", "SHOW STOPPER QUESTIONS"
| Modified by: ()
*********************************************************/
(function () {
    var detachElec = String(getAppSpecific("Residential Detached Accessory Structure - Electrical Only", capId));
    Avo_LogDebug("Detached Elec(" + detachElec + ")", 2);    //debug

    if (detachElec.toUpperCase() != "CHECKED") {
        return;
    }

    var groupsIgnoreArray = ["PROJECT TYPE", "ENVIRONMENTAL HEALTH", "IF REFERRED TO EH", "SEPTIC SYSTEM", "PLANNING", "CIVIL DRAINAGE", "GEOTECH", "FIRE",
        "PUBLIC WORKS", "SHOW STOPPER QUESTIONS"];

    eval(getScriptText("BLD_CreateChildBuildingPermit"));
    var childCapId = createChildBuildingPermit("Building", "Residential", "Detached Structure", "Electrical Only",
        "Residential Detached Accessory Structure - Electrical Only", groupsIgnoreArray);
})();