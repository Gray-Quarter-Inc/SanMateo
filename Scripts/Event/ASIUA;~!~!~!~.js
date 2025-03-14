/*
Script Name: ApplicationSpecificInfoUpdateAfter.js
Converted from Std Choice: ApplicationSpecificInfoUpdateAfter
 */

if (appMatch('Building/*/*/*') && !appMatch('Building/Residential/*/*')) {
    include('ES_BLD_UPD_ASI'); /* replaced branch(ES_BLD_UPD_ASI) */
}

if (appMatch('Planning/*/*/*')) {
    include('ES_PLN_UPD_ASI'); /* replaced branch(ES_PLN_UPD_ASI) */
}

if (appMatch('Planning/Project/*/*')) {
    include('ES_ENTITLEMENT_LOOP'); /* replaced branch(ES_ENTITLEMENT_LOOP) */
}

if (appMatch('Building/*/*/*')) {
    include('ES_BLD_ASIUPDATEAFTER'); /* replaced branch(ES_BLD_ASIUpdateAfter) */
}

if (appMatch('*/Full Review/*/*')) {
    include('ES_BLD_FEECALC'); /* replaced branch(ES_BLD_FEECALC) */
}

if (appMatch('*/EZ Review/*/*')) {
    include('ES_BLD_FEECALC'); /* replaced branch(ES_BLD_FEECALC) */
}

if (appMatch('*/Pre Application/*/*')) {
    updateShortNotes(AInfo['Project Type']);
}

if (appMatch('*/Research and Survey/*/*') && AInfo['Project Type'] != null) {
    updateShortNotes(AInfo['Project Type']);
}

if (appMatch('*/Project/*/*') && capName == null) {
    editAppName(AInfo['Planning Project Type']);
}

if (appMatch('*/Full Review/*/*') && feeExists('082', 'NEW', 'INVOICED')) {
    editAppSpecific('Legal Counsel Fee', feeAmount('082', 'NEW'));
}

if (appMatch('*/Full Review/*/*') && feeExists('081', 'NEW', 'INVOICED')) {
    editAppSpecific('Technology Surcharge', feeAmount('081', 'NEW'));
}

if (appMatch('RealProperty/*/*/*')) {
    include('ES_RP_ASIUPDATEAFTER'); /* replaced branch(ES_RP_ASIUpdateAfter) */
}

if (appMatch('WasteMgmt/Management Final/NA/NA')) {
    include('ES_WM_FINAL_UPD_ASI'); /* replaced branch(ES_WM_FINAL_UPD_ASI) */
}

var canCreateGreenHalo = false;
if (appMatch('Planning/Amnesty/*/*')) {
    include('AMNESTY_ASIUPDATEAFTER'); /* replaced branch(AMNESTY_ASIUpdateAfter) */
}
