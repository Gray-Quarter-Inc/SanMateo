/********************************************************
| Script/Function: resNewReviewFee() - (ID339)
| Created by: Jei Yang
| Created on: 08Jul21
| Usage: On WTUA add and invoice the following fees.
|        BLD_013
|        BLD_011 - 0.5*((7 * Residential footage field)+(3 * Unconditioned footage field)+(1.5 * Decks and patio footage field)+(5 * (manufactured))
| Modified by: ()
*********************************************************/
(function () {
    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeResult, feeCode, quantity;
    var quantity = 0;
    eval(getScriptText("BLD_FeeCalculationFunctions"));



    //BLD_011
    quantity = 0;
    feeCode = "BLD_011";
    var residential = parseFloat(getAppSpecific("Proposed cumulative square footage of conditioned space", capId));
    Avo_LogDebug("Proposed cumulative square footage of conditioned space(" + residential + ")", 2);

    var unconditional = parseFloat(getAppSpecific("Proposed cumulative square footage of unconditioned space", capId));
    Avo_LogDebug("Proposed cumulative square footage of unconditioned space(" + unconditional + ")", 2);

    var decksAndPatio = parseFloat(getAppSpecific("Proposed cumulative square footage of attached decs / patios / porches", capId));
    Avo_LogDebug("Proposed cumulative square footage of attached deck / patios / porches(" + decksAndPatio + ")", 2);

    //var manufactured = getAppSpecific("What is the cumulative square footage of the areas being remodeled?", capId);
    //Avo_LogDebug("What is the cumulative square footage of the areas being remodeled?(" + manufactured + ")", 2);

    var builtPermanent = String(getAppSpecific("Is this a manufactured / factory built home on a permanent foundation?"));
    Avo_LogDebug("Is this a manufactured / factory built home on a permanent foundation?(" + builtPermanent + ")", 2); //debug


    residential = residential ? parseFloat(residential) : 0;
    unconditional = unconditional ? parseFloat(unconditional) : 0;
    decksAndPatio = decksAndPatio ? parseFloat(decksAndPatio) : 0;
    var conditionedFormaula = 0;
    if (builtPermanent && builtPermanent.toUpperCase() == "YES") {
        conditionedFormaula = 5.78;
    } else {
        conditionedFormaula = 8.09;
    }

    // If any of the required fields are invalid
    quantity = 0.5 * ((conditionedFormaula * residential) + (3.47 * unconditional) + (1.73 * decksAndPatio));

    assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);

    //BLD_082
    /*
    feeCode = "BLD_082";
    quantity = 0.44 * (residential + unconditional);
    assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);
    */
})();
