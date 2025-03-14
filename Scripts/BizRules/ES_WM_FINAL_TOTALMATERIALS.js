/*
Subscript Name: ES_WM_FINAL_TOTALMATERIALS.js
Converted from Std Choice: ES_WM_FINAL_TOTALMATERIALS
Called From Scripts:
ES_WM_FINAL_UPD_ASI
 */

var totalAmt = 0;
if (typeof(MATERIALACTUALS) == 'object') {
    for (x in MATERIALACTUALS)
        (totalAmt = totalAmt + parseFloat(MATERIALACTUALS[x]['Weight (Tons)']));
}

editAppSpecific('Total Generated', totalAmt.toFixed(2));
