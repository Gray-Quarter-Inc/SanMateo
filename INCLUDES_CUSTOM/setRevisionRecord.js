function setRevisionRecord() {
    // For PRA, check BLD_083 has been invoiced for the capId.
    if (controlString = "PaymentReceiveAfter") {
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
            return;
        }

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
            return;
    }

    // Get parent
    if (!parentCapId) {
        parentCapId = getParent();
        Avo_LogDebug("1. Parent(" + parentCapId + ")", 2);  //debug
    }
    if (!parentCapId) {
        var result = aa.cap.getProjectByChildCapID(capId, null, null);
        if (result.getSuccess() != true) {
            Avo_LogDebug("Failed to get parent record. " + result.errorType + ': ' + result.errorMessage, 1);
            return;
        }
        
        var allParentRecords = result.getOutput();
        for (var i in allParentRecords) {
            parentCapId = allParentRecords[i].projectID;
            Avo_LogDebug("2. Parent(" + parentCapId + ")", 2);  //debug
        }
    }

    var capIdStrArr = String(parentCapId).split("-");
    var result = aa.cap.getCap(capIdStrArr[0], capIdStrArr[1], capIdStrArr[2]);

    //var result = aa.cap.getCap(parentCapId);

    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get cap " + parentCapId + ". " + result.errorType + ": " + result.errorMessage, 1);
        return;
    }
    var parentCap = result.getOutput();

    var parentAltId = String(parentCap.capModel.altID); //parentCap.getCapID().getCustomID();
    Avo_LogDebug("Parent(" + parentAltId + ")", 2);  //debug

    var capTypeModel = parentCap.capType;
    var recordType = String(capTypeModel);
    Avo_LogDebug("Parent Record Type(" + recordType + ")", 2); //debug


    var children = getChildren("Building/Revision/*/*", parentCapId)
    logDebug("Number of revision records: " + children.length);

    var index = children.length;
    var updatedAltId = parentAltId.replace("BLD", "REV") + "-" + ZeroPadNumber(index);
    logDebug("Replacing altID to " + updatedAltId);

    var result = aa.cap.updateCapAltID(capId, updatedAltId);

    Avo_LogDebug("Record ID has been updated to " + updatedAltId, 1);
}

