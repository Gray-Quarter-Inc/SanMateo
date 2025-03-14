function setBldExpDateOnInspPass(capId, inspResultArr, inspIdArr) {
    var altId = aa.cap.getCap(capId).getOutput().capModel.altID;
    Avo_LogDebug("setBldExpDateOnInspPass(" + altId + ", " + inspResultArr + ", " + inspIdArr + ")", 1);

    for (var i = 0; i < inspResultArr.length; i++) {
        var inspResult = inspResultArr[i];
        Avo_LogDebug("Result(" + inspResult + ")", 2);  //debug

        if (inspResult != "Pass") {
            continue;
        }

        var inspId = inspIdArr[i];
        Avo_LogDebug("Insp ID(" + inspId + ")", 2); //debug

        var result = aa.inspection.getInspection(capId, inspId);
        if (result.getSuccess() != true) {
            Avo_LogDebug("Failed to get Inspection " + inspId + ". " + result.errorType + ": " + result.errorMessage, 1);
            continue;
        }

        var inspection = result.getOutput();
        var inspStatusDate = new Date(inspection.inspectionStatusDate.epochMilliseconds);	// Date inspection resulted
        Avo_LogDebug("Insp Status Date(" + aa.util.formatDate(inspStatusDate, "MM/dd/yyyy") + ")");    //debug

        var expDate = new Date(inspStatusDate.getTime());
        expDate.setMonth(expDate.getMonth() + 6);

        var expDateStr = aa.util.formatDate(expDate, "MM/dd/yyyy");
        Avo_LogDebug("Exp Date(" + expDateStr + ")", 2);   //debug

        editAppSpecific("Expiration Date", expDateStr, capId);
        Avo_LogDebug("Set Expiration Date to " + expDateStr, 1);
    }
}
/*******************************************************
| Script/Function: setBldExpDateOnStatus(capId, wfProcess, wfTask, wfStatus, wfDateMMDDYYYY)
| Created by: Nicolaj Bunting
| Created on: 21Feb19
| Usage: If record status is set to "Issued" for the first time Then set ASI "Expiration Date" to 1 year from status date
| Else set expiration date to 6 months from status date
| Modified by: ()
*********************************************************/
