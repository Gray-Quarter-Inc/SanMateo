/*******************************************************
| Script/Function: reinstatement(ID376)
| Created by: Nicolaj Bunting
| Created on: 13Sep21
| Usage: When fees are paid If number of paid fees "BLD_085" from schedule "BLD_GEN" > ASI "Reinstatement limit" Then set ASI to number
| of paid fees, close task "Ready to Issue Permit" with status "Permit Re-Issued", activate task "Inspections" and update with status 
| "Reinstatement", set ASI "Date of Expiration" to 180 days from today, set ASI "Date of Reinstatement" to today's date
| Modified by: ()
*********************************************************/
(function () {
    var limit = parseInt(getAppSpecific("Reinstatement limit", capId), 10);
    Avo_LogDebug("Limit(" + limit + ")", 2);    //debug

    if (limit >= 2) {
        return;
    }

    // Check task statuses
    var issTaskName = "Ready to Issue Permit";
    var issStatus = "Permit Re-Issued";

    var inspTaskName = "Inspections";
    var inspStatus = "Reinstatement";

    // Get BLD_085, BLD_086 fees and payments
    var allFees = new Object();
    var feeItems = aa.fee.getFeeItems(capId).getOutput();
    for (var i in feeItems) {
        var feeAmount = feeItems[i].fee;
        var feeId = feeItems[i].feeSeqNbr;

        var feeSched = feeItems[i].f4FeeItemModel.feeSchudle;
        Avo_LogDebug("Fee Sched(" + feeSched + ")", 2); //debug

        if (feeSched != "BLD_GEN") {
            continue;
        }

        var feeCode = feeItems[i].feeCod;
        Avo_LogDebug(feeId + " " + feeCode + "($" + feeAmount + ")", 2);    //debug

        if (feeCode != "BLD_085") {
            continue;
        }

        allFees[feeId] = feeAmount;
    }

    if (Object.keys(allFees).length == 0) {
        Avo_LogDebug('BLD_085 has not been added to record', 1);
        return;
    }

    var paymentItems = aa.finance.getPaymentFeeItems(capId, null).getOutput();
    for (var i in paymentItems) {
        var feeIdToCheck = paymentItems[i].feeSeqNbr;
        Avo_LogDebug("Payment Fee ID(" + feeIdToCheck + ")", 2);    //debug

        var paidAmount = paymentItems[i].feeAllocation;

        if (!(feeIdToCheck in allFees)) {
            continue;
        }

        var feeAmount = allFees[feeIdToCheck];
        Avo_LogDebug("Fee($" + feeAmount + "), Paid($" + paidAmount + ")", 2);    //debug

        allFees[feeIdToCheck] = feeAmount - paidAmount;
    }

    var totalPaid = 0;
    for (var feeId in allFees) {
        var feeAmount = allFees[feeId];
        Avo_LogDebug("Fee Balance($" + feeAmount + ")", 2);    //debug

        if (feeAmount > 0) {
            continue;
        }

        totalPaid++;
    }

    Avo_LogDebug("Total Paid(" + totalPaid + ")", 2);   //debug

    if (totalPaid <= limit) {
        return;
    }

    editAppSpecific("Reinstatement limit", totalPaid, capId);

    // Update workflow
    var taskName = issTaskName;
    var success = activateTask(taskName);
    if (success === false) {
        Avo_LogDebug('Failed to activate task "' + taskName + '"', 1);
        return;
    }

    Avo_LogDebug('Activated task "' + taskName + '"', 1);

    var status = issStatus;
    success = closeTask(taskName, status, "Closed by ID376 reinstatement", "");
    if (success === false) {
        Avo_LogDebug('Failed to close task "' + taskName + '" with status of "' + status + '"', 1);
        return;
    }

    Avo_LogDebug('Closed task "' + taskName + '" with status of "' + status + '"', 1);

    taskName = inspTaskName;
    success = activateTask(taskName);
    if (success === false) {
        Avo_LogDebug('Failed to activate task "' + taskName + '"', 1);
        return;
    }

    Avo_LogDebug('Activated task "' + taskName + '"', 1);

    var taskObj = aa.workflow.getTask(capId, taskName).getOutput();
    var processCode = taskObj.processCode;
    Avo_LogDebug("Process(" + processCode + ")", 2);    //debug

    status = inspStatus;
    var success = updateTask(taskName, status, "Updated by by ID376 reinstatement", "", processCode, capId);
    if (success === false) {
        Avo_LogDebug('Failed to update task "' + taskName + '" with status of "' + status + '"', 1);
        return;
    }

    Avo_LogDebug('Updated task "' + taskName + '" with status of "' + status + '"', 1);

    // Update exp and reinstatement dates
    var halfYearFromNow = Avo_GetToday();
    halfYearFromNow.setDate(halfYearFromNow.getDate() + 180);

    var halfYearFromNowStr = aa.util.formatDate(halfYearFromNow, "MM/dd/yyyy");
    Avo_LogDebug("Half Year from Now(" + halfYearFromNowStr + ")", 2);   //debug

    editAppSpecific("Date of Expiration", halfYearFromNowStr, capId);

    var todayStr = aa.util.formatDate(new Date(), "MM/dd/yyyy");
    editAppSpecific("Date of Reinstatement", todayStr, capId);
})();