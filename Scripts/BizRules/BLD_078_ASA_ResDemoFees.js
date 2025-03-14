/*******************************************************
| Script/Function: resDemoFees() - (ID78)
| Created by: Jei Yang
| Created on: 9Nov20
| Usage: On ASA add and invoice fees from schedule "BLD_GEN": "BLD_028".
|        If ASI "Area of structures to be demolished" < 250, then set quantity to 191.
|        If ASI "Area of structures to be demolished" >= 250, then set quantity to 347. 
| Modified by: (GQ 12/26/2024 11008)
*********************************************************/
(function () {
    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeResult, feeCode, quantity;

    feeCode = "BLD_028";

    var areaToDemolish = parseFloat(getAppSpecific("Area of structures to be demolished", capId));
    Avo_LogDebug("Area to be demolished(" + areaToDemolish + ")", 2);

    if (isNaN(areaToDemolish) == true || areaToDemolish <= 0) {
        return;
    }

    quantity = (areaToDemolish < 250) ? 191 : 347;

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