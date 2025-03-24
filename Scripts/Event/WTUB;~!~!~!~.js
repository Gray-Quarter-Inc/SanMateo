/*
Script Name: WorkflowTaskUpdateBefore.js
Converted from Std Choice: WorkflowTaskUpdateBefore
 */

if (matches(wfStatus, 'Issued', 'Re-Issue', 'Finaled', 'Permit Issued', 'Revision Issued') && balanceDue > 0) {
    showMessage = true;
    comment('<font size=small><b>Balance Due:</b></font><br><br>There is a balance due for this Record. It cannot be issued or finaled until all fees are paid.<br><br>');
    cancel = true;
}

if (appMatch('Building/*/*/*') && !appMatch('Building/Residential/*/*')) {
    include('ES_BLD_WORKFLOWTASKUPDATEBEFORE'); /* replaced branch(ES_BLD_WorkflowTaskUpdateBefore) */
}
