function Avo_GetTotalFees() {
    var ignoreList = new Object();
    if (arguments.length > 0 && arguments[0] && String(arguments[0]).length > 0) {
        var allFeeCodesToIngore = String(arguments[0]).split(',');
        for (var i in allFeeCodesToIngore) {
            var feeCodeToIgnore = allFeeCodesToIngore[i];
            Avo_LogDebug("Fee code to ignore(" + feeCodeToIgnore + ")", 2); //debug

            ignoreList[feeCodeToIgnore] = true;
        }
    }

    var recordId = capId;
    if (arguments.length > 1 && arguments[1]) {
        recordId = arguments[1];
    }

    var altId = aa.cap.getCap(capId).getOutput().capModel.altID;
    Avo_LogDebug("Avo_GetTotalFees(" + altId + ")", 1);

    // Get fee balance and fees paid balance
    // #balance, #balanceDue, #fee, #payment
    var feeTotal = 0;
    //var paidTotal = 0;
    //var allFeeIds = new Object();

    var feeItems = aa.fee.getFeeItems(recordId).getOutput();
    for (var i in feeItems) {
        var feeCode = String(feeItems[i].feeCod);

        var feeAmount = feeItems[i].fee;
        var feeId = feeItems[i].feeSeqNbr;
        Avo_LogDebug(feeId + " " + feeCode + "($" + feeAmount + ")", 2);    //debug

        if (feeCode in ignoreList) {
            continue;
        }

        feeTotal += feeAmount;
        //allFeeIds[feeId] = feeAmount;
    }

    return feeTotal;
}

/*******************************************************
| Script/Function: Avo_GetTotalFeesOfSelected([feeCodeIncludeList], [recordId])
| Created by: Jei Yang
| Created on: 24Mar21
| Usage: Get the total fee amount on record, ignoring those fee codes in feeCodeIngoreList separated by commas
| Modified by: ()
*********************************************************/
