/*******************************************************
| Script/Function: BB_007_GETFOLDERITEMS()
| Created by: Tom Grzegorczyk   
| Created on: 29 Oct 2020
| Usage: Gets a list of all items within a folder
| Modified by: ()
*********************************************************/
function GETFOLDERITEMS(token, projectId, folderId) {
    if (adapterUrl == undefined || adapterUrl == null || adapterUrl == "") {
        Avo_LogDebug("BB_007_GETFOLDERS - URL in BB_CONFIGS is not set", 1);
        return null;
    }
    var endpointUrl = "/api/project/" + projectId + "/folder/" + folderId + "/items";

    var headers = aa.httpClient.initPostParameters();
    headers.put("Authorization", "Bearer " + token);

    try {
        var client = aa.httpClient.get(adapterUrl + endpointUrl, headers);
        if (!client.getSuccess()) {
            Avo_LogDebug("**ERROR in BB_007_GETFOLDERS Info: " + client.message, 1);
            return null;
        }
        Avo_LogDebug("BB_007_GETFOLDERS client.getOutput(): " + client.getOutput(), 2);
        var response = JSON.parse(String(client.getOutput()));
        return response;
    } catch (ex) {
        Avo_LogDebug("**Error in BB_007_GETFOLDERS Info: " + ex.message, 1);
        return null;
    }
} 
