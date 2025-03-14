/*
Subscript Name: ES_BLD_INSPECTIONRESULTSUBMITAFTER.js
Converted from Std Choice: ES_BLD_InspectionResultSubmitAfter
Called From Scripts:
InspectionResultSubmitAfter
V360InspectionResultSubmitAfter
 */

if (!appMatch('*/Stop Work Notice/*/*') && !matches(inspType, 'Final by Geotechnical', 'Final by Fire', 'Final by Green Building', 'Final by Health', 'Final Other', 'Final Other Permit', 'Final by Planning', 'Final by Public Works', 'Final by Sewer District', 'Final by Waste Management', 'Final by Water District', 'Final Drainage Public Works', '901 Building Final', '111 Erosion Control') && AInfo['Never Expires'] == null) {
    editAppSpecific('Expiration Date', dateAdd(inspResultDate, 181));
}

if (!appMatch('*/Stop Work Notice/*/*') && matches(inspType, '901 Building Final') && matches(inspResult, 'Fail', 'Partial') && AInfo['Never Expires'] == null) {
    editAppSpecific('Expiration Date', dateAdd(inspResultDate, 181));
}

if (matches(appTypeString, 'Building/Full Review/NA/NA', 'Building/EZ Review/NA/NA') && checkInspectionResult('901 Building Final', 'Pass') && isTaskActive('Inspections') && balanceDue == 0) {
    updateTask('Inspections', 'Finaled', 'Updated by Script when 901 Building Final inspection results in a pass', 'Updated by script');
    setTask('Inspections', 'N', 'Y');
}

if (appMatch('Building/OTC/*/*') && isTaskActive('Inspections') && checkInspectionResult('901 Building Final', 'Pass')) {
    closeTask('Inspections', 'Finaled', 'Finaled by script after passed 901 Building Final inspection', 'Updated by script');
}

inspDateArray = new Array();
inspDateMonth = null;
inspDateArray = new Array;
inspDateArray = inspResultDate.split('/');
inspDateMonth = inspDateArray[0];
comment('inspDateMonth: ' + inspDateMonth);
setBldExpDateOnInspPass(capId, inspResultArr, inspIdArr);
