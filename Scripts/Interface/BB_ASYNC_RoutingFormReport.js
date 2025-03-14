/*******************************************************
| Script Title: BB_ASYNC_RoutingFormReport
| Created by: Tom Grzegorczyk   
| Created on: 19Nov24
| Usage: Generate new routing form report
| Modified by: ()
*********************************************************/
// ********************************************************************************************************************************
//	Env Paramters Below
// ********************************************************************************************************************************
var servProvCode = aa.getServiceProviderCode();
capId = aa.env.getValue("CapID");						// Record ID
var cap = aa.cap.getCap(capId).getOutput();
appType = String(cap.getCapType());
appTypeArray = appType.split("/");

currentUserID = "ADMIN";
var user = String(aa.env.getValue("User")); 			// AA User
if (user && user != "null" && user.length > 0) {
    currentUserID = user;
}

var debug = "";
var message = "";
var showDebug = true;
var error = "";
var br = "<BR/>";
var useAppSpecificGroupName = false;
var AInfo = null;

var SCRIPT_VERSION = 3.0;

useProductScript = true;
var useCustomScriptFile = true;  // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
var useSA = false;
var SA = null;
var SAScript = null;

// Print debug using aa.print instead of aa.debug
useLogDebug = true;
var debugLevel = 2;

function getScriptText(vScriptName, servProvCode, useProductScripts) {
    if (!servProvCode) servProvCode = aa.getServiceProviderCode();
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    try {
        if (useProductScripts) {
            var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
        } else {
            var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
        }
        return emseScript.getScriptText() + "";
    } catch (err) {
        return "";
    }
}

// ********************************************************************
//printEnv();
// ***********************************************************************

try {
    // Set the system user
    var result = aa.person.getUser(currentUserID);
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get sys user ADMIN. " + result.errorMessage, 1);
    } else {
        systemUserObj = result.getOutput();
    }

    eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA, useCustomScriptFile));
    // eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA, useCustomScriptFile));
    eval(getScriptText("INCLUDES_CUSTOM", SA, useCustomScriptFile));

    eval(getScriptText("BB_000_HELPERS"));
    eval(getScriptText("BB_001_GETBLUEBEAMTOKEN"));
    eval(getScriptText("BB_006_UPLOADFILE"));

    // Main function
    (function () {
        var altId = aa.cap.getCap(capId).getOutput().capModel.altID;
        Avo_LogDebug("Record(" + altId + ")", 2);  //debug

        var reportType = "";
        //Is resubmittal?
        var resubmittal = Number(getAppSpecific("Resubmittal Cycle")) > 0 || Number(getAppSpecific("Submittal Cycle")) > 0;
        //Is revision?
        if (appMatch("Building/Revision/NA/NA", capId)) {
            reportType = resubmittal == true ? "RESUBMITTAL ROUTING FORM" : "REVISION ROUTING FORM";
        } else {
            reportType = resubmittal == true ? "RESUBMITTAL ROUTING FORM" : "APPLICATION ROUTING FORM";
        }

        var reportType = "";
        //Is resubmittal?
        var resubmittal = Number(getAppSpecific("Resubmittal Cycle")) > 0 || Number(getAppSpecific("Submittal Cycle")) > 0;
        //Is revision?
        if (appMatch("Building/Revision/NA/NA", capId)) {
            reportType = resubmittal == true ? "RESUBMITTAL ROUTING FORM" : "REVISION ROUTING FORM";
        } else {
            reportType = resubmittal == true ? "RESUBMITTAL ROUTING FORM" : "APPLICATION ROUTING FORM";
        }

        var doc = renameRoutingFormReport(altId, generateRoutingFormReport(altId, reportType));
        if (doc != null) {
            var recordFolderId = getAppSpecific("Record Folder Id", capId);
            if (recordFolderId != null && recordFolderId != "") {
                uploadReportToBlueBeam(doc, recordFolderId);
            }
        }
    })();

} catch (err) {
    debug += "Error in process " + err.message;
    error += br + err.message;
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
        Avo_LogDebug("**Error in BB_ASYNC_RoutingFormReport renameCommentSheetReport(): " + ex.message, 1);
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
        Avo_LogDebug("BB_ASYNC_RoutingFormReport generateRoutingFormReport() - Failed to get report info model. " + result.errorType + ": " + result.errorMessage, 1);
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
        Avo_LogDebug("BB_ASYNC_RoutingFormReport generateRoutingFormReport() - System failed get report: " + result.errorType + ": " + result.errorMessage, 1);
        return false;
    }

    var reportOutput = result.getOutput();

    if (!reportOutput) {
        return false;
    }
    var reportFile = aa.reportManager.storeReportToDisk(reportOutput);
    reportFile = reportFile.getOutput();
    Avo_LogDebug("BB_ASYNC_RoutingFormReport generateRoutingFormReport() - Report " + reportOutput.name + " generated for record " + altId, 2);
    return reportOutput.name;
}


function uploadReportToBlueBeam(doc, recordFolderId) {
    if (doc != null && doc.documentNo) {
        // Get token
        var token = GETBLUEBEAMTOKEN();
        if (token == null) {
            Avo_LogDebug(
                "BB_ASYNC_RoutingFormReport uploadReportToBlueBeam() - Failed to get token from Accela BlueBeam Adapter", 1
            );
            return;
        }

        var result = UPLOADFILE(token, doc, projectId, recordFolderId);
        if (result == true) {
            Avo_LogDebug("BB_ASYNC_RoutingFormReport uploadReportToBlueBeam() - Report uploaded successfully", 2);
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

//aa.sendMail("noreply@smcgov.org", "tom.grzegorczyk@avocette.com", "", "SMC Supp: BB_ASYNC_RoutingFormReport", debug); //debug