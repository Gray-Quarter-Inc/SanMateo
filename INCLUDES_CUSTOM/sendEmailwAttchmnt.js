function sendEmailwAttchmnt(fromAddress, toAddress, ccAddress, reportSubject, reportContent, aaReportName, aaReportParamName, aaReportParamValue) {

    var reportName = aaReportName;

    report = aa.reportManager.getReportInfoModelByName(reportName);

    report = report.getOutput();

    report.setModule(appTypeArray[0]);

    report.setCapId(capId);

    var parameters = aa.util.newHashMap();   //Make sure the parameters includes some key parameters.  

    parameters.put(aaReportParamName, aaReportParamValue);

    report.setReportParameters(parameters);

    var permit = aa.reportManager.hasPermission(reportName, currentUserID);

    if (permit.getOutput().booleanValue()) {

        var reportResult = aa.reportManager.getReportResult(report);

        if (reportResult) {

            reportResult = reportResult.getOutput();

            var reportFile = aa.reportManager.storeReportToDisk(reportResult);

            reportFile = reportFile.getOutput();

            var sendResult = aa.sendEmail(fromAddress, toAddress, ccAddress, reportSubject, reportContent, reportFile);
        }

        if (sendResult.getSuccess())

            logDebug("A copy of this report has been sent to the valid email addresses.");

        else logDebug("System failed send report to selected email addresses because mail server is broken or report file size is great than 5M.");
    }

    else logDebug("No permission to report: " + reportName + " for Admin" + systemUserObj);
}
/*******************************************************
| Script/Function: setBldExpDateOnInspPass(capId)
| Created by: Nicolaj Bunting
| Created on: 21Feb19
| Usage: If the inspection result is "Pass" Then set ASI "Expiration Date" to 6 months from result date
| Modified by: ()
*********************************************************/
