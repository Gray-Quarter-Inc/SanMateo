/*******************************************************
| Script/Function: essAutoIssue(ID528)
| Created by: Tom Grzegorczyk
| Created on: 28Oct24
| Usage: On ASA add and invoice fee BLD_060 from fee schedule BLD_GEN with quantity of 520 + 58 * (ASI "Number of Energy Systems" - 1)
| If parent record type is Building/Auto Issue/NA/NA 
| Modified by: ()
*********************************************************/
(function () {
    var feeSched = "BLD_GEN";
    var feeCode = "BLD_060";
    var feeResult, quantity;
    var recordTypeToCheck = "Building/Auto Issue/NA/NA";
    var parentsOfType = Avo_GetAllParentsOfType(recordTypeToCheck, capId);

    if (!parentsOfType || parentsOfType.length < 1) {
        Avo_LogDebug('Record has no parents of type "' + recordTypeToCheck + '"', 1);
        return;
    }

    var numOfES = Number(AInfo["Number of Energy Systems"]);
    Avo_LogDebug("Number of Energy Systems(" + numOfES + ")", 2);   //debug
    if (isNaN(numOfES) || Math.ceil(numOfES) < 3) {
        quantity = 520 + 58;
    } else {
        quantity = 520 + 58 * (numOfES - 1);
    }
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