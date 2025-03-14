//BLD_285_WTUA_PoolSpaHotTubReviewFee
/*******************************************************
| Script/Function: poolSpaHotTubReviewFees() - (ID285)
| Created by: Jei Yang
| Created on: 6May21
| Usage: When task "Application Submittal" has status set to "Fee Assessment" add and invoice fees from schedule "BLD_GEN".
|        For case 1 (Swimming pool / spa), invoice BLD_057, 067, 010, 011, 034.
|        For case 2 (Pond), invoice BLD_057, 067, 034, 010, 033, 031.
|        For case 3 (Hot tub), invoice BLD_001, 067, 010. 
| Modified by: (GQ 11008 12/26/2024)
*********************************************************/
(function () {
    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeResult, feeCode, quantity;
    var quantity = 0;
    eval(getScriptText("BLD_FeeCalculationFunctions"));

    //Case 1: Swimming pool / spa
    var swimmingPool = getAppSpecific("Swimming pool / spa", capId);
    Avo_LogDebug("Swimming pool / spa(" + swimmingPool + ")", 2);

    if (swimmingPool && swimmingPool.toUpperCase() == "CHECKED") {
        //BLD_011
        feeCode = "BLD_011";
        quantity = 0;

        var surfaceArea = parseFloat(getAppSpecific("What is the surface area of the pool / spa (sq ft)?", capId));
        Avo_LogDebug("What is the surface area of the pool / spa (sq ft)?(" + surfaceArea + ")", 2);

        if (isNaN(surfaceArea) != true) {
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

        //BLD_034
        // feeCode = "BLD_034";
        // quantity = 0;

        // var landscapingArea = parseFloat(getAppSpecific("Amount of rehabilitated or new irrigated landscaping area. Including sq ft from pools, spas, ponds", capId));
        // Avo_LogDebug("Amount of rehabilitated or new irrigated landscaping area. Including sq ft from pools, spas, ponds(" + landscapingArea + ")", 2);

        // if (isNaN(landscapingArea) != true) {
        //     if (landscapingArea >= 500 && landscapingArea < 2500) {
        //         quantity = 400;
        //     } else if (landscapingArea >= 2500) {
        //         quantity = 800;
        //     }
        // }

        // if (quantity > 0) {
        //     feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
        //     if (feeResult) {
        //         Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
        //     }
        //     else if (feeResult == null) {
        //         Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
        //     } else {
        //         Avo_LogDebug("Failed to add fee " + feeCode, 1);
        //     }
        // }
    }

    //Case 2: Pond
    var pond = getAppSpecific("Pond", capId);
    Avo_LogDebug("Pond(" + pond + ")", 2);

    if (pond && pond.toUpperCase() == "CHECKED") {
        //BLD_011
        feeCode = "BLD_011";
        quantity = 0;

        var surfaceArea = parseFloat(getAppSpecific("What is the construction valuation including labor and materials?", capId));
        Avo_LogDebug("What is the construction valuation including labor and materials?(" + surfaceArea + ")", 2);

        if (isNaN(surfaceArea) != true) {
            quantity = calcPermitFee_BLD_010_BLD_011(surfaceArea) * 0.65;
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

        //BLD_034
        // feeCode = "BLD_034";
        // quantity = 0;

        // var landscapingArea = parseFloat(getAppSpecific("Amount of rehabilitated or new irrigated landscaping area. Including sq ft from pools, spas, ponds", capId));
        // Avo_LogDebug("Amount of rehabilitated or new irrigated landscaping area. Including sq ft from pools, spas, ponds(" + landscapingArea + ")", 2);

        // if (isNaN(landscapingArea) != true) {
        //     if (landscapingArea >= 500 && landscapingArea < 2500) {
        //         quantity = 400;
        //     } else if (landscapingArea >= 2500) {
        //         quantity = 800;
        //     }
        // }

        // if (quantity > 0) {
        //     feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
        //     if (feeResult) {
        //         Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
        //     }
        //     else if (feeResult == null) {
        //         Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
        //     } else {
        //         Avo_LogDebug("Failed to add fee " + feeCode, 1);
        //     }
        // }

        //BLD_033
        feeCode = "BLD_033";
        quantity = 0;

        var imperviousSurface = parseFloat(getAppSpecific("Amount of new or replaced impervious surface. Include sq ft from pools & spas as applicable (sq ft)", capId));
        Avo_LogDebug("Amount of new or replaced impervious surface. Include sq ft from pools & spas as applicable (sq ft)(" + imperviousSurface + ")", 2);

        if (isNaN(imperviousSurface) != true) {
            if (imperviousSurface >= 150 && imperviousSurface < 750) {
                quantity = 191;
            } else if (imperviousSurface >= 750) {
                quantity = 572;
            }
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

        //BLD_031
        feeCode = "BLD_031";
        quantity = 0;

        var cutVol = parseFloat(getAppSpecific("Cut volume (cubic yds)", capId));
        Avo_LogDebug("Cut Volume(" + cutVol + ")", 2);

        var fillVol = parseFloat(getAppSpecific("Fill volume (cubic yds)", capId));
        Avo_LogDebug("Fill Volume(" + fillVol + ")", 2);

        var totalVol = cutVol + fillVol;
        Avo_LogDebug("Total Volume(" + totalVol + ")", 2);    //debug

        if (isNaN(totalVol) != true && totalVol > 250) {
            quantity = 191;
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

    //Case 3: Hot Tub
    var hotTub = getAppSpecific("Self-contained, stand-alone hot tub", capId);
    Avo_LogDebug("Self-contained, stand-alone hot tub(" + hotTub + ")", 2);

    if (hotTub && hotTub.toUpperCase() == "CHECKED") {
        //BLD_011
        feeCode = "BLD_011";
        quantity = 381;

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
