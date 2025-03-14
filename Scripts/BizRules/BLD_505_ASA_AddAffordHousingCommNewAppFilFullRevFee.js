/*******************************************************
| Script/Function: addAffordHousingCommNewAppFilFullRevFee(ID504)
| Created by: Nicolaj Bunting
| Created on: 24Jul23
| Usage: On ASA If ASI "Publicly Funded" and "Public Agency Project" are Not checked And only "Building",
| "High Density Residential" are checked And "Affordable Housing" is "Yes" And
| "Building Square Footage" + "High Density Residential Square Footage"
| = "Affordable Housing Square Footage" Then add and invoice fee "BLD_133" from fee schedule "BLD_GEN"
| Modified by: ()
*********************************************************/
(function () {
    var pubFunded = String(AInfo["Publicly Funded"]);
    var pubAgencyProj = String(AInfo["Public Agency Project"]);
    if (pubFunded == "CHECKED" || pubAgencyProj == "CHECKED") {
        return;
    }

    var affordHousing = String(AInfo["Affordable Housing"]);
    Avo_LogDebug("Affordable Housing(" + affordHousing + ")", 2);   //debug

    var affordSqFootage = parseFloat(AInfo["Affordable Housing Square Footage"]);
    Avo_LogDebug("Affordable Housing Sq. Footage(" + affordSqFootage + ")", 2); //debug

    if (isNaN(affordSqFootage) == true) { affordSqFootage = 0; }

    var bldSqFootage = parseFloat(AInfo["Building Square Footage"]);
    Avo_LogDebug("Building Sq. Footage(" + bldSqFootage + ")", 2);   //debug

    if (isNaN(bldSqFootage) == true) { bldSqFootage = 0; }

    var highDensitySqFootage = parseFloat(AInfo["High Density Residential Square Footage"]);
    Avo_LogDebug("High Density Residential Sq. Footage(" + highDensitySqFootage + ")", 2);   //debug

    if (isNaN(highDensitySqFootage) == true) { highDensitySqFootage = 0; }

    var isResOnly = getIsResOnly("Building_Commerical_Add_ProjectFee");
    Avo_LogDebug("Only Residential(" + isResOnly + ")", 2);    //debug

    if (isResOnly != true || affordHousing != "Yes"
        || affordSqFootage != (bldSqFootage + highDensitySqFootage)) {
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

        if (matches(fieldName, "Building", "High Density Residential") == true) {
            isRes = true;
        } else {
            isNonRes = true;
        }
    }

    return isRes && !isNonRes;
}