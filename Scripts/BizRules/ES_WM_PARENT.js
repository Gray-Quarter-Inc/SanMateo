/*
Subscript Name: ES_WM_PARENT.js
Converted from Std Choice: ES_WM_PARENT
Called From Scripts:
ApplicationSubmitAfter
ConvertToRealCAPAfter
 */

if (AInfo['Associated Building Permit Number']) {
    addParent(AInfo['Associated Building Permit Number']);
}

parentID = getParent();
copyParcels(parentID, capId);
copyAddresses(parentID, capId);
copyContacts(parentID, capId);
copyLicensedProf(parentID, capId);
copyOwner(parentID, capId);
updateAppStatus('Submitted', 'Initial Status');
editAppName('WMP for ' + AInfo['Associated Building Permit Number']);
editAppSpecific('WMP required because project is a', getAppSpecific('Waste Management Plan', parentID));
if (matches(getAppSpecific('Green Building?', parentID), '50 Percent', 'COM', 'SFD')) {
    editAppSpecific('Green Building', 'Yes');
} else {
    editAppSpecific('Green Building', 'No');
}

pWorkDesc = workDescGet(parentID);
updateWorkDesc(pWorkDesc, capId);
