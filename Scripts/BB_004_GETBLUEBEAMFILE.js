/*******************************************************
| Script/Function: BB_004_GETBLUEBEAMFILE()
| Created by: Tom Grzegorczyk   
| Created on: 3 Nov 2020
| Usage: Get BlueBeam file
| Modified by: ()
*********************************************************/
function GETBLUEBEAMFILE(token, projectId, fileId) {
    if (adapterUrl == undefined || adapterUrl == null || adapterUrl == "") {
        Avo_LogDebug("BB_004_GETBLUEBEAMFILE - URL in BB_CONFIGS is not set", 1);
        return null;
    }
    var endpointUrl = "/api/project/" + projectId + "/file/" + fileId;

    var headers = aa.httpClient.initPostParameters();
    headers.put("Authorization", "Bearer " + token);

    try {
        var client = aa.httpClient.get(adapterUrl + endpointUrl, headers);
        if (!client.getSuccess()) {
            Avo_LogDebug("**ERROR in BB_004_GETBLUEBEAMFILE Info: " + client.message, 1);
            return null;
        }

        var response = JSON.parse(String(client.getOutput()));
        return response;
    } catch (ex) {
        Avo_LogDebug("**Error in BB_004_GETBLUEBEAMFILE Info: " + ex.message, 1);
        return null;
    }
} 
