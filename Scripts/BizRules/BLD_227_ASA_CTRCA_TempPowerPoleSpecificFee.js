/*******************************************************
| Script/Function: tempPowerPoleSpecificFee() - (ID223)
| Created by: Jei Yang
| Created on: 22Feb21
| Usage: On ASA/CTRCA add and invoice fees from schedule "BLD_GEN": "BLD_012".
|        Base quantity of 191.
| Modified by: (GQ 12-26-2024 11008)
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

    if (resOrComm.toUpperCase() == "RESIDENTIAL") {
        quantity = 191;
    } else {
        quantity = 381;
    }

    // Permit fee
    feeCode = "BLD_052";

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