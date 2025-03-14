/*
Script Name: ES_WM_FINAL_MATERIALSACTUALS_LOOP.js
Converted from Std Choice: ES_WM_FINAL_MATERIALSACTUALS_LOOP
*/


if (MATERIALACTUALS[x]['Measurement'] == 'Weight (Tons)') {
	MATERIALACTUALS[x]['Weight (Tons)']=MATERIALACTUALS[x]['Amount'];
	MATERIALACTUALS[x]['Volume (CU. YD.)']=(parseFloat(MATERIALACTUALS[x]['Amount'])/lookup('WasteConversion',MATERIALACTUALS[x]['Material'])).toFixed(2);
	}

if (MATERIALACTUALS[x]['Measurement'] == 'Volume (CU. YD.)') {
	MATERIALACTUALS[x]['Volume (CU. YD.)']=MATERIALACTUALS[x]['Amount'];
	MATERIALACTUALS[x]['Weight (Tons)']=(parseFloat(MATERIALACTUALS[x]['Amount'])*lookup('WasteConversion',MATERIALACTUALS[x]['Material'])).toFixed(2);
	}

