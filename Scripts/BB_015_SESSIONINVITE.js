/*******************************************************
| Script/Function: BB_015_SESSIONINVITE
| Created by: Tom Grzegorczyk   
| Created on: 24 Feb 2021
| Usage: Invite user to BlueBeam session
| Modified by: ()
*********************************************************/
function SESSIONINVITE(token, sessionId, email, message) {
    if (adapterUrl == undefined || adapterUrl == null || adapterUrl == "") {
        Avo_LogDebug("BB_015_SESSIONINVITE() - URL in BB_CONFIGS is not set", 1);
        return null;
    }

    var endpointUrl = "/api/session/" + sessionId + "/invite";

    var headers = aa.httpClient.initPostParameters();
    headers.put("Authorization", "Bearer " + token);
    headers.put("Content-Type", "application/json");
    var body = '{"Email": "' + email + '", "Message": "' + message + '"}';
    Avo_LogDebug("BB_003_CREATEBLUEBEAMFILE - body(" + body + ")", 2);
    try {
        aa.httpClient.post(adapterUrl + endpointUrl, headers, body);
        return true;
    } catch (ex) {
        //Avo_LogDebug("**Error in BB_015_SESSIONINVITE() : " + ex.message, 1);
        return true;
    }
}
