/*******************************************************
| Script/Function: BB_016_SESSIONCHANGEOWNER
| Created by: Tom Grzegorczyk   
| Created on: 24 Feb 2021
| Usage: Change ownership of BlueBeam session
| Modified by: ()
*********************************************************/
function SESSIONCHANGEOWNER(token, sessionId, email) {
    if (adapterUrl == undefined || adapterUrl == null || adapterUrl == "") {
        Avo_LogDebug("BB_016_SESSIONCHANGEOWNER() - URL in BB_CONFIGS is not set", 1);
        return null;
    }

    var endpointUrl = "/api/session/" + sessionId + "/update_owner";

    var headers = aa.httpClient.initPostParameters();
    headers.put("Authorization", "Bearer " + token);
    headers.put("Content-Type", "application/json");
    var body = '{"Email": "' + email + '"}';

    try {
        var client = aa.httpClient.post(adapterUrl + endpointUrl, headers, body);
        if (!client.getSuccess()) {
            Avo_LogDebug("**Error in BB_016_SESSIONCHANGEOWNER() : " + client.message, 1);
            return false;
        } else {
            return true;
        }
    } catch (ex) {
        Avo_LogDebug("**Error in BB_016_SESSIONCHANGEOWNER() : " + ex.message, 1);
        return false;
    }
    return false;
}