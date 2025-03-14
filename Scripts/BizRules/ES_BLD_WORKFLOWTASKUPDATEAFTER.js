/*
Subscript Name: ES_BLD_WORKFLOWTASKUPDATEAFTER.js
Converted from Std Choice: ES_BLD_WorkflowTaskUpdateAfter
Called From Scripts:
WorkflowTaskUpdateAfter
 */

if (matches(wfStatus, 'Issued')) {
    setBldExpDateOnStatus(capId, wfProcess, wfTask, wfStatus, wfDateMMDDYYYY);
    aa.sendMail('noreply@smcgov.org', 'PI_Test@avocette.com', '', 'setBldExpDateOnStatus', debug);
}

if (matches(wfStatus, 'Revision Issued', 'Revisions', 'Reinstatement', 'Revision', 'Expired Permit Reinstated') && AInfo['Never Expires'] == null) {
    editAppSpecific('Expiration Date', dateAdd(wfDateMMDDYYYY, 181));
}

if (matches(wfStatus, '30 Day Extension') && AInfo['Never Expires'] == null) {
    editAppSpecific('Expiration Date', dateAdd(wfDateMMDDYYYY, 31));
}

if (matches(wfStatus, '90 Day Extension') && AInfo['Never Expires'] == null) {
    editAppSpecific('Expiration Date', dateAdd(wfDateMMDDYYYY, 91));
}

if (matches(wfStatus, '180 Day Extension') && AInfo['Never Expires'] == null) {
    editAppSpecific('Expiration Date', dateAdd(wfDateMMDDYYYY, 181));
}

if (appMatch('*/Full Review/*/*') && matches(wfStatus, 'Issued') && AInfo['Waste Management Plan'] != 'Not Required' && !isScheduled('Final by Waste Management')) {
    scheduleInspection('Final by Waste Management', 3650, null, null, 'Scheduled by Script when permit is issued');
}

if (appMatch('*/*/Reroof/*') && wfStatus == 'Review by Planning') {
    email('onlinepermit@smcgov.org', 'noreply@accela.com', 'Reroof Review by Planning', 'The following Reroof record has the workflow status of Review by Planning, ' + capIDString + '.');
}

if (appMatch('*/*/Windows or Doors Size for Size/*') && wfStatus == 'Review by Planning') {
    email('onlinepermit@smcgov.org', 'noreply@accela.com', 'Windows or Doors Review by Planning', 'The following Windows or Doors record has the workflow status of Review by Planning, ' + capIDString + '.');
}

if (appMatch('*/*/Siding or Stucco/*') && wfStatus == 'Siding or Stucco Review by Planning') {
    email('onlinepermit@smcgov.org', 'noreply@accela.com', 'Review by Planning', 'The following Siding or Stucco record has the workflow status of Review by Planning, ' + capIDString + '.');
}

if (appMatch('*/OTC/*/*') && capStatus == 'Issued') {
    include('ES_SEND_APPLICATION_EMAIL'); /* replaced branch(ES_SEND_APPLICATION_EMAIL) */
}

if (appMatch('*/*/Residential/*') && wfStatus == 'Approved' && !isTaskActive('Building') && !isTaskActive('Planning')) {
    theCapAddress = getCapAddress(capId);
    emailContact('Permit ' + capIDString + ' is ready to Issue', 'You are a contact on permit ' + capIDString + ' at address ' + theCapAddress + '. Your permit is ready for issue and download via our online Permit Center (https://aca-prod.accela.com/smcgov/Default.aspx). You may now begin work and schedule inspections. Building Counter (650) 599-7310');
}

if (matches(wfStatus, 'Change of Scope Received', 'Resubmittal Received') && AInfo['ResubmittalNo'] != null) {
    nextSub = parseInt(AInfo['ResubmittalNo']) + 1;
    editAppSpecific('ResubmittalNo', nextSub);
    updateAppStatus('Resubmittal ' + nextSub, 'Change of scope or resubmittal received');
}

if (matches(wfStatus, 'Change of Scope Received', 'Resubmittal Received') && AInfo['ResubmittalNo'] == null) {
    editAppSpecific('ResubmittalNo', 1);
    updateAppStatus('Resubmittal 1', 'Change of scope or resubmittal received');
}

if (matches(wfStatus, 'Change of Scope Received', 'Resubmittal Received') && isTaskActive('Building Review')) {
    updateTask('Building Review', 'Building Resubmittal ' + AInfo['ResubmittalNo'] + ' Received', 'Task status updated by script', '');
    setTask('Building Review', 'N', 'Y');
    setTask('Resubmittal or Revision', 'Y', 'N');
}

if (matches(wfStatus, 'Change of Scope Received', 'Resubmittal Received') && isTaskActive('Planning Review')) {
    setTask('Planning Review', 'N', 'N');
}

if (matches(wfStatus, 'Change of Scope Received', 'Resubmittal Received') && isTaskActive('Fire Review')) {
    setTask('Fire Review', 'N', 'N');
}

if (matches(wfStatus, 'Change of Scope Received', 'Resubmittal Received') && isTaskActive('Environmental Health Review')) {
    setTask('Environmental Health Review', 'N', 'N');
}

if (matches(wfStatus, 'Change of Scope Received', 'Resubmittal Received') && isTaskActive('Public Works Review')) {
    setTask('Public Works Review', 'N', 'N');
}

if (matches(wfStatus, 'Change of Scope Received', 'Resubmittal Received') && isTaskActive('Sewer Review')) {
    setTask('Sewer Review', 'N', 'N');
}

if (matches(wfStatus, 'Change of Scope Received', 'Resubmittal Received') && isTaskActive('Misc Agency Review')) {
    setTask('Misc Agency Review', 'N', 'N');
}

if (matches(wfStatus, 'Change of Scope Received', 'Resubmittal Received') && isTaskActive('Water District Review')) {
    setTask('Water District Review', 'N', 'N');
}

if (matches(wfStatus, 'Change of Scope Received', 'Resubmittal Received') && isTaskActive('Geotechnical Review')) {
    setTask('Geotechnical Review', 'N', 'N');
}

if (wfTask == 'Inspections' && wfStatus == 'Revision' && AInfo['RevisionNo'] != null) {
    nextRev = parseInt(AInfo['RevisionNo']) + 1;
    editAppSpecific('RevisionNo', nextRev);
    loopTask('Inspections', 'Revision ' + AInfo['RevisionNo'], 'Revision received', 'Task status updated by script');
    updateAppStatus('Revision ' + nextRev, 'Revision received');
    editAppSpecific('ResubmittalNo', 0);
}

if (wfTask == 'Inspections' && wfStatus == 'Revision' && AInfo['RevisionNo'] == null) {
    editAppSpecific('RevisionNo', 1);
    loopTask('Inspections', 'Revision ' + AInfo['RevisionNo'], 'Revision received', 'Task status updated by script');
    updateAppStatus('Revision 1', 'Revision received');
    editAppSpecific('ResubmittalNo', 0);
}
