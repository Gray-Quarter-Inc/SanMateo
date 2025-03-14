/*******************************************************
| Script/Function: createChildBuildingPermit(group, type, subType, category, desc, groupsIgnoreArray)
| Created by: Mike Buell
| Created on: 19Oct20
| Usage: create child record of type group/type/subType/category, copy APO, contacts, ASI
| Modified by: ()
*********************************************************/
function createChildBuildingPermit(group, type, subType, category, desc, groupsIgnoreArray) {
    // create the child - set the description
    var childCapId = createChild(group, type, subType, category, desc);

    if (!childCapId) {
        return false;
    }

    var childAltId = aa.cap.getCap(capId).getOutput().capModel.altID;
    //Avo_LogDebug("Record(" + altId + ")", 2);  //debug

    Avo_LogDebug("Created child " + desc + " permit " + childAltId, 1);
    /*
    var updateCapAltIdResult = aa.cap.updateCapAltID(newLicId, childPermitNum);
        
    if (updateCapAltIdResult.getSuccess()) {
        logDebug("Updated the altId to - " + childPermitNum);
    } else {
        logDebug("Could not update the altId");
    }
    */

    //copy the ASI
    //copyASIFields(capId,newLicId,groupsIgnoreArray);
    copyAppSpecific(childCapId, groupsIgnoreArray);

    return childCapId;
}