/*
Subscript Name: ES_WM_FINAL_DIVERTEDMATERIALS.js
Converted from Std Choice: ES_WM_FINAL_DIVERTEDMATERIALS
Called From Scripts:
ES_WM_FINAL_UPD_ASI
 */

var totalAmt = 0;
if (typeof(MATERIALACTUALS) == 'object') {
    for (x in MATERIALACTUALS)
        if (MATERIALACTUALS[x]['Material'] != 'Waste' && MATERIALACTUALS[x]['Material'] != 'Mixed C&D Debris')
            (totalAmt = totalAmt + parseFloat(MATERIALACTUALS[x]['Weight (Tons)']));
}

if (typeof(MATERIALACTUALS) == 'object') {
    for (x in MATERIALACTUALS)
        if (MATERIALACTUALS[x]['Material'] == 'Mixed C&D Debris')
            (totalAmt = totalAmt + (parseFloat(MATERIALACTUALS[x]['Weight (Tons)'] * .8)));
    comment('Total AMT = ' + totalAmt);
}

editAppSpecific('Total Diverted', totalAmt.toFixed(2));
