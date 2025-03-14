/*******************************************************
| Script/Function: revisionFee() - (ID378)
| Created by: Jei Yang
| Created on: 20Sep21
| Usage: Assess and invoice fee BLD_083 (quantity of 1) from fee schedule BLD_GEN
| Modified by: ()
*********************************************************/
(function () {
    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeResult, feeCode, quantity;
    var quantity = 0;
    eval(getScriptText("BLD_FeeCalculationFunctions"));

    //BLD_083
    feeCode = "BLD_083";
    quantity = 1;

    assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);

})();