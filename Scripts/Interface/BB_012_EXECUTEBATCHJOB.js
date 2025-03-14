/*******************************************************
| Script/Function: BB_012_EXECUTEBATCHJOB
| Created by: Tom Grzegorczyk   
| Created on: 23 Dec 2020
| Usage: Executes a adapter batch job at provided endpoint and brings back it's result
| Modified by: ()
*********************************************************/
function EXECUTEBATCHJOB(adapterUrl, endpoint, params) {
    if (adapterUrl == null || adapterUrl == "") {
        Avo_LogDebug("BB_012_EXECUTEBATCHJOB() - URL in BB_CONFIGS is not set", 1);
        return null;
    }
    var fullUrl = adapterUrl + "/api/batch/" + endpoint;
    var counter = 0;
    for (var p in params) {
        if (counter > 0) {
            fullUrl += "&";
        } else {
            fullUrl += "?";
        }
        fullUrl += p + "=" + params[p];
        counter++;
    }

    //Avo_LogDebug("BB_012_EXECUTEBATCHJOB - url: " + fullUrl, 1);
    var headers = aa.httpClient.initPostParameters();
    headers.put("Authorization", "Bearer " + token);
    headers.put("Content-Type", "application/json");

    try {
        client = aa.httpClient.post(fullUrl, headers, '');
        if (!client.getSuccess()) {
            Avo_LogDebug("**Error in BB_012_EXECUTEBATCHJOB: " + client.message, 1);
            return false;
        }

        var json = String(client.getOutput());
        // Avo_LogDebug("BB_012_EXECUTEBATCHJOB - Json(" + json + ")", 2);  //debug

        if (!json) {
            Avo_LogDebug("BB_012_EXECUTEBATCHJOB - Response is empty. Returning null", 2);
            return null;
        }
        Avo_LogDebug("BB_012_EXECUTEBATCHJOB - Result: " + json, 2);
        var response = JSON.parse(json);
        return response;
    } catch (ex) {
        Avo_LogDebug("**Error in BB_012_EXECUTEBATCHJOB: " + ex.message, 1);
        return false;
    }
}
