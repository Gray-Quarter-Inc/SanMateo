
/*******************************************************
| Script/Function: BB_ASA
| Created by: Tom Grzegorczyk   
| Created on: 3 Nov 2020
| Usage: Run BlueBeam integration for Application Submit After (ASA) event
|       This script creates module,record and download folders in 
|       preparation for the documents to be uploaded after an application 
|       has been submitted.
| Modified by: ()
*********************************************************/
eval(getScriptText("BB_000_HELPERS"));
eval(getScriptText("BB_001_GETBLUEBEAMTOKEN"));
eval(getScriptText("BB_002_CREATEBLUEBEAMFOLDER"));
eval(getScriptText("BB_003_CREATEBLUEBEAMFILE"));
eval(getScriptText("BB_007_GETFOLDERITEMS"));
eval(getScriptText("BB_008_GETFOLDERBYNAME"));

(function () {
    Avo_LogDebug("BB_ASA - Initiated", 1);
    var adapterUrl = lookup("BB_CONFIGS", "URL");
    if (adapterUrl == undefined || adapterUrl == null || adapterUrl == "") {
        Avo_LogDebug("BB_DUAA - URL in BB_CONFIGS is not set", 1);
        return;
    }
    var projectId = lookup("BB_CONFIGS", "PROJECT_ID");
    if (projectId == undefined || projectId == null) {
        Avo_LogDebug("BB_ASA - PROJECT_ID in BB_CONFIGS is not set", 1);
        return;
    }

    var folderId = getAppSpecific("Record Folder Id");
    if (folderId == null) {
        //Get token
        var token = GETBLUEBEAMTOKEN();
        if (token != null) {
            Avo_LogDebug("BB_ASA - capId: " + capId, 2);
            var result = aa.cap.getCap(capId);
            if (result.getSuccess() != true) {
                Avo_LogDebug("BB_ASA - Failed to get cap for record " + capId + ". " + result.errorType + ": " + result.errorMessage, 1);
                return;
            }

            var cap = result.getOutput();
            var capModel = cap.capModel;

            if (!capModel) {
                Avo_LogDebug("BB_ASA - Cap model not found!", 1);
                return;
            }
            Avo_LogDebug("BB_ASA - altID: " + capModel.altID, 2);
            var name = capModel.altID + ' - ' + getAddressPart();
            var module = String(capModel.moduleName);
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
                    Avo_LogDebug("BB_ASA - Record module folder not found", 1);
                    return;
                }
                var d = new Date();
                var year = d.getFullYear();
                var yearFolderId = GETFOLDERBYNAME(token, projectId, moduleFolderId, year);
                if (yearFolderId == null) {
                    Avo_LogDebug("BB_ASA - Year folder not found for module '" + module.toUpperCase() + "'", 1);
                    return false;
                }
                parentFolderId = yearFolderId;
            }


            // Create record folder
            var result = CREATEBLUEBEAMFOLDER(token, projectId, name, parentFolderId, "Record Folder");
            if (result != null) {
                folderId = result["Id"];
                if (folderId != null) {
                    // Save record folder id
                    var success = editAppSpecific("Record Folder Id", folderId);
                    if (success == true) {
                        Avo_LogDebug("BB_ASA - Record Folder Id Updated", 1);
                    }
                    // Save revision number
                    var revisionNumber = 0;
                    var success = editAppSpecific("Revision Number", revisionNumber);
                    if (success == true) {
                        Avo_LogDebug("BB_ASA - Revision Number set to " + revisionNumber, 1);
                    }
                    // Save submittal counter 
                    var subCycle = 0;
                    var success = editAppSpecific("Submittal Cycle", subCycle);
                    if (success == true) {
                        Avo_LogDebug("BB_ASA - Submittal Cycle set to " + subCycle, 1);
                    }
                    // Save resubmittal counter
                    var resubCycle = 0;
                    var success = editAppSpecific("Resubmittal Cycle", resubCycle);
                    if (success == true) {
                        Avo_LogDebug("BB_ASA - Resubmittal Cycle set to " + resubCycle, 1);
                    }

                    if (module.toUpperCase() == "BUILDING") {
                        // Create 'Approved Plans' folder
                        var result2 = CREATEBLUEBEAMFOLDER(token, projectId, "Approved Plans", folderId, "Automation Folder - all files existing in this folder will be downloaded to Accela when key workflow task is triggered");
                        if (result2 != null) {
                            var subFolderId = result2["Id"];
                            if (subFolderId != null) {
                                Avo_LogDebug("BB_ASA - 'Approved Plans' folder created successfully", 1);
                            }
                        }

                        // Create 'Pre-Construction Plans' folder
                        var result3 = CREATEBLUEBEAMFOLDER(token, projectId, "Pre-Construction Plans", folderId, "Automation Folder - all files existing in this folder will be downloaded to Accela when key workflow task is triggered");
                        if (result3 != null) {
                            var subFolderId = result3["Id"];
                            if (subFolderId != null) {
                                Avo_LogDebug("BB_ASA - 'Pre-Construction Plans' folder created successfully", 1);
                            }
                        }

                        // Create 'Archive' folder
                        var result4 = CREATEBLUEBEAMFOLDER(token, projectId, "Archive", folderId, "Archive Folder - a housekeeping folder to stash old submittals so that they are not being worked on");
                        if (result4 != null) {
                            var subFolderId = result4["Id"];
                            if (subFolderId != null) {
                                Avo_LogDebug("BB_ASA - 'Archive' folder created successfully", 1);
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
                }
            }

            //Update document names
            if (publicUser != true) {
                // In AA
                updateDocumentNames(capModel.altID, module);
            }
        } else {
            Avo_LogDebug("BB_ASA - Failed to get token from Accela BlueBeam Adapter", 1);
            return;
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
})();

//aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC PROD: BB_ASA", debug);

