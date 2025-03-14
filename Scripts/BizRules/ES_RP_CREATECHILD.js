/*
Subscript Name: ES_RP_CREATECHILD.js
Converted from Std Choice: ES_RP_CreateChild
Called From Scripts:
ES_RP_WORKFLOWTASKUPDATEAFTER
 */

if (AInfo['Type'] == 'Lease - County as Tenant') {
    newChildID = createChild('RealProperty', 'County Tenant', 'NA', 'NA');
}

if (AInfo['Type'] == 'Lease - County as Landlord') {
    newChildID = createChild('RealProperty', 'County Landlord', 'NA', 'NA');
}

if (AInfo['Type'] == 'Acquisition') {
    newChildID = createChild('RealProperty', 'County Owned Property', 'NA', 'NA');
}

if (AInfo['Type'] == 'Misc') {
    newChildID = createChild('RealProperty', 'Miscellaneous', 'NA', 'NA');
}

saveId = capId;
pappName = capName;
cdpScriptObj = aa.cap.getCapDetail(capId).getOutput();
capId = newChildID;
editAppName(pappName);
copyOwner(saveId, capId);
copyLicensedProf(saveId, capId);
copyParcels(saveId, capId);
copyAddresses(saveId, capId);
copyParcelGisObjects();
capId = saveId;
