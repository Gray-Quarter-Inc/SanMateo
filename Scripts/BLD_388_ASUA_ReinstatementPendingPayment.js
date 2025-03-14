/*******************************************************
| Script/Function: denyReinstatementRequest() - (ID389)
| Created by: Jei Yang
| Created on: 25Nov21
| Usage: Application Status Update After - Charge Invoice fee BLD_085 if record status is updated to “Reinstatement Pending Payment”. 
Fee schedule BLD_GEN
| Modified by: 20Jan22 Jei Yang - updated formala to calculate reinstatement fee.
*********************************************************/
(function () {
    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeCode, quantity;
    var quantity = 0;
    eval(getScriptText("BLD_FeeCalculationFunctions"));

    feeCode = "BLD_085";
    quantity = calculateReinstatementFee(capId);

    if (quantity == 0) {
        Avo_LogDebug("Calculated fee amount for " + feeCode + " is zero", 1);
        return;
    }

    assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);

})();

aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC Supp: BLD_388_ASUA_ReinstatementPendingPayment", debug); //debug


