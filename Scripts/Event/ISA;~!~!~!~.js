/*
Script Name: InspectionScheduleAfter.js
Converted from Std Choice: InspectionScheduleAfter
*/

if (capStatus == 'Issued' && isTaskActive('Ready to Issue')) {
	deactivateTask('Ready to Issue');
	activateTask('Inspections');
	}

