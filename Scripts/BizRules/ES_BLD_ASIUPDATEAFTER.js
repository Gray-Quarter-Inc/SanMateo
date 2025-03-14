/*
Subscript Name: ES_BLD_ASIUPDATEAFTER.js
Converted from Std Choice: ES_BLD_ASIUpdateAfter
Called From Scripts:
ApplicationSpecificInfoUpdateAfter
 */

if (appMatch('*/Stop Work Notice/*/*') && isTaskActive('Complaint Received') && AInfo['Origin'] == 'Field Inspection') {
    loopTask('Complaint Received', 'In Violation', 'Updated by Script', 'Updated by Script');
}

if (AInfo['Percent Value'] > 50) {
    updateFee('B022', 'B_BLD', 'FINAL', 1, 'N');
    editAppSpecific('Other Housing Fees', '752');
}

if (AInfo['Percent Value'] > 50 && !appHasCondition('Valuation', null, '50 Percent Valuation Rule Applies', null)) {
    addStdCondition('Valuation', '50 Percent Valuation Rule Applies');
}

if (AInfo['Percent Value'] > 50 && !isScheduled('901 Building Final')) {
    scheduleInspection('901 Building Final', 5, 'null', 'null', 'null');
}

if (!appMatch('*/OTC/*/*')) {
    updateShortNotes(AInfo['Project Type']);
}

if (appMatch('*/Full Review/*/*') && capName == 'null') {
    editAppName(getAppSpecific('Project Type'));
}

if (appMatch('*/Full Review/*/*') && feeExists('B002', 'NEW')) {
    editAppSpecific('State Building Permit Fee', feeAmount('B002', 'NEW'));
}

if (appMatch('*/*/HVAC/*') && AInfo['Ducts'] == 'CHECKED' && !feeExists('B078', 'NEW', 'INVOICED')) {
    updateFee('B078', 'B_HVAC', 'FINAL', 1, 'N');
}

applevel3 = aa.env.getValue('ApplicationTypeLevel3');
comment('The App Type Level 3 is : ' + applevel3);
// test to see if the app type level 3 is available;
if (appMatch('*/*/Sewer Line/*') && AInfo['Public Right of Way'] == 'CHECKED' && !isScheduled('Final by Public Works')) {
    scheduleInspection('Final by Public Works', 365, null, null, 'Scheduled by Script');
}

if (appMatch('*/*/Sewer Line/*') && AInfo['City Cleanout'] == 'CHECKED' && !isScheduled('Final by Sewer')) {
    scheduleInspection('Final by Sewer', 365, null, null, 'Scheduled by Script');
}
