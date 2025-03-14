function Avo_NewRevisionCheck() {
    var updatedRevisionID = String(AInfo["Updated Revision ID"]);
    Avo_LogDebug("Updated Revision ID(" + updatedRevisionID + ")", 2); //debug

    if (!updatedRevisionID || updatedRevisionID.length == 0 || updatedRevisionID.toLowerCase() == "null") {
        return true;
    } else if (updatedRevisionID.toLowerCase() == "undefined") {
        return false; //ASI does not exist. The permit is not Revision.
    }

    return false;
}
/*******************************************************
| Script/Function: Avo_UpdateTaskAsUser(taskName, taskStatus, taskComment, taskNote, username, [processName], [recordId])
| Created by: Nicolaj Bunting
| Created on: 20Nov20
| Usage: update task taskName with status taskStatus as username, include taskComment, taskNote
| Modified by: ()
*********************************************************/
