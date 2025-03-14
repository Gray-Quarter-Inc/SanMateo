//BLD_518_WTUA_AddAffordHousingResNewFees
/*******************************************************
| Script/Function: addAffordHousingResNewFees() - (ID518)
| Created by: Tom Grzegorczyk
| Created on: 11Dec23
| Event : WTUA
| Usage: When ASI "Is affordable housing included in this project?" is "Yes" and "AffHousSqFt" > 0 
| Add and invoice BLD_134 from BLD_GEN 
| Modified by: ()
*********************************************************/
(function () {
    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeCode, quantity, feeResult;
    var quantity = 1;

    var affordableHousing = String(AInfo["Is affordable housing included in this project?"]);
    Avo_LogDebug("Is affordable housing included in this project?(" + affordableHousing + ")", 2);   //debug

    if (affordableHousing != "Yes") {
        return;
    }

    var sqft = parseFloat(AInfo["AffHousSqFt"]);
    Avo_LogDebug("AffHousSqFt(" + sqft + ")", 2);

    if (!isNaN(sqft) || sqft > 0) {

        //Assess and invoice fee BLD_134
        feeCode = "BLD_134";
        feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
        if (feeResult) {
            Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
        }
        else if (feeResult == null) {
            Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
        } else {
            Avo_LogDebug("Failed to add fee " + feeCode, 1);
        }
    }
})();


