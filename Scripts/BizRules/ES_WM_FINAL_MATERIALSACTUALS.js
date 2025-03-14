/*
Subscript Name: ES_WM_FINAL_MATERIALSACTUALS.js
Converted from Std Choice: ES_WM_FINAL_MATERIALSACTUALS
Called From Scripts:
ES_WM_FINAL_UPD_ASI
 */

removeASITable('MATERIAL ACTUALS');
if (typeof(MATERIALACTUALS) == 'object') {
    removeASITable('MATERIAL ACTUALS');
    for (x in MATERIALACTUALS)
        //start replaced branch: ES_WM_FINAL_MATERIALSACTUALS_LOOP
    {
        if (MATERIALACTUALS[x]['Measurement'] == 'Weight (Tons)') {
            MATERIALACTUALS[x]['Weight (Tons)'] = MATERIALACTUALS[x]['Amount'];
            MATERIALACTUALS[x]['Volume (CU. YD.)'] = (parseFloat(MATERIALACTUALS[x]['Amount']) / lookup('WasteConversion', MATERIALACTUALS[x]['Material'])).toFixed(2);
        }

        if (MATERIALACTUALS[x]['Measurement'] == 'Volume (CU. YD.)') {
            MATERIALACTUALS[x]['Volume (CU. YD.)'] = MATERIALACTUALS[x]['Amount'];
            MATERIALACTUALS[x]['Weight (Tons)'] = (parseFloat(MATERIALACTUALS[x]['Amount']) * lookup('WasteConversion', MATERIALACTUALS[x]['Material'])).toFixed(2);
        }

    }
    //end replaced branch: ES_WM_FINAL_MATERIALSACTUALS_LOOP;
    addASITable('MATERIAL ACTUALS', MATERIALACTUALS);
}
