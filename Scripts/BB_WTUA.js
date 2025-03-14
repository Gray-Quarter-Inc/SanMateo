/*******************************************************
| Script/Function: BB_WTUA
| Created by: Tom Grzegorczyk   
| Created on: 29 Oct 2020
| Usage: Run BlueBeam integration for Workflow Task Update After (WTUA) event
| Modified by: Jei Yang (Mar 30, 2022) - added UpdateBluebeamFolder so folder name is updated based on new Revison ID
*********************************************************/
eval(getScriptText("BB_000_HELPERS"));
eval(getScriptText("BB_001_GETBLUEBEAMTOKEN"));
eval(getScriptText("BB_005_UPDATEBLUEBEAMFOLDER"));
eval(getScriptText("BB_006_UPLOADFILE"));
eval(getScriptText("BB_008_GETFOLDERBYNAME"));
eval(getScriptText("BB_010_CREATESESSION"));
eval(getScriptText("BB_013_MANUALDOWNLOAD"));
eval(getScriptText("BB_015_SESSIONINVITE"));
eval(getScriptText("BB_016_SESSIONCHANGEOWNER"));

(function () {
    Avo_LogDebug("BB_WTUA - Initiated", 1);
    try {
        if (adapterUrl == undefined || adapterUrl == null || adapterUrl == "") {
            Avo_LogDebug("BB_DUAA - URL in BB_CONFIGS is not set", 1);
            return;
        }
        if (projectId == undefined || projectId == null) {
            Avo_LogDebug("BB_ASA - PROJECT_ID in BB_CONFIGS is not set", 1);
            return;
        }
        var recordType = String(cap.capType);
        var capModel = aa.cap.getCap(capId).getOutput().getCapModel();
        var module = String(capModel.moduleName);
        Avo_LogDebug("BB_WTUA - recordType: " + recordType, 2);
        Avo_LogDebug("BB_WTUA - wfTask: " + wfTask, 2);
        Avo_LogDebug("BB_WTUA - wfStatus: " + wfStatus, 2);
        // Check if there are any triggers for active task and status
        var downloadTriggers = GETACTIONTRIGGER(recordType, "download");
        var uploadTriggers = GETACTIONTRIGGER(recordType, "upload");
        var reportUploadTriggers = GETACTIONTRIGGER(recordType, "upload-report");
        var sessionTriggers = GETACTIONTRIGGER(recordType, "session");
        var sessionInviteTriggers = GETACTIONTRIGGER(recordType, "invite");
        var revisionTriggers = GETACTIONTRIGGER(recordType, "revision");
        var submittalTriggers = GETACTIONTRIGGER(recordType, "submittal");
        var resubmittalTriggers = GETACTIONTRIGGER(recordType, "resubmittal");


        // Get token
        var token = GETBLUEBEAMTOKEN();
        if (token == null) {
            Avo_LogDebug(
                "BB_WTUA - Failed to get token from Accela BlueBeam Adapter", 1
            );
            return;
        }

        // Process upload triggers
        if (uploadTriggers && uploadTriggers.length > 0) {
            var recordFolderId = getAppSpecific("Record Folder Id");
            if (recordFolderId != null && recordFolderId != "") {
                Avo_LogDebug("BB_WTUA - Upload triggers count: " + uploadTriggers.length, 2);
                for (var r in uploadTriggers) {
                    var trigger = uploadTriggers[r];
                    if (wfTask == trigger.Task && wfStatus == trigger.Status) {
                        //BB_006_UPLOADFILE
                        UPLOADFILES(token, recordFolderId);
                    }
                }
            }
            else {
                Avo_LogDebug("BB_WTUA - Record Folder ID is empty. 'Upload' action will not trigger. ", 2);
            }
        }
        // Process session triggers
        if (sessionTriggers && sessionTriggers.length > 0) {
            var recordFolderId = getAppSpecific("Record Folder Id");
            if (recordFolderId != null && recordFolderId != "") {
                Avo_LogDebug("BB_WTUA - Session triggers count: " + sessionTriggers.length, 2);
                for (var r in sessionTriggers) {
                    var trigger = sessionTriggers[r];
                    if (wfTask == trigger.Task && wfStatus == trigger.Status) {
                        //BB_010_CREATESESSION
                        var sessionId = CREATESESSION(token, recordFolderId);
                        if (sessionId != false && sessionId != "") {
                            var email = GETEMAILASSIGNEDTOCAP(capId);
                            if (email != null && email != "") {
                                Avo_LogDebug("BB_WTUA - Updating session owner to " + email, 2);
                                var sessionUpdated = SESSIONCHANGEOWNER(token, sessionId, email);
                                if (sessionUpdated) {
                                    Avo_LogDebug("BB_WTUA - Session " + sessionId + " reassigned to " + email, 2);
                                }
                            }
                        }
                    }
                }
            }
            else {
                Avo_LogDebug("BB_WTUA - Record Folder ID is empty. 'Session' action will not trigger. ", 2);
            }
        }
        // Process session invite triggers
        if (sessionInviteTriggers && sessionInviteTriggers.length > 0) {
            var sessionId = getAppSpecific("Session Id");
            if (sessionId != null && sessionId != "") {
                Avo_LogDebug("BB_WTUA - Session Invite triggers count: " + sessionInviteTriggers.length, 2);
                for (var r in sessionInviteTriggers) {
                    var trigger = sessionInviteTriggers[r];
                    var currentTask = String(wfTask);
                    if (currentTask.endsWith("Review") && wfStatus == trigger.Status) {
                        var capModel = aa.cap.getCap(capId).getOutput().getCapModel();
                        var altId = capModel.altID;
                        var assigned = getTaskAssignedStaff();
                        var email = GETEMAILASSIGNEDTOWORKFLOWTASK(assigned);
                        var message = altId + ", " + getPrimaryAddress() + ". Description: ";
                        if (capModel && capModel.capWorkDesModel && capModel.capWorkDesModel.description) {
                            var str = new String(capModel.capWorkDesModel.description);
                            str = str.replace(/\"/g, '\\"');
                            message += str;
                        }
                        Avo_LogDebug("BB_WTUA - Invitation Message '" + message, 2);
                        if (email != null && email != "") {
                            logDebug("Assigned Staff Email: " + email);
                            var invited = SESSIONINVITE(token, sessionId, email, message);
                            if (invited) {
                                Avo_LogDebug("BB_WTUA - Session '" + sessionId + "' invite sent to " + email, 2);
                            } else {
                                Avo_LogDebug("BB_WTUA - Session '" + sessionId + "' invite for " + email + " failed! Check BlueBeam adapter logs. ", 2);
                            }
                        }
                    }
                }
            }
            else {
                Avo_LogDebug("BB_WTUA - Session ID is empty. 'Session Invite' action will not trigger. ", 2);
            }
        }
        
        // Process download triggers
        if (downloadTriggers && downloadTriggers.length > 0) {
            Avo_LogDebug("BB_WTUA - Download triggers count: " + downloadTriggers.length, 2);
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
                    DOWNLOADFILES(token, trigger.Folder, projectId, recordFolderId, docGroup, docCategory);
                }
            }
        }
        // Process revision triggers
        if (revisionTriggers && revisionTriggers.length > 0) {
            Avo_LogDebug("BB_WTUA - Revision triggers count: " + revisionTriggers.length, 2);
            for (var r in revisionTriggers) {
                var trigger = revisionTriggers[r];
                if (wfTask == trigger.Task && wfStatus == trigger.Status) {
                    newRevision();
                }
            }
        }
        // Process submittal triggers
        if (submittalTriggers && submittalTriggers.length > 0) {
            Avo_LogDebug("BB_WTUA - Submittal triggers count: " + submittalTriggers.length, 2);
            for (var r in submittalTriggers) {
                var trigger = submittalTriggers[r];
                if (wfTask == trigger.Task && wfStatus == trigger.Status) {
                    newSubmittal();
                }
            }
        }
        // Process resubmittal triggers
        if (resubmittalTriggers && resubmittalTriggers.length > 0) {
            Avo_LogDebug("BB_WTUA - Resubmittal triggers count: " + resubmittalTriggers.length, 2);
            for (var r in resubmittalTriggers) {
                var trigger = resubmittalTriggers[r];
                if (wfTask == trigger.Task && wfStatus == trigger.Status) {
                    newResubmittal();
                }
            }
        }

        // Update folder name based on the new Revision Permit ID
        if (appMatch("Building/Revision/NA/NA", capId)) {
            if (wfTask == "Application Submittal" && wfStatus == "Complete") {
                if (recordFolderId && recordFolderId != "") {
                    var capModel = aa.cap.getCap(capId).getOutput().getCapModel();
                    var module = String(capModel.moduleName);
                    var parentCapID = capModel.parentCapID;
                    var parentFolderId = null;
                    Avo_LogDebug("parentCapID: " + parentCapID, 2);

                    if (parentCapID != null) {
                        //Get parent record folder
                        parentFolderId = getAppSpecific("Record Folder Id", parentCapID);
                        Avo_LogDebug("parentFolderId: " + parentFolderId, 2);
                    }

                    if (parentFolderId == null || parentFolderId == "") {
                        // Get record module folder
                        Avo_LogDebug(' Cap module: ' + module.toUpperCase(), 1);
                        var moduleFolderId = GETRECORDMODULEFOLDER(module.toUpperCase());
                        if (moduleFolderId == null || moduleFolderId == "") {
                            Avo_LogDebug("BB_WTUA - Record module folder not found", 1);
                            return;
                        }
                        Avo_LogDebug('moduleFolderId: ' + moduleFolderId, 1);

                        var d = new Date();
                        var year = d.getFullYear();
                        var yearFolderId = GETFOLDERBYNAME(token, projectId, moduleFolderId, year);
                        if (yearFolderId == null) {
                            Avo_LogDebug("BB_WTUA - Year folder not found for module '" + module.toUpperCase() + "'", 1);
                            return false;
                        }
                        parentFolderId = yearFolderId;
                        Avo_LogDebug("parentFolderId2: " + parentFolderId, 2);
                    }

                    var name = capModel.altID + ' - ' + getAddressPart();
                    Avo_LogDebug('Folder name: ' + name, 1);
                    // Update record folder
                    var result = UPDATEBLUEBEAMFOLDER(token, projectId, recordFolderId, name, parentFolderId);
                    if (result == true) {
                        Avo_LogDebug("BB_WTUA - Record Folder successfully updated", 1);
                    } else {
                        Avo_LogDebug("BB_WTUA - Record Folder update failed", 1);
                    }

                }
                updateDocumentNames(capModel.altID, module); //passing altId instead of cap, to retrieve the updated altId.
            }
        }

         // Process report upload triggers
         if (reportUploadTriggers && reportUploadTriggers.length > 0) {
            Avo_LogDebug("BB_WTUA - Report upload triggers count: " + reportUploadTriggers.length, 2);
            // Get record folder Id
            var recordFolderId = getAppSpecific("Record Folder Id");
            var capModel = aa.cap.getCap(capId).getOutput().getCapModel();
            var altId = capModel.altID;
            for (var d in reportUploadTriggers) {
                var trigger = reportUploadTriggers[d];
                if (wfTask == trigger.Task && wfStatus == trigger.Status) {
                    if (trigger.Report == "Comment Sheet") {
                        //Generate and save the report
                        var fileName = generateCommentSheetReport(altId);
                        //Rename report
                        var doc = renameCommentSheetReport(altId, fileName);
                        //// Upload doc to BlueBeam - doesn't work because of timing. File is not yet available in Construct at this stage
                        //if (doc != null) {
                        //    var result = UPLOADFILE(token, doc, projectId, recordFolderId);
                        //    if (result == true) {
                        //        Avo_LogDebug("BB_WTUA - Report uploaded successfully", 2);
                        //    }
                        //}
                    } else if (trigger.Report = "Routing Form") {
                        var scriptName = "BB_ASYNC_RoutingFormReport";
                        var envParameters = aa.util.newHashMap();
                        envParameters.put("CapID", capId);
                        envParameters.put("User", currentUserID);

                        aa.runAsyncScript(scriptName, envParameters);
                        Avo_LogDebug("Executing async script : " + scriptName, 1);
                    }
                }
            }
        }

    } catch (ex) {
        Avo_LogDebug("**Error in BB_WTUA: " + ex.message, 1);
    }
})();

