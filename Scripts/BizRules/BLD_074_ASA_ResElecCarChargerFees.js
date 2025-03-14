/*******************************************************
| Script/Function: resElecCarChargerFees(ID74)
| Created by: Jei Yang
| Created on: 12Nov20
| Usage: On ASA add and invoice fees from fee schedule BLD_GEN
| "BLD_001",
| If ASI "Project Type" is "Commercial" Then "BLD_127" with quantity of 347 * ASI
| "Number of Charging Stations", 
| If "Residential" Then "BLD_016" with quantity of 347,
| If "Is an electrical service upgrade required?" is "Yes" Then "BLD_014" with quantity of If
| "Is the service upgrade less than 300 Amps" is "Yes" Then 191 else 462
| Modified by: (GQ 12/27/2024)
*********************************************************/
(function () {
    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeResult, feeCode, quantity;

    // Application Filing Fee - Easy Review
    feeCode = "BLD_001";
    quantity = 1;
    feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
    if (feeResult) {
        Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
    }
    else if (feeResult == null) {
        Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
    } else {
        Avo_LogDebug("Failed to add fee " + feeCode, 1);
    }

    // Electric Installation Fee
    feeCode = "BLD_014";

    var upgradeRequired = String(getAppSpecific("Is an electrical service upgrade required?",
        capId));
    Avo_LogDebug("Elec service upgrade required?(" + upgradeRequired + ")", 2);

    if (upgradeRequired.toUpperCase() == 'YES') {
        quantity = 462;

        var lessThan300Amps = String(getAppSpecific("Is the service upgrade less than 300 Amps?",
            capId));
        Avo_LogDebug("<300 Amps?(" + lessThan300Amps + ")", 2);

        if (lessThan300Amps.toUpperCase() == 'YES') {
            quantity = 191;
        }

        feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
        if (feeResult) {
            Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
        }
        else if (feeResult == null) {
            Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
        } else {
            Avo_LogDebug("Failed to add fee " + feeCode, 1);
        }
    }

    var projType = String(getAppSpecific("Project Type", capId));
    Avo_LogDebug("Project Type(" + projType + ")", 2);  //debug

    if (projType == "Commercial") {
        // Commercial Electric Charging Stations
        feeCode = "BLD_127";

        var chargeStationNum = parseInt(getAppSpecific("Number of Charging Stations", capId), 10);
        Avo_LogDebug("Total Charge Stations(" + chargeStationNum + ")", 2);

        if (isNaN(chargeStationNum) == true || chargeStationNum < 1) {
            return;
        }
        
        quantity = 347 * chargeStationNum;

        feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
        if (feeResult) {
            Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
        }
        else if (feeResult == null) {
            Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
        } else {
            Avo_LogDebug("Failed to add fee " + feeCode, 1);
        }
    }

    if (projType == "Residential") {
        // Residential Vehicle Charging System Installation
        feeCode = "BLD_016";
        quantity = 347;

        feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
        if (feeResult) {
            Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
        }
        else if (feeResult == null) {
            Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
        } else {
            Avo_LogDebug("Failed to add fee " + feeCode, 1);
        }
    }
})();