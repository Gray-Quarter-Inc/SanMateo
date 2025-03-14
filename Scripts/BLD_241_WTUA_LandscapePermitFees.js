/*******************************************************
| Script/Function: landscapePermitFees() - (ID241)
| Created by: Jei Yang
| Created on: 22Mar21
| Usage: When task "Plan Preparation for Issuance" status set to "Final Fees Assessment" add and invoice
| fees from schedule "BLD_GEN":
| If ASI "Are you creating, replacing or altering a foundation?" is "No" and "Retaining Wall" is Not
| checked and "Trellis or pergola or abbor", "Outdoor kitchen", "Pizza oven", "Fire pit",
| "Outdoor fireplaces", "Free standing wall", "Electric gate" are not checked Then "BLD_010" with
| quantity of If "Project Type" is "Commercial" Then 330 Else 165,
| If ASI "Trellis or pergola or abbor" is checked Then "BLD_068",
| If ASI "Outdoor kitchen" is checked Then "BLD_070",
| If ASI "Pizza oven" is checked Then "BLD_071",
| If ASI "Fire pit" is checked Then "BLD_072",
| If ASI "Outdoor fireplaces" is checked Then "BLD_073",
| If ASI "Free standing wall" is checked Then "BLD_074",
| If ASI "Electric gate" is checked Then "BLD_075",
| If ASI "Landscaping" is checked and "Are you creating, replacing or altering a foundation?" is "Yes"
| And "What is the construction valuation for the foundation work including labor and materials?" has
| value
| Or ASI "Retaining Wall" is checked and "What is the construction valuation of the retaining walls" has
| value Then "BLD_010" with quantity of valuation of foundation work + valuation of retaining wall,
| "BLD_067" with quantity of
| ("What is the construction valuation for the foundation work including labor and materials?"
| + "What is the construction valuation of the retaining walls") / 25000 rounded up to nearest dollar,
| call ID16
| Modified by: (Tom Grzegorczyk on 31Oct22 - BLD_10 Minimum fee $165) Test
*********************************************************/
(function () {
    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeResult, feeCode, quantity;
    var quantity = 0;
    eval(getScriptText("BLD_FeeCalculationFunctions"));

    var retainingWall = String(AInfo["Retaining Wall"]);
    Avo_LogDebug("Retaining Wall(" + retainingWall + ")", 2);    //debug

    var retainingWallsVal = parseInt(AInfo[
        "What is the construction valuation of the retaining walls"], 10);
    Avo_LogDebug("Retaining walls value amount(" + retainingWallsVal + ")", 2); //debug

    var landscaping = String(AInfo["Landscaping"]);
    Avo_LogDebug("Landscaping(" + landscaping + ")", 2);    //debug

    var landscapingVal = parseInt(AInfo[
        "What is the construction valuation of this landscaping project"], 10);
    Avo_LogDebug("Landscaping value amount(" + landscapingVal + ")", 2); //debug
   
    var foundationChange = String(AInfo["Are you creating, replacing or altering a foundation?"]);
    Avo_LogDebug("Foundation Change(" + foundationChange + ")", 2); //debug

    var foundationWorkVal = parseInt(AInfo[
        "What is the construction valuation for the foundation work including labor and materials?"],
        10);
    Avo_LogDebug("Foundation Work value amount(" + foundationWorkVal + ")", 2); //debug

    var drivewayChange = String(AInfo["Are you creating, replacing, or altering a driveway"]);
    Avo_LogDebug("Driveway Change(" + drivewayChange + ")", 2); //debug

    var drivewayWorkVal = parseInt(AInfo[
        "Driveway Valuation"], 10);
    Avo_LogDebug("Driveway Work value amount(" + drivewayWorkVal + ")", 2); //debug
    
    var landscapeArea = parseInt(AInfo[
        "Amount of rehabilitated or new irrigated landscaping area"], 10);
    Avo_LogDebug("Landscape Area(" + landscapeArea + ")", 2);   //debug



    // A la carte
    var allFieldNames = ["Trellis or pergola or abbor", "Outdoor kitchen", "Pizza oven",
        "Fire pit", "Outdoor fireplaces", "Free standing wall", "Electric gate"];
    var allFeeCodes = ["BLD_068", "BLD_070", "BLD_071", "BLD_072", "BLD_073", "BLD_074",
        "BLD_075"];

    var allCheckedFields = new Object();
    for (var i in allFieldNames) {
        var fieldName = allFieldNames[i];
        var fieldValue = String(getAppSpecific(fieldName, capId));
        Avo_LogDebug(fieldName + "(" + fieldValue + ")", 2);    //debug

        if (fieldValue != "CHECKED") {
            continue;
        }

        allCheckedFields[fieldName] = i;
    }

    Avo_LogDebug("Total Checked(" + Object.keys(allCheckedFields).length + ")", 2); //debug

    // BLD_010 Minimum fee
    if (foundationChange != "Yes" && retainingWall != "CHECKED"
        && Object.keys(allCheckedFields).length == 0) {
        feeCode = "BLD_010";
        quantity = 381;

        var projType = String(AInfo["Project Type"]);
        Avo_LogDebug("Project Type(" + projType + ")", 2);  //debug

        if (projType == "Commercial") {
            quantity = 381;
        }

        if (projType == "Residential") {
            quantity = 191;
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

        // Percentage fees
        // BLD_039, 040, 043
        include("BLD_016_ASA_ResPercentageFees");

        return;
    }

    // A la carte fees
    // BLD_068 Trellises or pergola or abbor
    // BLD_070 Outdoor kitchen
    // BLD_071 Pizza Oven
    // BLD_072 Fire pit
    // BLD_073 Outdoor fireplaces
    // BLD_074 Free standing wall
    // BLD_075 Electric gate
    quantity = 1;

    for (var fieldName in allCheckedFields) {
        var i = allCheckedFields[fieldName];

        feeCode = allFeeCodes[i];

        feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
        if (feeResult) {
            Avo_LogDebug("Fee " + feeCode + " has been added with quantity of "
                + quantity, 1);
        }
        else if (feeResult == null) {
            Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of "
                + quantity, 1);
        } else {
            Avo_LogDebug("Failed to add fee " + feeCode, 1);
        }
    }

    // BLD_010 Building Permit Fee
    // BLD_067 CA Building Standard Fee
     if ((landscaping == "CHECKED" && foundationChange == "Yes" && isNaN(foundationWorkVal) != true)
        || (landscaping == "CHECKED" && drivewayChange == "Yes" && isNaN(drivewayWorkVal) != true)
        || (landscaping == "CHECKED" && isNaN(landscapingVal) != true)
        || (retainingWall == "CHECKED" && isNaN(retainingWallsVal) != true)) {
        var valuation = 0;

        if (landscaping == "CHECKED" && foundationChange == "Yes" && isNaN(foundationWorkVal) != true) {
            valuation += calcPermitFee_BLD_010_BLD_011(foundationWorkVal);
        }

        if (landscaping == "CHECKED" && drivewayChange == "Yes" && isNaN(drivewayWorkVal) != true) {
            valuation += calcPermitFee_BLD_010_BLD_011(drivewayWorkVal);
        }

        if (retainingWall == "CHECKED" && isNaN(retainingWallsVal) != true) {
            valuation += calcPermitFee_BLD_010_BLD_011(retainingWallsVal);
        }

        if (valuation > 0) {
            feeCode = "BLD_010";
            quantity = valuation.toFixed(2);

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

        var totalVal = 0;
        if (isNaN(landscapingVal) != true) {
            totalVal += landscapingVal;
        }
        if (isNaN(retainingWallsVal) != true) {
            totalVal += retainingWallsVal;
        }

        Avo_LogDebug("Total Valuation($" + totalVal + ")", 2);  //debug

        if (totalVal > 0) {
            feeCode = "BLD_067";
            quantity = Math.ceil(totalVal / 25000).toFixed(2);

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
    // BLD_039, 040, 043
    include("BLD_016_ASA_ResPercentageFees");
})();