//Increments revision counter
function newRevision() {
    try {
        var revisionNumber = getAppSpecific("Revision Number");
        revisionNumber++;
        editAppSpecific("Revision Number", revisionNumber);
        Avo_LogDebug("Revision successfully incremented to: " + revisionNumber);

        return true;
    } catch (ex) {
        Avo_LogDebug("**Error in BB_WTUA newRevision(): " + ex.message, 1);
        return false;
    }
}
//Increments submittal cycle counter
function newSubmittal() {
    try {
        var subCycle = getAppSpecific("Submittal Cycle");
        var rtipStatus = taskStatus('Ready to Issue Permit');
        Avo_LogDebug("'Ready to Issue Permit' task status: " + rtipStatus, 2);
        if (rtipStatus != 'Permit Issued') {
            subCycle++;
            editAppSpecific("Submittal Cycle", subCycle);
            Avo_LogDebug("Submittal Cycle successfully incremented to: " + subCycle);
        }

        return true;
    } catch (ex) {
        Avo_LogDebug("**Error in BB_WTUA newSubmittal(): " + ex.message, 1);
        return false;
    }
}
//Increments resubmittal cycle counter
function newResubmittal() {
    try {
        var resubCycle = getAppSpecific("Resubmittal Cycle");
        var rtipStatus = taskStatus('Ready to Issue Permit');
        Avo_LogDebug("'Ready to Issue Permit' task status: " + rtipStatus, 2);
        if (rtipStatus == 'Permit Issued') {
            resubCycle++;
            editAppSpecific("Resubmittal Cycle", resubCycle);
            Avo_LogDebug("Resubmittal Cycle successfully incremented to: " + resubCycle);
        }
        return true;
    } catch (ex) {
        Avo_LogDebug("**Error in BB_WTUA newResubmittal(): " + ex.message, 1);
        return false;
    }
}

