/*******************************************************
| Script/Function: tempStrucFee() - (ID399)
| Created by: Jei Yang
| Created on: 19Apr22
| Usage: Assess and invoice fee BLD_057 (quantity of 1) from fee schedule BLD_GEN
| Modified by: 
|   1. Tom Grzegorczyk on 29Apr22 - Ticket 14970 - Assess and invoice fee BLD_010 from the fee schedule BLD_GEN with a quantity of 330
|      "Permit Fees (Collected at Application Submittal)
|      The permit fee is equal to $330, which is derived from the following calculation: 2 x $165 per hour per inspection fee. 
|      This coincides with the minimum Commercial permit fee."
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
    eval(getScriptText("BLD_FeeCalculationFunctions"));

    //BLD_057
    feeCode = "BLD_057";
    assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);

    //BLD_010
    feeCode = "BLD_010";
    quantity = 381;
    assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);
})();