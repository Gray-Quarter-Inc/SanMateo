/*
Subscript Name: ES_RP_UPDATESHORTNOTES.js
Converted from Std Choice: ES_RP_UpdateShortNotes
Called From Scripts:
ES_RP_APPSUBMITAFTER
ES_RP_ASIUPDATEAFTER
 */

if (appMatch('RealProperty/County Landlord/*/*')) {
    updateShortNotes(AInfo['Agreement Type']);
}

if (appMatch('RealProperty/County Landlord/*/*')) {
    updateShortNotes(AInfo['Agreement Type']);
}

if (appMatch('RealProperty/County Tenant/*/*') && !AInfo['Use'] == 'Flex/Other') {
    updateShortNotes(AInfo['Use']);
}

if (appMatch('RealProperty/County Tenant/*/*') && AInfo['Use'] == 'Flex/Other') {
    updateShortNotes(AInfo['Use'] + '-' + AInfo['Other Use Category']);
}

if (appMatch('RealProperty/Miscellaneous/*/*')) {
    updateShortNotes(AInfo['Type']);
}

if (appMatch('RealProperty/Work Order/*/*')) {
    updateShortNotes(AInfo['Type']);
}

if (appMatch('RealProperty/County Owned Property/*/*')) {
    updateShortNotes(AInfo['Property Interest']);
}
