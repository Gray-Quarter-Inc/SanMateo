/*******************************************************
| Script/Function: poolSpaHotTubSpecificFees() - (ID274)
| Created by: Jei Yang
| Created on: 6May21
| Usage: On ASA add and invoice fees from schedule "BLD_GEN".
         If parent is same record type Then "BLD_083"
|        For case 1 (Swimming pool / spa), invoice BLD_057, 067, 010, 011, 034.
|        For case 2 (Pond), invoice BLD_057, 067, 034, 010, 033.
|        For case 3 (Hot tub), invoice BLD_001, 067, 010. 
|        issue BLD_039, BLD_040, BLD_043. (Percentage fees)
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

    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeResult, feeCode, quantity;
    var quantity = 0;

    // Get parent
    if (!parentCapId) {
        parentCapId = getParent();
    }

    // Get parent record type
    if (parentCapId) {
        var parentCap = aa.cap.getCap(parentCapId).getOutput();
        var parentAltId = parentCap.capModel.altID;
        Avo_LogDebug("Parent(" + parentAltId + ")", 2);  //debug

        var capTypeModel = parentCap.capType;
        var recordType = String(capTypeModel);
        Avo_LogDebug("Parent Record Type(" + recordType + ")", 2); //debug

        if (recordType == appTypeString) {
            feeCode = "BLD_083";
            quantity = 1;
            feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
            if (feeResult) {
                Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
            }
            else if (feeResult == null) {
                Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
            } else {
                Avo_LogDebug("Failed to add fee " + feeCode, 1);
            }

            return;
        }
    }

    eval(getScriptText("BLD_FeeCalculationFunctions"));

    //Case 1: Swimming pool / spa
    var swimmingPool = getAppSpecific("Swimming pool / spa", capId);
    Avo_LogDebug("Swimming pool / spa(" + swimmingPool + ")", 2);

    if (swimmingPool && swimmingPool.toUpperCase() == "CHECKED") {
        //BLD_057
        feeCode = "BLD_057";
        quantity = 1;
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

    //Case 2: Pond
    var pond = getAppSpecific("Pond", capId);
    Avo_LogDebug("Pond(" + pond + ")", 2);

    if (pond && pond.toUpperCase() == "CHECKED") {
        //BLD_057
        feeCode = "BLD_057";
        quantity = 1;
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

    //Case 3: Hot Tub
    var hotTub = getAppSpecific("Self-contained, stand-alone hot tub", capId);
    Avo_LogDebug("Self-contained, stand-alone hot tub(" + hotTub + ")", 2);

    if (hotTub && hotTub.toUpperCase() == "CHECKED") {
        //BLD_001
        feeCode = "BLD_001";
        quantity = 1;
        feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
        if (feeResult) {
            Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
        }
        else if (feeResult == null) {
            Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
        } else {
            Avo_LogDebug("Failed to add fee " + feeCode, 1);
        }

        //BLD_059
        feeCode = "BLD_059";
        quantity = 1;
        feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
        if (feeResult) {
            Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
        }
        else if (feeResult == null) {
            Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
        } else {
            Avo_LogDebug("Failed to add fee " + feeCode, 1);
        }

        var constructionValudation = getAppSpecific("What is the construction valuation including labor and materials?", capId);
        Avo_LogDebug("What is the construction valuation including labor and materials?(" + hotTub + ")", 2);

        //BLD_067
        feeCode = "BLD_067";
        quantity = 0;

        if (!isNaN(constructionValudation)) {
            quantity = calcFee_BLD_067(constructionValudation);
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
})();