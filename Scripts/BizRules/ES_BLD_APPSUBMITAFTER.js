/*
Subscript Name: ES_BLD_APPSUBMITAFTER.js
Converted from Std Choice: ES_BLD_AppSubmitAfter
Called From Scripts:
ApplicationSubmitAfter
 */

if (appMatch('Building/*/*/*')) {
    include('ES_BLD_UPD_ASI'); /* replaced branch(ES_BLD_UPD_ASI) */
}

if (appMatch('*/Stop Work Notice/*/*') && AInfo['Origin'] == 'Field Inspection') {
    loopTask('Complaint Received', 'In Violation', 'Updated by Script', 'Updated by Script');
}

if (!publicUser && appMatch('Building/*/*/*')) {
    include('ES_CSLB_AFTER'); /* replaced branch(ES_CSLB_AFTER) */
}

if (appMatch('*/*/Reroof/*')) {
    updateFee('B067', 'B_RERF', 'FINAL', parseInt(AInfo['Reroof Square Feet']), 'N');
}

if (appMatch('*/Full Review/*/*')) {
    addFee('082', 'B_BLD', 'FINAL', 1, 'N');
    //addFee('081','B_BLD','FINAL',1,'N');
}

if (appMatch('*/*/HVAC/*') && AInfo['Ducts'] == 'CHECKED' && !feeExists('B078', 'NEW', 'INVOICED')) {
    updateFee('B078', 'B_HVAC', 'FINAL', 1, 'Y');
}

applevel3 = aa.env.getValue('ApplicationTypeLevel3');
comment('The App Type Level 3 is : ' + applevel3);
if (appMatch('*/OTC/*/*') && capName == null) {
    updateShortNotes(applevel3);
    editAppName(getShortNotes());
}

if (appMatch('*/*/Sewer Line/*') && AInfo['Public Right of Way'] == 'CHECKED') {
    scheduleInspection('Final by Public Works', 365, null, null, 'Scheduled by Script');
}

if (appMatch('*/*/Sewer Line/*') && AInfo['City Cleanout'] == 'CHECKED') {
    scheduleInspection('Final by Sewer', 365, null, null, 'Scheduled by Script');
}

if (appMatch('*/*/HVAC/*') && AInfo['Select Type'] == 'Furnace' && !feeExists('B035', 'NEW', 'INVOICED')) {
    addFee('B035', 'B_HVAC', 'FINAL', 1, 'Y');
}

if (appMatch('*/*/HVAC/*') && AInfo['Select Type'] == 'HVAC' && !feeExists('B039', 'NEW', 'INVOICED')) {
    addFee('B039', 'B_HVAC', 'FINAL', 1, 'Y');
}

if (appMatch('*/*/HVAC/*') && AInfo['Select Type'] == 'AC' && !feeExists('B031', 'NEW', 'INVOICED')) {
    addFee('B031', 'B_HVAC', 'FINAL', 1, 'Y');
}

if (appMatch('*/*/Residential/*') && !feeExists('B061', 'NEW', 'INVOICED')) {
    addFee('B061', 'B_BLD', 'FINAL', 1, 'Y');
    addFee('B002', 'B_BLD', 'FINAL', 1, 'Y');
}

if (appMatch('*/Photovoltaic/*/*') && AInfo['Upgrade Subpanel less than 300amps'] == 'Yes') {
    addFee('B014A', 'B_BLD', 'FINAL', 1, 'N');
    addFee('B001', 'B_MANUAL', 'FINAL', 29, 'N');
    addFee('B003', 'B_MANUAL', 'FINAL', 5, 'N');
}

if (appMatch('*/Photovoltaic/*/*') && AInfo['Is there an electric service upgrade that less than 300amp?'] == 'Yes') {
    addFee('B014', 'B_BLD', 'FINAL', 1, 'N');
    addFee('B001', 'B_MANUAL', 'FINAL', 29, 'N');
    addFee('B003', 'B_MANUAL', 'FINAL', 5, 'N');
}

if (appMatch('Building/*/*/*')) {
    lcpMidCoast();
}

if (appMatch('Building/*/*/*')) {
    femaFloodZoneCheck();
}

if (appMatch('Building/*/*/*')) {
    var conditionAdded = addRoofingSysReqCondition(capId);
}
