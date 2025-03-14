/*******************************************************
| Script/Function: addAffordHousingAltAddRevFees(ID506)
| Created by: Nicolaj Bunting
| Created on: 24Jul23
| Usage: When task "Application Submittal" status set to "Fee Assessment" If ASI "Addition" is checked
| And "Affordable Housing" is "Yes" Then add and invoice fees from schedule "BLD_GEN"
| If ASI "Alteration" is checked And "Affordable Housing Square Footage" = "Residential Square Footage"
| Then "BLD_134" with quantity of 4
| If ASI "Alteration" is checked and "Impervious Surface" >= 150 And "Affordable Housing Square Footage"
| = "Residential Square Footage" Then "BLD_135" with quantity of If "Impervious Surface" >= 750 Then 495
| Else 165
| If "Residential" is checked Then "BLD_136" with quantity of 0.5 * "Affordable Housing Square Footage"
| * first comma separated value of "Residential" in std choice "Building_Commerical_Add_PlanCheckFee"
| Modified by: ()
*********************************************************/
(function () {
    var feeSched = "BLD_GEN";
    var feeCode, quantity, feeResult;

    var add = String(AInfo["Addition"]);
    Avo_LogDebug("Addition(" + add + ")", 2); //debug

    var affordHousing = String(getAppSpecific("Affordable Housing", capId));
    Avo_LogDebug("Affordable Housing(" + affordHousing + ")", 2);   //debug

    if (add != "CHECKED" || affordHousing != "Yes") {
        return;
    }

    var affordSqFootage = parseFloat(getAppSpecific("Affordable Housing Square Footage", capId));
    Avo_LogDebug("Affordable Housing Sq. Footage(" + affordSqFootage + ")", 2); //debug

    if (isNaN(affordSqFootage) == true) { affordSqFootage = 0; }

    var resSqFootage = parseFloat(getAppSpecific("Residential Square Footage", capId));
    Avo_LogDebug("Residential Sq. Footage(" + resSqFootage + ")", 2);   //debug

    if (isNaN(resSqFootage) == true) { resSqFootage = 0; }

    var isWaivingFees = affordHousing == "Yes" && affordSqFootage == resSqFootage;
    Avo_LogDebug("Waiving Fees(" + isWaivingFees + ")", 2); //debug

    var alt = String(AInfo["Alteration"]);
    Avo_LogDebug("Alteration(" + alt + ")", 2); //debug

    if (alt == "CHECKED" && isWaivingFees == true) {
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

    if (isNaN(impervSurf) == true) { impervSurf = 0; }

    if (alt == "CHECKED" && impervSurf >= 150 && isWaivingFees == true) {
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

    var res = String(AInfo["Residential"]);
    Avo_LogDebug("Residential(" + res + ")", 2); //debug

    if (res == "CHECKED") {
        var stdChoice = "Building_Commerical_Add_PlanCheckFee";
        var details = String(lookup(stdChoice, "Residential")).split(",");
        if (details.length < 2) {
            Avo_LogDebug("Plan Check fee details for Residential are invalid", 1);
            return;
        }

        var multiplier = parseFloat(details[0]);
        Avo_LogDebug("Plan Check Multiplier(" + multiplier + ")", 2);  //debug

        if (isNaN(multiplier) == true) {
            Avo_LogDebug("Invalid fee multiplier for Residential", 1);
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