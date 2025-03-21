/*
Subscript Name: ES_WM_WORKFLOWTASKUPDATEAFTER.js
Converted from Std Choice: ES_WM_WorkflowTaskUpdateAfter
Called From Scripts:
WorkflowTaskUpdateAfter
*/


emailAddress = '';
t2 ="You can visit us at http://www.recycleworks.org/con_dem/index.html for more information on C&D recycling or check out this great guide for information on where to properly dispose of your items http://www.recycleworks.org/pdf/CD_office_guide.pdf.";
if (appMatch('WasteMgmt/*/*/*')) {
	contacts = aa.people.getCapContactByCapID(capId).getOutput();
	for(yy in contacts)if(contacts[yy].getCapContactModel().getPeople().getContactType()=='Waste Plan Contact')emailAddress=''+contacts[yy].getEmail();
	}

if (appMatch('WasteMgmt/Management Final/NA/NA') && matches(wfStatus,'Approved','Citizen Reviewed and Approved')&& emailAddress) {
	sendEmailwAttchmnt('noreply@smcgov.com',emailAddress,'','Waste Management Plan Approved',"Thank you for using our RecycleWorks Waste Management Plan online site.<br><br>Your project's Section 2 Waste Management Plan ("+capIDString+") has been approved. Please find attached the electronic copy of your project's Section 2 report. Your project can now be finalized by the County's Building Department. Please contact the Building Department for more information and next steps.<br><br>If you have any questions about the Waste Management Plan, please contact the C&D Program Coordinator at sustainability@smcgov.org or call at (650) 599-1498.",'WM Plan','RecordID',capIDString,'','');
	}

if (appMatch('WasteMgmt/Management Plan/NA/NA') && matches(wfStatus,'Reviewed with Comments','Additional Revision Required') && emailAddress) {
	sendEmailwAttchmnt('sustainability@smcgov.org',emailAddress,'','Submitted Waste Management Plan '+capIDString+' Needs Modification','Your Waste Management Plan has been reviewed with the following comments.<br><br>Comments: '+wfComment+'<br><br>Please reply to this email with your responses or call us at (650) 599-1498','WM Plan Section 1','RecordID',capIDString,'','');
	}

if (appMatch('WasteMgmt/Management Plan/NA/NA') && matches(wfStatus,'Approved') && emailAddress) {
	sendEmailwAttchmnt('noreply@smcgov.com',emailAddress,'','Waste Management Plan Approved',"Thank you for using our RecycleWorks Waste Management Plan online site.<br><br>Your project+'s Section 1 Waste Management Plan ("+capIDString+") has been approved. Please find attached the electronic copy of your project's Section 1 report.<br><br>Along with a completed Section 2 of the Waste Management Plan, please be sure to save your receipts, photos, letters or other documentation of construction & demolition (C&D) materials diverted or disposed, as proof that your project has met the County's waste management requirement prior to your final inspection.<br><br>"+t2+'<br><br>If you have any questions please contact the C&D Program Coordinator at sustainability@smcgov.orgor call at (650) 599-1498.','WM Plan','RecordID',capIDString,'','');
	comment('Send To '+emailAddress);
	}

if (appMatch('WasteMgmt/Management Plan/NA/NA') && matches(wfStatus,'Approved')) {
	include('ES_WM_UPD_BLD_WF'); /* replaced branch(ES_WM_UPD_BLD_WF) */
	}

if (appMatch('WasteMgmt/Management Final/NA/NA') && matches(wfStatus,'Approved')) {
	include('ES_WM_UPDATEPARENTINSPECTION'); /* replaced branch(ES_WM_UpdateParentInspection) */
	}

