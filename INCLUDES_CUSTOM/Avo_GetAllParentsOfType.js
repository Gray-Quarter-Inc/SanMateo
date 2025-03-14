function Avo_GetAllParentsOfType(recordType, recordId) {
    if (recordType) {
        recordType = String(recordType);
    }

    if (!recordId) {
        recordId = capId;
    }

    var altId = aa.cap.getCap(recordId).getOutput().getCapModel().altID;
    logDebug("Avo_GetAllParentsOfType(" + recordType + ", " + altId + ")");

    var parents = new Array();

    var allParents = aa.cap.getProjectByChildCapID(recordId, null, null).getOutput();
    if (!allParents || allParents.length == 0) {
        return parents;
    }

    for (var i in allParents) {
        var parentCapId = allParents[i].projectID;

        if (recordType) {
            if (appMatch(recordType, parentCapId) == false) {
                continue;
            }
        }

        parents.push(parentCapId);
    }

    return parents;
}

/*******************************************************
| Script/Function: Avo_GetDateFromAccelaDateString()
| Usage: Convert an Accela formatted date string into a js date object
| Modified by: ()
*********************************************************/
