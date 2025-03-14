/*******************************************************
| Script/Function: addAltUpfrontFee() - (ID309)
| Created by: Jei Yang
| Created on: 19May21
| Usage: Assess and invoice fee BLD_058 from fee schedule BLD_GEN
| Modified by: ()
*********************************************************/
(function () {
    var feeCode = "BLD_058";
    var feeSched = "BLD_GEN";

    var feeResult = updateFee(feeCode, feeSched, "FINAL", 1, "Y");
    if (feeResult) {
        Avo_LogDebug("Fee " + feeCode + " has been added with quantity of 1", 1);
    }
    else if (feeResult == null) {
        Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of 1", 1);
    } else {
        Avo_LogDebug("Failed to add fee " + feeCode, 1);
    }
})();