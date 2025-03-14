/*******************************************************
| Script/Function: resReroofPermitSpecificFees() - (ID21)
| Created by: Nicolaj Bunting
| Created on: 22Oct20
| Usage: On ASA add and invoice fee from schedule "BLD_GEN":
| If ASI "Total Squares to be Replaced" > 0 Then "BLD_025" with quantity of 165, If ASI > 10 Then add 100 * (ASI - 10) / 1000 rounded up
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
    
    var resOrComm = String(AInfo["Residential or Commercial"]);
    Avo_LogDebug("Residential or Commercial(" + resOrComm + ")", 2); //debug

    var repSquares = parseFloat(getAppSpecific("Total Squares to be Replaced", capId));
    Avo_LogDebug("Replacement Squares(" + repSquares + ")", 2);

    if (isNaN(repSquares) == true || repSquares <= 0) {
        return;
    }

    feeCode = "BLD_025";
    if (resOrComm.toUpperCase() == "COMMERCIAL") {
        quantity = 381;
    } else {
        quantity = 191;
    }

    if (repSquares > 10) {
        quantity += 116 * Math.ceil(100 * (repSquares - 10) / 1000);
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