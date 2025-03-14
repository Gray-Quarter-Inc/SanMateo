/*******************************************************
| Script/Function: BB_014_GETSESSION()
| Created by: Tom Grzegorczyk   
| Created on: 19 Feb 2021
| Usage: Get BlueBeam session
| Modified by: ()
*********************************************************/
function GETSESSION(token, sessionId) {
    if (adapterUrl == undefined || adapterUrl == null || adapterUrl == "") {
        Avo_LogDebug("BB_014_GETSESSION - URL in BB_CONFIGS is not set", 1);
        return null;
    }
    var endpointUrl = "/api/session/" + sessionId;

    var headers = aa.httpClient.initPostParameters();
    headers.put("Authorization", "Bearer " + token);

    try {
        var client = aa.httpClient.get(adapterUrl + endpointUrl, headers);
        if (!client.getSuccess()) {
            Avo_LogDebug("**ERROR in BB_014_GETSESSION(): " + client.message, 1);
            return null;
        }

        var response = JSON.parse(String(client.getOutput()));
        return response;
    } catch (ex) {
        Avo_LogDebug("**Error in BB_014_GETSESSION(): " + ex.message, 1);
        return null;
    }
} 
