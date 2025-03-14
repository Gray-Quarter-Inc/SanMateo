/********************************************************
| Script/Function: addAltReviewFee() - (ID310)
| Created by: Jei Yang
| Created on: 19May21
| Usage: On WTUA add and invoice the following fees.
|        BLD_013
|        BLD_031 - (If ASI 'Retaining wall" is "Checked", OR if ASI "Are you creating, replacing or altering a foundation?" is "Yes", OR  {If the toal value  from the ASIs "Cut volume (cubic ys)" and "Fill volume (cubic yards)" is Greater than 250), AND if ASI "Will the foundation for this project be on piers?" is "No"quantity is 165
|                   If the total value  from the ASIs "Cut volume (cubic yards)" and "Fill volume (cubic yds)" is greater than 250, AND if ASI "Will the foundation for this project be on piers?" is "Yes" quantity = 750)
|        BLD_033 - (Amount of new or replaced impervious surface. Include sq ft from pools & spas as applicable (sq ft)= 0 to 149 (integer no decimal) quantity = 165
|                   Amount of new or replaced impervious surface. Include sq ft from pools & spas as applicable (sq ft) = 150 to 749(integer no decimal) quantity = 165
|                   Amount of new or replaced impervious surface. Include sq ft from pools & spas as applicable (sq ft) >= 750(integer no decimal) AND the toal value  from the ASIs "Cut volume (cubic yds)" and "Fill volume (cubic yds)" is greater than 250, quantity = 495)
|        BLD_078 - 0.65*(Permit fee) if ASI "Are you replacing dry rot or termite damage?" is set to "Yes"
|        BLD_080 - 0.65* (Permit Fee) if ASI "Will you be rewiring the electrical?" is set to "Yes"
|        BLD_011 - 0.5*((8.09 * Residential footage field)+(3.47 * Unconditioned footage field)+(1.73 * Decks and patio footage field)+(7.51 (if Structural alteration) OR 6.35 (if non structural alteration) * (Alteration footage field))
| Modified by: (GQ 12/27/2024 11008)
*********************************************************/
(function () {
    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeResult, feeCode, quantity;
    var quantity = 0;
    eval(getScriptText("BLD_FeeCalculationFunctions"));

    /*
    //BLD_013
    quantity = 1;
    feeCode = "BLD_013";

    feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
    if (feeResult) {
        Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
    }
    else if (feeResult == null) {
        Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
    } else {
        Avo_LogDebug("Failed to add fee " + feeCode, 1);
    }
    
    
    //var retainingWall = String(AInfo["Retaining Wall"]);
    //Avo_LogDebug("Retaining Wall(" + retainingWall + ")", 2); //debug
    //var creatingFoundation = String(AInfo["Are you creating, replacing or altering a foundation?"]);
    //Avo_LogDebug("Are you creating, replacing or altering a foundation?(" + creatingFoundation + ")", 2); //debug
    var cutVolumn = String(AInfo["Cut volume (cubic yds)"]);
    Avo_LogDebug("Cut volume (cubic yds)(" + cutVolumn + ")", 2); //debug
    var fillVolumn = String(AInfo["Fill volume (cubic yds)"]);
    Avo_LogDebug("Fill volume (cubic yds)(" + fillVolumn + ")", 2); //debug
    var onPiers = String(AInfo["Will the foundation for this project be on piers?"]);
    Avo_LogDebug("Will the foundation for this project be on piers?(" + onPiers + ")", 2); //debug
 
    //BLD_031
    quantity = 0;
    if ((cutVolumn + fillVolumn) > 250 && onPiers.toUpperCase() == 'NO') {
        quantity = 165;
    }
    if ((cutVolumn + fillVolumn) > 250 && onPiers.toUpperCase() == 'YES') {
        quantity = 750;
    }
    if (quantity > 0) {

        feeCode = "BLD_031";

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
    

    //BLD_033
    quantity = 0;
    var impSurface = parseInt(String(AInfo["Amount of new or replaced impervious surface. Include sq ft from pools & spas as applicable (sq ft)"]));
    Avo_LogDebug("Amount of new or replaced impervious surface. Include sq ft from pools & spas as applicable (sq ft)(" + impSurface + ")", 2); //debug
    
    if (impSurface >= 150 && impSurface < 750) {
        quantity = 165;
    } else if (impSurface >= 750) {
        quantity = 495;
    }

    if (quantity > 0) {
        feeCode = "BLD_033";

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
    */


    //BLD_078
    quantity = 0;
    feeCode = "BLD_078";

    var valuationForRepair = parseFloat(getAppSpecific("What is the construction valuation for the repair of the dry rot or termite damage including labor", capId));
    Avo_LogDebug("What is the construction valuation for the repair of the dry rot or termite damage?(" + valuationForRepair + ")", 2);
    
    if (!isNaN(valuationForRepair)) {
        quantity = calcPermitFee_BLD_010_BLD_011(valuationForRepair) * 0.65;
    }

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

    //BLD_080
    quantity = 0;
    feeCode = "BLD_080";
    
    var rewiring = String(AInfo["Will you be rewiring the electrical?"]);
    var valuationForRewire = parseFloat(getAppSpecific("What is the construction valuation for the rewire work including labor and materials?", capId));
    Avo_LogDebug("What is the construction valuation for the rewire work including labor and materials?(" + valuationForRewire + ")", 2);
    
    if (rewiring.toUpperCase() == "YES" && !isNaN(valuationForRewire)) {
        quantity = calcPermitFee_BLD_010_BLD_011(valuationForRewire) * 0.65;
    }

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

    //BLD_011
    feeCode = "BLD_011";
    var residential = getAppSpecific("New square footage of conditioned space being added to residence (sq ft)", capId);
    Avo_LogDebug("New square footage of conditioned space being added to residence (sq ft)(" + residential + ")", 2);

    var unconditional = getAppSpecific("New square footage of unconditioned space being added to residence (sq ft)", capId);
    Avo_LogDebug("New square footage of unconditioned space being added to residence (sq ft)(" + unconditional + ")", 2);
    
    var decksAndPatio = getAppSpecific("New square footage being added / replaced to attached deck / patio / porch (sq ft)", capId);
    Avo_LogDebug("New square footage being added / replaced to attached deck / patio / porch (sq ft)(" + decksAndPatio + ")", 2);

    var alteration = getAppSpecific("What is the cumulative square footage of the areas being remodeled?", capId);
    Avo_LogDebug("What is the cumulative square footage of the areas being remodeled?(" + alteration + ")", 2);

    var addingLoadBearingWalls = String(AInfo["Will you be adding / moving / removing load bearing walls?"]);
    Avo_LogDebug("Will you be adding / moving / removing load bearing walls?(" + addingLoadBearingWalls + ")", 2); //debug

    var structuralAlterationValue = 0;
    if (addingLoadBearingWalls.toUpperCase() == "YES") {
        structuralAlterationValue = 7.51; //Structual alteration
    } else {
        structuralAlterationValue = 6.35; //Non-structural alternation
    }
    
    residential = residential ? parseFloat(residential) : 0;
    unconditional = unconditional ? parseFloat(unconditional) : 0;
    decksAndPatio = decksAndPatio ? parseFloat(decksAndPatio) : 0;
    alteration = alteration ? parseFloat(alteration) : 0;

    // If any of the required fields are invalid
    quantity = 0.5 * ((8.09 * residential) + (3.47 * unconditional) + (1.73 * decksAndPatio) + (structuralAlterationValue * alteration));

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
