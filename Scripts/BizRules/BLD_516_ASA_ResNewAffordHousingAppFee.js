/*******************************************************
| Script/Function: addResNewAffordHousingAppFee(ID516)
| Created by: Tom Grzegorczyk
| Created on: 8Dec23
| Usage: On ASA add and invoice fees from schedule "BLD_GEN"
| If ASI "Is affordable housing included in this project?" is "Yes", 
| then Assess and invoice fee "BLD_133" from the fee schedule BLD_GEN with the quantity of 1 
| If this record has a parent record of the same type then charge fee: BLD_083 from the fee schedule BLD_GEN instead
| Modified by: ()
*********************************************************/
(function () {
    var feeSched = "BLD_GEN";
    var feeCode, feeResult, quantity;

    var affordableHousing = String(AInfo["Is affordable housing included in this project?"]);
    Avo_LogDebug("Is affordable housing included in this project?(" + affordableHousing + ")", 2);   //debug

    if (affordableHousing != "Yes") {
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
        // BLD_133
        feeCode = "BLD_133";
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