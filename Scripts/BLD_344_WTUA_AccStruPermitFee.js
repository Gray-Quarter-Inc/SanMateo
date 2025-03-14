/********************************************************
| Script/Function: accStruPermitFee() - (ID344) 
| Created by: Jei Yang
| Created on: 15Jun21
| Usage: On WTUA add and invoice the following fees.
|        Assess and invoice fee BLD_010
|           Case 1. Residential Accessory
|               If ASI "What type of residential non habitable structure is being constructed" does not equal 
| "Detached urban shed (120 - 499 sf)" OR "Detached urban shed (> 500 sf)" (the ASI is a dropdown list, only 1 value can be selected)
|               BLD_010 = 0.5*(3 * Square footage)
|               Square footage = ASI: "New square footage of unconditioned space being added to residence (sq ft)"
|           Case 2. Detached Urban Shed (120 - 499SF)
|               If   "What type of residential non habitable structure is being constructed" = "Detached urban shed (120 - 499 sf)"
|               BLD_010 = 0.5*(450)
|           Case 3. Detached Urban Shed (> 500 sf)
|               If "What type of residential non habitable structure is being constructed" = "Detached urban shed (> 500 sf)" 
|               BLD_010 = 0.5*(1 * square footage)
|               Square footage is tracked by field "New square footage of unconditioned space being added to residence (sq ft)"
|       Assess and Invoice fee BLD_067 from fee schedule BLD_GEN
|           Valuation amount = ASI "What is the construction valuation for this project including labor and materials?"
|           (Valuation amount /$25,000) the minimum fee is $1.0
|           It is $1 per 25,0000 of the valuation amount and fraction there of 
| (always round up to the next dollar value even if it is only 1 cent over)
|           For example: If the valuation amount is 60,000. (60,000/25,000 = 2.4) rounding up to the next dollar, BLD_067 = $3
|       Assess and Invoice fee BLD_045 from fee scheudle BLD_GEN
|           (Valuation * 0.00013) the minimum fee is $0
|           Valuation = ASI "What is the construction valuation for this project including labor and materials?"
|       Call ID16
|        
| Modified by: Tom Grzegorczyk on 5Jan23 - BLD_045 calculation: if ASI "What is the construction valuation for this project including labor and materials?" =< 3
|                                          (Valuation?* 0.00013) the minimum fee is?$0.5 else (Valuation * 0.00028) the minimum fee is?$0.5
|              Tom Grzegorczyk on 2May23 - For all cases if ASI "Proposed cumulative square footage of attached decs / patios / porches" > 0 then calculate
| quantity =0.5*(1.5*(Y) ) where Y = The number entered in the ASI "Proposed cumulative square footage of attached decs / patios / porches" and add this to the total of BLD_010
|
*********************************************************/
(function () {
    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeCode, quantity;
    var quantity = 0;
    eval(getScriptText("BLD_FeeCalculationFunctions"));

    //BLD_010
    feeCode = "BLD_010";
    var typeOfNonHabitable = String(AInfo["What type of residential non-habitable structure is being constructed?"]);
    Avo_LogDebug("Type of Non-Habitable(" + typeOfNonHabitable + ")", 2); //debug

    var unconditioned = parseFloat(AInfo["Proposed cumulative square footage of unconditioned space"]);
    Avo_LogDebug("Unconditioned space(" + unconditioned + ")", 2); //debug

    var patios = parseFloat(AInfo["Proposed cumulative square footage of attached decs / patios / porches"]);
    Avo_LogDebug("decs / patios / porches(" + patios + ")", 2); //debug
    if (patios > 0) {
        patios = 0.5 * 1.73 * patios;
    } else
        patios = 0;

    unconditioned = unconditioned ? parseFloat(unconditioned) : 0;

    if (typeOfNonHabitable != "Detached urban shed (120 - 499 sf)" && typeOfNonHabitable != "Detached urban shed (> 500 sf)") {
        //Residential Accessory
        quantity = 0.5 * 3.47 * unconditioned + patios;
    } else if (typeOfNonHabitable == "Detached urban shed (120 - 499 sf)") {
        quantity = 0.5 * 520 + patios;
    } else if (typeOfNonHabitable == "Detached urban shed (> 500 sf)") {
        quantity = 0.5 * 1.16 * unconditioned + patios;
    }
    assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);

    quantity = 0;
    var valuation = String(AInfo["What is the construction valuation for this project including labor and materials?"]);
    Avo_LogDebug("What is the construction valuation for this project including labor and materials?(" + valuation + ")", 2); //debug

    if (valuation && !isNaN(parseFloat(valuation))) {
        //BLD_067
        feeCode = "BLD_067";
        quantity = calcFee_BLD_067(valuation);
        assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);

        var stories = parseFloat(
            getAppSpecific("Number of proposed stories including basements", capId));
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

    //BLD_090 - Disabled as part of 2025 fee schedule update
    /*
    var imperviousSurface = parseFloat(getAppSpecific("Amount of new or replaced impervious surface. Include sq ft from pools & spas as applicable (sq ft)", capId));
    Avo_LogDebug("Amount of new or replaced impervious surface. Include sq ft from pools & spas as applicable (sq ft)(" + imperviousSurface + ")", 2);

    if (!isNaN(imperviousSurface) && imperviousSurface > 750) {
        feeCode = "BLD_090";
        quantity = 1;
        assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);
    }
    */
    
    //Script 16 Residential Percentage Fees
    include("BLD_016_ASA_ResPercentageFees");
})();
