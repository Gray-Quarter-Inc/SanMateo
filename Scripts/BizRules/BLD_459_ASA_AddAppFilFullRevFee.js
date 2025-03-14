/*******************************************************
| Script/Function: addAppFilFullRevFee(ID459)
| Created by: Nicolaj Bunting
| Created on: 1Nov22
| Usage: On ASA If ASI "Publicly Funded" and "Public Agency Project" are not checked Then add and
| invoice fee "BLD_058" from schedule "BLD_GEN" with quantity of 1
| Modified by: ()
*********************************************************/
(function () {
    var pubFunded = String(AInfo["Publicly Funded"]);
    var pubAgencyProj = String(AInfo["Public Agency Project"]);
    if (pubFunded == "CHECKED" || pubAgencyProj == "CHECKED") {
        return;
    }

    // Application Filing Fee - Full Review
    var feeCode = "BLD_058";
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