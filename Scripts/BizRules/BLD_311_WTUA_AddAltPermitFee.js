/********************************************************
| Script/Function: addAltPermitFee() - (ID311) 
| Created by: Tom Grzegorczyk
| Created on: 20May21
| Usage: On WTUA add and invoice the following fees.
|        BLD_090
|        BLD_067 -  Valuation amount = ASI "What is the construction valuation for this project including labor and materials?"
|                   (Valuation amount /$25,000) the minimum fee is $1.0
|
|        BLD_045 -  (Valuation * 0.00013) the minimum fee is $0
|                   Valuation = ASI "What is the construction valuation for this project including labor and materials?"
|
|        BLD_077 - Are you replacing dry rot or termite damage?" is set to "Yes", 
|                   Project valuation is tracked by ASI "What is the construction valuation for the repair of the dry rot or termite damage including labor"
|                   Quantity = Permit fee from the table in calcPermitFee_BLD_010_BLD_011(Project valuation) function
|
|         BLD_079 - If ASI "Will you be rewiring the electrical?" is set to "Yes"
|                   Project valuation is tracked by ASI "What is the construction valuation for the rewire work including labor and materials?"
|                   Quantity = Permit fee from the table in calcPermitFee_BLD_010_BLD_011(Project valuation) function
|
|         BLD_010 - 4 Square footage fields calculations:
|                   1. Residential footage field "New square footage of conditioned space being added to residence (sq ft)"
|                   2. Unconditioned footage field "New square footage of unconditioned space being added to residence (sq ft)"
|                   3. Decks and patio footage field "New square footage being added / replaced to attached deck / patio / porch (sq ft)"
|                   4. Alteration footage field "What is the cumulative square footage of the areas being remodeled?"
|
|                   Please note that the cacluation also depend on the ASI "Will you be adding / moving / removing load bearing walls?"
|                   if it = "Yes" then it is Structural alteration,
|                   if "No" then it is Non Structural alteration
|
|                   Calculation as follows 0.5*((7 * Residential footage field)+(3 * Unconditioned footage field)+(1.5 * Decks and patio footage field)+(6.5 (if Structural alteration) OR 5.5 (if non structural alteration) * (Alteration footage field))
|
|        BLD_047 - if ASI "New sqaure footage of conditioned space being added to residence" is greater than "0"
|                  Calculation = 2.44 * ( the number entered in the ASI "New sqaure footage of conditioned space being added to residence")
|        BLD_081
|        
| Modified by: Tom Grzegorczyk on 5Jan23 - BLD_045 calculation when ASI "Addition" is "CHECKED": if ASI "What is the construction valuation for this project including labor and materials?" =< 3
|                                          (Valuation?* 0.00013) the minimum fee is?$0.5 else (Valuation?* 0.00028) the minimum fee is?$0.5
*********************************************************/
(function () {
    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeCode, quantity;
    var quantity = 0;
    eval(getScriptText("BLD_FeeCalculationFunctions"));

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


    quantity = 0;
    var valuation = String(AInfo["What is the construction valuation for this project including labor and materials?"]);
    Avo_LogDebug("What is the construction valuation for this project including labor and materials?(" + valuation + ")", 2); //debug

    if (valuation && !isNaN(parseFloat(valuation))) {
        //BLD_067
        feeCode = "BLD_067";
        quantity = calcFee_BLD_067(valuation);
        assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);

        quantity = 0;
        var resAddition = getAppSpecific("Addition");
        //if (resAddition == "CHECKED") {
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
        //}
    }
    quantity = 0;

    //BLD_077
    feeCode = "BLD_077";
    var replacingDamage = String(AInfo["Are you replacing dry rot or termite damage?"]);
    Avo_LogDebug("Are you replacing dry rot or termite damage?(" + replacingDamage + ")", 2); //debug

    if (replacingDamage && replacingDamage == "Yes") {
        var valuation = String(AInfo["What is the construction valuation for the repair of the dry rot or termite damage including labor"]);
        Avo_LogDebug("What is the construction valuation for the repair of the dry rot or termite damage including labor(" + valuation + ")", 2); //debug
        quantity = calcPermitFee_BLD_010_BLD_011(valuation);
        assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);
        quantity = 0;
    }

    //BLD_079 
    feeCode = "BLD_079";
    var rewiringElectrical = String(AInfo["Will you be rewiring the electrical?"]);
    Avo_LogDebug("Will you be rewiring the electrical?(" + rewiringElectrical + ")", 2); //debug

    if (rewiringElectrical && rewiringElectrical == "Yes") {
        var valuation = String(AInfo["What is the construction valuation for the rewire work including labor and materials?"]);
        Avo_LogDebug("What is the construction valuation for the rewire work including labor and materials?(" + valuation + ")", 2); //debug
        if (valuation && !isNaN(parseFloat(valuation))) {
            quantity = calcPermitFee_BLD_010_BLD_011(parseFloat(valuation));
            assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);
        }
        quantity = 0;
    }

    //BLD_010
    feeCode = "BLD_010";
    var residential = parseFloat(AInfo["New square footage of conditioned space being added to residence (sq ft)"]);
    Avo_LogDebug("New square footage of conditioned space being added to residence (sq ft)(" + residential + ")", 2); //debug
    var unconditioned = parseFloat(AInfo["New square footage of unconditioned space being added to residence (sq ft)"]);
    Avo_LogDebug("New square footage of unconditioned space being added to residence (sq ft)(" + unconditioned + ")", 2); //debug
    var decks = parseFloat(AInfo["New square footage being added / replaced to attached deck / patio / porch (sq ft)"]);
    Avo_LogDebug("New square footage being added / replaced to attached deck / patio / porch (sq ft)(" + decks + ")", 2); //debug
    var alteration = parseFloat(AInfo["What is the cumulative square footage of the areas being remodeled?"]);
    Avo_LogDebug("What is the cumulative square footage of the areas being remodeled?(" + alteration + ")", 2); //debug
    var movingWalls = String(AInfo["Will you be adding / moving / removing load bearing walls?"]);
    Avo_LogDebug("Will you be adding / moving / removing load bearing walls?(" + movingWalls + ")", 2); //debug

    if (isNaN(residential) === true) {
        residential = 0;
        Avo_LogDebug("Warning: Value of 'New square footage of conditioned space being added to residence (sq ft)' ASI is not a number!", 2);
    }
    if (isNaN(unconditioned) === true) {
        unconditioned = 0;
        Avo_LogDebug("Warning: Value of 'New square footage of unconditioned space being added to residence (sq ft)' ASI is not a number!", 2);
    }
    if (isNaN(decks) === true) {
        decks = 0;
        Avo_LogDebug("Warning: Value of 'New square footage being added / replaced to attached deck / patio / porch (sq ft)' ASI is not a number!", 2);
    }
    if (isNaN(alteration) === true) {
        alteration = 0;
        Avo_LogDebug("Warning: Value of 'What is the cumulative square footage of the areas being remodeled?' ASI is not a number!", 2);
    }

    var structuralAlterationModifier = movingWalls === "Yes" ? 7.51 : 6.35;
    quantity = 0.5 * ((8.09 * residential) + (3.47 * unconditioned) + (1.73 * decks) + (structuralAlterationModifier * alteration));
    assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);
    
    
    quantity = 0;
    

    if (residential > 0) {
        //BLD_081
        feeCode = "BLD_081";

        var parcelObj = new Object();
        loadParcelAttributes(parcelObj);

        var zoningAttrName = "ParcelAttribute.LPC MIDCOAST PROJECT AREA";
        var zoningAttr = String(parcelObj[zoningAttrName]);
        Avo_LogDebug(zoningAttrName + "(" + zoningAttr + ")", 2); //debug

        if (zoningAttr == "Yes" || zoningAttr == "YES") {
            quantity = 2.05 * residential;
            assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);
        }
    }
    
    //BLD_047
    quantity = 0;
    feeCode = "BLD_047";

    var addingADU = parseFloat(AInfo["Are you adding an ADU or JADU within the proposed addition or alteration?"]);
    Avo_LogDebug("Are you adding an ADU or ADJU" + addingADU + ")", 2); //debug
    var resCondSpace = parseFloat(AInfo["New square footage of conditioned space being added to residence (sq ft)"]);
    Avo_LogDebug("New square footage of conditioned space being added to residence (sq ft)(" + resCondSpace + ")", 2); //debug

    
    if(addingADU && resCondSpace && ((addingADU != "Not applicable" && resCondSpace >= 750) ||(addingADU == "Not applicable" && resCondSpace))){
        quantity = 2.44 * resCondSpace;
        assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);
    }
  
    // Percentage fees
    include("BLD_016_ASA_ResPercentageFees");
})();
