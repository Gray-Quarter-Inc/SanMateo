/*
Script Name: ParcelAddAfter.js
Converted from Std Choice: ParcelAddAfter
 */

if (appMatch('Building/*/*/*') && !appMatch('Building/Residential/*/*')) {
    var conditionAdded = addRoofingSysReqCondition(capId);
}
