/*******************************************************
| Script/Function: addAffordHousingAltAddAppFilFullRevFee(ID504)
| Created by: Nicolaj Bunting
| Created on: 24Jul23
| Usage: On ASA If ASI "Publicly Funded" and "Public Agency Project" are Not checked And "Alteration",
| "Occupancy Change" are Not checked And only "Residential" is checked And "Affordable Housing" is "Yes"
| And "Residential Square Footage" = "Affordable Housing Square Footage" Then add and invoice fee
| "BLD_133" from fee schedule "BLD_GEN"
| Modified by: ()
*********************************************************/
(function () {
    var pubFunded = String(AInfo["Publicly Funded"]);
    var pubAgencyProj = String(AInfo["Public Agency Project"]);
    if (pubFunded == "CHECKED" || pubAgencyProj == "CHECKED") {
        return;
    }

    var alt = String(AInfo["Alteration"]);
    Avo_LogDebug("Alteration(" + alt + ")", 2); //debug

    var occChange = String(AInfo["Occupancy Change"]);
    Avo_LogDebug("Occupancy Change(" + occChange + ")", 2); //debug

    if (alt == "CHECKED" || occChange == "CHECKED") {
        return;
    }

    var affordHousing = String(AInfo["Affordable Housing"]);
    Avo_LogDebug("Affordable Housing(" + affordHousing + ")", 2);   //debug

    var affordSqFootage = parseFloat(AInfo["Affordable Housing Square Footage"]);
    Avo_LogDebug("Affordable Housing Sq. Footage(" + affordSqFootage + ")", 2); //debug

    if (isNaN(affordSqFootage) == true) { affordSqFootage = 0; }

    var resSqFootage = parseFloat(AInfo["Residential Square Footage"]);
    Avo_LogDebug("Residential Sq. Footage(" + resSqFootage + ")", 2);   //debug

    if (isNaN(resSqFootage) == true) { resSqFootage = 0; }

    var isResOnly = getIsResOnly("Building_Commerical_Add_ProjectFee");
    Avo_LogDebug("Only Residential(" + isResOnly + ")", 2);    //debug

    if (isResOnly != true || affordHousing != "Yes" || affordSqFootage != resSqFootage) {
        return;
    }

    // Application Filing Fee - Affordable Housing Reduction
    var feeCode = "BLD_133";
    var feeSched = "BLD_GEN";
    var quantity = 1;

    var feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, "Y");
    if (feeResult) {
        Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
    }
    else if (feeResult == null) {
        Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
    } else {
        Avo_LogDebug("Failed to add fee " + feeCode, 1);
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

        if (fieldName == "Residential") {
            isRes = true;
        } else {
            isNonRes = true;
        }
    }

    return isRes && !isNonRes;
}