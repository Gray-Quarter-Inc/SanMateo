/*
Subscript Name: ES_RP_ASIUPDATEAFTER.js
Converted from Std Choice: ES_RP_ASIUpdateAfter
Called From Scripts:
ApplicationSpecificInfoUpdateAfter
 */

if (typeof(AMENDMENTS) == 'object') {
    count = null;
    for (eachrow in AMENDMENTS)
        count = count + 1;
    comment('count=' + count);
    editAppSpecific('Number of Lease Amendments', count);
}

if (appMatch('RealProperty/County Tenant/*/*') || appMatch('RealProperty/County Landlord/*/*')) {
    include('ES_RP_CREATEARCHIVERULES'); /* replaced branch(ES_RP_CreateArchiveRules) */
}

include('ES_RP_UPDATESHORTNOTES'); /* replaced branch(ES_RP_UpdateShortNotes) */
