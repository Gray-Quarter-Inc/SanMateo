function Avo_GetTotalFeesOfSelected() {
    var includeList = new Object();
    if (arguments.length > 0 && arguments[0] && String(arguments[0]).length > 0) {
        var allFeeCodesToInclude = String(arguments[0]).split(',');
        for (var i in allFeeCodesToInclude) {
            var feeCodeToInclude = allFeeCodesToInclude[i];
            Avo_LogDebug("Fee code to include(" + feeCodeToInclude + ")", 2); //debug

            includeList[feeCodeToInclude] = true;
        }
    }

    var recordId = capId;
    if (arguments.length > 1 && arguments[1]) {
        recordId = arguments[1];
    }

    var altId = aa.cap.getCap(capId).getOutput().capModel.altID;
    Avo_LogDebug("Avo_GetTotalFees(" + altId + ")", 1);

    // Get fee balance
    // #balance, #balanceDue, #fee, #payment
    var feeTotal = 0;
    //var paidTotal = 0;
    //var allFeeIds = new Object();

    var feeItems = aa.fee.getFeeItems(recordId).getOutput();
    for (var i in feeItems) {
        var feeCode = String(feeItems[i].feeCod);

        var feeAmount = feeItems[i].fee;
        var feeId = feeItems[i].feeSeqNbr;

        if (!(feeCode in includeList)) {
            continue;
        }

        feeTotal += feeAmount;
        Avo_LogDebug(feeId + " " + feeCode + "($" + feeAmount + ")", 2);    //debug
        //allFeeIds[feeId] = feeAmount;
    }

    return feeTotal;
}

/*******************************************************
| Script/Function: Avo_GetTotalNumberOfHeadsQuantity(recordId)
| Created by: Nicolaj Bunting
| Created on: 26Jun17
| Usage: For each row in ASIT "FLOOR_INFO" get the "Number of Heads" value Then for each additional 200 heads or fraction thereof add 1 to the sum
| Modified by: ()
*********************************************************/
