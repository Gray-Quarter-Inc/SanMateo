/*
Subscript Name: ES_MPF_APPSUBMITAFTER.js
Converted from Std Choice: ES_MPF_AppSubmitAfter
Called From Scripts:
ApplicationSubmitAfter
 */

if (appMatch('MenloParkFire/*/*/*')) {
    closeTask('Application Submittal', 'Application Submitted', 'Updated Via Script', null);
    updateAppStatus('Under Review', 'Updated Via Script');
    activateTask('Fire Review');
}

if ((appMatch('*/*/Floor Finishing/*') && AInfo['Total Floor Area'] <= 350) || (appMatch('*/*/HVAC/*') && AInfo['Cubic Feet per Minute'] < 2000)) {
    closeTask('Fire Review', 'Not Required', 'Updated by ES_MPF_AppSubmitAfter', '');
    activateTask('Permit Issuance');
}

if ((appMatch('MenloParkFire/Plan Review/*/*') && AInfo['Resubmittal'] == 'Yes') || (appMatch('MenloParkFire/Permit/*/*') && AInfo['Resubmittal'] == 'Yes')) {
    updateFee('MP41306', 'MP_CONSTRUCTION', 'FINAL', 1, 'Y');
} else {
    include('ES_FIREASA'); /* replaced branch(ES_FireASA) */
}

if (appMatch('*/*/Photovoltaic/*') && AInfo['Type'] == 'Residential' && AInfo['Total kW'] > 10000) {
    addStdCondition('Photovoltaic', 'Large Residential Photovoltaic System', capId);
}
