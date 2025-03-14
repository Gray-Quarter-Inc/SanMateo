/*******************************************************
| Script/Function: elecGenSpecificFees() - (ID219)
| Created by: Jei Yang
| Created on: 9Feb21
| Usage: On ASA/CTRCA add and invoice fees from schedule "BLD_GEN": "BLD_013" with a quantity of 1,
|        and "BLD_015" with a quantity of 450.
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

    // Permit fee
    feeCode = "BLD_013";
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

    // Permit fee
    feeCode = "BLD_015";
    //quantity = 450;

    feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
    if (feeResult) {
        Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
    }
    else if (feeResult == null) {
        Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
    } else {
        Avo_LogDebug("Failed to add fee " + feeCode, 1);
    }

    var greater = getAppSpecific("Is the generator and/or its enclosure greater than 150 SQ ft?", capId);
    Avo_LogDebug("Is the generator and/or its enclosure greater than 150 SQ ft?(" + greater + ")", 2); //debug
    
    if(greater.toUpperCase() != "YES") {
        return;
    }
    
    // Permit fee
    feeCode = "BLD_062";

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