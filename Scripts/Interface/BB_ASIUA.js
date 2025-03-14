/*******************************************************
| Script/Function: BB_ASIUA
| Created by: Tom Grzegorczyk   
| Created on: 3 Nov 2020
| Usage: Run BlueBeam integration for Application Specific Information Submit After (ASIUA) event
| Modified by: ()
*********************************************************/
var adapterUrl = lookup("BB_CONFIGS", "URL");
var projectId = lookup("BB_CONFIGS", "PROJECT_ID");

eval(getScriptText("BB_000_HELPERS"));
eval(getScriptText("BB_001_GETBLUEBEAMTOKEN"));
eval(getScriptText("BB_002_CREATEBLUEBEAMFOLDER"));
eval(getScriptText("BB_007_GETFOLDERITEMS"));
eval(getScriptText("BB_008_GETFOLDERBYNAME"));
eval(getScriptText("BB_010_CREATESESSION"));
eval(getScriptText("BB_014_GETSESSION"));
eval(getScriptText("BB_016_SESSIONCHANGEOWNER"));
eval(getScriptText("BB_017_CHECKOUTFILE"));

(function () {
    Avo_LogDebug("BB_ASIUA - Initiated", 1);
    if (adapterUrl == undefined || adapterUrl == null || adapterUrl == "") {
        Avo_LogDebug("BB_DUAA - URL in BB_CONFIGS is not set", 1);
        //showComment("BlueBeam integration failed. Missing BlueBeam configuration. ");
        return;
    }

    if (projectId == undefined || projectId == null) {
        Avo_LogDebug("BB_ASIUA - PROJECT_ID in BB_CONFIGS is not set", 1);
        //showComment("BlueBeam integration failed. Missing BlueBeam configuration.");
        return;
    }

    //Get token
    var token = GETBLUEBEAMTOKEN();
    var recordFolderId = getAppSpecific("Record Folder Id");
    var retryRecordFolder = getAppSpecific("Retry Record Folder");
    var renewSession = getAppSpecific("Create / Renew Session");
    var addToSession = getAppSpecific("Add to Session");
    Avo_LogDebug("BB_ASIUA - recordFolderId: " + recordFolderId, 2);
    Avo_LogDebug("BB_ASIUA - retryRecordFolder: " + retryRecordFolder, 2);
    Avo_LogDebug("BB_ASIUA - renewSession: " + renewSession, 2);
    Avo_LogDebug("BB_ASIUA - addToSession: " + addToSession, 2);

    if (token != null) {
        if (retryRecordFolder == "CHECKED" && (recordFolderId == null || recordFolderId == "")) {
            Avo_LogDebug("BB_ASIUA - Creating Record Folder in BlueBeam. ", 1);
            createRecordFolder(token);
        }
        if (renewSession == "CHECKED") {
            Avo_LogDebug("BB_ASIUA - Renewing BlueBeam session ", 1);
            renewBlueBeamSession(token, recordFolderId);
        }
        if (addToSession == "CHECKED") {
            Avo_LogDebug("BB_ASIUA - Adding documents to session. ", 1);
            addToBlueBeamSession(token);
        }
    } else {
        Avo_LogDebug("BB_ASIUA - Failed to get token from BlueBeam Adapter", 1);
        return;
    }

})();

function createRecordFolder(token) {

    var capModel = cap.getCapModel();
    var module = String(capModel.moduleName);
    // Get parent folder for this record type
    var parentCapID = capModel.parentCapID;
    var parentFolderId = null;

    if (parentCapID != null) {
        //Get parent record folder
        parentFolderId = getAppSpecific("Record Folder Id", parentCapID);
    }

    if (parentFolderId == null || parentFolderId == "") {
        // Get record module folder
        Avo_LogDebug(' Cap module: ' + module.toUpperCase(), 1);
        var moduleFolderId = GETRECORDMODULEFOLDER(module.toUpperCase());
        if (moduleFolderId == null || moduleFolderId == "") {
            Avo_LogDebug("BB_ASIUA - Record module folder not found", 1);
            return;
        }
        var d = new Date();
        var year = d.getFullYear();
        var yearFolderId = GETFOLDERBYNAME(token, projectId, moduleFolderId, year);
        if (yearFolderId == null) {
            Avo_LogDebug("BB_ASIUA - Year folder not found for module '" + module.toUpperCase() + "'", 1);
            return false;
        }
        parentFolderId = yearFolderId;
    }

    // Create BlueBeam Folder for Record
    var name = cap.getCapModel().altID + ' - ' + getAddressPart();
    var result = CREATEBLUEBEAMFOLDER(token, projectId, name, parentFolderId, "Record Folder");
    if (result != null) {
        folderId = result["Id"];
        if (folderId != null) {
            editAppSpecific("Record Folder Id", folderId);
            editAppSpecific("Retry Record Folder", null);
            Avo_LogDebug("BB_ASIUA - Record Folder created successfully!", 1);

            if (module.toUpperCase() == "BUILDING") {
                // Create 'Approved Plans' folder
                var result2 = CREATEBLUEBEAMFOLDER(token, projectId, "Approved Plans", folderId, "Automation Folder - all files existing in this folder will be downloaded to Accela when key workflow task is triggered");
                if (result2 != null) {
                    var subFolderId = result2["Id"];
                    if (subFolderId != null) {
                        Avo_LogDebug("BB_ASIUA - 'Approved Plans' folder created successfully", 1);
                    }
                }

                // Create 'Pre-Construction Plans' folder
                var result3 = CREATEBLUEBEAMFOLDER(token, projectId, "Pre-Construction Plans", folderId, "Automation Folder - all files existing in this folder will be downloaded to Accela when key workflow task is triggered");
                if (result3 != null) {
                    var subFolderId = result3["Id"];
                    if (subFolderId != null) {
                        Avo_LogDebug("BB_ASIUA - 'Pre-Construction Plans' folder created successfully", 1);
                    }
                }

                // Create 'Archive' folder
                var result4 = CREATEBLUEBEAMFOLDER(token, projectId, "Archive", folderId, "Archive Folder - a housekeeping folder to stash old submittals so that they are not being worked on");
                if (result4 != null) {
                    var subFolderId = result4["Id"];
                    if (subFolderId != null) {
                        Avo_LogDebug("BB_ASIUA - 'Archive' folder created successfully", 1);
                    }
                }

                // Create 'Review Comments' folder
                var result5 = CREATEBLUEBEAMFOLDER(token, projectId, "Review Comments", folderId, "Review Comments - folder to store Comment Sheet file");
                if (result5 != null) {
                    var subFolderId = result5["Id"];
                    if (subFolderId != null) {
                        Avo_LogDebug("BB_ASA - 'Review Comments' folder created successfully", 1);
                    }
                }
            } else if (module.toUpperCase() == "PUBLICWORKS") {
                // Create 'Complete Package' folder
                var result2 = CREATEBLUEBEAMFOLDER(token, projectId, "Complete Package", folderId, "Complete Package - folder to store Complete Package file");
                if (result2 != null) {
                    var subFolderId = result2["Id"];
                    if (subFolderId != null) {
                        Avo_LogDebug("BB_ASA - 'Complete Package' folder created successfully", 1);
                    }
                }
                // Create 'Archive' folder
                var result3 = CREATEBLUEBEAMFOLDER(token, projectId, "Archive", folderId, "Archive Folder - a housekeeping folder to stash old submittals so that they are not being worked on");
                if (result3 != null) {
                    var subFolderId = result3["Id"];
                    if (subFolderId != null) {
                        Avo_LogDebug("BB_ASA - 'Archive' folder created successfully", 1);
                    }
                }
            }
        } else {
            Avo_LogDebug("BB_ASIUA - Failed to create Record Folder, see adapter logs for more details.", 1);
        }
    }
}

