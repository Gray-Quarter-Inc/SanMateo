/*
Subscript Name: ES_RP_CREATEARCHIVERULES.js
Converted from Std Choice: ES_RP_CreateArchiveRules
Called From Scripts:
ES_RP_ASIUPDATEAFTER
 */

cType = 'snapshot';
if (AInfo['Create Snapshot'] == 'CHECKED') {
    include('ES_RP_CREATEARCHIVE'); /* replaced branch(ES_RP_CreateArchive) */
}

if (appMatch('RealProperty/County Tenant/NA/NA') && AInfo['BaseRentHold'] != null && AInfo['Base Rent'] != AInfo['BaseRentHold']) {
    include('ES_RP_CREATEARCHIVE'); /* replaced branch(ES_RP_CreateArchive) */
    createCapComment('Base Rent was changed from ' + AInfo['BaseRentHold'] + ' to ' + AInfo['Base Rent']);
    editAppSpecific('BaseRentHold', AInfo['Base Rent']);
}

if (appMatch('RealProperty/County Tenant/NA/NA') && AInfo['BaseRentHold'] == null && AInfo['Base Rent'] != null) {
    editAppSpecific('BaseRentHold', AInfo['Base Rent']);
}

if (appMatch('RealProperty/County Tenant/NA/NA') && AInfo['RentAddress2Hold'] != null && AInfo['Rent Address 2'] != AInfo['RentAddress2Hold']) {
    include('ES_RP_CREATEARCHIVE'); /* replaced branch(ES_RP_CreateArchive) */
    createCapComment('Rent Address 2 was changed from ' + AInfo['RentAddress2Hold'] + ' to ' + AInfo['Rent Address 2']);
    editAppSpecific('RentAddress2Hold', AInfo['Rent Address 2']);
}

if (appMatch('RealProperty/County Tenant/NA/NA') && AInfo['RentAddress2Hold'] == null && AInfo['Rent Address 2'] != null) {
    editAppSpecific('RentAddress2Hold', AInfo['Rent Address 2']);
}

if (appMatch('RealProperty/County Tenant/NA/NA') && AInfo['AreaOfPremises1Hold'] != null && AInfo['Area of Premises 1'] != AInfo['AreaOfPremises1Hold']) {
    include('ES_RP_CREATEARCHIVE'); /* replaced branch(ES_RP_CreateArchive) */
    createCapComment('Area of Premises 1 was changed from ' + AInfo['AreaOfPremises1Hold'] + ' to ' + AInfo['Area of Premises 1']);
    editAppSpecific('AreaOfPremises1Hold', AInfo['Area of Premises 1']);
}

if (appMatch('RealProperty/County Tenant/NA/NA') && AInfo['AreaOfPremises1Hold'] == null && AInfo['Area of Premises 1'] != null) {
    editAppSpecific('AreaOfPremises1Hold', AInfo['Area of Premises 1']);
}

if (appMatch('RealProperty/County Tenant/NA/NA') && AInfo['AreaOfPremises2Hold'] != null && AInfo['Area of Premises 2'] != AInfo['AreaOfPremises2Hold']) {
    include('ES_RP_CREATEARCHIVE'); /* replaced branch(ES_RP_CreateArchive) */
    createCapComment('Area of Premises 2 was changed from ' + AInfo['AreaOfPremises2Hold'] + ' to ' + AInfo['Area of Premises 2']);
    editAppSpecific('AreaOfPremises2Hold', AInfo['Area of Premises 2']);
}

if (appMatch('RealProperty/County Tenant/NA/NA') && AInfo['AreaOfPremises2Hold'] == null && AInfo['Area of Premises 2'] != null) {
    editAppSpecific('AreaOfPremises2Hold', AInfo['Area of Premises 2']);
}
