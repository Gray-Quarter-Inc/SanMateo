/*******************************************************
| Script/Function: resPvSolarPermitSpecificFees() - (ID68)
| Created by: Nicolaj Bunting
| Created on: 5Nov20
| Usage: On ASA add and invoice fees from schedule "BLD_GEN"
| If parent is same record type Then "BLD_083" Else
| "BLD_001",
| If ASI "Total kW" > 0 Then
| If "Project Type" is "Residential" Then "BLD_017" with quantity $520 + $17 * ASI "Total kW" above 15kW,
| If ASI "Project Type" is "Commercial" Then "BLD_128" with quantity $1155 + $8 * ASI "Total kW" above
| 50kW + $6 * kW above 250kW rounded up,
| "BLD_014" with quantity If ASI "Is the service upgrade less than 300 Amps" is "Yes" Then $191 Else $462,
| If ASI "Number of additional subpanels, load centers, and/or distribution panels" > 0 Then "BLD_061"
| with quantity $191 * ASI "Number of additional subpanels, load centers, and/or distribution panels",
| If ASI "Solar Panel Type" is "Solar Roof Tiles" And
| "Total Squares to be Replaced (1 square equals 100 sq. ft.)" > 0 Then "BLD_025" with quantity $191,
| If total squares > 10 Then + 116 * ((totalSquares - 10) / 10) rounded up
| Modified by: Jei Yang
| Modified by GQ 12/26/2024 11008
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

    // Get parent cap
    var parentCap = getParentCap();
    if (parentCap != null) {
        var parentAltId = parentCap.capModel.altID;
        Avo_LogDebug("Parent(" + parentAltId + ")", 2);  //debug

        // Get parent record type
        var capTypeModel = parentCap.capType;
        var recordType = String(capTypeModel);
        Avo_LogDebug("Parent Record Type(" + recordType + ")", 2); //debug

        if (recordType == appTypeString) {
            // Revision Fee
            feeCode = "BLD_083";
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

            return;
        }
    }

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

    // Residential Solar PV kW
    feeCode = "BLD_017";

    var totalKw = parseFloat(getAppSpecific("Total kW", capId));
    Avo_LogDebug("Total kW(" + totalKw + ")", 2);   //debug

    if (isNaN(totalKw) == true || totalKw < 0) {
        Avo_LogDebug("Failed to add fee " + feeCode + ". (Invalid value for 'Total Kw')", 1);
        return;
    }

    totalKw = Math.ceil(totalKw);

    if (totalKw > 0) {
        var projType = String(getAppSpecific("Project Type", capId));
        Avo_LogDebug("Project Type(" + projType + ")", 2);  //debug

        if (projType == "Residential") {
            quantity = 520;

            if (totalKw > 15) {
                quantity += 17 * (totalKw - 15);
            }
        }

        if (projType == "Commercial") {
            feeCode = "BLD_128";
            quantity = 1155;

            var adjWattage = totalKw;
            if (totalKw > 250) {
                adjWattage = 250;

                quantity += 6 * (totalKw - 250);
            }

            if (adjWattage > 50) {
                quantity += 8 * (adjWattage - 50);
            }
        }
    }

    if (quantity > 0) {
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

    // Electric Installation Fee
    feeCode = "BLD_014";
    quantity = 462;

    var lessThan300Amps = getAppSpecific("Is the service upgrade less than 300 Amps?", capId);
    Avo_LogDebug("Is the service upgrade less than 300 Amps?(" + lessThan300Amps + ")", 2);   //debug

    if (lessThan300Amps) {
        if (String(lessThan300Amps).toUpperCase() == 'YES') {
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

    // Additional subpanels, load centers, and/or distribution panels
    feeCode = "BLD_061";

    var numOfSubpanels = parseFloat(
        getAppSpecific("Number of additional subpanels, load centers, and/or distribution panels",
            capId));
    Avo_LogDebug("Total Subpanels(" + numOfSubpanels + ")", 2);   //debug

    if (isNaN(numOfSubpanels) != true && numOfSubpanels > 0) {
        quantity = 191 * numOfSubpanels;

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

    // Reroofing
    feeCode = "BLD_025";
    quantity = 191;

    var solarPanelType = getAppSpecific("Solar Panel Type", capId);
    Avo_LogDebug("Solar Panel Type(" + solarPanelType + ")", 2);   //debug

    if (solarPanelType.toUpperCase() != "SOLAR ROOF TILES") {
        return;
    }

    var totalSquares = parseFloat(
        getAppSpecific("Total Squares to be Replaced (1 square equals 100 sq. ft.)", capId));
    Avo_LogDebug("Total Squares to be Replaced(" + totalSquares + ")", 2);   //debug

    if (isNaN(totalSquares) == true || totalSquares <= 0) {
        return; //undefined or invalid value
    }

    if (totalSquares > 10) {
        quantity += 116 * Math.ceil((totalSquares - 10) / 10);
    }

    //$3,960 plus $20 for each additional 1,000 or fraction thereof 
    //quantity = 3960 + 20 * Math.ceil((costOfWork - 100001) / 1000);
    feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
    if (feeResult) {
        Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
    }
    else if (feeResult == null) {
        Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
    } else {
        Avo_LogDebug("Failed to add fee " + feeCode, 1);
    }
})();

function getParentCap() {
    if (!parentCapId) {
        parentCapId = getParent();
    }

    if (matches(parentCapId, null, "null", "", undefined, "undefined") == true) {
        return null;
    }

    var result = aa.cap.getCap(parentCapId);
    if (result.getSuccess() != true) {
        Avo_LogDebug('Failed to get cap for parent ' + parentCapId + '. '
            + result.errorType + ": " + result.errorMessage, 1);
        return null;
    }

    var parentCap = result.getOutput();
    if (matches(parentCap, null, "null", "", undefined, "undefined") == true) {
        Avo_LogDebug('Invalid parent cap', 1);
        return null;
    }

    return parentCap;
}