//BLD_281_WTUA_KitchenBathReviewFees
/*******************************************************
| Script/Function: kitchenBathReviewFees() - (ID281)
| Created by: Tom Grzegorczyk
| Created on: 12May21
| Event : WTUA
| Usage: 
|       Assess and invoice fee BLD_011
|       Calculation as follows: 
|       Case 1: If ASI "Will you be moving / removing load bearing walls?" is set to "Yes",
|               quantity = 0.5*(6.25* (Y))
|
|               Y = The number entered in the field ASI "What is the cumulative square footage of the areas being remodeled?"
|               For example: if ASI "What is the cumulative square footage of the areas being remodeled?" = 100. BLD_011 = 0.5*(6.25*(100)) = $312.5
|
|               If ASI "Will you be moving / removing load bearing walls?" is set to "Yes",
|               quantity = 0.5*(6.25* (Y))
|
|       Case 2: If ASI "Will you be moving / removing load bearing walls?" is set to "No",
|               quantity = 0.5*(5.5* (Y))
|
|               Y = The number entered in the field ASI "What is the cumulative square footage of the areas being remodeled?"
|
| Modified by: ()
*********************************************************/
(function () {
    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeCode, quantity;
    var quantity = 0;
    
    eval(getScriptText("BLD_FeeCalculationFunctions"));

    var movingWalls = getAppSpecific("Will you be moving / removing load bearing walls?", capId);
    Avo_LogDebug("Will you be moving / removing load bearing walls?(" + movingWalls + ")", 2);
    var surfaceArea = parseFloat(getAppSpecific("What is the cumulative square footage of the areas being remodeled?", capId));
    Avo_LogDebug("What is the cumulative square footage of the areas being remodeled?(" + surfaceArea + ")", 2);

    //Assess and invoice BLD_011
    feeCode = "BLD_011";
    if (isNaN(surfaceArea) === false) {
        quantity = calcFee_remodeledArea(surfaceArea, movingWalls == "Yes");
        assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);
        quantity = 0;
    }
})();
