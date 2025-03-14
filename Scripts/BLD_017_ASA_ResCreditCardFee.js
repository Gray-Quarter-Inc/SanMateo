/*******************************************************
| Script/Function: resCreditCardFee() - (ID17)
| Created by: Nicolaj Bunting
| Created on: 22Oct20
| Usage: On ASA If in ACA Then add and invoice fees from schedule "BLD_GEN": "BLD_042" with quantity of 3% * total fee amount excluding 
| credit card fee
| Modified by: ()
*********************************************************/
(function () {
    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeResult, feeCode, quantity;
    feeCode = "BLD_042";

    // Credit card fee
    var totalFees = Avo_GetTotalFees(feeCode, capId);
    Avo_LogDebug("Total fees($" + totalFees + ")", 2);  //debug

    if (totalFees <= 0) {
        return;
    }

    quantity = 0.03 * totalFees;
    feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
    if (feeResult) {
        Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
    }
    else if (feeResult == null) {
        Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
    } else {
        Avo_LogDebug("Failed to add fee " + feeCode, 1);
    }

    totalFees = Avo_GetTotalFees(capId);
    Avo_LogDebug("Total fees($" + totalFees + ")", 2);  //debug
})();