function setBldExpDateOnStatus(capId, wfProcess, wfTask, wfStatus, wfDateMMDDYYYY) {
    var altId = aa.cap.getCap(capId).getOutput().capModel.altID;
    Avo_LogDebug("setBldExpDateOnStatus(" + altId + ", " + wfProcess + ", " + wfTask + ", " + wfStatus + ", " + wfDateMMDDYYYY + ")", 1);

    if (wfStatus != "Issued") {
        Avo_LogDebug('Status is invalid', 1);
        return;
    }

    wfProcess = String(wfProcess);

    switch (wfProcess) {
        case "B_OTC":
            if (wfTask != "Application Submittal") {
                Avo_LogDebug('"Application Submittal" task is invalid', 1);
                return;
            }

            break;

        case "B_PERMIT":
        case "B_PHOTO":
            if (wfTask != "Ready to Issue") {
                //if (wfTask != "Ready to Issue" && wfTask != "Ready To Issue") {
                Avo_LogDebug('"Ready to Issue" task is invalid', 1);
                return;
            }

            break;

        default:
            Avo_LogDebug("Invalid workflow", 1);
            return;
    }

    var dateArr = String(wfDateMMDDYYYY).split("/");
    var statusDate = new Date(dateArr[2], parseInt(dateArr[0], 10) - 1, dateArr[1]);
    Avo_LogDebug("Status Date(" + aa.util.formatDate(statusDate, "MM/dd/yyyy") + ")", 2);   //debug

    var expDate = new Date(statusDate.getTime());
    expDate.setFullYear(expDate.getFullYear() + 1);

    // Check status history
    var initialStatus = true;

    var result = aa.cap.getStatusHistoryByCap(capId, "APPLICATION", aa.util.newQueryFormat());
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get status history. " + result.errorType + ': ' + result.errorMessage, 1);
    } else {
        var statusHistory = result.getOutput();
        for (var i in statusHistory) {
            var statusModel = statusHistory[i];

            var status = statusModel.status;
            Avo_LogDebug("Status(" + status + ")", 2);

            if (status != "Issued") {
                continue;
            }

            if (initialStatus == true) {
                initialStatus = false;
                continue;
            }

            expDate = new Date(statusDate.getTime());
            expDate.setMonth(expDate.getMonth() + 6);
            break;
        }
    }

    expDate = aa.util.formatDate(expDate, "MM/dd/yyyy");
    Avo_LogDebug("Exp Date(" + expDate + ")", 2);   //debug

    editAppSpecific("Expiration Date", expDate, capId);
    Avo_LogDebug("Set Expiration Date to " + expDate, 1);
}
