/*******************************************************
| Script/Function: addResNewFarmLaborUpfronFee(ID515)
| Created by: Tom Grzegorczyk
| Created on: 11Dec23
| Usage: On ASA when ASI "FarmLabor" = yes 
| If this record has a parent record of the same type then charge fee: BLD_083 from the fee schedule BLD_GEN instead of the below fees:
| If BLD_133 is already invoiced, ignore below
| Assess and invoice fee BLD_143 from fee schedule BLD_GEN
| Modified by: ()
*********************************************************/
(function () {
    var feeSched = "BLD_GEN";
    var feeCode, feeResult, quantity;

    var farmLabor = String(AInfo["FarmLabor"]);
    Avo_LogDebug("FarmLabor(" + farmLabor + ")", 2);   //debug

    if (farmLabor != "Yes") {
        return;
    }

    var result = aa.cap.getCap(capId);
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get cap for record " + capId + ". " + result.errorType + ": " + result.errorMessage, 1);
        return;
    }
    var cap = result.getOutput();
    var altId = cap.capModel.altID;
    var capTypeModel = cap.capType;
    var recordType = String(capTypeModel);
    Avo_LogDebug("Record Type(" + recordType + ")", 2); //debug

    var parentsSameType = Avo_GetAllParentsOfType(capTypeModel, capId);

    if (parentsSameType && parentsSameType.length > 0) {
        // BLD_083
        feeCode = "BLD_083";
    } else {
        // BLD_143
        feeCode = "BLD_143";
        var exists = feeExistsWithStatus("BLD_133", "NEW");
        if (exists === true) {
            Avo_LogDebug("Fee BLD_133 has been already added and invoiced. Skipping.", 1);
            return;
        }
    }

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


})();

function feeExistsWithStatus(feeCode, feeStatus) {
    var found = false;
    var result = aa.fee.getFeeItems(capId);
    if (result.getSuccess() !== true) {
        Avo_LogDebug('Failed to get fees. ' + result.errorType + ": " + result.errorMessage, 1);
        return found;
    }

    var allFeeItems = result.getOutput();
    for (var i in allFeeItems) {
        var feeItem = allFeeItems[i];
        //Avo_LogDebug('feeCode: ' + feeItem.feeCod, 2);
        //Avo_LogDebug('feeitemStatus: ' + feeItem.feeitemStatus, 2);
        if (feeItem.feeCod != feeCode) {
            continue;
        }
        var statusMatch = feeItem.feeitemStatus == feeStatus;
        if (statusMatch == false) {
            continue;
        }
        found = true;
        break;
    }
    return found;
}
