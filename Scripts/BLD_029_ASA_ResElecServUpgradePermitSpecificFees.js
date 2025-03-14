/*******************************************************
| Script/Function: resElecServUpgradePermitSpecificFees() - (ID29)
| Created by: Nicolaj Bunting
| Created on: 22Oct20
| Usage: On ASA add and invoice fees from schedule "BLD_GEN": "BLD_014" If ASI "Is the service upgrade less than 300 Amps" is "Yes" Then quantity is 165 
| Else 400, + 25 * (ASI "Number of meters" - 1)
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

    var resOrComm = String(AInfo["Residential or Commercial"]);
    Avo_LogDebug("Residential or Commercial(" + resOrComm + ")", 2); //debug

    if (resOrComm.toUpperCase() == "COMMERCIAL") {
        quantity = 381;
    } else {
        quantity = 191;
    }

    // BLD_014
    feeCode = "BLD_014";

    var lessThan300Amps = String(getAppSpecific("Is the service upgrade less than 300 Amps", capId));
    Avo_LogDebug("<300 A(" + lessThan300Amps + ")", 2); //debug

    if (lessThan300Amps.toUpperCase() != "Y" && lessThan300Amps.toUpperCase() != "YES") {
        quantity = 462;
    }

    var totalMetersNum = parseInt(getAppSpecific("Number of meters", capId), 10);
    Avo_LogDebug("Total Meters(" + totalMetersNum + ")", 2);    //debug

    var additionalMetersNum = totalMetersNum - 1;

    if (additionalMetersNum > 0) {
        quantity += 29 * additionalMetersNum;
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

    //BLD_061
    feeCode = "BLD_061";
    var numOfSubpanels = parseInt(getAppSpecific("Number of sub panels being added, altered or repaired", capId), 10);
    Avo_LogDebug("Number of sub panels being added, altered or repaired(" + numOfSubpanels + ")", 2);    //debug

    if (numOfSubpanels > 0) {
        quantity = numOfSubpanels * 191;
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