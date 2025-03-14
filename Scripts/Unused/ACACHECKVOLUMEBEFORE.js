/*
Script Name: ACACheckVolumeBefore.js
Converted from Std Choice: ACACheckVolumeBefore
*/


showMessage = false;
showDebug = false;
badVolume = 'N';
loadASITables4ACA_x();
if (typeof(MATERIALACTUALS) == 'object') {
	for(x in MATERIALACTUALS) if(MATERIALACTUALS[x]['Material'] == 'Other Source Separated' && MATERIALACTUALS[x]['Measurement'] == 'Volume (CU. YD.)')(badVolume = 'Y');
	}

if (typeof(MATERIALACTUALS) == 'object') {
	for(x in MATERIALACTUALS) if(MATERIALACTUALS[x]['Material'] == 'Other Salvage/Reuse' && MATERIALACTUALS[x]['Measurement'] == 'Volume (CU. YD.)')(badVolume = 'Y');
	}

if (badVolume == 'Y') {
	showMessage = true;
	comment('Measurement for Other Source Separated or Other Salvage/Reuse materials reported below cannot be reported in Volume (cubic yards). Please edit the information so that they are reported in Weight (tons).');
	}

