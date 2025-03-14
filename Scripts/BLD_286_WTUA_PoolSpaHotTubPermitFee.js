/*******************************************************
| Script/Function: poolSpaHotTubPermitFees() - (ID286)
| Created by: Jei Yang
| Created on: 12May21
| Usage: When task "Plan Preparation for Issuance" has status set to "Final Fees Assessment" add and invoice fees from schedule 
| "BLD_GEN", BLD_039, BLD_040, BLD_043
| If ASI "Swimming pool / spa" is checked Then add and invoice BLD_057, 067, 010, 011, 034.
| If ASI "Pond" is checked Then add and invoice BLD_057, 067, 034, 010, 033.
| Modified by: ()
*********************************************************/
(function () {
    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeResult, feeCode, quantity;
    var quantity = 0;
    eval(getScriptText("BLD_FeeCalculationFunctions"));

    quantity = 1;

    // Percentage fees
    //include("BLD_016_ASA_ResPercentageFees");

    //Case 1: Swimming pool / spa
    var swimmingPool = getAppSpecific("Swimming pool / spa", capId);
    Avo_LogDebug("Swimming pool / spa(" + swimmingPool + ")", 2);

    if (swimmingPool && String(swimmingPool).toUpperCase() == "CHECKED") {
        //BLD_010
        feeCode = "BLD_010";
        quantity = 0;
        var surfaceArea = parseFloat(getAppSpecific("What is the surface area of the pool / spa (sq ft)?", capId));
        Avo_LogDebug("What is the surface area of the pool / spa (sq ft)?(" + surfaceArea + ")", 2);
        
        if (!isNaN(surfaceArea)) {
            quantity = (5.75 * surfaceArea) * 0.5;
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

        //BLD_067
        feeCode = "BLD_067";
        quantity = 0;
        var valuation = parseFloat(getAppSpecific("What is the construction valuation including labor and materials?", capId));
        Avo_LogDebug("What is the construction valuation including labor and materials?(" + valuation + ")", 2);
        
        if (!isNaN(valuation)) {
            quantity = calcFee_BLD_067(valuation);
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
    
    //Case 2: Pond
    var pond = getAppSpecific("Pond", capId);
    Avo_LogDebug("Pond(" + pond + ")", 2);
    
    if (pond && String(pond).toUpperCase() == "CHECKED") {
        //BLD_010
        feeCode = "BLD_010";
        quantity = 0;

        var valuation = parseFloat(getAppSpecific("What is the construction valuation including labor and materials?", capId));
        Avo_LogDebug("What is the construction valuation including labor and materials?(" + valuation + ")", 2);

        if (!isNaN(valuation)) {
            quantity = calcPermitFee_BLD_010_BLD_011(valuation);
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

        //BLD_067
        feeCode = "BLD_067";
        quantity = 0;

        if (!isNaN(valuation)) {
            quantity = calcFee_BLD_067(valuation);
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

    // Percentage fees
    include("BLD_016_ASA_ResPercentageFees");
})();
