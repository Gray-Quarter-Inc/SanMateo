/*******************************************************
| Script/Function: resHVACPermitSpecificFees() - (ID20)
| Created by: Nicolaj Bunting
| Created on: 20Oct20
| Usage: On ASA add and invoice fees from schedule "BLD_GEN"
| If ASI "Furnance" or "AC" are checked Then "BLD_020" with quantity of checked ASI + If ASI "Heat Pump"
| is checked Then ASI "Number of Heat Pumps" (minimum of 1)
| If ASI "Duct work" is checked Then "BLD_012" with quantity of 165,
| If ASI "Boiler Installation" is checked Then "BLD_018" with quantity of 1,
| If ASI "Number of Radiant Heating Panels" > 0 Then "BLD_021" with quantity of 165 for first 3 and + 25
| for each additional,
| If ASI "Factory-built fireplace" is checked Then "BLD_022" with quantity of 1
| If ASI "Decorative gas appliances" is checked Then "BLD_002" with quantity of 1
| Modified by: Jei Yang
*********************************************************/
(function () {
    var pubAgencyProj = String(AInfo["Public Agency Project"]);
    if (controlString == "ApplicationSubmitAfter" && pubAgencyProj == "CHECKED") {
        return;
    }
    if (controlString == "ConvertToRealCapAfter" && pubAgencyProj != "CHECKED") {
        return;
    }

    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeResult, feeCode, quantity;

    // Permit fee (Furnace and AC)
    var allFieldNames = ["Furnace", "AC"];
    quantity = 0;

    for (var i in allFieldNames) {
        var fieldName = allFieldNames[i];

        var value = String(getAppSpecific(fieldName, capId));
        Avo_LogDebug(fieldName + "(" + value + ")", 2);

        if (value.toUpperCase() != "CHECKED") {
            continue;
        }

        quantity++;
    }
    
    // Permit fee (Heat Pump)
    var value = String(getAppSpecific("Heat Pump", capId));
    Avo_LogDebug("Heat Pump(" + value + ")", 2);

    var numOfHeatPumps = String(getAppSpecific("Number of Heat Pumps", capId));
    Avo_LogDebug("Number of Heat Pumps(" + numOfHeatPumps + ")", 2);

    if (value.toUpperCase() == "CHECKED") {
        if (parseInt(numOfHeatPumps) > 0) {
            quantity += parseInt(numOfHeatPumps);
        } else {
            quantity++;
        }
    }

    if (quantity > 0) {
        feeCode = "BLD_020";

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

    // Electrical, Mechanical, Water Line Minimum Fee
    var ductWork = String(getAppSpecific("Duct Work", capId));
    Avo_LogDebug("Duct Work(" + ductWork + ")", 2);

    if (ductWork.toUpperCase() == "CHECKED") {
        feeCode = "BLD_012";
        quantity = 191;

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

    // Boiler Installation Fee
    var boiler = String(getAppSpecific("Boiler Installation", capId));
    Avo_LogDebug("Boiler Installation(" + boiler + ")", 2);

    if (boiler.toUpperCase() == "CHECKED") {
        feeCode = "BLD_018";
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
    }

    // Radiant Heating Panels Fee
    var heatPanelsNum = parseInt(getAppSpecific("Number of Radiant Heating Panels", capId), 10);
    Avo_LogDebug("Total Radiant Heating Panels(" + heatPanelsNum + ")", 2);

    if (isNaN(heatPanelsNum) != true && heatPanelsNum > 0) {
        feeCode = "BLD_021";
        quantity = 191;

        var extraPanels = heatPanelsNum - 3;
        if (extraPanels > 0) {
            quantity += extraPanels * 29;
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

    // Fireplace Fee
    var fireplace = String(getAppSpecific("Factory-built fireplace", capId));
    Avo_LogDebug("Fireplace(" + fireplace + ")", 2);

    if (fireplace.toUpperCase() == "CHECKED") {
        feeCode = "BLD_022";
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
    }

    // Gas Appliances
    var gasAppliances = String(getAppSpecific("Decorative gas appliances", capId));
    Avo_LogDebug("Decorative gas appliances(" + gasAppliances + ")", 2);

    if (gasAppliances.toUpperCase() == "CHECKED") {
        feeCode = "BLD_002";
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
    }
})();