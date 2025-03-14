/*******************************************************
| Script/Function: createChildPoolSpa() - (ID3)
| Created by: Mike Buell
| Created on: 19Oct20
| Usage: On submit If ASI "Residential Pool or Spa - Repair and New" is checked Then create child record of type 
| "Building/Residential/Pool or Spa/Repair and New", copy APO, contacts, and ASI ignoring groups "PROJECT TYPE", "ENVIRONMENTAL HEALTH", 
| "IF REFERRED TO EH", "SEPTIC SYSTEM", "PLANNING", "CIVIL DRAINAGE", "GEOTECH", "FIRE", "PUBLIC WORKS", "SHOW STOPPER QUESTIONS"
| Modified by: ()
*********************************************************/
(function () {
    var poolSpa = String(getAppSpecific("Residential Pool or Spa - Repair and New", capId));
    Avo_LogDebug("Pool or Spa(" + poolSpa + ")", 2);    //debug

    if (poolSpa.toUpperCase() != "CHECKED") {
        return;
    }

    var groupsIgnoreArray = ["PROJECT TYPE", "ENVIRONMENTAL HEALTH", "IF REFERRED TO EH", "SEPTIC SYSTEM", "PLANNING", "CIVIL DRAINAGE", "GEOTECH", "FIRE",
        "PUBLIC WORKS", "SHOW STOPPER QUESTIONS"];

    eval(getScriptText("BLD_CreateChildBuildingPermit"));
    var childCapId = createChildBuildingPermit("Building", "Residential", "Pool or Spa", "Repair and New", "Residential Pool or Spa - Repair and New",
        groupsIgnoreArray);
})();