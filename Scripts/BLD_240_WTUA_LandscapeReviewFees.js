/*******************************************************
| Script/Function: landscapeReviewFees() - (ID240)
| Created by: Jei Yang
| Created on: 18Mar21
| Usage: When task "Application Submittal" status set to "Fee Assessment" add and invoice fees from
| schedule "BLD_GEN":
| If ASI "Amount of rehabilitated or new irrigated landscaping area" >= 500 Then "BLD_034" with quantity
| of 400,
| If ASI "Amount of rehabilitated or new irrigated landscaping area" >= 2500 Then "BLD_130" with quantity
| of 400,
| If ASI "Landscaping" is checked and "Are you creating, replacing or altering a foundation?" is "Yes"
| And "What is the construction valuation for the foundation work including labor and materials?" has
| value
| Or ASI "Retaining Wall" is checked and "What is the construction valuation of the retaining walls" has
| value Then "BLD_011" with quantity of 0.65 * (valuation of foundation work
| + valuation of retaining wall),
| If ASI "Cut volume (cubic yards)" + "Fill volume (cubic yards)" > 250 or
| "Amount of new or replaced impervious surface" rounded to nearest integer > 750 Then "BLD_033" with
| quantity of 495,
| If ASI "Amount of new or replaced impervious surface" rounded to nearest integer >= 150 and <= 750 Then
| "BLD_033" with quantity of 191,
| If ASI "Retaining Wall" is checked or "Are you creating, replacing or altering a foundation?" is "Yes"
| or "Cut volume (cubic yards)" + "Fill volume (cubic yards)" > 250 Then "BLD_031" with quantity of 191
| Modified by: (Tom Grzegorczyk on 11May22) 
|   Incident report 14844 - Fee investigation (Surcharge Fees)
|   "If landscaping permit has a parent permit, do not invoice Plan Check Fee (BLD_011)."
*********************************************************/
(function () {
    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeResult, feeCode, quantity;
    var quantity = 0;

    eval(getScriptText("BLD_FeeCalculationFunctions"));

    var landscaping = String(AInfo["Landscaping"]);
    Avo_LogDebug("Landscaping(" + landscaping + ")", 2); //debug

    var irrLandArea = parseInt(AInfo[
        "Amount of rehabilitated or new irrigated landscaping area"], 10);
    Avo_LogDebug("Irrigated landscaping area(" + irrLandArea + ")", 2); //debug

    var retainingWall = String(AInfo["Retaining Wall"]);
    Avo_LogDebug("Retaining Wall(" + retainingWall + ")", 2); //debug

    var retainingWallsValue = parseInt(AInfo[
        "What is the construction valuation of the retaining walls"], 10);
    Avo_LogDebug("Retaining walls value amount(" + retainingWallsValue + ")", 2); //debug

    var foundationChange = String(AInfo["Are you creating, replacing or altering a foundation?"]);
    Avo_LogDebug("Foundation Change(" + foundationChange + ")", 2); //debug

    var foundationValue = parseFloat(AInfo[
        "What is the construction valuation for the foundation work including labor and materials?"]);
    Avo_LogDebug("Foundation Valuation($" + foundationValue + ")", 2);  //debug

    var cutVolume = parseFloat(AInfo["Cut volume (cubic yards)"]);
    Avo_LogDebug("Cut volume(" + cutVolume + ")", 2); //debug

    if (isNaN(cutVolume) == true) {
        cutVolume = 0;
    }

    var fillVolume = parseFloat(AInfo["Fill volume (cubic yards)"]);
    Avo_LogDebug("Fill volume(" + fillVolume + ")", 2); //debug

    if (isNaN(fillVolume) == true) {
        fillVolume = 0;
    }

    Avo_LogDebug("Total Volume(" + (cutVolume + fillVolume) + ")", 2);  //debug

    var impSurface = parseInt(AInfo["Amount of new or replaced impervious surface"], 10);
    Avo_LogDebug("Impervious surface(" + impSurface + ")", 2); //debug

    // BLD_034 Landscape Review
    // if (isNaN(irrLandArea) != true && irrLandArea >= 500) {
    //     feeCode = "BLD_034";
    //     quantity = 400;

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

    // BLD_130 WELO Performance Approach
    if (isNaN(irrLandArea) != true && irrLandArea >= 2500) {
        feeCode = "BLD_130";
        quantity = 400;

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

    // BLD_011 Plan Check Fee
    if ((landscaping == "CHECKED" && foundationChange == "Yes" && isNaN(foundationValue) != true)
        || (retainingWall == "CHECKED" && isNaN(retainingWallsValue) != true)) {
        quantity = 0;

        if (landscaping == "CHECKED" && foundationChange == "Yes" && isNaN(foundationValue) != true) {
            quantity += calcPermitFee_BLD_010_BLD_011(foundationValue);
        }

        if (retainingWall == "CHECKED" && isNaN(retainingWallsValue) != true) {
            quantity += calcPermitFee_BLD_010_BLD_011(retainingWallsValue);
        }

        if (quantity > 0) {
            feeCode = "BLD_011";
            quantity *= 0.65;
            quantity = quantity.toFixed(2);

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

    // BLD_033 Civil & Drainage Review Fee
    quantity = 0;

    if (impSurface > 750) {
        quantity = 572;
    }

    if (impSurface >= 150 && impSurface <= 750) {
        quantity = 191;
    }

    if ((cutVolume + fillVolume) > 250) {
        quantity = 572;
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

    // BLD_031 Geotechnical Report Review
    if (retainingWall == "CHECKED" || foundationChange == "Yes" || (cutVolume + fillVolume) > 250) {
        feeCode = "BLD_031";
        quantity = 191;

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