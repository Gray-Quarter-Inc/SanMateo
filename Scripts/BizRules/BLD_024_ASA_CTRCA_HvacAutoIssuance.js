/*******************************************************
| Script/Function: hvacAutoIssuance() - (ID24)
| Created by: Nicolaj Bunting
| Created on: 22Oct20
| Usage: On submit in ACA If ASI "Project Type" is "Residential" Then
| If ASI "Furnace" Is checked and "Furnace New or Replacement" is "Replacement" AND
| "Furnace Is the installation or replacement located in the garage" is "No" AND
| "Furnace Using existing gas and electrical circuits?" is "Yes" AND
| "Furance Is the furance/AC being located in the same location?" is "Yes"
| Or If ASI "AC" is checked And "AC New or Replacement" is "Replacement" AND
| "AC Is the installation or replacement located in the garage" is "No" AND
| "AC Using existing gas and electrical circuits?" is "Yes" AND
| "AC Is the furance/AC being located in the same location?" is "Yes"
| Or If ASI "Boiler Installation" is checked And "Boiler New or Replacement" is "Replacement"
| Or If ASI "Factory-built fireplace" is checked And "Factory Built Fireplace New or Replacement" is
| "Replacement"
| Or If ASI "Decorative gas appliances" is checked And "Decorative Gas Appliance New or Replacement" is
| "Replacement"
| Then close task "Ready to Issue Permit" with status of "Permit Issued" as same user, call ID54
| Modified by: Jei Yang
*********************************************************/
(function () {
    var projType = String(getAppSpecific("Project Type", capId));
    Avo_LogDebug("Project Type(" + projType + ")", 2);  //debug

    if (projType != "Residential") {
        return;
    }

    var subgroupArray = ['AC', 'Furnace', 'Heat Pump', 'Boiler Installation',
        'Factory-built fireplace', 'Decorative gas appliances'];
    var checkReqList = new Object(); //Check required list

    var result = aa.appSpecificInfo.getByCapID(capId);
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get ASI. " + result.errorType + ": " + result.errorMessage, 1);
        return false;
    }

    //Check the General subgroup
    for (var i = 0; i < subgroupArray.length; i++) {
        var value = String(AInfo[subgroupArray[i]]);
        Avo_LogDebug(subgroupArray[i] + "(" + value + ")", 2); //debug

        if (value.toUpperCase() == "CHECKED") {
            checkReqList[subgroupArray[i]] = true;
        }
    }


    if (checkReqList['Furnace']) {
        var newOrReplace = String(AInfo["Furnace New or Replacement"]);
        Avo_LogDebug("Furnace New or Replacement(" + newOrReplace + ")", 2); //debug

        /*var furnaceGarage = String(
            AInfo["Furnace Is the installation or replacement located in the garage"]);
        Avo_LogDebug("Furnace Garage(" + furnaceGarage + ")", 2); //debug
        */

        var usingExisting = String(AInfo["Furnace Using existing gas and electrical circuits?"]);
        Avo_LogDebug("Furnace Using existing gas and electrical circuits(" + usingExisting
            + ")", 2); //debug

        var locatedSame = String(
            AInfo["Furnace Is the furnace/AC being located in the same location?"]);
        Avo_LogDebug("Furnace located in the same location?(" + locatedSame + ")", 2); //debug

        if (newOrReplace.toUpperCase() == 'NEW' || usingExisting.toUpperCase() != 'YES' || locatedSame.toUpperCase() != 'YES') {
            Avo_LogDebug("Furnace requirements failed", 2); //debug
            return;
        }
    }
    if (checkReqList['AC']) {
        var newOrReplace = String(AInfo["AC New or Replacement"]);
        Avo_LogDebug("AC New or Replacement(" + newOrReplace + ")", 2); //debug

        /*var acGarage = String(AInfo["AC Is the installation or replacement located in the garage"]);
        Avo_LogDebug("AC Garage(" + acGarage + ")", 2); //debug
        */

        var usingExisting = String(AInfo["AC Using existing gas and electrical circuits?"]);
        Avo_LogDebug("Using existing gas and electrical circuits(" + usingExisting + ")", 2); //debug

        var locatedSame = String(AInfo["AC Is the furnace/AC being located in the same location?"]);
        Avo_LogDebug("AC located in the same location?(" + locatedSame + ")", 2); //debug

        if (newOrReplace.toUpperCase() == 'NEW' || usingExisting.toUpperCase() != 'YES' || locatedSame.toUpperCase() != 'YES') {
            Avo_LogDebug("AC requirements failed", 2); //debug
            return;
        }
    }
    if (checkReqList['Boiler Installation']) {
        var newOrReplace = String(AInfo["Boiler New or Replacement"]);
        Avo_LogDebug("Boiler New or Replacement(" + newOrReplace + ")", 2); //debug
        if (newOrReplace.toUpperCase() == 'NEW') {
            return;
        }
    }
    if (checkReqList['Factory-built fireplace']) {
        var newOrReplace = String(AInfo["Factory Built Fireplace New or Replacement"]);
        Avo_LogDebug("Factory Built Fireplace New or Replacement(" + newOrReplace + ")", 2); //debug
        if (newOrReplace.toUpperCase() == 'NEW') {
            return;
        }
    }
    if (checkReqList['Decorative gas appliances']) {
        var newOrReplace = String(AInfo["Decorative Gas Appliance New or Replacement"]);
        Avo_LogDebug("Decorative Gas Appliance New or Replacement(" + newOrReplace + ")", 2); //debug
        if (newOrReplace.toUpperCase() == 'NEW') {
            return;
        }
    }
    if (checkReqList['Heat Pump']) {
        var newOrReplace = String(AInfo["Heat Pump New or Replacement"]);
        Avo_LogDebug("Heat Pump New or Replacement(" + newOrReplace + ")", 2); //debug
        if (newOrReplace.toUpperCase() == 'NEW') {
            return;
        }
    }


    Avo_LogDebug("Requirements all met - Auto Issue", 2); //debug

    var username = "ONLINE PERMITS";

    var taskName, status, success;

    taskName = "Application Submittal";
    status = "Complete";

    // Update status and complete task
    success = Avo_CloseTaskAsUser(taskName, status, "", "", username, false, null, capId);
    if (success === false) {
        return;
    }

    // Branch task
    taskName = "Ready to Issue Permit";
    status = "Permit Issued";
    success = Avo_BranchTaskAsUser(taskName, status, "", "", username, null, capId);
    if (success === false) {
        return;
    }

    //Script 384 Send Permit Auto Issued Email
    include("BLD_384_ASA_CTRCA_SendPermitAutoIssuedEmail");
})();

aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "",
    "SMC Prod: BLD_024_ASA_CTRCA_HvacAutoIssuance", debug); //debug