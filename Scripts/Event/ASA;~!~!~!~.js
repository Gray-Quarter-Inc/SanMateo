/*
Script Name: ApplicationSubmitAfter.js
Converted from Std Choice: ApplicationSubmitAfter
 */

if (appMatch('Building/*/*/*') && !appMatch('Building/Residential/*/*')) {
    include('ES_BLD_APPSUBMITAFTER'); /* replaced branch(ES_BLD_AppSubmitAfter) */
}

if (appMatch('Planning/*/*/*')) {
    editAppSpecific('Community Area', AInfo['ParcelAttribute.COMMUNITY AREA']);
    editAppSpecific('FEMA', AInfo['ParcelAttribute.FEMA']);
    editAppSpecific('Zoning', AInfo['ParcelAttribute.ZONING DESIGNATION']);
    editAppSpecific('Zoning 2', AInfo['ParcelAttribute.ZONING 2']);
    editAppSpecific('Zoning 3', AInfo['ParcelAttribute.ZONING 3']);
    editAppSpecific('Zoning 4', AInfo['ParcelAttribute.ZONING 4']);
    editAppSpecific('Within a Scenic Corridor', AInfo['ParcelAttribute.SCENIC CORRIDOR']);
    editAppSpecific('General Plan Land Use', AInfo['ParcelAttribute.GENERAL PLAN LAND USE']);
    editAppSpecific('GP Land Use 2', AInfo['ParcelAttribute.GP LAND USE 2']);
    editAppSpecific('GP Land Use 3', AInfo['ParcelAttribute.GP LAND USE 3']);
    editAppSpecific('Within a Scenic Corridor', AInfo['ParcelAttribute.SCENIC CORRIDOR']);
    editAppSpecific('Williamson Act', AInfo['ParcelAttribute.WILLIAMSON ACT']);
    editAppSpecific('Current Review Cycle', 0);
}

if (appMatch('PublicWorks/*/*/*')) {
    editAppSpecific('Community Area', AInfo['ParcelAttribute.COMMUNITY AREA']);
    editAppSpecific('Sewer District', AInfo['ParcelAttribute.SEWER DISTRICT']);
}

if (appMatch('Planning/Project/*/*')) {
    include('ES_ENTITLEMENT_LOOP'); /* replaced branch(ES_ENTITLEMENT_LOOP) */
}

if (appMatch('*/Research and Survey/*/*') && AInfo['Project Type'] != null) {
    updateShortNotes(AInfo['Project Type']);
}

if (appMatch('RealProperty/*/*/*')) {
    include('ES_RP_APPSUBMITAFTER'); /* replaced branch(ES_RP_AppSubmitAfter) */
}

if (!publicUser && appMatch('WasteMgmt/*/*/*')) {
    include('ES_WM_PARENT'); /* replaced branch(ES_WM_PARENT) */
    include('ES_WM_CAPID'); /* replaced branch(ES_WM_CAPID) */
    include('ES_WM_APPLICATION_RECEIVED_EMAIL'); /* replaced branch(ES_WM_APPLICATION_RECEIVED_EMAIL) */
    include('ES_WM_FINAL_UPD_ASI'); /* replaced branch(ES_WM_FINAL_UPD_ASI) */
}

//if (AInfo['Inspection Area'] == null) {
//    editAppSpecific('Inspection Area', AInfo['ParcelAttribute.BUILDING INSPECTION AREA']);
//}

if (appMatch('MenloParkFire/*/*/*')) {
    include('ES_MPF_APPSUBMITAFTER'); /* replaced branch(ES_MPF_AppSubmitAfter) */
}

formatAddressAndOwnerZips(capId);
