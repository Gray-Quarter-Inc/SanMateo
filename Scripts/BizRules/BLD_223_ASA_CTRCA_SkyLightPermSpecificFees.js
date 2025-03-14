/*******************************************************
| Script/Function: skyLightPermSpecificFees() - (ID223)
| Created by: Jei Yang
| Created on: 18Feb21
| Usage: On ASA If parent is same record type Then add and invoice fee from schedule "BLD_GEN" "BLD_083" Else "BLD_026" with a quantity 
| of 381
| Modified by: (GQ 12/26/2024 11008)
*********************************************************/
(function () {
    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeResult, feeCode, quantity;

    // Permit fee
    feeCode = "BLD_026";

    //var numOfSkylights = String(getAppSpecific("Number of skylights / sun tunnels being installed", capId));
    //Avo_LogDebug("Number of skylights / sun tunnels being installed(" + numOfSkylights + ")", 2);    //debug

    quantity = 381;
    //if (numOfSkylights > 1) {
    //    quantity += 10 * (numOfSkylights - 1);
    //}

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
        }
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
})();