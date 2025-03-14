/*
Subscript Name: ES_BLD_VALUATIONREMODEL.js
Converted from Std Choice: ES_BLD_VALUATIONREMODEL
Called From Scripts:
FeeAssessAfter
 */

var query = aa.util.newQueryFormat();
var valuationTable = aa.finance.getCalculatedValuation(capId, query);
var valTabObj = null;
totalUnitAmt = 0;
if (valuationTable.getSuccess()) {
    valTabObj = valuationTable.getOutput();
}

if (valTabObj) {
    for (xx in valTabObj)
        if (matches(valTabObj[xx].getUseTyp(), 'Remodel'))
            totalUnitAmt += parseFloat(valTabObj[xx].getUnitValue());
}

if (totalUnitAmt > 1 && !feeExists('B005', 'NEW', 'INVOICED')) {
    editAppSpecific('Manual Valuation', totalUnitAmt);
    //comment('Total Unit Amount to add is: ' + totalUnitAmt);
}
