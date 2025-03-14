/*
Script Name: WorkflowTaskUpdateAfter.js
Converted from Std Choice: WorkflowTaskUpdateAfter
 */

if (appMatch('Building/*/*/*') && !appMatch('Building/Residential/*/*')) {
    include('ES_BLD_WORKFLOWTASKUPDATEAFTER'); /* replaced branch(ES_BLD_WorkflowTaskUpdateAfter) */
}

if (appMatch('Planning/*/*/*')) {
    include('ES_PLN_WORKFLOWTASKUPDATEAFTER'); /* replaced branch(ES_PLN_WorkflowTaskUpdateAfter) */
}

if (appMatch('PublicWorks/*/*/*')) {
    include('ES_PW_WORKFLOWTASKUPDATEAFTER'); /* replaced branch(ES_PW_WorkflowTaskUpdateAfter) */
}

if (appMatch('RealProperty/*/*/*')) {
    include('ES_RP_WORKFLOWTASKUPDATEAFTER'); /* replaced branch(ES_RP_WorkflowTaskUpdateAfter) */
}

if (appMatch('WasteMgmt/*/*/*')) {
    include('ES_WM_WORKFLOWTASKUPDATEAFTER'); /* replaced branch(ES_WM_WorkflowTaskUpdateAfter) */
}

if (wfStatus == 'Cancelled') {
    taskCloseAllExcept('Cancelled', 'Cancelled by script');
}

if (appMatch('Planning/Project/*/*') && wfTask == 'Project Analysis' && (wfStatus == 'Deemed Complete' || wfStatus == 'Deemed Incomplete') && balanceDue > 0) {
    showMessage = true;
    comment('There is a balance owing of $' + balanceDue + ' on this record');
}

if (appMatch('Planning/Project/*/*') && wfTask == 'Required Advisory Committee' && (wfStatus == 'Letter of Decision' || wfStatus == 'No Advisory Committee Required' || wfStatus == 'Recommend Approval' || wfStatus == 'Recommend Denial') && balanceDue > 0) {
    showMessage = true;
    comment('There is a balance owing of $' + balanceDue + ' on this record');
}