function getTaskAssignedStaff() {
    var workflowObj;
    var assignedStaff = null;
    if (wfObj) {
        workflowObj = wfObj;
    } else {
        workflowObj = aa.workflow.getTasks(capId).getOutput();
    }
    for (i in workflowObj) {
        task = workflowObj[i];
        if (task.getTaskDescription() == wfTask) {
            var assignedStaff = task.assignedStaff;
            Avo_LogDebug("Assigned Staff: " + assignedStaff, 2);
            break;
        }
    }
    return assignedStaff;
}

function getPrimaryAddress() {
    var result = aa.address.getAddressByCapId(capId);
    if (result.getSuccess() != true) {
        Avo_LogDebug('getPrimaryAddress() - Failed to get addresses on record ' + altId + '. ' + result.errorType + ": " + result.errorMessage, 1);
    }

    var addr = "";
    var allAddressModels = result.getOutput();
    for (var i in allAddressModels) {
        var addressModel = allAddressModels[i];
        if (allAddressModels.length > 1 && addressModel.primaryFlag != "Y") {
            continue;
        }
        addr = addressModel;
        break;
    }
    return addr;
}

function generateCommentSheetReport(altId) {
    var reportName = 'Consolidated Review Comment Sheet';
    var module = 'Building';
    var parameters = aa.util.newHashMap();
    parameters.put("capid", altId);

    var result = aa.reportManager.getReportInfoModelByName(reportName);
    if (result.getSuccess() != true) {
        Avo_LogDebug("generateCommentSheetReport() - Failed to get report info model. " + result.errorType + ": " + result.errorMessage, 1);
        return false;
    }

    var report = result.getOutput();
    report.setModule(module);
    report.setCapId(capId.getID1() + "-" + capId.getID2() + "-" + capId.getID3());
    report.getEDMSEntityIdModel().setAltId(altId);
    report.setReportParameters(parameters);

    result = aa.reportManager.getReportResult(report);
    if (result.getSuccess() != true) {
        Avo_LogDebug("generateCommentSheetReport() - System failed get report: " + result.errorType + ": " + result.errorMessage, 1);
        return false;
    }

    var reportOutput = result.getOutput();

    if (!reportOutput) {
        return false;
    }
    var reportFile = aa.reportManager.storeReportToDisk(reportOutput);
    reportFile = reportFile.getOutput();
    Avo_LogDebug("generateCommentSheetReport() - Report " + reportOutput.name + " generated for record " + altId, 2);
    return reportOutput.name;
}

