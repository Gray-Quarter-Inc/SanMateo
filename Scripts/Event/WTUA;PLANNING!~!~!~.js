if((wfTask == "Application Submittal" && wfStatus=="Deemed Complete") || (wfTask == "Agency Referrals" && wfStatus == "Received Resubmittal")){
    comment('**Increment the Current Plan Review Cycle**');
    varX = parseInt(AInfo['Current Review Cycle']) + 1;
    editAppSpecific('Current Review Cycle', varX);
}
if (wfTask == "Agency Referrals" && wfStatus == "Route") {
    routeToExternalReviews();
    var currentPlanReview = AInfo["Current Review Cycle"]
    var wfObj = aa.workflow.getTasks(capId).getOutput();
	for (var i in wfObj) {
		var fTask = wfObj[i];
		if (fTask.getActiveFlag().equals("Y")) {
			resultWorkflowTask(fTask.getTaskDescription(),"Received Plan Submittal #" + currentPlanReview, "", "");
		}
	}
}
if(wfTask == "Project Analysis" && wfStatus == "Resubmittal Required") {
    updateTask("Agency Referrals", "Waiting for Resubmittal", "", "");
    }

if(wfTask == "Application Submittal" && wfStatus =="Deemed Complete") {
    comment('**Sending email P_DEEMED_COMPLETE**');
    var altID = capId.getCustomID();
    var asyncParams = aa.util.newHashMap();
    addParameter(asyncParams, "vEmailTemplate", "P_DEEMED_COMPLETE");
    addParameter(asyncParams, "vAltId", altID);
    addParameter(asyncParams, "vContactType", "Applicant");
    //addParameter(asyncParams, "vContactName", "Applicant");
    addParameter(asyncParams, "vReportModule", "Planning");
    addParameter(asyncParams, "vReportName", "");
    addParameter(asyncParams, "vReportAltId", altID);
    aa.runAsyncScript("ASYNC_SEND_EMAIL", asyncParams);
    
}

