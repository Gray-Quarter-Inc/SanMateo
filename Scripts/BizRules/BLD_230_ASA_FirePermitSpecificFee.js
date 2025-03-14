/*******************************************************
| Script/Function: firePermitSpecificFee() - (ID230)
| Created by: Jei Yang
| Created on: 22Feb21
| Usage: On ASA add and invoice fees from schedule "BLD_GEN": "BLD_012" and "BLD_024".
|        Base quantity of 165 and 1.
| Modified by: ()
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
    var quantity = 1;

    var resOrComm = String(AInfo["Residential or Commercial"]);
    Avo_LogDebug("Residential or Commercial(" + resOrComm + ")", 2); //debug
    var fireSystem = String(AInfo["Fire System"]);
    Avo_LogDebug("Fire System(" + fireSystem + ")", 2); //debug


    // Permit fee
    if (fireSystem.toUpperCase() == "FIRE SPRINKLER") {
        feeCode = "BLD_024";

        if (resOrComm.toUpperCase() == "RESIDENTIAL") {
            quantity = 347;
        } else {
            quantity = 381;
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


    if (fireSystem.toUpperCase() == "FIRE ALARM") {
        feeCode = "BLD_023";

        if (resOrComm.toUpperCase() == "RESIDENTIAL") {
            quantity = 289;
        } else {
            quantity = 381;
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

})();