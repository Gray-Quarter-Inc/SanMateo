/*
Subscript Name: ES_RP_WORKFLOWTASKUPDATEAFTER.js
Converted from Std Choice: ES_RP_WorkflowTaskUpdateAfter
Called From Scripts:
WorkflowTaskUpdateAfter
 */

if (appMatch('RealProperty/Work Order/NA/NA') && wfTask == 'Activities' && wfStatus == 'Create Child' && matches(AInfo['Type'], 'Lease - County as Tenant', 'Lease - County as Landlord', 'Acquisition', 'Misc')) {
    include('ES_RP_CREATECHILD'); /* replaced branch(ES_RP_CreateChild) */
}

if (appMatch('RealProperty/County Tenant/NA/NA') && wfTask == 'Lease Management' && wfStatus == 'Amendment') {
    cType = 'amendment';
    include('ES_RP_CREATEARCHIVE'); /* replaced branch(ES_RP_CreateArchive) */
}

if (appMatch('RealProperty/County Tenant/NA/NA') && wfTask == 'Lease Management' && wfStatus == 'Renewed') {
    cType = 'snapshot';
    include('ES_RP_CREATEARCHIVE'); /* replaced branch(ES_RP_CreateArchive) */
}
