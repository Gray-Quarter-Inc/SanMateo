/*
Subscript Name: ES_WM_FINAL_DIVERTEDMATERIALS_CD.js
Converted from Std Choice: ES_WM_FINAL_DIVERTEDMATERIALS_CD
Called From Scripts:
ES_WM_FINAL_UPD_ASI
 */

var totalAmt = 0;
if (typeof(MATERIALACTUALS) == 'object') {
    for (x in MATERIALACTUALS)
        if (MATERIALACTUALS[x]['Material'] != 'Asphalt' && MATERIALACTUALS[x]['Material'] != 'Bricks' && MATERIALACTUALS[x]['Material'] != 'Concrete' && MATERIALACTUALS[x]['Material'] != 'Dirt' && MATERIALACTUALS[x]['Material'] != 'Other inert solids' && MATERIALACTUALS[x]['Material'] != 'Bricks Salvage/Reuse' && MATERIALACTUALS[x]['Material'] != 'Concrete Salvage/Reuse' && MATERIALACTUALS[x]['Material'] != 'Waste' && MATERIALACTUALS[x]['Material'] != 'Mixed C&D Debris')
            (totalAmt = totalAmt + parseFloat(MATERIALACTUALS[x]['Weight (Tons)']));
    comment('Total AMT = ' + totalAmt);
}

if (typeof(MATERIALACTUALS) == 'object') {
    for (x in MATERIALACTUALS)
        if (MATERIALACTUALS[x]['Material'] == 'Mixed C&D Debris')
            (totalAmt = totalAmt + (parseFloat(MATERIALACTUALS[x]['Weight (Tons)'] * .8)));
    comment('Total AMT = ' + totalAmt);
}

editAppSpecific('C&D Diverted', totalAmt.toFixed(2));
