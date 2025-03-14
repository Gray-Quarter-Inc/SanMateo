/*******************************************************
| Script/Function: BB_003_CREATEBLUEBEAMFILE()
| Created by: Tom Grzegorczyk   
| Created on: 3 Nov 2020
| Usage: Create Project File via BlueBeam Adaper. This function is prepared to be run via async call as document file is not yet saved at DUA event.
| Modified by: ()
*********************************************************/
function CREATEBLUEBEAMFILE(token, name, projectId, parentFolderId, documentId, environment) {
    if (adapterUrl == undefined || adapterUrl == null || adapterUrl == "") {
        Avo_LogDebug("BB_003_CREATEBLUEBEAMFILE - URL in BB_CONFIGS is not set", 1);
        return null;
    }
    var fullUrl =
        adapterUrl + "/api/project/" + projectId + "/file/construct?environment=" + environment;

    var headers = aa.httpClient.initPostParameters();
    headers.put("Authorization", "Bearer " + token);
    headers.put("Content-Type", "application/json");
    var body = '{"Name":"' + name + '", "ParentFolderId":' + parentFolderId + ',"DocumentId": "' + documentId + '"}';

    try {
        client = aa.httpClient.post(fullUrl, headers, body);
        if (!client.getSuccess()) {
            Avo_LogDebug("**Error in BB_003_CREATEBLUEBEAMFILE: " + client.message, 1);
            return false;
        }

        var json = String(client.getOutput());
        // Avo_LogDebug("BB_003_CREATEBLUEBEAMFILE - Json(" + json + ")", 2);  //debug

        if (!json) {
            Avo_LogDebug("BB_003_CREATEBLUEBEAMFILE - Response is empty. Returning null", 2);
            return null;
        }
        Avo_LogDebug("BB_003_CREATEBLUEBEAMFILE - Result: " + json, 2);
        var response = JSON.parse(json);
        return response;
    } catch (ex) {
        Avo_LogDebug("**Error in BB_003_CREATEBLUEBEAMFILE: " + ex.message, 1);
        return false;
    }
}