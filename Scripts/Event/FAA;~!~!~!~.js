/*
Script Name: FeeAssessAfter.js
Converted from Std Choice: FeeAssessAfter
 */

aa.finance.reCalculateFees(capId, 'CALC', null);
if (appMatch('*/Full Review/*/*')) {
    include('ES_BLD_VALUATIONREMODEL'); /* replaced branch(ES_BLD_VALUATIONREMODEL) */
}

if (fileDateYYYYMMDD > '2013-12-08' && !feeExists('B005', 'NEW', 'INVOICED') && AInfo['Manual Valuation'] > 1) {
    addFee('B005', 'B_BLD', 'FINAL', parseInt(AInfo['Manual Valuation']), 'N');
}

if (appMatch('*/Full Review/*/*')) {
    editAppSpecific('Building Valuation Fee', feeAmount('B005', 'NEW'));
}

if (fileDateYYYYMMDD > '2013-12-08' && !feeExists('B002', 'NEW', 'INVOICED') && appMatch('*/Full Review/*/*')) {
    addFee('B002', 'B_BLD', 'FINAL', 1, 'N');
    editAppSpecific('State Building Permit Fee', feeAmount('B002', 'NEW'));
}
