/*******************************************************
| Script/Function: BB_009_CREATEDOCUMENT()
| Created by: Tom Grzegorczyk   
| Created on: 4 Nov 2020
| Usage: Create new Record Document with a file content from URL
| Modified by: ()
*********************************************************/
function CREATEDOCUMENT(token, capId, docGroup, docCategory, fileType, fileName, url, description, environment) {
    if (adapterUrl == undefined || adapterUrl == null || adapterUrl == "") {
        Avo_LogDebug("BB_009_CREATEDOCUMENT() - URL in BB_CONFIGS is not set", 1);
        return null;
    }
    var fullUrl = adapterUrl + "/api/record/" + capId + "/document?environment=" + environment;
    //Avo_LogDebug("BB_009_CREATEDOCUMENT - url: " + fullUrl, 1);
    var headers = aa.httpClient.initPostParameters();
    headers.put("Authorization", "Bearer " + token);
    headers.put("Content-Type", "application/json");
    var body = '{"DocGroup": "' + docGroup + '", "DocCategory": "' + docCategory + '", "FileType": "' + fileType + '", "FileName": "' + fileName + '", "Url": "' + url + '","Description": "' + description + '"}';
    //Avo_LogDebug("BB_009_CREATEDOCUMENT - body: " + body, 1);
    try {
        client = aa.httpClient.post(fullUrl, headers, body);
        if (!client.getSuccess()) {
            Avo_LogDebug("**Error in BB_009_CREATEDOCUMENT: " + client.message, 1);
            return false;
        }

        var json = String(client.getOutput());
        // Avo_LogDebug("BB_009_CREATEDOCUMENT - Json(" + json + ")", 2);  //debug

        if (!json) {
            Avo_LogDebug("BB_009_CREATEDOCUMENT - Response is empty. Returning null", 2);
            return null;
        }
        Avo_LogDebug("BB_009_CREATEDOCUMENT - Result: " + json, 2);
        var response = JSON.parse(json);
        return response;
    } catch (ex) {
        Avo_LogDebug("**Error in BB_009_CREATEDOCUMENT: " + ex.message, 1);
        return false;
    }
}