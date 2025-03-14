/*******************************************************
| Script/Function: createChildPropaneWaterTank() - (ID8)
| Created by: Mike Buell
| Created on: 19Oct20
| Usage: On submit If ASI "Residential Propane and Water Storage Tank" is checked Then create child record of type 
| "Building/Residential/Plumbing/Propane and Water Tank", copy APO, contacts, and ASI ignoring groups "PROJECT TYPE", "ENVIRONMENTAL HEALTH", 
| "IF REFERRED TO EH", "SEPTIC SYSTEM", "PLANNING", "CIVIL DRAINAGE", "GEOTECH", "FIRE", "PUBLIC WORKS", "SHOW STOPPER QUESTIONS"
| Modified by: ()
*********************************************************/
(function () {
    var tank = String(getAppSpecific("Residential Propane and Water Storage Tank", capId));
    Avo_LogDebug("Propane Tank(" + tank + ")", 2);    //debug

    if (tank.toUpperCase() != "CHECKED") {
        return;
    }

    var groupsIgnoreArray = ["PROJECT TYPE", "ENVIRONMENTAL HEALTH", "IF REFERRED TO EH", "SEPTIC SYSTEM", "PLANNING", "CIVIL DRAINAGE", "GEOTECH", "FIRE",
        "PUBLIC WORKS", "SHOW STOPPER QUESTIONS"];

    eval(getScriptText("BLD_CreateChildBuildingPermit"));
    var childCapId = createChildBuildingPermit("Building", "Residential", "Plumbing", "Propane and Water Tank", "Residential Propane and Water Tank", 
        groupsIgnoreArray);
})();