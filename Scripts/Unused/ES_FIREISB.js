/*
Script Name: ES_FireISB.js
Converted from Std Choice: ES_FireISB
*/


if (appMatch('MenloParkFire/*/Sprinkler/*') && inspType == 'Fire Final' && !checkInspectionResult('Rough Inspection', 'Passed')) {
	showMessage = true;
	comment('A Final Fire inspection cannot be scheduled until the Rough Inspection has been passed.');
	cancel = true;
	}

if (matches(inspType, 'Underground Hydro','Flush','Weld/Glue','Overhead Hydro','Rough Inspection','Flow Test','Monitoring System','Fire Alarm System','Auto Fire Extinguishing System','Install / Remove Tank','Spray Booth / Ovens','Tent','Hazmat','PV Solor','Other','Fire Final')) {
	updateTask('Inspection','Inspections Scheduled','Updated via script', null);
	updateAppStatus('Inspections Scheduled','Updated via script');
	}

if (appMatch('MenloParkFire/*/Underground Piping/*') && inspType == 'Fire Final' && !checkInspectionResult('Rough Inspection', 'Hydro Inspection', 'Flush Inspection', 'Passed')) {
	showMessage = true;
	comment('A Final Fire inspection cannot be scheduled until a Rough Inspection, Hydro Inspection and Flush Inspection have passed.');
	cancel = true;
	}

