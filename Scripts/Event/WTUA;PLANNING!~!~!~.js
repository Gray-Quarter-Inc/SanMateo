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
   var primaryEmail = "";
    var primaryContactName = "";
    var capContactResult = aa.people.getCapContactByCapID(capId);
    if (capContactResult.getSuccess()) {
        var capContactArray = capContactResult.getOutput();
  
        for (var contact in capContactArray){
            var thisContact = capContactArray[contact].getPeople();
            if(thisContact.flag == 'Y' ){
                primaryEmail = thisContact.email;
                primaryContactName = thisContact.getFirstName() + " " + thisContact.getLastName();
            }
        }
    }
    var asyncParams = aa.util.newHashMap();
    addParameter(asyncParams, "vEmailTemplate", "P_DEEMED_COMPLETE");
    addParameter(asyncParams, "vAltId", altID);
    addParameter(asyncParams, "vToEmail", "ALLCONTACTS");
    addParameter(asyncParams, "vwfComment",wfComment);
    //addParameter(asyncParams, "vContactType", "Applicant");
    addParameter(asyncParams, "vContactName", primaryContactName);
    addParameter(asyncParams, "vReportModule", "Planning");
    addParameter(asyncParams, "vReportName", "");
    addParameter(asyncParams, "vReportAltId", altID);
    aa.runAsyncScript("ASYNC_SEND_EMAIL", asyncParams);
    
}
if((wfTask == "Application Submittal") && matches(wfStatus,"Deemed Incomplete","Additional Info Required")) {
    comment('**Sending email P_INCOMPLETE**');
    var altID = capId.getCustomID();
   var primaryEmail = "";
    var primaryContactName = "";
    var capContactResult = aa.people.getCapContactByCapID(capId);
    if (capContactResult.getSuccess()) {
        var capContactArray = capContactResult.getOutput();
  
        for (var contact in capContactArray){
            var thisContact = capContactArray[contact].getPeople();
            if(thisContact.flag == 'Y' ){
                primaryEmail = thisContact.email;
                primaryContactName = thisContact.getFirstName() + " " + thisContact.getLastName();
            }
        }
    }
    var asyncParams = aa.util.newHashMap();
    addParameter(asyncParams, "vEmailTemplate", "P_INCOMPLETE");
    addParameter(asyncParams, "vAltId", altID);
    addParameter(asyncParams, "vToEmail", "ALLCONTACTS");
    addParameter(asyncParams,"$$wfComment$$", wfComment);
    //addParameter(asyncParams, "vContactType", "Applicant");
    addParameter(asyncParams, "vContactName", primaryContactName);
    addParameter(asyncParams, "vReportModule", "Planning");
    addParameter(asyncParams, "vReportName", "");
    addParameter(asyncParams, "vReportAltId", altID);
    aa.runAsyncScript("ASYNC_SEND_EMAIL", asyncParams);
    
}

if (appMatch("Planning/Pre Application/NA/NA") && wfTask == "Public Workshop" && wfStatus == "Workshop Held") {
    var asyncParams = aa.util.newHashMap();
    addParameter(asyncParams, "vEmailTemplate", "P_PUBLIC_WORKSHOP_SUMMARY");
    addParameter(asyncParams, "vAltId", capId.getCustomID());
    addParameter(asyncParams, "vContactType", "Applicant");
    addParameter(asyncParams, "vDocumentType", "Public Workshop Summary");
    aa.runAsyncScript("ASYNC_SEND_EMAIL", asyncParams);
}

