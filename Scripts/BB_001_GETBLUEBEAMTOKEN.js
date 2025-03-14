/*******************************************************
| Script/Function: BB_001_GETBLUEBEAMTOKEN()
| Created by: Tom Grzegorczyk   
| Created on: 3 Nov 2020
| Usage: Get BlueBeam Adapter authorization token
| Modified by: ()
*********************************************************/
function GETBLUEBEAMTOKEN() {
    if (adapterUrl == undefined || adapterUrl == null || adapterUrl == "") {
        Avo_LogDebug("BB_001_GETBLUEBEAMTOKEN - URL in BB_CONFIGS is not set", 1);
        return null;
    }
    var username = lookup("BB_CONFIGS", "API_USER");
    if (username == null || username == "") {
        Avo_LogDebug("BB_001_GETBLUEBEAMTOKEN - API_USER in BB_CONFIGS is not set", 1);
        return null;
    }
    var password = lookup("BB_CONFIGS", "API_PASSWORD");
    if (password == null || password == "") {
        Avo_LogDebug("BB_001_GETBLUEBEAMTOKEN - API_PASSWORD in BB_CONFIGS is not set", 1);
        return null;
    }
    var tokenUrl = "/Token";

    var params = aa.httpClient.initPostParameters();
    params.put("grant_type", "password");
    params.put("username", username);
    params.put("Password", password);

    // printLine(Serialize(params, false));  //debug

    var client = aa.httpClient.post(adapterUrl + tokenUrl, params);
    if (!client.getSuccess()) {
        Avo_LogDebug("**ERROR in BB_001_GETBLUEBEAMTOKEN: " + client.message, 1);
        return null;
    }

    var response = JSON.parse(String(client.getOutput()));

    var token = response.access_token;
    if (token.length <= 0) {
        Avo_LogDebug("**ERROR in BB_001_GETBLUEBEAMTOKEN: unable to get token", 1);
        return null;
    }
    //Avo_LogDebug("BLUEBEAM TOKEN=" + token);
    return token; 
}
