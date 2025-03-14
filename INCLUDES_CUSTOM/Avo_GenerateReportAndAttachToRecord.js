function Avo_GenerateReportAndAttachToRecord(itemCap, reportName, module, parameters) {
    var altId = aa.cap.getCap(itemCap).getOutput().getCapModel().altID;
    Avo_LogDebug("Avo_GenerateReportAndAttachToRecord(" + altId + ", " + reportName + ", " + module + ", " + parameters.toString() + ")", 1);
    //returns the report file which can be attached to an email.
    var user = currentUserID;   // Setting the User Name
    var result = aa.reportManager.getReportInfoModelByName(reportName);
    if (result.getSuccess() != true) {
        Avo_LogDebug('Failed to get report "' + reportName + '". ' + result.errorType + ":" + result.errorMessage, 1);
        return false;
    }

    var report = result.getOutput();

    report.setModule(module);
    // Note: Changed this to use the capId instead of the altId because the adhoc report will not attach to the record otherwise. 
    // Question: Will SSRS reports use the capId or the altId?
    report.setCapId(itemCap.getID1() + "-" + itemCap.getID2() + "-" + itemCap.getID3());
    report.getEDMSEntityIdModel().setAltId(itemCap.getCustomID());
    report.setReportParameters(parameters);

    var permit = aa.reportManager.hasPermission(reportName, user);
    if (!permit.getOutput().booleanValue()) {
        Avo_LogDebug("You have no permission.", 1);
        return false;
    }

    var reportResult = aa.reportManager.getReportResult(report);
    if (!reportResult || reportResult.getSuccess() != true) {
        Avo_LogDebug("System failed get report: " + reportResult.errorType + ": " + reportResult.errorMessage, 1);
        return false;
    }

    reportOutput = reportResult.getOutput();
    if (!reportOutput) {
        return false;
    }

    Avo_LogDebug("Filename(" + reportOutput.name + ")", 2);	//debug
    return reportOutput.name;
}

/*******************************************************
| Script/Function: Avo_GetAllParentsOfType([recordType], [recordId])
| Created by: Nicolaj Bunting
| Created on: 18Apr18
| Usage: Convert an Accela formatted date string into a js date object
| Modified by: ()
*********************************************************/
