/*******************************************************
| Script/Function: BB_DUAA
| Created by: Tom Grzegorczyk  
| Created on: 3 Nov 2020
| Usage: Run BlueBeam integration for Document Update After (DUAA) event
|        This script checks for a 'Manual Upload' flag and executes manual file upload to BlueBeam        
| Modified by: ()
*********************************************************/
var projectId = lookup("BB_CONFIGS", "PROJECT_ID");
var adapterUrl = lookup("BB_CONFIGS", "URL");
var recordFolderId = getAppSpecific("Record Folder Id");

eval(getScriptText("BB_000_HELPERS"));
eval(getScriptText("BB_001_GETBLUEBEAMTOKEN"));
eval(getScriptText("BB_003_CREATEBLUEBEAMFILE"));
eval(getScriptText("BB_010_CREATESESSION"));
eval(getScriptText("BB_006_UPLOADFILE"));
eval(getScriptText("BB_014_GETSESSION"));
eval(getScriptText("BB_017_CHECKOUTFILE"));

(function () {
    Avo_LogDebug("BB_DUAA - Initiated", 1);
    if (projectId == undefined || projectId == null) {
        Avo_LogDebug(
            "BB_DUAA - PROJECT_ID in BB_CONFIGS is not set", 1
        );
        return;
    }

    if (adapterUrl == undefined || adapterUrl == null || adapterUrl == "") {
        Avo_LogDebug("BB_DUAA - URL in BB_CONFIGS is not set", 1);
        return;
    }


    if (recordFolderId == null || recordFolderId == "") {
        Avo_LogDebug("BB_DUAA - Record Folder Not Found", 1);
        return;
    }

    try {
        if (documentModel && documentModel != null && templateObj && templateObj != null && templateObj.templateForms && templateObj.templateForms != null) {
            var fileId = GETDOCUMENTASI(
                templateObj.templateForms,
                "BLUEBEAM",
                "File Id"
            );
            var manualUpload = GETDOCUMENTASI(
                templateObj.templateForms,
                "BLUEBEAM",
                "Manual Upload"
            );
            var toSession = GETDOCUMENTASI(
                templateObj.templateForms,
                "BLUEBEAM",
                "Add to Session"
            );
            // Get token
            var token = GETBLUEBEAMTOKEN();
            if (token == null) {
                Avo_LogDebug(
                    "BB_DUAA - Failed to get token from Accela BlueBeam Adapter", 1
                );
                return;
            }

            if (fileId == null || fileId == "") {
                if (manualUpload == "CHECKED") {
                    Avo_LogDebug("BB_DUAA - Manual file upload to BlueBeam requested", 2);
                    var result = UPLOADFILE(token, null, projectId, recordFolderId);
                    if (result == true) {
                        Avo_LogDebug("BB_DUAA - File uploaded successfully", 2);
                    }
                } else {
                    Avo_LogDebug("BB_DUAA - File not in BlueBeam. To upload it manually check 'Manual Upload' checkbox.", 2);
                }

            } else {
                Avo_LogDebug("BlueBeam File Id: " + fileId, 2);
                if (toSession == "CHECKED") {
                    Avo_LogDebug("BB_DUAA - Add file to BlueBeam session requested", 2);
                    var sessionId = getAppSpecific("Session Id", capId);
                    var session = GETSESSION(token, sessionId);
                    Avo_LogDebug("BB_DUAA - Session: " + JSON.stringify(session), 2);
                    if (session == null || session["Id"] == null) {
                        Avo_LogDebug("BB_DUAA - Session not found. Creating new session ", 1);
                        //BB_010_CREATESESSION
                        var sessionId = CREATESESSION(token, recordFolderId);
                        if (sessionId != false && sessionId != "") {
                            //BB_000_HELPERS
                            var email = GETEMAILASSIGNEDTOCAP(capId);
                            if (email != null && email != "") {
                                Avo_LogDebug("BB_ASIUA - Updating session owner to " + email, 2);
                                var sessionUpdated = SESSIONCHANGEOWNER(token, sessionId, email);
                                if (sessionUpdated) {
                                    Avo_LogDebug("BB_ASIUA - Session " + sessionId + " reassigned to " + email, 2);
                                }
                            }
                        }
                    }
                    else if (session["Status"] != "Active") {
                        Avo_LogDebug("BB_DUAA - Reactivating BlueBeam session", 2);
                        var success = REACTIVATESESSION(token, sessionId);
                        if (success === true) {
                            Avo_LogDebug("BB_DUAA - Session status set to 'Active' ", 1);
                        } else {
                            Avo_LogDebug("BB_DUAA - Unable to reactivate the session. ", 1);
                        }
                    }

                    var success = CHECKOUTFILE(token, projectId, fileId, sessionId);
                    if (success == true) {
                        var docStatus = lookup("BB_CONFIGS", "DOCUMENT_STATUS_SESSION");
                        Avo_LogDebug("File " + fileId + " was checked out to session " + sessionId, 2);
                        documentModel.setDocStatus(docStatus);
                        documentModel.setDocStatusDate(aa.util.now());
                        var updateResult = aa.document.updateDocument(documentModel);
                        if (updateResult.getSuccess()) {
                            Avo_LogDebug("BB_DUAA - Document Status updated to '" + docStatus + "'", 2);
                        } else {
                            Avo_LogDebug("*Warning in BB_DUAA: Document Status update failed!", 2);
                        }
                    } else {
                        Avo_LogDebug("Unable to checkout file " + fileId);
                    }

                    EDITDOCUMENTASI(templateObj, "BLUEBEAM", "Add to Session", null, documentModel);
                }
            }
        }
    }
    catch (ex) {
        Avo_LogDebug("BB_DUAA - Error: " + ex, 1);
    }
})();
