/*******************************************************
| Script/Function: deckPatioSpecificFee() - (ID284)
| Created by: Jei Yang
| Created on: 11May21
| Usage: On ASA add and invoice the following fees.
|        BLD_001 from BLD_FEN.
|        BLD_067: Valuation amount = ASI "What is the construction valuation including labor and materials?"
|                 (Valuation amount /$25,000) the minimum fee is $1.0
|                 It is $1 per 25,0000 of the valuation amount and fraction there of (always round up to the next dollar value even if it is only 1 cent over)
|        BLD_010: Quantity = 1.5 * ASI "What is the cumulative square footage of the deck / patio / porch included in this project?"
|        BLD_011: 0.65*(Permit fee)
|                 Project valuation is tracked by ASI "What is the construction valuation for the repair of the dry rot or termite damage?"
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

    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeResult, feeCode, quantity;
    var quantity = 0;
    eval(getScriptText("BLD_FeeCalculationFunctions"));


    //BLD_001
    feeCode = "BLD_001";
    quantity = 1;
    feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
    if (feeResult) {
        Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
    }
    else if (feeResult == null) {
        Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
    } else {
        Avo_LogDebug("Failed to add fee " + feeCode, 1);
    }

    //BLD_067
    feeCode = "BLD_067";
    var valuation = parseFloat(getAppSpecific("What is the construction valuation including labor and materials?", capId));
    Avo_LogDebug("What is the construction valuation including labor and materials?(" + valuation + ")", 2);
    
    if (!isNaN(valuation)) {
        quantity = calcFee_BLD_067(valuation);
    }

    
    feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
    if (feeResult) {
        Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
    }
    else if (feeResult == null) {
        Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
    } else {
        Avo_LogDebug("Failed to add fee " + feeCode, 1);
    }

    //BLD_010
    feeCode = "BLD_010";
    quantity = 0;
    var sqft = parseFloat(getAppSpecific("What is the cumulative square footage of the deck / patio / porch included in this project?", capId));
    Avo_LogDebug("What is the cumulative square footage of the deck / patio / porch included in this project?(" + sqft + ")", 2);
    
    if (!isNaN(sqft)) {
        quantity = sqft * 1.73 * 0.5;
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

    //BLD_011 (Same calculation as BLD_010)
    feeCode = "BLD_011";
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

    var replacingDamage = String(getAppSpecific("Are you replacing dry rot or termite damage?", capId));
    Avo_LogDebug("Are you replacing dry rot or termite damage?(" + replacingDamage + ")", 2);
    
    if (replacingDamage && replacingDamage.toUpperCase() == "YES") {
        //BLD_077
        feeCode = "BLD_077";
        quantity = 0;
        var permitFeeAmount = 0;
        var valuationForRepair = parseFloat(getAppSpecific("What is the construction valuation for the repair of the dry rot or termite damage?", capId));
        Avo_LogDebug("What is the construction valuation for the repair of the dry rot or termite damage?(" + valuationForRepair + ")", 2);
        if (!isNaN(valuationForRepair)) {
            permitFeeAmount = calcPermitFee_BLD_010_BLD_011(valuationForRepair);
            quantity = permitFeeAmount;
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

        //BLD_078
        feeCode = "BLD_078";
        if (!isNaN(valuationForRepair)) {
            quantity = permitFeeAmount * 0.65;
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
    }

})();
