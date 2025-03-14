/*******************************************************
| Script/Function: addAffordHousingCommNewFees(ID508)
| Created by: Nicolaj Bunting
| Created on: 25Jul23
| Usage: When task "Application Submittal" is set to the status of "Fee Assessment" If ASI
| "Affordable Housing" is "Yes" and "Affordable Housing Square Footage" > 0 Then add and invoice fees
| from schedule "BLD_GEN"
| If only project types "High Density Residential" and "Building" are checked And
| "Affordable Housing Square Footage" = "Building Square Footage"
| + "High Density Residential Square Footage" Then "BLD_134" with quantity of 4
| If ASI "Affordable Housing Square Footage" = "Building Square Footage" +
| "High Density Residential Square Footage" and "Impervious Surface" >= 150 Then "BLD_135" with quantity
| of If "Impervious Surface" >= 750 Then 495 Else 165
| If ASI "Building" or "High Density Residential" is checked Then "BLD_136" with quantity of 0.5 * ASI
| "Affordable Housing Square Footage" value * first comma separated value of "Building" in std choice
| "Building_Commerical_Add_PlanCheckFee"
| Modified by: ()
*********************************************************/
(function () {
    var feeSched = "BLD_GEN";
    var feeCode, quantity, feeResult;

    var affordHousing = String(AInfo["Affordable Housing"]);
    Avo_LogDebug("Affordable Housing(" + affordHousing + ")", 2);   //debug

    var affordSqFootage = parseFloat(AInfo["Affordable Housing Square Footage"]);
    Avo_LogDebug("Affordable Housing Sq. Footage(" + affordSqFootage + ")", 2); //debug

    if (isNaN(affordSqFootage) == true) { affordSqFootage = 0; }

    if (affordHousing != "Yes" || affordSqFootage <= 0) {
        return;
    }

    var isResOnly = getIsResOnly("Building_Commerical_Add_ProjectFee");
    Avo_LogDebug("Only Residential(" + isResOnly + ")", 2);    //debug

    var bldSqFootage = parseFloat(AInfo["Building Square Footage"]);
    Avo_LogDebug("Building Sq. Footage(" + bldSqFootage + ")", 2);   //debug

    if (isNaN(bldSqFootage) == true) { bldSqFootage = 0; }

    var highDensityResSqFootage = parseFloat(AInfo["High Density Residential Square Footage"]);
    Avo_LogDebug("High Density Residential Sq. Footage(" + highDensityResSqFootage + ")", 2);   //debug

    if (isNaN(highDensityResSqFootage) == true) { highDensityResSqFootage = 0; }

    var isWaivingFees = affordSqFootage == (bldSqFootage + highDensityResSqFootage);
    Avo_LogDebug("Waiving Fees(" + isWaivingFees + ")", 2); //debug

    if (isResOnly == true && isWaivingFees == true) {
        // Planning Review Fee - Affordable Housing Reduction
        feeCode = "BLD_134";
        quantity = 4;
        feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, "Y");
        if (feeResult) {
            Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
        }
        else if (feeResult == null) {
            Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
        } else {
            Avo_LogDebug("Failed to add fee " + feeCode, 1);
        }
    }

    var impervSurf = parseFloat(AInfo["Impervious Surface"]);
    Avo_LogDebug("Impervious Surface(" + impervSurf + ")", 2);  //debug

    if (isNaN(impervSurf) != true && impervSurf >= 150 && isWaivingFees == true) {
        // Civil & Drainage Fee - Affordable Housing Reduction
        feeCode = "BLD_135";
        quantity = 165;

        if (impervSurf >= 750) {
            quantity = 495;
        }

        feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, "Y");
        if (feeResult) {
            Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
        }
        else if (feeResult == null) {
            Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
        } else {
            Avo_LogDebug("Failed to add fee " + feeCode, 1);
        }
    }

    var bld = String(AInfo["Building"]);
    Avo_LogDebug("Building(" + bld + ")", 2);   //debug

    var highDensityRes = String(AInfo["High Density Residential"]);
    Avo_LogDebug("High Density Res(" + highDensityRes + ")", 2);    //debug

    if (bld == "CHECKED" || highDensityRes == "CHECKED") {
        var stdChoice = "Building_Commerical_Add_PlanCheckFee";
        var details = String(lookup(stdChoice, "Building")).split(",");
        if (details.length < 2) {
            Avo_LogDebug("Plan Check fee details for Building are invalid", 1);
            return;
        }

        var multiplier = parseFloat(details[0]);
        Avo_LogDebug("Plan Check Multiplier(" + multiplier + ")", 2);  //debug

        if (isNaN(multiplier) == true) {
            Avo_LogDebug("Invalid fee multiplier for Building", 1);
            return;
        }

        // Plan Check Fee - Affordable Housing Reduction
        feeCode = "BLD_136";
        quantity = 0.5 * affordSqFootage * multiplier;
        if (quantity <= 0) {
            Avo_LogDebug("Invalid quantity of " + quantity, 1);
            return;
        }

        feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, "Y");
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

function getIsResOnly(stdChoice) {
    var isResOnly = false;

    var result = aa.bizDomain.getBizDomain(stdChoice);
    if (result.getSuccess() !== true) {
        Avo_LogDebug("Failed to retrieve values from standard choice " + stdChoice + ". "
            + result.errorType + ": " + result.errorMessage, 1);
        return isResOnly;
    }

    var isRes = false;
    var isNonRes = false;

    var stdChoiceArray = result.getOutput().toArray();
    for (var i in stdChoiceArray) {
        var fieldName = String(stdChoiceArray[i].bizdomainValue);

        var checkbox = String(AInfo[fieldName]);
        Avo_LogDebug(fieldName + "(" + checkbox + ")", 2);  //debug

        if (checkbox != "CHECKED") {
            continue;
        }

        if (matches(fieldName, "Building", "High Density Residential") == true) {
            isRes = true;
        } else {
            isNonRes = true;
        }
    }

    return isRes && !isNonRes;
}