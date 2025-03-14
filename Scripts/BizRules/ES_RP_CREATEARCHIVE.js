/*
Subscript Name: ES_RP_CREATEARCHIVE.js
Converted from Std Choice: ES_RP_CreateArchive
Called From Scripts:
ES_RP_CREATEARCHIVERULES
ES_RP_WORKFLOWTASKUPDATEAFTER
 */

if (appMatch('RealProperty/County Tenant/NA/NA') && cType == 'snapshot') {
    newChildID = createChild('RealProperty', 'Z Archives', 'County Tenant Snapshot', 'NA', capName);
}

if (appMatch('RealProperty/County Tenant/NA/NA') && cType == 'amendment') {
    newChildID = createChild('RealProperty', 'Z Archives', 'County Tenant Amendment', 'NA', capName);
}

saveId = capId;
capId = newChildID;
if (cType == 'amendment') {
    updateAppStatus('Amendment', 'Amendment', newChildID);
}

if (cType == 'snapshot') {
    updateAppStatus('Snapshot', 'Snapshot', newChildID);
}

addStdCondition('Archive Record', 'Archive Record');
deleteTask(capId, 'Lease Initialization');
deleteTask(capId, 'Lease Management');
editAppSpecific('Create Archive', 'UNCHECKED');
capId = saveId;
editAppSpecific('Create Snapshot', 'UNCHECKED');
updateChildAltID4Digits(capId, newChildID, '-');