function renameCommentSheetReport(altId, fileName) {
    try {
        var allDocs = getCapDocuments(capId);
        if (allDocs != null) {
            var doc = getDocumentByName(allDocs, fileName);
            if (doc != null && doc.documentNo) {
                var revision = getAppSpecific("Revision Number");
                if (revision == null || revision == "" || revision == undefined) {
                    revision = 0;
                }
                var revisionCounter = revision.length > 1 ? revision : ("0" + revision);

                var subCycle = getAppSpecific("Submittal Cycle");
                if (subCycle == null || subCycle == "") {
                    subCycle = 1;
                }
                var subCounter = subCycle.length > 1 ? subCycle : ("0" + subCycle);

                var resubCycle = getAppSpecific("Resubmittal Cycle");
                if (resubCycle == null || resubCycle == "") {
                    resubCycle = 0;
                }
                var resubCounter = resubCycle.length > 1 ? resubCycle : ("0" + resubCycle);

                var document = aa.document.getDocumentByPK(doc.documentNo).getOutput();
                var numIndex = fileName.lastIndexOf(".");
                var extension = fileName.substr(numIndex);
                var category = document.docCategory;
                var addressPart = getAddressPart();
                var catCode = getDocumentCategoryCode(category);
                var newName = altId + "_" + addressPart + "_" + catCode + "_Sub" + subCounter + "_Rev" + revisionCounter + "_" + resubCounter;
                Avo_LogDebug("Checking for duplicate names ", 2);
                var duplicateCounter = checkForDuplicates(allDocs, newName, extension);
                if (duplicateCounter > 0) {
                    Avo_LogDebug(duplicateCounter + " duplicate(s) found. Renaming.", 2);
                    newName += "[" + duplicateCounter + "]";
                }
                newName += extension;
                document.setDocName(newName);
                document.setFileName(newName);
                var newDocResult = aa.document.updateDocument(document);
                if (newDocResult.getSuccess()) {
                    newDocResult.getOutput();
                    Avo_LogDebug("Document renamed successfully! From '" + fileName + "' to '" + newName + "'", 1);
                    return aa.document.getDocumentByPK(doc.documentNo).getOutput();
                }
            }
        }
    } catch (ex) {
        Avo_LogDebug("**Error in renameCommentSheetReport(): " + ex.message, 1);
    }
    return null;
}

