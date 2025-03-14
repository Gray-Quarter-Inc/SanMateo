/*******************************************************
| Script/Function: createChildDemo() - (ID5)
| Created by: Mike Buell
| Created on: 19Oct20
| Usage: On submit If ASI "Residential Demolition" is checked Then create child record of type "Building/Residential/Demolition/NA", copy APO, contacts, 
| and ASI ignoring groups "PROJECT TYPE", "ENVIRONMENTAL HEALTH", "IF REFERRED TO EH", "SEPTIC SYSTEM", "PLANNING", "CIVIL DRAINAGE", "GEOTECH", "FIRE", 
| "PUBLIC WORKS", "SHOW STOPPER QUESTIONS"
| Modified by: ()
*********************************************************/
(function () {
    var demolition = String(getAppSpecific("Residential Demolition", capId));
    Avo_LogDebug("Demo(" + demolition + ")", 2);    //debug

    if (demolition.toUpperCase() != "CHECKED") {
        return;
    }

    var groupsIgnoreArray = ["PROJECT TYPE", "ENVIRONMENTAL HEALTH", "IF REFERRED TO EH", "SEPTIC SYSTEM", "PLANNING", "CIVIL DRAINAGE", "GEOTECH", "FIRE",
        "PUBLIC WORKS", "SHOW STOPPER QUESTIONS"];

    eval(getScriptText("BLD_CreateChildBuildingPermit"));
    var childCapId = createChildBuildingPermit("Building", "Residential", "Demolition", "NA", "Residential Demolition", groupsIgnoreArray);
})();