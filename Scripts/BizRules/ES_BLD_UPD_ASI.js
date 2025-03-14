/*
Subscript Name: ES_BLD_UPD_ASI.js
Converted from Std Choice: ES_BLD_UPD_ASI
Called From Scripts:
ApplicationSpecificInfoUpdateAfter
ConvertToRealCAPAfter
ES_BLD_APPSUBMITAFTER
 */

if (AInfo['Community Area'] == null) {
    editAppSpecific('Community Area', AInfo['ParcelAttribute.COMMUNITY AREA']);
    editAppSpecific('Zoning 1', AInfo['ParcelAttribute.ZONING DESIGNATION']);
}

if (AInfo['Inspection Area'] == null) {
    editAppSpecific('Inspection Area', AInfo['ParcelAttribute.BUILDING INSPECTION AREA']);
}

if (AInfo['FEMA'] == null) {
    editAppSpecific('FEMA', AInfo['ParcelAttribute.FEMA']);
}

if (AInfo['Fire Severity Zones - LRA SRA'] == null) {
    editAppSpecific('Fire Severity Zones - LRA SRA', AInfo['ParcelAttribute.FIRE_SEVERITY_ZONE']);
}

if (AInfo['Project Watershed'] == null) {
    editAppSpecific('Project Watershed', AInfo['ParcelAttribute.WATERSHED']);
}

if (AInfo['Sq Ft 1'] != null || AInfo['Sq Ft 2'] != null || AInfo['Sq Ft 3'] != null || AInfo['Sq Ft 4'] != null || AInfo['Sq Ft 5'] != null || AInfo['Sq Ft 6'] != null || AInfo['Sq Ft 7'] != null || AInfo['Sq Ft 8'] != null) {
    include('ES_CALC_IMPACT_FEE'); /* replaced branch(ES_CALC_IMPACT_FEE) */
}
