/*******************************************************
| Script/Function: BB_005_UPDATEBLUEBEAMFOLDER
| Created by: Tom Grzegorczyk   
| Created on: 3 Nov 2020
| Usage: Update BlueBeam folder name
| Modified by: ()
*********************************************************/
function UPDATEBLUEBEAMFOLDER(token, projectId, folderId, name, parentFolderId) {
    if (adapterUrl == undefined || adapterUrl == null || adapterUrl == "") {
        Avo_LogDebug("BB_005_UPDATEBLUEBEAMFOLDER - URL in BB_CONFIGS is not set", 1);
        return null;
    }

    var endpointUrl = "/api/project/" + projectId + "/folder/" + folderId;

    var headers = aa.httpClient.initPostParameters();
    headers.put("Authorization", "Bearer " + token);
    headers.put("Content-Type", "application/json");
    var body = '{"Name": "' + name + '", "ParentFolderId": "' + parentFolderId + '"}';

    try {
        var client = aa.httpClient.post(adapterUrl + endpointUrl, headers, body);
        if (!client.getSuccess()) {
            Avo_LogDebug("**Error in BB_005_UPDATEBLUEBEAMFOLDER: " + client.message, 1);
            return false;
        } else {
            return true;
        }
    } catch (ex) {
        Avo_LogDebug("**Error in BB_005_UPDATEBLUEBEAMFOLDER: " + ex.message, 1);
        return false;
    }
}