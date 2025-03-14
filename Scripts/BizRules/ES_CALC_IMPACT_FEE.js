/*
Subscript Name: ES_CALC_IMPACT_FEE.js
Converted from Std Choice: ES_CALC_IMPACT_FEE
Called From Scripts:
ES_BLD_UPD_ASI
 */

comSqFt = parseInt(AInfo['Sq Ft 6']) + parseInt(AInfo['Sq Ft 7']) + parseInt(AInfo['Sq Ft 8']);
comment('comSqFt = ' + comSqFt);
if (AInfo['Sq Ft 1'] > 2500) {
    updateFee('BHI01', 'B_HOUSING_IMPACT', 'FINAL', AInfo['Sq Ft 1'], 'N');
}

if (AInfo['Sq Ft 2'] > 0) {
    updateFee('BHI02', 'B_HOUSING_IMPACT', 'FINAL', AInfo['Sq Ft 2'], 'N');
}

if (AInfo['Sq Ft 3'] > 0) {
    updateFee('BHI03', 'B_HOUSING_IMPACT', 'FINAL', AInfo['Sq Ft 3'], 'N');
}

if (AInfo['Sq Ft 4'] > 0) {
    updateFee('BHI04', 'B_HOUSING_IMPACT', 'FINAL', AInfo['Sq Ft 4'], 'N');
}

if (AInfo['Sq Ft 5'] > 0) {
    updateFee('BHI05', 'B_HOUSING_IMPACT', 'FINAL', AInfo['Sq Ft 5'], 'N');
}

if (AInfo['Sq Ft 6'] > 0 && comSqFt > 3500) {
    updateFee('BHI06', 'B_HOUSING_IMPACT', 'FINAL', AInfo['Sq Ft 6'], 'N');
}

if (AInfo['Sq Ft 7'] > 0 && comSqFt > 3500) {
    updateFee('BHI10', 'B_HOUSING_IMPACT', 'FINAL', AInfo['Sq Ft 7'], 'N');
}

if (AInfo['Sq Ft 8'] > 0 && comSqFt > 3500) {
    updateFee('BHI07', 'B_HOUSING_IMPACT', 'FINAL', AInfo['Sq Ft 8'], 'N');
}
