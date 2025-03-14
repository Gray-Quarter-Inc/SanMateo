/*******************************************************
| Script/Function: createChildLandscaping() - (ID4)
| Created by: Mike Buell
| Created on: 19Oct20
| Usage: On submit If ASI "Residential Landscaping" is checked Then create child record of type "Building/Residential/Landscaping/NA", copy APO, contacts, 
| and ASI ignoring groups "PROJECT TYPE", "ENVIRONMENTAL HEALTH", "IF REFERRED TO EH", "SEPTIC SYSTEM", "PLANNING", "CIVIL DRAINAGE", "GEOTECH", "FIRE", 
| "PUBLIC WORKS", "SHOW STOPPER QUESTIONS"
| Modified by: ()
*********************************************************/
(function () {
    var landscaping = String(getAppSpecific("Residential Landscaping", capId));
    Avo_LogDebug("Landscaping(" + landscaping + ")", 2);    //debug

    if (landscaping.toUpperCase() != "CHECKED") {
        return;
    }

    var groupsIgnoreArray = ["PROJECT TYPE", "ENVIRONMENTAL HEALTH", "IF REFERRED TO EH", "SEPTIC SYSTEM", "PLANNING", "CIVIL DRAINAGE", "GEOTECH", "FIRE",
        "PUBLIC WORKS", "SHOW STOPPER QUESTIONS"];

    eval(getScriptText("BLD_CreateChildBuildingPermit"));
    var childCapId = createChildBuildingPermit("Building", "Residential", "Landscaping", "NA", "Residential Landscaping", groupsIgnoreArray);
})();