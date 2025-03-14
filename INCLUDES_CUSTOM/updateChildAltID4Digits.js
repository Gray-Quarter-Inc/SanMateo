function updateChildAltID4Digits(pcapId, ccapId, suffix) {
    /*---------------------------------------------------------------------------------------------------------/
    | Function Intent: 
    | This function is designed to update the AltId (b1permit.b1_alt_id) of an child record (ccapId).
    | The new AltId will be created using the AltId of its parent record (pcapId) plus the suffix variable
    | provided. Finally the end of the new id will be the number of child records of that record type.
    |
    | Example:
    | Parent AltId: 499-12-67872
    | Child AltId: 499-12-67872-ELEC-01
    |   499-12-67872-ELEC-02
    |   499-12-67872-ELEC-03
    |
    | Returns:
    | Outcome  Description   Return Type
    | Success: New AltID of Childrecord AltID String
    | Failure: Error    null null
    |
    | Call Example:
    | updateChildAltID(pcapId, ccapId, "-ELEC-"); 
    |
    | 11/01/2012 - Keith H
    | Version 1 Created
    |
    | Required paramaters in order:
    | pcapId - capId model of the parent record
    | ccapId - capId model of the child record
    | suffix - string that will be appended to the end of the parent AltId (ie. "-ELEC-")
    |
    /----------------------------------------------------------------------------------------------------------*/
    var p_AltId = pcapId.getCustomID();
    var c_AltId = ccapId.getCustomID();
    var c_cap = aa.cap.getCap(ccapId).getOutput();
    var c_appTypeResult = c_cap.getCapType();
    var c_appTypeString = c_appTypeResult.toString();
    var c_appTypeArray = c_appTypeString.split("/");

    //Get the number of child records by type provided
    var totChildren = getChildren(c_appTypeArray[0] + "/" + c_appTypeArray[1] + "/*/*", pcapId);
    if (totChildren === null || totChildren.length === 0) { logDebug("**ERROR: getChildren function found no children"); return null; }

    //Set the numeric suffic of the new AltId number to the actual number of child records that exists for the type.
    var totalFound = totChildren.length;
    var i = 0;

    //When using the clone feature multiple records can be created at the same time. When this happens the AltIds of the
    //children records are not set. To correctly set the AltIds we need to start with the last number and work backwards.
    //This ensures all the new child records recieves a unique AltId.

    for (i = 0; i <= totChildren.length; i++) {
        //Add leading 0's if single digit
        if (totalFound < 10) { totalFound = '000' + totalFound; }
        if (totalFound > 9 && totalFound < 100) { totalFound = '00' + totalFound; }
        if (totalFound > 100 && totalFound < 999) { totalFound = '0' + totalFound; }

        var newAltId = p_AltId + suffix + totalFound + "";
        var updateResult = aa.cap.updateCapAltID(ccapId, newAltId);
        if (updateResult.getSuccess()) {
            logDebug("Updated child record AltId to " + newAltId + ".");
            break;
        }
        else {
            if (i == totalFound) {
                logDebug("** ERROR: Failed to update the AltID for " + c_AltId + ". " + updateResult.getErrorType() + " : " + updateResult.getErrorMessage());
                return null;
            }
            //Might be duplicate because of multiple clones, try the next lower number
            totalFound = totChildren.length - (1 + i);
            //Check for negitive. 
            if (totalFound < 0) {
                logDebug("**ERROR: Number used for AltID would be less than 0. Failed to update the AltID for " + c_AltId + ". ");
                return null;
            }
            logDebug("** Attempting the next number: " + totalFound + ".");
        }
    }

    return newAltId;
}
/*----------------------------------------------------------------------------------------------------/
| GIS Related Functions
/----------------------------------------------------------------------------------------------------*/
/*******************************************************
| Script/Function: updateParcelAttr()
| Created by: Mike Buell
| Created on: 02June17
| Usage: update the parcel attribute value
| Modified by: 
| Modified on: 
*********************************************************/
