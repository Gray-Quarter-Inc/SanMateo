/*
Subscript Name: ES_WM_FINAL_UPD_ASI.js
Converted from Std Choice: ES_WM_FINAL_UPD_ASI
Called From Scripts:
ApplicationSpecificInfoUpdateAfter
ApplicationSubmitAfter
ConvertToRealCAPAfter
 */

include('ES_WM_FINAL_MATERIALSACTUALS'); /* replaced branch(ES_WM_FINAL_MATERIALSACTUALS) */
include('ES_WM_FINAL_TOTALMATERIALS'); /* replaced branch(ES_WM_FINAL_TOTALMATERIALS) */
include('ES_WM_FINAL_DIVERTEDMATERIALS'); /* replaced branch(ES_WM_FINAL_DIVERTEDMATERIALS) */
if (AInfo['Total Generated'] && AInfo['Total Diverted']) {
    editAppSpecific('Diversion Percentage', Math.round(parseFloat(AInfo['Total Diverted']) / parseFloat(AInfo['Total Generated']) * 100));
}

include('ES_WM_FINAL_TOTALMATERIALS_CD'); /* replaced branch(ES_WM_FINAL_TOTALMATERIALS_CD) */
include('ES_WM_FINAL_DIVERTEDMATERIALS_CD'); /* replaced branch(ES_WM_FINAL_DIVERTEDMATERIALS_CD) */
if (AInfo['C&D Generated'] != '0.00' || AInfo['C&D Diverted'] != '0.00') {
    editAppSpecific('C&D Diversion Percentage', Math.round(parseFloat(AInfo['C&D Diverted']) / parseFloat(AInfo['C&D Generated']) * 100));
}

if (AInfo['C&D Generated'] == '0.00' && AInfo['C&D Diverted'] == '0.00') {
    editAppSpecific('C&D Diversion Percentage', 0);
}
