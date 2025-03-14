/*
Subscript Name: ES_PLN_UPD_ASI.js
Converted from Std Choice: ES_PLN_UPD_ASI
Called From Scripts:
ApplicationSpecificInfoUpdateAfter
 */

if (AInfo['Community Area'] == null) {
    editAppSpecific('Community Area', AInfo['ParcelAttribute.COMMUNITY AREA']);
}

if (AInfo['FEMA'] == null) {
    editAppSpecific('FEMA', AInfo['ParcelAttribute.FEMA']);
}

if (AInfo['Zoning'] == null) {
    editAppSpecific('Zoning', AInfo['ParcelAttribute.ZONING DESIGNATION']);
}

if (AInfo['Zoning 2'] == null) {
    editAppSpecific('Zoning 2', AInfo['ParcelAttribute.ZONING 2']);
}

if (AInfo['Zoning 3'] == null) {
    editAppSpecific('Zoning 3', AInfo['ParcelAttribute.ZONING 3']);
}

if (AInfo['Zoning 4'] == null) {
    editAppSpecific('Zoning 4', AInfo['ParcelAttribute.ZONING 4']);
}

if (AInfo['Within a Scenic Corridor'] == null) {
    editAppSpecific('Within a Scenic Corridor', AInfo['ParcelAttribute.SCENIC CORRIDOR']);
}

if (AInfo['General Plan Land Use'] == null) {
    editAppSpecific('General Plan Land Use', AInfo['ParcelAttribute.GENERAL PLAN LAND USE']);
}

if (AInfo['GP Land Use 2'] == null) {
    editAppSpecific('GP Land Use 2', AInfo['ParcelAttribute.GP LAND USE 2']);
}

if (AInfo['GP Land Use 3'] == null) {
    editAppSpecific('GP Land Use 3', AInfo['ParcelAttribute.GP LAND USE 3']);
}

if (AInfo['Fire District'] == null) {
    editAppSpecific('Fire District', AInfo['ParcelAttribute.FIRE DISTRICT']);
}

if (AInfo['Fire Severity Zone'] == null) {
    editAppSpecific('Fire Severity Zone', AInfo['ParcelAttribute.FIRE SEVERITY ZONE']);
}

if (AInfo['Elementary School District'] == null) {
    editAppSpecific('Elementary School District', AInfo['ParcelAttribute.ELEMENTARY SCHOOL DISTRICT']);
}

if (AInfo['High School District'] == null) {
    editAppSpecific('High School District', AInfo['ParcelAttribute.HIGH SCHOOL DISTRICT']);
}

if (AInfo['Elementary School District'] == null) {
    editAppSpecific('Elementary School District', AInfo['ParcelAttribute.ELEMENTARY SCHOOL DISTRICT']);
}

if (AInfo['ASBS'] == null) {
    editAppSpecific('ASBS', AInfo['ParcelAttribute.ASBS']);
}

if (AInfo['Water Supplier or District'] == null) {
    editAppSpecific('Water Supplier or District', AInfo['ParcelAttribute.WATER SUPPLY DISTRICT']);
}

if (AInfo['Sewer  District'] == null) {
    editAppSpecific('Sewer District', AInfo['ParcelAttribute.SEWER DISTRICT']);
}
