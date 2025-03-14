function copyOwner(sCapID, tCapID) {
    var ownrReq = aa.owner.getOwnerByCapId(sCapID);
    if (ownrReq.getSuccess() != true) {
        Avo_LogDebug("Failed to get Owners. " + ownrReq.getErrorType() + ": " + ownrReq.getErrorMessage(), 1);
        return false;
    }

    var count = 0;

    var allOwners = ownrReq.getOutput();
    for (var i in allOwners) {
        allOwners[i].setCapID(tCapID);

        var addReq = aa.owner.createCapOwnerWithAPOAttribute(allOwners[i]);
        if (addReq.getSuccess() != true) {
            Avo_LogDebug("Failed to copy owner " + allOwners[i].getOwnerFullName(), 1);
            continue;
        }

        count++;
        Avo_LogDebug("Copied Owner " + allOwners[i].getOwnerFullName(), 1);
    }

    return count;
}
/*******************************************************
| Script/Function: createChildTempRecord(cTypeArray, asiFieldArray, asiTableMapping, [itemCap])
| Created by: Mark Wells
| Usage: create associated form of type cTypeArray, copy ASI fields in asiFieldArray from parent, copy ASI tables in asiTableMapping 
| from parent, copy addresses and parcels from parent
| Modified by: ()
*********************************************************/
