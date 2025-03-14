/*******************************************************
| Script/Function: addAffordHousingPercentageFees(ID511)
| Created by: Nicolaj Bunting
| Created on: 24Jul23
| Usage: When task "Plan Preparation for Issuance" set to status of "Final Fees Assessment" Add and
| invoice fees "BLD_138", "BLD_139", "BLD_140" from schedule "BLD_GEN" with quantity of total amount of
| fees "BLD_133", "BLD_134", "BLD_135", "BLD_136", "BLD_137"
| Modified by: ()
*********************************************************/
(function () {
    var feeSched = "BLD_GEN";
    var feeCode, quantity;

    // Percentage fees
    quantity = 0;
    var allFeeCodes = "BLD_133,BLD_134,BLD_135,BLD_136,BLD_137";

    var feeItems = aa.fee.getFeeItems(capId).getOutput();
    for (var i in feeItems) {
        var feeCode = String(feeItems[i].feeCod);

        var feeAmount = feeItems[i].fee;
        var feeId = feeItems[i].feeSeqNbr;
        Avo_LogDebug(feeId + " " + feeCode + "($" + feeAmount + ")", 2);    //debug

        if (allFeeCodes.indexOf(feeCode) == -1) {
            continue;
        }

        quantity -= feeAmount;
        //allFeeIds[feeId] = feeAmount;
    }

    Avo_LogDebug("Affordable Housing Fees Total($" + quantity + ")", 2);  //debug

    if (quantity <= 0) {
        return;
    }

    feeCode = "BLD_138";
    feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, "Y");
    if (feeResult) {
        Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
    }
    else if (feeResult == null) {
        Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
    } else {
        Avo_LogDebug("Failed to add fee " + feeCode, 1);
    }

    feeCode = "BLD_139";
    feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, "Y");
    if (feeResult) {
        Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
    }
    else if (feeResult == null) {
        Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
    } else {
        Avo_LogDebug("Failed to add fee " + feeCode, 1);
    }

    feeCode = "BLD_140";
    feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, "Y");
    if (feeResult) {
        Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
    }
    else if (feeResult == null) {
        Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
    } else {
        Avo_LogDebug("Failed to add fee " + feeCode, 1);
    }
})();