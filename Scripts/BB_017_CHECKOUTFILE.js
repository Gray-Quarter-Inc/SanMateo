/*******************************************************
| Script/Function: BB_017_CHECKOUTFILE()
| Created by: Tom Grzegorczyk   
| Created on: 16 Jan 2023
| Usage: Checkout file to existing session
| Modified by: ()
*********************************************************/
function CHECKOUTFILE(token, projectId, fileId, sessionId) {
    try {
        if (adapterUrl == undefined || adapterUrl == null || adapterUrl == "") {
            Avo_LogDebug("BB_017_CHECKOUTFILE - URL in BB_CONFIGS is not set", 1);
            return null;
        }

        if (!fileId) {
            Avo_LogDebug("BB_017_CHECKOUTFILE - File ID is empty", 1);
            return false;
        }

        Avo_LogDebug("BB_017_CHECKOUTFILE - Checking out file " + fileId + " to session " + sessionId);

        var fullUrl = adapterUrl + "/api/project/" + projectId + "/file/" + fileId + "/checkout?sessionId=" + sessionId;
        var headers = aa.httpClient.initPostParameters();
        headers.put("Authorization", "Bearer " + token);
        headers.put("Content-Type", "application/json");
        var body = '';
        client = aa.httpClient.post(fullUrl, headers, body);
        if (!client.getSuccess()) {
            Avo_LogDebug("**Error in BB_017_CHECKOUTFILE Filed with message: " + client.message, 1);
            return false;
        }
        return true;
    } catch (ex) {
        Avo_LogDebug("**Error in createSession(): " + ex.message, 1);
        //showComment("BlueBeam integration failed. Check logs for error. (2)");
        return false;
    }
}
