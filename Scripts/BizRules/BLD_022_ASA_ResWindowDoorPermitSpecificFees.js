/*******************************************************
| Script/Function: resWindowDoorPermitSpecificFees() - (ID22)
| Created by: Nicolaj Bunting
| Created on: 22Oct20
| Usage: On ASA add and invoice fee from schedule "BLD_GEN"
| If ASI "Number of windows" or "Number of doors" > 0 Then "BLD_026" with quantity of 381, If sum > 6 Then add 12 * (ASI - 6)
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

    var numWindows = parseFloat(getAppSpecific("Number of windows", capId));
    Avo_LogDebug("Windows(" + numWindows + ")", 2);

    var numDoors = parseFloat(getAppSpecific("Number of doors", capId));
    Avo_LogDebug("Doors(" + numDoors + ")", 2);

    var sum = numWindows + numDoors;

    if (isNaN(sum) == true || sum < 0) {
        return;
    }

    // Permit fee
    feeCode = "BLD_026";
    quantity = 381;

    if (sum > 6) {
        quantity += 12 * (sum - 6);
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
})();