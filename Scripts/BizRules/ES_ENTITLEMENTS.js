/*
Subscript Name: ES_ENTITLEMENTS.js
Converted from Std Choice: ES_ENTITLEMENTS
Called From Scripts:
ES_ENTITLEMENT_LOOP
 */

feeRow = PROJECT[eachrow];
if (eachrow == 0) {
    entShortNotes = feeRow['Project Type'] + '';
}

if (eachrow > 0) {
    entShortNotes = entShortNotes + ',' + feeRow['Project Type'];
}
