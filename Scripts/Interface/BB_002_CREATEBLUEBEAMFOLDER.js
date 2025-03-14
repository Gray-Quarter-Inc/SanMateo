/*******************************************************
| Script/Function: BB_002_CREATEBLUEBEAMFOLDER
| Created by: Tom Grzegorczyk   
| Created on: 3 Nov 2020
| Usage: Create a BlueBeam folder
| Modified by: ()
*********************************************************/
function CREATEBLUEBEAMFOLDER(token, projectId, name, parentFolderId, comment) {
    if (adapterUrl == undefined || adapterUrl == null || adapterUrl == "") {
        Avo_LogDebug("BB_002_CREATEBLUEBEAMFOLDER() - URL in BB_CONFIGS is not set", 1);
        return null;
    }

    var endpointUrl = "/api/project/" + projectId + "/folder/";

    var headers = aa.httpClient.initPostParameters();
    headers.put("Authorization", "Bearer " + token);
    headers.put("Content-Type", "application/json");
    var body = '{"Name": "' + name + '", "ParentFolderId": "' + parentFolderId + '", "Comment": "' + comment + '"}';

    try {
        client = aa.httpClient.post(adapterUrl + endpointUrl, headers, body);
        if (!client.getSuccess()) {
            Avo_LogDebug("**Error in BB_002_CREATEBLUEBEAMFOLDER: " + client.message, 1);
            return false;
        }

        var json = String(client.getOutput());
        // logDebug("BB_002_CREATEBLUEBEAMFOLDER - Json(" + json + ")");  //debug

        if (!json) {
            Avo_LogDebug("BB_002_CREATEBLUEBEAMFOLDER - Response is empty. Returning null", 1);
            return null;
        }
        Avo_LogDebug("BB_002_CREATEBLUEBEAMFOLDER - Result: " + json);
        var response = JSON.parse(json);
        return response;
    } catch (ex) {
        Avo_LogDebug("**Error in BB_002_CREATEBLUEBEAMFOLDER: " + ex.message, 1);
        return false;
    }
}