/*******************************************************
| Script/Function: resPoolSpaDemoFees() - (ID73)
| Created by: Jei Yang
| Created on: 12Nov20
| Usage: Assess and Invoice fee BLD_028 from fee schedule BLD_GEN.
|        The amount should be flat $347, with quantity of 1.
| Modified by: ()
*********************************************************/
(function () {
    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeResult, feeCode, quantity;

    feeCode = "BLD_028";
    quantity = 347;

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