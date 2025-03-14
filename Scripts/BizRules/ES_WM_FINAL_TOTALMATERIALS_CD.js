/*
Subscript Name: ES_WM_FINAL_TOTALMATERIALS_CD.js
Converted from Std Choice: ES_WM_FINAL_TOTALMATERIALS_CD
Called From Scripts:
ES_WM_FINAL_UPD_ASI
 */

var totalAmt = 0;
if (typeof(MATERIALACTUALS) == 'object') {
    for (x in MATERIALACTUALS)
        if (MATERIALACTUALS[x]['Material'] != 'Asphalt' && MATERIALACTUALS[x]['Material'] != 'Bricks' && MATERIALACTUALS[x]['Material'] != 'Concrete' && MATERIALACTUALS[x]['Material'] != 'Bricks/Concrete' && MATERIALACTUALS[x]['Material'] != 'Dirt' && MATERIALACTUALS[x]['Material'] != 'Bricks Salvage/Reuse' && MATERIALACTUALS[x]['Material'] != 'Concrete Salvage/Reuse' && MATERIALACTUALS[x]['Material'] != 'Other inert solids')
            (totalAmt = totalAmt + parseFloat(MATERIALACTUALS[x]['Weight (Tons)']));
}

editAppSpecific('C&D Generated', totalAmt.toFixed(2));