function generateRoutingFormReport(altId, type) {
    var reportName = 'Routing Form';
    var module = 'Building';
    var parameters = aa.util.newHashMap();
    parameters.put("capid", altId);
    parameters.put("ReportType", type);

    var result = aa.reportManager.getReportInfoModelByName(reportName);
    if (result.getSuccess() != true) {
        Avo_LogDebug("generateRoutingFormReport() - Failed to get report info model. " + result.errorType + ": " + result.errorMessage, 1);
        return false;
    }

    var report = result.getOutput();
    report.setModule(module);
    report.setCapId(capId.getID1() + "-" + capId.getID2() + "-" + capId.getID3());
    report.getEDMSEntityIdModel().setAltId(altId);
    report.setReportParameters(parameters);

    Avo_LogDebug("report.ReportName='" + reportName + "'", 2);
    Avo_LogDebug("report.Module='" + module + "'", 2);
    Avo_LogDebug("report.CapId='" + capId.getID1() + "-" + capId.getID2() + "-" + capId.getID3() + "'", 2);
    Avo_LogDebug("report.AltId='" + altId + "'", 2);
    Avo_LogDebug("report.Parameters.capid='" + altId + "'", 2);
    Avo_LogDebug("report.Parameters.ReportType='" + type + "'", 2);


    result = aa.reportManager.getReportResult(report);
    if (result.getSuccess() != true) {
        Avo_LogDebug("generateRoutingFormReport() - System failed get report: " + result.errorType + ": " + result.errorMessage, 1);
        return false;
    }

    var reportOutput = result.getOutput();

    if (!reportOutput) {
        return false;
    }
    var reportFile = aa.reportManager.storeReportToDisk(reportOutput);
    reportFile = reportFile.getOutput();
    Avo_LogDebug("generateRoutingFormReport() - Report " + reportOutput.name + " generated for record " + altId, 2);
    return reportOutput.name;
}

function renameCommentSheetReport(altId, fileName) {
    try {
        var allDocs = getCapDocuments(capId);
        if (allDocs != null) {
            var doc = getDocumentByName(allDocs, fileName);
            if (doc != null && doc.documentNo) {
                var revision = getAppSpecific("Revision Number");
                if (revision == null || revision == "" || revision == undefined) {
                    revision = 0;
                }
                var revisionCounter = revision.length > 1 ? revision : ("0" + revision);

                var subCycle = getAppSpecific("Submittal Cycle");
                if (subCycle == null || subCycle == "") {
                    subCycle = 1;
                }
                var subCounter = subCycle.length > 1 ? subCycle : ("0" + subCycle);

                var resubCycle = getAppSpecific("Resubmittal Cycle");
                if (resubCycle == null || resubCycle == "") {
                    resubCycle = 0;
                }
                var resubCounter = resubCycle.length > 1 ? resubCycle : ("0" + resubCycle);

                var document = aa.document.getDocumentByPK(doc.documentNo).getOutput();
                var numIndex = fileName.lastIndexOf(".");
                var extension = fileName.substr(numIndex);
                var category = document.docCategory;
                var addressPart = getAddressPart();
                var catCode = getDocumentCategoryCode(category);
                var newName = altId + "_" + addressPart + "_" + catCode + "_Sub" + subCounter + "_Rev" + revisionCounter + "_" + resubCounter;
                Avo_LogDebug("Checking for duplicate names ", 2);
                var duplicateCounter = checkForDuplicates(allDocs, newName, extension);
                if (duplicateCounter > 0) {
                    Avo_LogDebug(duplicateCounter + " duplicate(s) found. Renaming.", 2);
                    newName += "[" + duplicateCounter + "]";
                }
                newName += extension;
                document.setDocName(newName);
                document.setFileName(newName);
                var newDocResult = aa.document.updateDocument(document);
                if (newDocResult.getSuccess()) {
                    newDocResult.getOutput();
                    Avo_LogDebug("Document renamed successfully! From '" + fileName + "' to '" + newName + "'", 1);
                    return aa.document.getDocumentByPK(doc.documentNo).getOutput();
                }
            }
        }
    } catch (ex) {
        Avo_LogDebug("**Error in renameCommentSheetReport(): " + ex.message, 1);
    }
    return null;
}

