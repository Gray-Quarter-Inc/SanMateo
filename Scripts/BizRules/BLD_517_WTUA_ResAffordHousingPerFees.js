//BLD_517_WTUA_ResAffordHousingPerFees
/*******************************************************
| Script/Function: resAffordHousingPerFees() - (ID517)
| Created by: Tom Grzegorczyk
| Created on: 5Dec23
| Event : WTUA
| Usage: Add and invoice fees "BLD_138", "BLD_139", "BLD_140" from schedule "BLD_GEN" with quantity of total amount of fees "BLD_133", "BLD_134", "BLD_135", "BLD_136", "BLD_137", 
| Modified by: ()
*********************************************************/
(function () {
    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeCode, quantity, feeResult;
    var quantity = 0;

    eval(getScriptText("BLD_FeeCalculationFunctions"));

    var allFeeCodesToAdd = "BLD_133,BLD_134,BLD_135,BLD_136,BLD_137";

    quantity = Avo_GetTotalFeesOfSelected(allFeeCodesToAdd, capId);
    Avo_LogDebug('Total amount of fees "BLD_133,BLD_134,BLD_135,BLD_136,BLD_137" (' + quantity + ')');
    //Assess and invoice fee BLD_138
    feeCode = "BLD_138";
    feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
    if (feeResult) {
        Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
    }
    else if (feeResult == null) {
        Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
    } else {
        Avo_LogDebug("Failed to add fee " + feeCode, 1);
    }

    //Assess and invoice fee BLD_139
    feeCode = "BLD_139";
    feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
    if (feeResult) {
        Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
    }
    else if (feeResult == null) {
        Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
    } else {
        Avo_LogDebug("Failed to add fee " + feeCode, 1);
    }

    //Assess and invoice fee BLD_140
    feeCode = "BLD_140";
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


