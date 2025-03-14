function Avo_CheckRevisionFeePaid() {
    // For PRA, check if BLD_083 has been invoiced for the capId.
    var revisionFeeInvoiced = false;
    var revisionFeeId = 0;
    var revisionFeeOwed = 0;
    var feeItems = aa.fee.getFeeItems(capId).getOutput();
    for (var i in feeItems) {
        var feeCode = String(feeItems[i].feeCod);
        var feeSched = feeItems[i].f4FeeItemModel.feeSchudle;
        var feeId = feeItems[i].feeSeqNbr;
        var feeAmount = feeItems[i].fee;

        Avo_LogDebug(feeId + " " + feeCode + "($" + feeAmount + ")", 2);    //debug
        if (feeCode == "BLD_083" && feeSched == "BLD_GEN") {
            revisionFeeId = feeId;
            revisionFeeOwed = feeAmount;
            revisionFeeInvoiced = true;
            break;
        }
    }

    if (!revisionFeeInvoiced) {
        return false;
    }

    //Check if BLD_083 has been paid.
    var paymentItems = aa.finance.getPaymentFeeItems(capId, null).getOutput();
    for (var i in paymentItems) {
        var feeIdToCheck = paymentItems[i].feeSeqNbr;
        var feePaid = paymentItems[i].feeAllocation;
        Avo_LogDebug("Payment Fee ID(" + feeIdToCheck + ")", 2);    //debug

        if (revisionFeeId != feeIdToCheck) {
            continue;
        }

        revisionFeeOwed = revisionFeeOwed - feePaid;
        break;
    }

    if (revisionFeeOwed > 0)
        return false;

    return true;
};
/*******************************************************
| Script/Function: Avo_CloseTaskAsUser(taskName, taskStatus, taskComment, taskNote, username, promoteTask, [processName], [recordId])
| Created by: Nicolaj Bunting
| Created on: 20Nov20
| Usage: close task taskName with status taskStatus as username, include taskComment, taskNote, If promoteTask is true Then promote to the next task
| Modified by: ()
*********************************************************/
