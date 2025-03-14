/*
Script Name: ES_WM_PreventDuplicateRecords.js
Converted from Std Choice: ES_WM_PreventDuplicateRecords
*/


if (appMatch('WasteMgmt/Management Plan/NA/NA')) {
	rfArray = getRelatedCapsByAddressBefore('WasteMgmt/Management Plan/NA/NA');
	}

comment(rfArray);

