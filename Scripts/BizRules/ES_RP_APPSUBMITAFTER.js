/*
Subscript Name: ES_RP_APPSUBMITAFTER.js
Converted from Std Choice: ES_RP_AppSubmitAfter
Called From Scripts:
ApplicationSubmitAfter
 */

if (AInfo['Base Rent'] != null) {
    editAppSpecific('BaseRentHold', AInfo['Base Rent']);
}

if (AInfo['Rent Address 2'] != null) {
    editAppSpecific('RentAddress2Hold', AInfo['Rent Address 2']);
}

include('ES_RP_UPDATESHORTNOTES'); /* replaced branch(ES_RP_UpdateShortNotes) */
