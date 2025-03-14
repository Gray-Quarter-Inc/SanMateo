/*******************************************************
| Script/Function: accStruReviewFee() - (ID343)
| Created by: Jei Yang
| Created on: 6May21
| Usage: When task "Application Submittal" has status set to "Fee Assessment" add and invoice fees from schedule "BLD_GEN".
|        Assess and invoice BLD_011
| Modified by: Tom Grzegorczyk (6Feb23) - 17357 - Fee Assessment not Working on Non-Hab ACC or Landscaping
|              Tom Grzegorczyk (2May23) - For all cases if ASI "Proposed cumulative square footage of attached decs / patios / porches" > 0 then calculate
|            quantity =0.5*(1.5*(Y) ) where Y = The number entered in the ASI "Proposed cumulative square footage of attached decs / patios / porches" 
|            and add this to the total of BLD_011 
*********************************************************/
(function () {
    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeCode, quantity;
    var quantity = 0;
    eval(getScriptText("BLD_FeeCalculationFunctions"));

    //BLD_011
    feeCode = "BLD_011";
    quantity = 0;

    var typeOfNonHabitable = String(AInfo["What type of residential non-habitable structure is being constructed?"]);
    Avo_LogDebug("Non-habitable Type(" + typeOfNonHabitable + ")", 2); //debug

    var unconditioned = AInfo["Proposed cumulative square footage of unconditioned space"];
    Avo_LogDebug("Unconditioned space(" + unconditioned + ")", 2); //debug

    var utilities = String(AInfo["What utilities will be connected to the accessory structure?"]);
    Avo_LogDebug("Utilities(" + utilities + ")", 2); //debug

    var patios = parseFloat(AInfo["Proposed cumulative square footage of attached decs / patios / porches"]);
    Avo_LogDebug("decs / patios / porches(" + patios + ")", 2); //debug
    if (patios > 0) {
        patios = 0.5 * 1.73 * patios;
    } else
        patios = 0;

    unconditioned = unconditioned ? parseFloat(unconditioned) : 0;

    if (!typeOfNonHabitable) {
        return;
    }

    if (typeOfNonHabitable.toUpperCase() == "DETACHED GARAGE / CARPORT"
        || typeOfNonHabitable.toUpperCase() == "DETACHED WORKSHOP"
        || typeOfNonHabitable.toUpperCase() == "DETACHED ART STUDIO"
        || typeOfNonHabitable.toUpperCase() == "EQUIPMENT ENCLOSURES"
        || typeOfNonHabitable.toUpperCase() == "UNCONDITIONED CABANYA"
        || typeOfNonHabitable.toUpperCase() == "UNCONDITIONED POOL HOUSE") {
        //CASE 1
        quantity = 0.5 * 3.47 * unconditioned + patios;

    } else if ((utilities == "Water" || utilities == "Electric" || utilities == "Both") &&
        (typeOfNonHabitable.toUpperCase() == "DETACHED URBAN SHED (120 - 499 SF)" || typeOfNonHabitable.toUpperCase() == "DETACHED URBAN SHED (> 500 SF)")) {
        //CASE 2
        quantity = 0.5 * 3.47 * unconditioned + patios;
    } else if (typeOfNonHabitable.toUpperCase() == "DETACHED URBAN SHED (120 - 499 SF)") {
        //CASE 3
        quantity = 0.5 * 520 + patios;
    } else if (typeOfNonHabitable.toUpperCase() == "DETACHED URBAN SHED (> 500 SF)") {
        //CASE 4
        quantity = 0.5 * 1.16 * unconditioned + patios;
    } else {
        return;
    }

    assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);
})();