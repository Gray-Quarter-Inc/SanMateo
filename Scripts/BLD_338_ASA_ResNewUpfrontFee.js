//BLD_338_ASA_ResNewUpfrontFee
/********************************************************
| Script/Function: resNewUpfrontFee() - (ID338) 
| Created by: Jei Yang
| Created on: 16Jun21
| Usage: On ASA, assess and invoice fee BLD_058
| Modified by: ()
*********************************************************/
(function () {
    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeCode, quantity;
    var quantity = 1;
    //eval(getScriptText("BLD_FeeCalculationFunctions"));

    feeCode = "BLD_058";
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
