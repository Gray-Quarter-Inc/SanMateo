/*******************************************************
| Script/Function: BB_010_CREATESESSION()
| Created by: Tom Grzegorczyk   
| Created on: 6 Nov 2020
| Usage: Create new BlueBeam session, invite a user by email address and check out all record files to session
| Modified by: ()
*********************************************************/
function CREATESESSION(token, recordFolderId) {
    try {
        var sessionId = getAppSpecific("Session Id");
        if (sessionId != null) {
            Avo_LogDebug("BB_010_CREATESESSION - Session ID is not empty, new session won't be created", 1);
            return false;
        }

        var altID = cap.getCapModel().altID;
        var name = altID + ' - ' + getAddressPart();
        var email = "";//'tom.grzegorczyk@avocette.com;cshimamoto@smcgov.org';
        Avo_LogDebug("BB_010_CREATESESSION - Creating session " + name);
        if (email != "") {
            Avo_LogDebug("BB_010_CREATESESSION - Session invitation will be sent to: " + email);
        }
        var result = CreateNewSession(token, projectId, recordFolderId, name, email);
        if (result != null && result != false && result.Id) {
            var newSessionId = result["Id"];
            if (newSessionId != null) {
                editAppSpecific("Session Id", newSessionId);
                return newSessionId;
            }
            Avo_LogDebug("BB_010_CREATESESSION - Failed to create session");
            return false;
        } else {
            Avo_LogDebug("BB_010_CREATESESSION - Failed to create session");
            return false;
        }
    } catch (ex) {
        Avo_LogDebug("**Error in createSession(): " + ex.message, 1);
        //showComment("BlueBeam integration failed. Check logs for error. (2)");
        return false;
    }
}

function CreateNewSession(token, projectId, folderId, name, email) {
    if (adapterUrl == undefined || adapterUrl == null || adapterUrl == "") {
        Avo_LogDebug("BB_010_CREATESESSION - URL in BB_CONFIGS is not set", 1);
        return null;
    }

    var fullUrl = adapterUrl + "/api/session/add_from_accela";
    var headers = aa.httpClient.initPostParameters();
    headers.put("Authorization", "Bearer " + token);
    headers.put("Content-Type", "application/json");
    var body = '{"Name": "' + name + '", "Email": "' + email + '", "ProjectId": "' + projectId + '", "FolderId": "' + folderId + '", "Notification": "true", "Restricted": "false"}';
    //Avo_LogDebug("BB_010_CREATESESSION() - body: " + body, 2);
    try {
        client = aa.httpClient.post(fullUrl, headers, body);
        if (!client.getSuccess()) {
            Avo_LogDebug("**Error in BB_010_CREATESESSION CreateNewSession(): " + client.message, 1);
            return false;
        }

        var json = String(client.getOutput());
        //Avo_LogDebug("Json(" + json + ")", 2);  //debug

        if (!json) {
            Avo_LogDebug("BB_010_CREATESESSION CreateNewSession() - Response is empty. Returning null", 2);
            return null;
        }
        //Avo_LogDebug("BB_010_CREATESESSION - Result: " + json, 2);
        var response = JSON.parse(json);
        return response;
    } catch (ex) {
        Avo_LogDebug("**Error in BB_010_CREATESESSION CreateNewSession(): " + ex.message, 1);
        return false;
    }
}

function getAddressPart() {
    var result = aa.address.getAddressByCapId(capId);
    if (result.getSuccess() != true) {
        log('Failed to get addresses on record ' + altId + '. ' + result.errorType + ": " + result.errorMessage, 1);
    }

    var addr = "";
    var allAddressModels = result.getOutput();
    for (var i in allAddressModels) {
        var addressModel = allAddressModels[i];
        if (allAddressModels.length > 1 && addressModel.primaryFlag != "Y") {
            continue;
        }
        if (!addr || addr.length == 0 || addr.toLowerCase() == "null") {
            //remove spaces
            addr = String(addressModel.houseNumberStart + ' ' + addressModel.streetName + ' ' + addressModel.streetSuffix);
            //take up to 10 characters
        }

        break;
    }
    return addr;
}

function REACTIVATESESSION(token, sessionId) {
    if (adapterUrl == undefined || adapterUrl == null || adapterUrl == "") {
        Avo_LogDebug("BB_010_REACTIVATESESSION() - URL in BB_CONFIGS is not set", 1);
        return null;
    }

    var endpointUrl = "/api/session/" + sessionId;

    var headers = aa.httpClient.initPostParameters();
    headers.put("Authorization", "Bearer " + token);
    headers.put("Content-Type", "application/json");
    var body = '{"Status": "Active"}';

    try {
        var client = aa.httpClient.post(adapterUrl + endpointUrl, headers, body);
        if (!client.getSuccess()) {
            Avo_LogDebug("**Error in BB_010_REACTIVATESESSION() : " + client.message, 1);
            return false;
        } else {
            return true;
        }
    } catch (ex) {
        Avo_LogDebug("**Error in BB_010_REACTIVATESESSION() : " + ex.message, 1);
        return false;
    }
    return false;
}