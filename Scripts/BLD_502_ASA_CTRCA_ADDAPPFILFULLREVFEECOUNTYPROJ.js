/*******************************************************
| Script/Function: addAppFilFullRevFeeCountyProj(ID502)
| Created by: Nicolaj Bunting
| Created on: 14Jul23
| Usage: On submit If ASI "Publicly Funded", "Public Agency Project" is checked Then add and invoice fee
| "BLD_058" from schedule "BLD_GEN"
| Modified by: ()
*********************************************************/
(function () {
    var pubFunded = String(AInfo["Publicly Funded"]);
    var pubAgencyProj = String(AInfo["Public Agency Project"]);
    if (pubFunded != "CHECKED" && pubAgencyProj != "CHECKED") {
        return;
    }

    var feeCode = "BLD_058";
    var feeSched = "BLD_GEN"
    var feeResult = updateFee(feeCode, feeSched, "FINAL", 1, "Y");
    if (feeResult) {
        Avo_LogDebug("Fee " + feeCode + " has been added", 1);
    }
    else if (feeResult == null) {
        Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of 1", 1);
    } else {
        Avo_LogDebug("Failed to add fee " + feeCode, 1);
    }
})();