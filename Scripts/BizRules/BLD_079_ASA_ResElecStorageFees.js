/*******************************************************
| Script/Function: resElecStorageFees() - (ID79)
| Created by: Jei Yang
| Created on: 10Nov20
| Usage: On submit If ASI "Public Agency Project" is Not checked And event is ASA Else CTRCA Then add
| and invoice fees from schedule "BLD_GEN"
| If parent is same record type Then "BLD_083" Else
| "BLD_001",
| "BLD_060" with quantity of 520 + 58 * (ASI "Number of Energy Systems" - 1),
| If ASI "Is an electrical service upgrade required?" is "Yes" Then "BLD_014" with quantity of If ASI
| "Is the service upgrade less than 300 Amps" is "Yes" Then $191 Else $462
| If ASI "Additional Subpanels" > 0 Then "BLD_061" with quantity of 191 * "Additional Subpanels"
| Modified by: (GQ 12/27/2024 11008)
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
                Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of "
                    + quantity, 1);
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

    // Electric Storage System Installation
    feeCode = "BLD_060";

    var numEnergySys = parseFloat(getAppSpecific(
        "Number of Energy Systems", capId));
    Avo_LogDebug("Total energy storage systems(" + numEnergySys + ")", 2);

    if (isNaN(numEnergySys) != true && numEnergySys > 0) {
        quantity = 520 + 58 * (numEnergySys - 1);

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

    var upgradeRequired = String(getAppSpecific("Is an electrical service upgrade required?",
        capId));
    Avo_LogDebug("Is an electrical service upgrade required?(" + upgradeRequired + ")", 2);

    if (upgradeRequired.toUpperCase() == 'YES') {
        var lessThan300Amps = String(getAppSpecific("Is the service upgrade less than 300 Amps?",
            capId));
        Avo_LogDebug("Is the service upgrade less than 300 Amps?(" + lessThan300Amps + ")", 2);

        if (lessThan300Amps.toUpperCase() == 'YES') {
            quantity = 191;
        } else {
            quantity = 462;
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

    var numPanels = parseFloat(getAppSpecific("Additional Subpanels", capId));
    Avo_LogDebug("Additional Panels(" + numPanels + ")", 2);

    if (isNaN(numPanels) != true && numPanels > 0) {
        quantity = 191 * numPanels;
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

aa.sendMail("noreply@smcgov.org", "PI_TEST@avocette.com", "",
    "SMC Prod: BLD_079_ASA_ResElecStorageFees", debug);    //debug

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