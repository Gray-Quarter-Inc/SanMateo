/*******************************************************
| Script/Function: kitchenBathUpfrontFees() - (ID280)
| Created by: Tom Grzegorczyk
| Created on: 12May21
| Usage: On ASA assess and invoice fee BLD_057 from fee schedule BLD_GEN
| Modified by: ()
*********************************************************/
(function () {
    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeResult, feeCode, quantity;
    var quantity = 1;

    // BLD_057
    feeCode = "BLD_057";
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

})();