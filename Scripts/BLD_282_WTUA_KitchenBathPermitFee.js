//BLD_282_WTUA_KitchenBathPermitFee
/*******************************************************
| Script/Function: kitchenBathPermitFee() - (ID282)
| Created by: Tom Grzegorczyk
| Created on: 12May21
| Event : WTUA
| Usage: 
|       Assess and invoice fee BLD_010 from BLD_GEN
|       Calculation as follows:
|
|       Case 1: If ASI "Will you be moving / removing load bearing walls?" is set to "Yes",
|               quantity = 0.5*(7.51* (Y))
|               Y = The number entered in the field ASI "What is the cumulative square footage of the areas being remodeled?"
|
|               For example: if ASI "What is the cumulative square footage of the areas being remodeled?" = 100. BLD_011 = 0.5*(7.51*(100)) = $
|
|               If ASI "Will you be moving / removing load bearing walls?" is set to "Yes",
|               quantity = 0.5*(7.51* (Y))
|
|       Case 2: If ASI "Will you be moving / removing load bearing walls?" is set to "No",
|               quantity = 0.5*(6.35* (Y))
|               Y = The number entered in the field ASI "What is the cumulative square footage of the areas being remodeled?"
|
|               For example: if ASI "What is the cumulative square footage of the areas being remodeled?" = 100. BLD_011 = 0.5*(6.35*(100)) = $
|
|       Assess and Invoice fee BLD_067 from fee schedule BLD_GEN
|       Calculation as follows:
|               Valuation amount = ASI "What is the construction valuation including labor and materials?"
|               (Valuation amount /$25,000) the minimum fee is $1.0
|
|               It is $1 per 25,0000 of the valuation amount and fraction there of (always round up to the next dollar value even if it is only 1 cent over)
|               For example: If the valuation amount is 60,000. (60,000/25,000 = 2.4) rounding up to the next dollar, BLD_067 = $3
|
|       Invoice and Assess fee BLD_014 from fee schedule BLD_GEN if ASI  "Is an electrical service upgrade required?" is "Yes"
|       Fee calculation as the following:
|               If ASI: "Is the service upgrade greater than 300 amps?" is Yes, amount = $462
|               If ASI: "Is the service upgrade greater than 300 amps?" is No, amount = $191
|
|       Invoice and Assess fee BLD_061 from fee schedule BLD_GEN
|       Fee calculation as the following:
|               $191 for each additional subpanels, tracked by ASI "Number of main service panels/ subpanels being added, altered, or repaired?"
|               Values can be from 0 to 6, do not charge the fee if the ASI value == 0
|
|       Assess and invoice fee BLD_039
|       Assess and invoice fee BLD_040
|       Assess and invoice fee BLD_043
|
| Modified by: (GQ 11008 12/27/2024)
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

    //Assess and invoice fee BLD_010
    feeCode = "BLD_010";
    if (isNaN(surfaceArea) === false) {
        quantity = calcFee_remodeledArea(surfaceArea, movingWalls == "Yes");
        assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);
        quantity = 0;
    }

    var valuation = parseFloat(getAppSpecific("What is the construction valuation including labor and materials?", capId));
    Avo_LogDebug("What is the construction valuation including labor and materials?(" + valuation + ")", 2);

    if (isNaN(valuation) == false) {
        //BLD_067
        feeCode = "BLD_067"; 
        quantity = calcFee_BLD_067(valuation);
        assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);
        quantity = 0;

        var stories = parseFloat(getAppSpecific("Number of Stories", capId));
        Avo_LogDebug("NumberOfStories(" + stories + ")", 2); //debug

        if (isNaN(stories) != true) {
            //BLD_045
            feeCode = "BLD_045";
            if (stories <= 3) {
                quantity = parseFloat(valuation * 0.00013);
            } else {
                quantity = parseFloat(valuation * 0.00028);
            }
            if (quantity < 0.5) {
                quantity = 0.5
            }
            assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);
        }
    }
    quantity = 0;

    var electricServiceRequired = getAppSpecific("Is an electrical service upgrade required?", capId);
    Avo_LogDebug("Is an electrical service upgrade required?(" + electricServiceRequired + ")", 2);
    var lessThan300Amps = getAppSpecific("Is the service upgrade greater than 300 amps?", capId);
    Avo_LogDebug("Is the service upgrade greater than 300 amps?(" + lessThan300Amps + ")", 2);

    //Assess and invoice fee BLD_014
    feeCode = "BLD_014";   
    if (electricServiceRequired == "Yes") {
        quantity = calcFee_electricServiceUpgrade(lessThan300Amps == "Yes");
        assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);
        quantity = 0;
    }

    var nbrOfServicePanels = Number(getAppSpecific("Number of main service panels/ subpanels being added, altered, or repaired?", capId));
    Avo_LogDebug("Number of main service panels/ subpanels being added, altered, or repaired?(" + nbrOfServicePanels + ")", 2);

    //Assess and invoice fee BLD_061
    feeCode = "BLD_061";
    if (nbrOfServicePanels > 0) {
        quantity = calcFee_BLD_061(nbrOfServicePanels);
        assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);
        quantity = 0;
    }

    var winDoors = parseFloat(getAppSpecific("How many windows / doors are being altered?", capId));
    Avo_LogDebug("Windows/Doors(" + winDoors + ")", 2);

    if (isNaN(winDoors) == true || winDoors < 0) {
        return;
    }

    // Assess and invoice fee BLD_026
    feeCode = "BLD_026";
    quantity = 330;

    if (winDoors > 6) {
        quantity += 10 * (winDoors - 6);
    }
    assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);
    quantity = 0;
    
    // Percentage fees
    include("BLD_016_ASA_ResPercentageFees");
})();


