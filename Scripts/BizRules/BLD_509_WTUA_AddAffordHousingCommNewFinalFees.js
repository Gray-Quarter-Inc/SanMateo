/*******************************************************
| Script/Function: addAffordHousingCommNewFinalFees(ID509)
| Created by: Nicolaj Bunting
| Created on: 25Jul23
| Usage: When task "Plan Preparation for Issuance" is set to the status of "Final Fees Assessment"
| If "Affordable Housing" is "Yes" And "Affordable Housing Square Footage" > 0 And ASI "Building",
| "High Density Residential" is checked Then add and invoice fee "BLD_137" from schedule "BLD_GEN" with
| quantity of 0.5 * ASI "Affordable Housing Square Footage" value * first comma separated value of
| "Building" in std choice "Building_Commerical_Add_ProjectFee", call ID511
| Modified by: Sheryll Tabamo
| Modifications: - add and invoice  BLD_141 from schedule BLD_GEN if parcel attribute LCP MIDCOAST PROJECT AREA  == 'Yes' 
|                   and ASI "Total Square footage" is greater than "0" 
|                   Calculation = 1.99* ( ASI"Affordable Housing Square Footage")
|                - add and invoice BLD_142 from schedule BLD_GEN with quantity of 2.44 x ASI "Affordable Housing Square Footage"
*********************************************************/
(function () {
    var feeSched = "BLD_GEN";
    var feeResult, feeCode, quantity;

    var affordHousing = String(getAppSpecific("Affordable Housing", capId));
    Avo_LogDebug("Affordable Housing(" + affordHousing + ")", 2);   //debug

    var affordSqFootage = parseFloat(getAppSpecific("Affordable Housing Square Footage", capId));
    Avo_LogDebug("Affordable Housing Sq. Footage(" + affordSqFootage + ")", 2); //debug

    if (isNaN(affordSqFootage) == true) { affordSqFootage = 0; }

    var bld = String(AInfo["Building"]);
    Avo_LogDebug("Building(" + bld + ")", 2);   //debug

    var highDensityRes = String(AInfo["High Density Residential"]);
    Avo_LogDebug("High Density Res(" + highDensityRes + ")", 2);    //debug

    if (affordHousing != "Yes" || affordSqFootage <= 0
        || (bld != "CHECKED" && highDensityRes != "CHECKED")) {
        return;
    }

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

    //Building Permit Fee - Affordable Housing Reduction
    feeCode = "BLD_137";
    quantity = 0.5 * affordSqFootage * multiplier;
    if (quantity <= 0) {
        Avo_LogDebug("Invalid quantity of " + quantity, 1);

        //Script 511 Add Affordable Housing Percentage Fees
        include("BLD_511_WTUA_AddAffordHousingPercentageFees");
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

    //Script 511 Add Affordable Housing Percentage Fees
    include("BLD_511_WTUA_AddAffordHousingPercentageFees");

    //added by Sheryll - August 3 2023
    // BLD 141 
    var parcelObj = new Object();
    loadParcelAttributes(parcelObj);

    var totalSquareFootage = parseFloat(getAppSpecific("Total Square Footage"));
    Avo_LogDebug("Total Square footage(" + totalSquareFootage + ")", 2); //debug

    var zoningAttrName = "ParcelAttribute.LPC MIDCOAST PROJECT AREA";
    var zoningAttr = String(parcelObj[zoningAttrName]);
    Avo_LogDebug(zoningAttrName + "(" + zoningAttr + ")", 2); //debug

    if (zoningAttr == "YES" && totalSquareFootage > 0) {
        feeCode = "BLD_141";

        quantity = affordSqFootage;
        feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, "Y");
        if (feeResult) {
            Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
        }
        else if (feeResult == null) {
    
            Avo_LogDebug("Failed to add fee " + feeCode, 1);
        }
    }
    //BLD_142
    feeCode = "BLD_142";
    quantity = 2.44 * affordSqFootage;
    feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, "Y");
    if (feeResult) {
        Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
    }
    else if (feeResult == null) {
        Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
    } else {
        Avo_LogDebug("Failed to add fee " + feeCode, 1);
    }

})();
