/*******************************************************
| Script: BLD_FeeCalculationFunctions
| Created by: Jei Yang
| Created on: 7May21
| Usage: functions to calculate fees based on given values.
| Modified by: (Tom Grzegorczyk - 10May21) - defined globals, automated range matching and fee calculation for BLD_011
|              (Tom Grzegorczyk - 12May21) - added new functions:
|                                                            assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee)
|                                                            calcFee_remodeledArea(surfaceArea, movingWalls)
|                                                            calcFee_electricServiceUpgrade(lessThan300Amps)
|                                                            calcFee_BLD_061(nbrOfServicePanels)
*********************************************************/

// If both min and max values are not null, matched range excludes min value and includes max value
// If min value is set to null it will leave left side, of the range, open. Matched range is anything below or equal max value.
// If max value is set to null it will leave right side of the range open. Matched range is anything above min value.
function rangeMatchWithMax(min, max, valuation) {
    return (min === null || valuation > min) && (max === null || valuation <= max) ? true : false;
}

// Assess and invoice fee
function assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee) {
    if (quantity > 0) {
        var feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
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

/*
| Function: calcPermitFee_BLD_010_BLD_011(valuation)
| Usage:    Calculate permit fee based on project valuation.
|           Commonly used for BLD_010 and BLD_011. ASI field name can vary depending of permit type.
|updated: 12-15-2024 GQ 11008
|   Project valuation	    |   Permit Fee
|   ____________________________________________________________________________________________________________________________________________________
|   $0 - $1,000             |   $191.00
|   $1,001 - $5,000         |	$381.00
|   $5,001 - $10,000        |	$572.00
|   $10,001 - $20,000       |	$1,143.00
|   $20,001 - $30,000       |	$1,525.00
|   $30,001 - $40.000       |	$1,906.00
|   $40,001 - $50,000       |	$2,287.00
|   $50,001 - $75,000       |	$3.430.00
|   $75,001 - $100,000      |	$4,574.00
|   $100,001 - $500,000     |	$4,574.00 for the first $100,000 of valuation plus $23.00 tor each additional $1,000 of valuation or fraction thereof
|   $500,001 and up	        |   $13,814.00 for the first $500,000 of valuation plus $23.00 tor each additional $1,000 of valuation or fraction thereof
|   ____________________________________________________________________________________________________________________________________________________
*/

var bld11FeeTable = [
    {
        min: null,
        max: 1000,
        calcPermitFee: function (valuation) { return 191; },
    },
    {
        min: 1000,
        max: 5000,
        calcPermitFee: function (valuation) { return 381; },
    },
    {
        min: 5000,
        max: 10000,
        calcPermitFee: function (valuation) { return 572; },
    },
    {
        min: 10000,
        max: 20000,
        calcPermitFee: function (valuation) { return 1143; },
    },
    {
        min: 20000,
        max: 30000,
        calcPermitFee: function (valuation) { return 1525; },
    },
    {
        min: 30000,
        max: 40000,
        calcPermitFee: function (valuation) { return 1906; },
    },
    {
        min: 40000,
        max: 50000,
        calcPermitFee: function (valuation) { return 2287; },
    },
    {
        min: 50000,
        max: 75000,
        calcPermitFee: function (valuation) { return 3430; },
    },
    {
        min: 75000,
        max: 100000,
        calcPermitFee: function (valuation) { return 4574; },
    },
    {
        min: 100000,
        max: 500000,
        calcPermitFee: function (valuation) { return 4574 + 23 * Math.ceil((valuation - 100000) / 1000); },
    },
    {
        min: 500000,
        max: null,
        calcPermitFee: function (valuation) { return 13814 + 23 * Math.ceil((valuation - 500000) / 1000); },
    },
];
function calcPermitFee_BLD_010_BLD_011(valuation) {

    var permitFee = 0;
    Avo_LogDebug("calcPermitFee_BLD_010_BLD_011(" + valuation + ")", 1);

    for (var f in bld11FeeTable) {
        var element = bld11FeeTable[f];
        if (rangeMatchWithMax(element.min, element.max, valuation)) {
            permitFee = element.calcPermitFee(valuation);
            break;
        }
    }

    return permitFee;
}

/*
| Function: calcFee_BLD_067(valuation)
| Usage:    Calculate fee based on construction valuation amount.
|
|   (Valuation amount /$25,000) the minimum fee is $1.0
|   It is $1 per 25,0000 of the valuation amount and fraction there of (always round up to the next dollar value even if it is only 1 cent over)
|   For example: If thevaluation amount is 60,000. (60,000/25,000 = 2.4) rounding up to the next dollar, BLD_067 = $3
*/
function calcFee_BLD_067(valuation) {
    Avo_LogDebug("calcFee_BLD_067()", 1);
    var chargeAmount = Math.ceil(Number(valuation) / Number(25000));
    return chargeAmount > 1 ? chargeAmount : 1;
}

/*
| Function: calcFee_remodeledArea(surfaceArea, movingWalls)
| Usage:    
|       Assess and invoice fee X
|       Calculation as follows:
|
|       Case 1: If ASI "Will you be moving / removing load bearing walls?" is set to "Yes",
|               quantity = 0.5*(6.25* (Y))
|               Y = The number entered in the field ASI "What is the cumulative square footage of the areas being remodeled"
|
|               For example: if ASI "What is the cumulative square footage of the areas being remodeled" = 100. X = 0.5*(6.25*(100)) = $312.5
|
|               If ASI "Will you be moving / removing load bearing walls?" is set to "Yes",
|               quantity = 0.5*(6.25* (Y))
|
|       Case 2: If ASI "Will you be moving / removing load bearing walls?" is set to "No",
|               quantity = 0.5*(5.5* (Y))
|               Y = The number entered in the field ASI "What is the cumulative square footage of the areas being remodeled"
|
|               For example: if ASI "What is the cumulative square footage of the areas being remodeled" = 100. X = 0.5*(5.5*(100)) = $225
*/
function calcFee_remodeledArea(surfaceArea, movingWalls) {
    Avo_LogDebug("calcFee_BLD_010(" + surfaceArea + ", " + movingWalls + ")", 1);
    if (movingWalls === true) {
        return 0.5 * (7.51 * surfaceArea);
    } else {
        return 0.5 * (6.35 * surfaceArea);
    }
}

/*
| Function: calcFee_electricServiceUpgrade(moreThan300Amps)
| Usage:
|       Invoice and Assess fee X if ASI  "Is an electric service upgrade required?" is "Y"
|       Fee calculation as the following:
|               If ASI: "Is the service upgrade less than 300 Amps" is Y, amount = $165
|               If ASI: is the service upgrade less than 300 Amps is N, amount = $400
*/
function calcFee_electricServiceUpgrade(moreThan300Amps) {
    Avo_LogDebug("calcFee_electricServiceUpgrade(" + moreThan300Amps + ")", 1);
    if (moreThan300Amps === true) {
        return 462;
    } else {
        return 191;
    }
}

/*
| Function: calcFee_BLD_061(nbrOfServicePanels)
| Usage:
|       Invoice and Assess fee BLD_061 from fee schedule BLD_GEN
|       Fee calculation as the following:
|       $165 for each additional subpanels, tracked by ASI "Number of main service panels / subpanels being added, altered, or repaired?"
|       Values can be from 0 to 6, do not charge the fee if the ASI value == 0
*/
function calcFee_BLD_061(nbrOfServicePanels) {
    return nbrOfServicePanels * 191;
}




/*******************************************************
| Script/Function: calculateReinstatementFee() 
| Created by: Jei Yang
| Created on: 20Jan22
| Usage: Calculate Reinstatement Fee amount based on the record type. (BLD_085 / BLD_086) 
Fee schedule BLD_GEN
| Modified by: ()
|
| Record Type                               Fee codes
| ~/~/Addition/NA                           BLD_010
| ~/~/Deck and Patio/NA                     BLD_010
| ~/~/Detached Structure/Full Utilities     BLD_010
| ~/~/New/NA                                BLD_010
| ~/~/Propane Tank/NA                       BLD_010
|
| ~/~/Plumbing/NA                           BLD_012
| ~/~/Plumbing/Water Heater                 BLD_012
|
| ~/~/Electrical/Generator                  BLD_015
|
| ~/~/Fire/NA                               BLD_024
|
| ~/~/Re-Roof/NA                            BLD_025
|
| ~/~/Window or Door/NA                     BLD_026
|
| ~/~/Siding and Stucco/NA                  BLD_027
| ~/~/Skylight/NA                           BLD_027
|
| ~/~/Demolition/NA                         BLD_028
|
| ~/~/Electrical/Temporary Power Pole       BLD_052
|
| ~/~/Bath Kitchen Remodel/NA               BLD_010 + BLD_014
|
| ~/~/Pool or Spa/NA                        BLD_010 + BLD_059
|
| ~/~/Electrical/Car Charger                BLD_014 + BLD_016
|
| ~/~/Electrical/Service Upgrade            BLD_014 + BLD_061
|
| ~/~/Electrical/Storage Systems            BLD_014 + BLD_016 + BLD_060 + BLD_061
|
| ~/~/Electrical/PV Solar                   BLD_014 + BLD_016 + BLD_017 + BLD_025 + BLD_060 + BLD_061
|
| ~/~/Mechanical/HVAC                       BLD_002 + BLD_012 + BLD_018 + BLD_019 + BLD_020 + BLD_021 + BLD_022
|
| ~/~/Landscaping/NA                        BLD_010 + BLD_068 + BLD_070 + BLD_071 + BLD_072 + BLD_073 + BLD_074 + BLD_075
 **/
function calculateReinstatementFee(capId) {
    var cap = aa.cap.getCap(capId).getOutput();
    var capTypeModel = cap.capType;
    var recordType = String(capTypeModel);
    Avo_LogDebug("Record Type(" + recordType + ")", 2); //debug
    
    var capSubType = String(capTypeModel.getSubType());
    var capCategory = String(capTypeModel.getCategory());
    var recordSubType = capSubType + "/" + capCategory;
    
    var allFeeCodes = new Object();
    
    switch (recordSubType) {
        case "Addition/NA":
        case "Deck and Patio/NA":
        case "Detached Structure/Full Utilities":
        case "New/NA":
        case "Propane Tank/NA":
            allFeeCodes["BLD_010"] = true;
            break;

        case "Plumbing/NA":
        case "Plumbing/Water Heater":
            allFeeCodes["BLD_012"] = true;
            break;

        case "Electrical/Generator":
            allFeeCodes["BLD_015"] = true;
            break;

        case "Fire/NA":
            allFeeCodes["BLD_024"] = true;
            break;

        case "Re-Roof/NA":
            allFeeCodes["BLD_025"] = true;
            break;

        case "Window or Door/NA":
            allFeeCodes["BLD_026"] = true;
            break;

        case "Siding and Stucco/NA":
        case "Skylight/NA":
            allFeeCodes["BLD_027"] = true;
            break;

        case "Demolition/NA":
            allFeeCodes["BLD_028"] = true;
            break;

        case "Electrical/Temporary Power Pole":
            allFeeCodes["BLD_052"] = true;
            break;

        case "Bath Kitchen Remodel/NA":
            allFeeCodes["BLD_010"] = true;
            allFeeCodes["BLD_014"] = true;
            break;

        case "Pool or Spa/NA":
            allFeeCodes["BLD_010"] = true;
            allFeeCodes["BLD_059"] = true;
            break;

        case "Electrical/Car Charger":
            allFeeCodes["BLD_014"] = true;
            allFeeCodes["BLD_016"] = true;
            break;

        case "Electrical/Service Upgrade":
            allFeeCodes["BLD_014"] = true;
            allFeeCodes["BLD_061"] = true;
            break;

        case "Electrical/Storage Systems":
            allFeeCodes["BLD_014"] = true;
            allFeeCodes["BLD_016"] = true;
            allFeeCodes["BLD_060"] = true;
            allFeeCodes["BLD_061"] = true;
            break;

        case "Electrical/PV Solar":
            allFeeCodes["BLD_014"] = true;
            allFeeCodes["BLD_016"] = true;
            allFeeCodes["BLD_017"] = true;
            allFeeCodes["BLD_025"] = true;
            allFeeCodes["BLD_060"] = true;
            allFeeCodes["BLD_061"] = true;
            break;

        case "Mechanical/HVAC":
            allFeeCodes["BLD_002"] = true;
            allFeeCodes["BLD_012"] = true;
            allFeeCodes["BLD_018"] = true;
            allFeeCodes["BLD_019"] = true;
            allFeeCodes["BLD_020"] = true;
            allFeeCodes["BLD_021"] = true;
            allFeeCodes["BLD_022"] = true;
            break;

        case "Landscaping/NA":
            allFeeCodes["BLD_010"] = true;
            allFeeCodes["BLD_068"] = true;
            allFeeCodes["BLD_070"] = true;
            allFeeCodes["BLD_071"] = true;
            allFeeCodes["BLD_072"] = true;
            allFeeCodes["BLD_073"] = true;
            allFeeCodes["BLD_074"] = true;
            allFeeCodes["BLD_075"] = true;
            break;

        default:
            Avo_LogDebug('"' + recordType + '" is not a supported record type', 1);
            return;
    }
    
    if (Object.keys(allFeeCodes).length == 0) {
        Avo_LogDebug('No permit fees associated with record type "' + recordType + '"', 1);
        return;
    }
    

    // Get fee amount sum
    
    result = aa.finance.getFeeItemInvoiceByCapID(capId, aa.util.newQueryFormat());
    if (result.getSuccess() != true) {
        Avo_LogDebug('Failed to get invoiced fee items for record ' + altId + '. '
            + result.errorType + ': ' + result.errorMessage, 1);
        return;
    }

    var quantity = 0;

    var allFeeItems = result.getOutput();
    for (var j in allFeeItems) {
        var feeItem = allFeeItems[j];

        var feeId = feeItem.feeSeqNbr;
        var feeCode = feeItem.feeCode;
        Avo_LogDebug("Fee Code(" + feeCode + ")", 2);   //debug

        if (!(feeCode in allFeeCodes)) {
            continue;
        }

        //var desc = feeItem.feeDescription;
        //var feeSched = feeItem.feeSchedule;
        //var feePeriod = feeItem.paymentPeriod;
        //var invoiceNum = feeItem.invoiceNbr;
        var amount = feeItem.fee;
        Avo_LogDebug("Amount($" + amount + ")", 2); //debug

        quantity += amount;
        //var quantity = feeItem.unit;
    }

    return quantity;
}