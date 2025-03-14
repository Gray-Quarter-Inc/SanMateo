/*******************************************************
| Script/Function: BB_008_GETFOLDERBYNAME()
| Created by: Tom Grzegorczyk   
| Created on: 29 Oct 2020
| Usage: Get BlueBeam folder by name
| Prerequisites: Requires BB_007_GETFOLDERITEMS
| Modified by: ()
*********************************************************/
function GETFOLDERBYNAME(token, projectId, parentFolderId, folderName) {
    var folderId = null;
    try {
        if (token != null && projectId != null && parentFolderId != null) {
            var response = GETFOLDERITEMS(token, projectId, parentFolderId);
            if (response.ProjectFolders) {
                var folders = response.ProjectFolders;
                for (var f in folders) {
                    var folder = response.ProjectFolders[f];
                    if (folder.Name && folder.ParentFolderId) {
                        if (folder.Name == folderName && folder.ParentFolderId == parentFolderId) {
                            folderId = folder.Id;
                            break;
                        }
                    }
                }
            } else {
                Avo_LogDebug("GETFOLDERBYNAME() - No folders found in BlueBeam for projectId(" + projectId + ")", 2);
            }
        }
    } catch (ex) {
        Avo_LogDebug("**Error in GETFOLDERBYNAME(token," + projectId + "," + parentFolderId + "): " + ex.message, 1);
    }
    return folderId;
}
