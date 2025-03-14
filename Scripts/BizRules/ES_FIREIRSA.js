/*
Subscript Name: ES_FIREIRSA.js
Converted from Std Choice: ES_FireIRSA
Called From Scripts:
InspectionResultSubmitAfter
 */

if (inspType == 'Underground Hydro', 'Flush', 'Weld/Glue', 'Overhead Hydro', 'Rough Inspection', 'Flow Test', 'Monitoring System', 'Fire Alarm System', 'Auto Fire Extinguishing System', 'Install / Remove Tank', 'Spray Booth / Ovens', 'Tent', 'Hazmat', 'PV Solor', 'Other', 'Fire Final' && inspResult == 'Failed', 'Cancelled', 'Partial Pass', 'No One at Site' && isTaskActive('Inspection')) {
    updateTask('Inspection', 'Inspections in Progress', 'Updated via script');
    updateAppStatus('Inspections in Progress', 'Updated via Script');
}

if (inspType == 'Fire Final' && inspResult == 'Passed' && isTaskActive('Inspection')) {
    closeTask('Inspection', 'Finaled', 'Updated via script');
    updateAppStatus('Finaled', 'Updated via script');
}

if (appMatch('MenloParkFire/Permit/Sprinkler/*') && inspType == 'Fire Final' && inspResult == 'Passed' && isTaskActive('Inspection')) {
    closeTask('Inspection', 'Finaled', 'Updated via script');
    updateAppStatus('Finaled', 'Updated via script');
}

if (inspType == 'Underground Hydro', 'Flush', 'Weld/Glue', 'Overhead Hydro', 'Rough Inspection', 'Flow Test', 'Monitoring System', 'Fire Alarm System', 'Auto Fire Extinguishing System', 'Install / Remove Tank', 'Spray Booth / Ovens', 'Tent', 'Hazmat', 'PV Solor', 'Other' && inspResult == 'Passed' && isTaskActive('Inspection')) {
    updateTask('Inspection', 'Passed', 'Updated via script');
}

if (inspResult == 'Reinspection Fee') {
    addFee('MP41305', 'MP_CONSTRUCTION', 'FINAL', 1, 'Y');
}
