/*
Subscript Name: ES_BLD_WORKFLOWTASKUPDATEBEFORE.js
Converted from Std Choice: ES_BLD_WorkflowTaskUpdateBefore
Called From Scripts:
WorkflowTaskUpdateBefore
 */

if (appMatch('*/Full Review/*/*') && matches(wfStatus, 'Finaled', 'Final Certificate of Occupancy') && (!isScheduled('901 Building Final') || isScheduled('901 Building Final')) && !checkInspectionResult('901 Building Final', 'Pass')) {
    showMessage = true;
    comment('<font size=small><b>Building Final Inspection:</b></font><br><br>This record cannot be finaled until a 901 Building Final inspection has been resulted with a disposition of Pass.<br><br>');
    cancel = true;
}

if (matches(wfStatus, 'Finaled', 'Permit Finaled') && appHasCondition(null, null, null, 'Required')) {
    comment('<font size=small><b>Required Condition:</b></font><br><br>This record has a required condition that must be resolved before the permit can be finaled.<br><br>');
    cancel = true;
}

if (AInfo['School Fees Required'] == 'CHECKED' && AInfo['School Fees Paid'] != 'CHECKED' && wfStatus == 'Issued') {
    showMessage = true;
    comment('<font size=small><b>School Fees Required</b></font><br><br>School Fees have not been paid. Please check Details TAB to verify School Fees Paid field.<br><br>');
    cancel = true;
}

if (AInfo['Fire Sprinkler Plan Required'] == 'CHECKED' && AInfo['Fire Sprinkler Issued'] != 'CHECKED' && wfStatus == 'Issued') {
    showMessage = true;
    comment('<font size=small><b>Fire Sprinker issued is Required before permit is issued</b></font><br><br>Please check Details TAB to verify Fire Sprinkler is issued.<br><br>');
    cancel = true;
}

if (AInfo['Grading Permit Required'] == 'CHECKED' && AInfo['Grading Permit Issued'] != 'CHECKED' && wfStatus == 'Issued') {
    showMessage = true;
    comment('<font size=small><b>Grading Permit issued is Required before permit is issued</b></font><br><br>Please check Details TAB to verify Grading permit is Issued.<br><br>');
    cancel = true;
}
