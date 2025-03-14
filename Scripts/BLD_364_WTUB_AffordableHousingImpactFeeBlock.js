/*******************************************************
| Script/Function: affordableHousingImpactFeeBlock() - (ID364)
| Created by: Jei Yang
| Created on: 22Jul21
| Usage: When task "Plan Preparation for Issuance" is set to the status of "Ready Letter Issued" If ASI 
| "Is affordable housing included in this project?" is "No" And "Impact fee" is "Required" And "BLD_084" from fee schedule 
| "BLD_GEN_MANU" is not invoiced Then block submit with the message 
| "The affordable housing impact fee must be invoiced or exemption identified for this permit before ready letter can be sent out"
| Modified by: ()
*********************************************************/
(function () {
    var affordableHousing = String(getAppSpecific("Is affordable housing included in this project?", capId));
    Avo_LogDebug("Affordable Housing(" + affordableHousing + ")", 2); //debug

    if (affordableHousing.toUpperCase() != "NO") {
        return;
    }

    var impactFee = String(getAppSpecific("Impact fee", capId));
    Avo_LogDebug("Impact Fee(" + impactFee + ")", 2);   //debug

    if (impactFee.toUpperCase() != "REQUIRED") {
        return;
    }

    // Get all invoiced fee items on a record
    var allFeeItems = new Array();

    var result = aa.finance.getFeeItemInvoiceByCapID(capId, aa.util.newQueryFormat());
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get invoiced fee items. " + result.errorType + ': ' + result.errorMessage, 1);
    } else {
        allFeeItems = result.getOutput();
    }

    for (var i in allFeeItems) {
        var feeItem = allFeeItems[i];

        var feeId = feeItem.feeSeqNbr;
        var feeCode = feeItem.feeCode;
        Avo_LogDebug("Fee Code(" + feeCode + ")", 2);   //debug

        if (feeCode != "BLD_084") {
            continue;
        }

        var desc = feeItem.feeDescription;
        var feeSched = feeItem.feeSchedule;
        Avo_LogDebug("Schedule(" + feeSched + ")", 2);  //debug

        if (feeSched != "BLD_GEN_MANU") {
            continue;
        }

        //var feePeriod = feeItem.paymentPeriod;
        //var invoiceNum = feeItem.invoiceNbr;
        //var amount = feeItem.fee;
        //var quantity = feeItem.unit;

        Avo_LogDebug("Found Affordable Housing Impact Fee", 1);
        return;
    }

    Avo_LogDebug("Failed to find Affordable Housing Impact Fee", 1);

    cancel = true;
    showMessage = true;

    var msg = "The affordable housing impact fee must be invoiced or exemption identified for this permit before ready letter can be sent out";
    comment(msg);
    Avo_LogDebug(msg, 1);
})();