function renewBlueBeamSession(token, recordFolderId) {
    var sessionId = getAppSpecific("Session Id");
    var session = GETSESSION(token, sessionId);
    if (session == null || session["Id"] == null) {
        Avo_LogDebug("BB_ASIUA - Session not found. Creating new session ", 1);
        //BB_010_CREATESESSION
        var sessionId = CREATESESSION(token, recordFolderId);
        if (sessionId != false && sessionId != "") {
            editAppSpecific("Session Id", sessionId, capId);
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
    //else if (session["Status"] != "Active") {
    //    Avo_LogDebug("BB_ASIUA - Session found. Session status is not 'Active'. Removing value from 'Session Id' ASI ", 1);
    //    var success = REACTIVATESESSION(token, sessionId);
    //    if (success === true) {
    //        Avo_LogDebug("BB_ASIUA - Session status set to 'Active' ", 1);
    //    } else {
    //        Avo_LogDebug("BB_ASIUA - Unable to reactivate the session. ", 1);
    //    }
    //}
    editAppSpecific("Create / Renew Session", null);
}

function addToBlueBeamSession(token) {
    var sessionId = getAppSpecific("Session Id");
    var desiredStatus = lookup("BB_CONFIGS", "DOCUMENT STATUS");
    var newStatus = lookup("BB_CONFIGS", "DOCUMENT_STATUS_SESSION");
    // Get all documents on a record
    var result = aa.document.getCapDocumentList(capId, "ADMIN");
    if (result.getSuccess() != true) {
        Avo_LogDebug(
            "BB_ASIUA - Failed to find any documents. " +
            result.errorType +
            ": " +
            result.errorMessage,
            1
        );
        return false;
    }

    var allDocs = result.getOutput();
    for (i in allDocs) {
        var doc = allDocs[i];
        var documentId = doc["documentNo"];
        doc = aa.document.getDocumentByPK(documentId).getOutput();
        if (doc.template == null) {
            doc.getTemplate();
        }
        var currentStatus = doc.getDocStatus();

        if (currentStatus == desiredStatus) {
            //Check template
            if (doc.template != null) {
                var forms = doc.template.templateForms;
                if (forms != null) {
                    var fileId = GETDOCUMENTASI(
                        forms,
                        "BLUEBEAM",
                        "File Id"
                    );

                    var success = CHECKOUTFILE(token, projectId, fileId, sessionId);
                    if (success == true) {
                        Avo_LogDebug("File " + fileId + " was checked out to session " + sessionId, 2);
                        doc.setDocStatus(newStatus);
                        doc.setDocStatusDate(aa.util.now());
                        var updateResult = aa.document.updateDocument(doc);
                        if (updateResult.getSuccess()) {
                            Avo_LogDebug("BB_ASIUA - Document Status updated to '" + newStatus + "'", 2);
                        } else {
                            Avo_LogDebug("*Warning in BB_ASIUA: Document Status update failed!", 2);
                        }
                    } else {
                        Avo_LogDebug("Unable to checkout file " + fileId);
                    }

                    EDITDOCUMENTASI(doc.template, "BLUEBEAM", "Add to Session", null, doc);
                }
            } else {
                Avo_LogDebug("BB_ASIUA documentId(" + documentId + ") fileName(" + doc.getFileName() + ") - No template found. Skipping. ", 2);
            }
        } else {
            Avo_LogDebug("BB_ASIUA document status(" + currentStatus + "). Skipping. ", 2);
        }
    }

    editAppSpecific("Add to Session", null);
    return true;
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

if (matches(currentUserID, "AVOCETTE") && showMessage != true) {
    showMessage = true;
    comment(debug); //debug
}