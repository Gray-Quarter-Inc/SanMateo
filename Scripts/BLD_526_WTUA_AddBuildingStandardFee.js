/*******************************************************
| Script Title: addBuildingStandardFee (ID526)
| Created by: Andy Cervanez
| Created on: 3Sep24
| Event: WTUA
| Usage: 
|
|   1) Assess and Invoice fee BLD_067 from fee schedule BLD_GEN
|
|       Calculation as follows:
|
|       Valuation amount = ASI "Valuation"
|
|       (Valuation amount /$25,000) the minimum fee is $1.0
|
|       It is $1 per 25,0000 of the valuation amount and fraction there of (always round up to the next dollar value even if it is only 1 cent over)
|
|       For example: If thevaluation amount is 60,000. (60,000/25,000 = 2.4) rounding up to the next dollar, BLD_067 = $3
|
| Modified by: ()
*********************************************************/
(function () {

    var pubAgencyProj = String(AInfo["Public Agency Project"]);
    if (controlString == "ApplicationSubmitAfter" && pubAgencyProj == "CHECKED") {
        return;
    }
    if (controlString == "ConvertToRealCapAfter" && pubAgencyProj != "CHECKED") {
        return;
    }

    eval(getScriptText("BLD_FeeCalculationFunctions"));

    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeCode, quantity;

    var conVal = parseFloat(AInfo["Valuation"]);
    Avo_LogDebug("Valuation($" + conVal + ")", 2);    //debug

    if (isNaN(conVal) == true) {
        Avo_LogDebug("Valuation is not a valid number", 1);
        return;
    }

    // CA Building Standard Fee
    feeCode = "BLD_067";
    quantity = Math.ceil(conVal / 25000);

    if (quantity > 0) {
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

