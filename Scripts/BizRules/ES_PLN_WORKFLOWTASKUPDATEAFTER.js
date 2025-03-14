/*
Subscript Name: ES_PLN_WORKFLOWTASKUPDATEAFTER.js
Converted from Std Choice: ES_PLN_WorkflowTaskUpdateAfter
Called From Scripts:
WorkflowTaskUpdateAfter
 */

if (appMatch('Planning/Amnesty/*/*') && wfTask == 'Application Submittal' && wfStatus == 'Incomplete') {
    var tasks = aa.workflow.getTask(capId, wfTask).getOutput();
    if (tasks.getDispositionComment())
        params.put('$$TASKCOMMENT$$', tasks.getDispositionComment());
    else
        params.put('$$TASKCOMMENT$$', 'No Comments');
    sendAmnestyEmailNotification('AMNESTY INCOMPLETE SUBMITTAL');
}

if (appMatch('Planning/Amnesty/*/*') && wfTask == 'Review Consolidation' && wfStatus == "Resubmittal Req'd") {
    var tasks = aa.workflow.getTask(capId, wfTask).getOutput();
    if (tasks.getDispositionComment())
        params.put('$$TASKCOMMENT$$', tasks.getDispositionComment());
    else
        params.put('$$TASKCOMMENT$$', 'No Comments');
    sendAmnestyEmailNotification('AMNESTY RESUBMITTAL REQUIRED');
}

if (appMatch('Planning/Amnesty/*/*') && wfTask == 'Review Consolidation' && wfStatus == 'Approved') {
    if (balanceDue > 0)
        params.put('$$FEES$$', 'Total balance due: $' + balanceDue);
    else
        params.put('$$FEES$$', 'No fees due');
    sendAmnestyEmailNotification('AMNESTY READY TO PROCEED');
}

if (appMatch('Planning/Amnesty/*/*') && wfTask == 'Ready to Proceed' && wfStatus == 'Final Fees Assessment') {
    if (balanceDue > 0)
        params.put('$$FEES$$', 'Total balance due: $' + balanceDue);
    else
        params.put('$$FEES$$', 'No fees due');
    sendAmnestyEmailNotification('AMNESTY OUTSTANDING FEES');
}

if (appMatch('Planning/Amnesty/*/*') && wfTask == 'Ready to Proceed' && wfStatus == 'Approval to Proceed Issued') {
    sendAmnestyEmailNotification('AMNESTY PERMISSION TO PROCEED');
}

if (appMatch('Planning/Amnesty/*/*') && wfTask == 'Ready to Proceed' && wfStatus == 'Generate Notice') {
    var numDaysToComplete = AInfo['Application - # of Days to Complete'];
    var projectDueDate = dateAdd(null, numDaysToComplete);
    editAppSpecific('Project End Date', projectDueDate);
}

if (appMatch('Planning/Amnesty/*/*') && wfTask == 'Ready to Proceed' && wfStatus == 'Generate Notice') {
    var reportParams = aa.util.newHashMap();
    reportParams.put('RECORD_ID', capIDString);
    generateReport(capId, 'Amnesty Notice - Permission to Proceed', 'Planning', reportParams);
}