function renameRoutingFormReport(altId, fileName) {
    try {
        var allDocs = getCapDocuments(capId);
        if (allDocs != null) {
            var doc = getDocumentByName(allDocs, fileName);
            if (doc != null && doc.documentNo) {
                var revision = getAppSpecific("Revision Number");
                if (revision == null || revision == "" || revision == undefined) {
                    revision = 0;
                }
                var revisionCounter = revision.length > 1 ? revision : ("0" + revision);

                var subCycle = getAppSpecific("Submittal Cycle");
                if (subCycle == null || subCycle == "") {
                    subCycle = 1;
                }
                var subCounter = subCycle.length > 1 ? subCycle : ("0" + subCycle);

                var resubCycle = getAppSpecific("Resubmittal Cycle");
                if (resubCycle == null || resubCycle == "") {
                    resubCycle = 0;
                }
                var resubCounter = resubCycle.length > 1 ? resubCycle : ("0" + resubCycle);

                var document = aa.document.getDocumentByPK(doc.documentNo).getOutput();
                var numIndex = fileName.lastIndexOf(".");
                var extension = fileName.substr(numIndex);
                var category = document.docCategory;
                var addressPart = getAddressPart();
                var catCode = getDocumentCategoryCode(category);
                var newName = altId + "_" + addressPart + "_" + catCode + "_Sub" + subCounter + "_Rev" + revisionCounter + "_" + resubCounter;
                Avo_LogDebug("Checking for duplicate names ", 2);
                var duplicateCounter = checkForDuplicates(allDocs, newName, extension);
                if (duplicateCounter > 0) {
                    Avo_LogDebug(duplicateCounter + " duplicate(s) found. Renaming.", 2);
                    newName += "[" + duplicateCounter + "]";
                }
                newName += extension;
                document.setDocName(newName);
                document.setFileName(newName);
                var newDocResult = aa.document.updateDocument(document);
                if (newDocResult.getSuccess()) {
                    newDocResult.getOutput();
                    Avo_LogDebug("Document renamed successfully! From '" + fileName + "' to '" + newName + "'", 1);
                    return aa.document.getDocumentByPK(doc.documentNo).getOutput();
                }
            }
        }
    } catch (ex) {
        Avo_LogDebug("**Error in renameCommentSheetReport(): " + ex.message, 1);
    }
    return null;
}

function uploadReportToBlueBeam(doc, recordFolderId) {
    if (doc != null && doc.documentNo) {
        var result = UPLOADFILE(token, doc, projectId, recordFolderId);
        if (result == true) {
            Avo_LogDebug("BB_WTUA - Report uploaded successfully", 2);
        }
    }
}

function getCapDocuments(targetCapId) {
    var allDocs = null;
    var result = aa.document.getCapDocumentList(targetCapId, "ADMIN");
    if (result.getSuccess() == true) {
        allDocs = result.getOutput();
    }
    return allDocs;
}

function getDocumentByName(documents, fileName) {
    var result = null;
    for (x in documents) {
        document = documents[x];
        if (document && document.fileName == fileName) {
            result = document;
        }
    }
    return result;
}
function getDocumentById(documents, documentId) {
    var result = null;
    for (x in documents) {
        document = documents[x];
        if (document && document.documentNo == documentId) {
            result = document;
        }
    }
    return result;
}

function getDocumentCategoryCode(category) {
    var docCode = '';
    var catArr = String(category).split(/\|/);
    if (catArr.length > 1) {
        docCode = String(catArr[1].trim());
    }
    return docCode;
}
