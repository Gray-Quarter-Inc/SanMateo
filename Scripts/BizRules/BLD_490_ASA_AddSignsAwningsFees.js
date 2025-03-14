/*******************************************************
| Script/Function: addSignsAwningsFees(ID490)
| Created by: Nicolaj Bunting
| Created on: 7Jun23
| Usage: On ASA add and invoice fees from schedule "BLD_GEN"
| "BLD_001" with quantity of 1
| If ASI "Number of Proposed Illuminated Sign(s)" > 0 Then "BLD_131" with quantity of ASI
| If ASI "Number of Proposed Non-Illuminated Sign(s)" > 0 Then "BLD_132" with quantity of ASI
| If ASI "What is the construction valuation for this project including labor and materials?" > 0 Then
| "BLD_067" with quantity of ASI / 25,000 rounded up to nearest dollar
| Modified by: ()
*********************************************************/
(function () {

    var pubAgencyProj = String(AInfo["Public Agency Project"]);
    if (controlString == "ApplicationSubmitAfter" && pubAgencyProj == "CHECKED") {
        return;
    }
    if (controlString == "ConvertToRealCapAfter" && pubAgencyProj != "CHECKED") {
        return;
    }

    var feeSched = "BLD_GEN";
    var feeCode, feeResult, quantity;

    // Application Filing Fee - Easy Review
    feeCode = "BLD_001";
    quantity = 1;
    feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, "Y");
    if (feeResult) {
        Avo_LogDebug("Fee " + feeCode + " has been added", 1);
    }
    else if (feeResult == null) {
        Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
    } else {
        Avo_LogDebug("Failed to add fee " + feeCode, 1);
    }

    // Signs/Awnings Illuminated
    var illumSigns = parseInt(getAppSpecific("IllumSign", capId), 10);
    Avo_LogDebug("Illuminated Signs(" + illumSigns + ")", 2);  //debug

    var litAwnings = parseInt(getAppSpecific("LitAwnings", capId), 10);
    Avo_LogDebug("Illuminated Signs(" + litAwnings + ")", 2);  //debug

    totalIllumSigns = illumSigns + litAwnings;

    if (isNaN(totalIllumSigns) != true && totalIllumSigns > 0) {
        feeCode = "BLD_131";
        quantity = totalIllumSigns;
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

    // Signs/Awnings Non-Illuminated
    var nonIllumSigns = parseInt(getAppSpecific("NonIllumSign",
        capId), 10);
    Avo_LogDebug("Non-Illuminated Signs(" + nonIllumSigns + ")", 2);  //debug

    var nonLitAwnings = parseInt(getAppSpecific("NonLitAwnings", capId), 10);
    Avo_LogDebug("Illuminated Signs(" + nonLitAwnings + ")", 2);  //debug

    totalNonIllumSigns = nonIllumSigns + nonLitAwnings;

    if (isNaN(totalNonIllumSigns) != true && totalNonIllumSigns > 0) {
        feeCode = "BLD_132";
        quantity = totalNonIllumSigns;
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

    // CA Building Standard Fee
    var constructVal = parseFloat(getAppSpecific(
        "ConstValuation", capId));
    Avo_LogDebug("Construction Valuation($" + constructVal + ")", 2);   //debug

    if (isNaN(constructVal) != true && constructVal > 0) {
        feeCode = "BLD_067";
        quantity = Math.ceil(constructVal / 25000);
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