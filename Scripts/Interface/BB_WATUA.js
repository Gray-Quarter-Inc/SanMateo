/*******************************************************
| Script/Function: BB_WATUA
| Created by: Tom Grzegorczyk
| Created on: 24 Feb 2021
| Usage: Run BlueBeam integration for Workflow AdHoc Task Update After (WATUA) event
| Modified by: ()
*********************************************************/
var projectId = lookup("BB_CONFIGS", "PROJECT_ID");
var adapterUrl = lookup("BB_CONFIGS", "URL");

eval(getScriptText("BB_000_HELPERS"));
eval(getScriptText("BB_001_GETBLUEBEAMTOKEN"));
eval(getScriptText("BB_006_UPLOADFILE"));
eval(getScriptText("BB_013_MANUALDOWNLOAD"));

(function () {
    Avo_LogDebug("BB_WATUA - Initiated", 1);
    try {
        if (adapterUrl == undefined || adapterUrl == null || adapterUrl == "") {
            Avo_LogDebug("BB_DUAA - URL in BB_CONFIGS is not set", 1);
            //showComment("BlueBeam integration failed. Missing BlueBeam configuration. ");
            return;
        }
        if (projectId == undefined || projectId == null) {
            Avo_LogDebug("BB_ASA - PROJECT_ID in BB_CONFIGS is not set", 1);
            //showComment("BlueBeam integration failed. Missing BlueBeam configuration.");
            return;
        }
        var recordType = String(cap.capType);
        var capModel = aa.cap.getCap(capId).getOutput().getCapModel();
        var module = String(capModel.moduleName);
        Avo_LogDebug("BB_WATUA - recordType: " + recordType, 2);
        Avo_LogDebug("BB_WATUA - wfTask: " + wfTask, 2);
        Avo_LogDebug("BB_WATUA - wfStatus: " + wfStatus, 2);
        // Check if there are any triggers for active task and status
        var downloadTriggers = GETACTIONTRIGGER(recordType, "download");
        var uploadTriggers = GETACTIONTRIGGER(recordType, "upload");


        // Get token
        var token = GETBLUEBEAMTOKEN();
        if (token == null) {
            Avo_LogDebug(
                "BB_WATUA - Failed to get token from Accela BlueBeam Adapter", 1
            );
            return;
        }

        // Process upload triggers
        if (uploadTriggers && uploadTriggers.length > 0) {
            var recordFolderId = getAppSpecific("Record Folder Id");
            if (recordFolderId != null && recordFolderId != "") {
                Avo_LogDebug("BB_WATUA - Upload triggers count: " + uploadTriggers.length, 2);
                for (var r in uploadTriggers) {
                    var trigger = uploadTriggers[r];
                    if (wfTask == trigger.Task && wfStatus == trigger.Status) {
                        //BB_006_UPLOADFILE
                        var success = UPLOADFILES(token, recordFolderId);
                        if (success == true) {
                            var newStatus = "Sent";
                            taskSuccess = updateTask(wfTask, newStatus, "", "", "");
                            if (taskSuccess == false) {
                                Avo_LogDebug('BB_WATUA - Failed to update task "' + wfTask + '" with status of "' + newStatus + '"', 1);
                            }
                        }
                    }
                }
            }
            else {
                Avo_LogDebug("BB_WATUA - Record Folder ID is empty. 'Upload' action will not trigger. ", 2);
            }
        }

        // Process download triggers
        if (downloadTriggers && downloadTriggers.length > 0) {
            Avo_LogDebug("BB_WATUA - Download triggers count: " + downloadTriggers.length, 2);
            // Get record folder Id
            var recordFolderId = getAppSpecific("Record Folder Id");

            for (var d in downloadTriggers) {
                var trigger = downloadTriggers[d];
                if (wfTask == trigger.Task && wfStatus == trigger.Status) {
                    var docGroup = "";
                    var docCategory = "";
                    if (module.toUpperCase() == "BUILDING") {
                        docGroup = "BUILDING";
                        docCategory = "Other Documents | OTHER";
                    } else if (module.toUpperCase() == "PUBLICWORKS") {
                        docGroup = "PUBLICWORKS";
                        docCategory = "BlueBeam | BB | 9";
                    }

                    if (trigger.Folder) {
                        docCategory = trigger.Category;
                    }
                    //BB_013_MANUALDOWNLOAD
                    var success = DOWNLOADFILES(token, trigger.Folder, projectId, recordFolderId, docGroup, docCategory);
                    if (success == true) {
                        var newStatus = "Sent";
                        if (module.toUpperCase() == "PUBLICWORKS") {
                            newStatus = "Retrieved";
                        }
                        taskSuccess = updateTask(wfTask, newStatus, "", "", "");
                        if (taskSuccess == false) {
                            Avo_LogDebug('BB_WATUA - Failed to update task "' + wfTask + '" with status of "' + newStatus + '"', 1);
                        }
                    }
                }
            }
        }
    } catch (ex) {
        Avo_LogDebug("**Error in BB_WATUA: " + ex.message, 1);
        //showComment("BlueBeam integration failed. Check logs for error. (1)");
    }
})();