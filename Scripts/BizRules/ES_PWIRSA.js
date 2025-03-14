/*
Subscript Name: ES_PWIRSA.js
Converted from Std Choice: ES_PWIRSA
Called From Scripts:
InspectionResultSubmitAfter
V360InspectionResultSubmitAfter
 */

if (appMatch('*/Illicit Discharge/*/*') && inspType == 'Site Inspection' && inspResult == 'In Violation' && isTaskActive('Inspections')) {
    closeTask('Inspections', 'In Violation', 'Updated by script');
    updateAppStatus('Enforcement Level 4', 'Updated by script');
}
