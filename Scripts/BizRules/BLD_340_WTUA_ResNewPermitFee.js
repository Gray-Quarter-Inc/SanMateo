/********************************************************
| Script/Function: resNewPermitFee() - (ID340) 
| Created by: Jei Yang
| Created on: 8Jul21
| Usage: When task "Plan Preparation for Issuance" status set to "Final Fees Assessment" add and invoice the following fees from
| sched "BLD_GEN":
|        "BLD_010" with quantity of 0.5*((7 * Residential footage field)+(3 * Unconditioned footage field) +
| (1.5 * Decks and patio footage field) + (5 * (Alteration footage field))
|        "BLD_067" with quantity of
|           Valuation amount = ASI "What is the construction valuation for this project including labor and materials?"
|           (Valuation amount /$25,000) the minimum fee is $1.0
|           It is $1 per 25,0000 of the valuation amount and fraction there of (always round up to the next dollar value even
| if it is only 1 cent over)
|           For example: If the valuation amount is 60,000. (60,000/25,000 = 2.4) rounding up to the next dollar, BLD_067 = $3
|        If ASI "Proposed cumulative square footage of conditioned space" > "What is the total square footage being demolished?"
| Then Assess and Invoice fee BLD_047 (Road Mitigiation Fee) from fee scheudle BLD_GEN
|        Assess and invoice fee BLD_039
|        Assess and invoice fee BLD_040
|        Assess and invoice fee BLD_043
| Modified by: Mihaela Berceanu
*********************************************************/
(function () {
    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeCode;
    var quantity = 0;
    eval(getScriptText("BLD_FeeCalculationFunctions"));

    //BLD_010
    feeCode = "BLD_010";
    var conditional = parseFloat(getAppSpecific("Proposed cumulative square footage of conditioned space", capId));
    Avo_LogDebug("Proposed cumulative square footage of conditioned space(" + conditional + ")", 2);

    var unconditional = parseFloat(getAppSpecific("Proposed cumulative square footage of unconditioned space", capId));
    Avo_LogDebug("Proposed cumulative square footage of unconditioned space(" + unconditional + ")", 2);

    var decksAndPatio = parseFloat(getAppSpecific("Proposed cumulative square footage of attached decs / patios / porches", capId));
    Avo_LogDebug("Proposed cumulative square footage of attached deck / patios / porches(" + decksAndPatio + ")", 2);

    //var manufactured = parseFloat(getAppSpecific("What is the cumulative square footage of the areas being remodeled?", capId));
    //Avo_LogDebug("What is the cumulative square footage of the areas being remodeled?(" + manufactured + ")", 2);

    var builtPermanent = parseFloat(
        getAppSpecific("Is this a manufactured / factory built home on a permanent foundation?", capId));
    Avo_LogDebug("Building Permanent(" + builtPermanent + ")", 2); //debug

    var demolished = parseFloat(getAppSpecific("What is the total square footage being demolished?", capId));
    Avo_LogDebug("What is the total square footage being demolished?(" + demolished + ")", 2); //debug

    if (isNaN(conditional) == true) conditional = 0;
    if (isNaN(unconditional) == true) unconditional = 0;
    if (isNaN(decksAndPatio) == true) decksAndPatio = 0;
    if (isNaN(demolished) == true) demolished = 0;

    var conditionedFormula = 0;
    if (builtPermanent && builtPermanent.toUpperCase() == "YES") {
        conditionedFormula = 5.78;
    } else {
        conditionedFormula = 8.09;
    }

    // If any of the required fields are invalid
    quantity = 0.5 * ((conditionedFormula * conditional) + (3.47 * unconditional) + (1.73 * decksAndPatio));
    assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);

    quantity = 0;
    var valuation = parseFloat(
        getAppSpecific("What is the construction valuation for this project including labor and materials?", capId));
    Avo_LogDebug("Valuation(" + valuation + ")", 2); //debug

    if (isNaN(valuation) != true) {
        //BLD_067
        feeCode = "BLD_067";
        quantity = calcFee_BLD_067(valuation);
        assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);

        var stories = parseFloat(
            getAppSpecific("Number of proposed stories including basement", capId));//This ASI exists only on Building/Residential/New/NA records, on other records the ASI name ends with "s"(basements)
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

        //BLD_047
        feeCode = "BLD_047";
        if (conditional > demolished) {
            var addedSpace = conditional - demolished;
            quantity = 2.44 * addedSpace;
            assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);
        }
    }

    // Percentage fees
    //BLD_039, 040, 043
    include("BLD_016_ASA_ResPercentageFees");
})();