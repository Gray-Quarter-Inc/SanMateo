/*******************************************************
| Script/Function: BB_DUA
| Created by: Tom Grzegorczyk   
| Created on: 3 Nov 2020
| Usage: Run BlueBeam integration for Document Upload After (DUA) event
| Modified by: ()
*********************************************************/
eval(getScriptText("BB_000_HELPERS"));

(function () {
    Avo_LogDebug("BB_DUA - Initiated", 1);
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

    var revision = getAppSpecific("Revision Number");
    if (revision == null || revision == "" || revision == undefined) {
        revision = 0;
    }
    var revisionCounter = revision.length > 1 ? revision : ("0" + revision);

    var subCycle = getAppSpecific("Submittal Cycle");
    if (subCycle == null || subCycle == "") {
        subCycle = 0;
    }
    var subCounter = subCycle.length > 1 ? subCycle : ("0" + subCycle);

    var resubCycle = getAppSpecific("Resubmittal Cycle");
    if (resubCycle == null || resubCycle == "") {
        resubCycle = 0;
    }
    var resubCounter = resubCycle.length > 1 ? resubCycle : ("0" + resubCycle);

    var allDocs = null;

    documentModelList = documentModelArray.toArray();

    for (x in documentModelList) {
        try {
            var result = aa.document.getCapDocumentList(capId, "ADMIN");
            if (result.getSuccess() == true) {
                allDocs = result.getOutput();
            }

            var docModel = documentModelList[x];
            var documentNo = docModel.documentNo;
            Avo_LogDebug("documentNo: " + documentNo, 2);
            var document = aa.document.getDocumentByPK(documentNo).getOutput();
            var oldName = document.fileName;
            var fileName = document.getFileName();
            var numIndex = fileName.lastIndexOf(".");
            var extension = fileName.substr(numIndex);
            var category = document.docCategory;
            var description = document.docDescription;
            var altId = cap.capModel.altID;
            var module = String(cap.capModel.moduleName);
            var addressPart = getAddressPart();
            var newName = "";
            if (module.toUpperCase() == "PUBLICWORKS") {
                var catCode = getDocumentProperty(category, 1);
                var positionCode = getDocumentProperty(category, 2);
                newName = positionCode + "_" + altId + "_" + addressPart + "_" + catCode + "_Sub" + subCounter + "_Rev" + revisionCounter + "_" + resubCounter;
            } else {
                var catCode = getDocumentProperty(category, 1);
                if (subCounter == 0) {
                    newName = altId + "_" + addressPart + "_" + catCode;
                } else {
                    newName = "RESUB" + subCounter + "_" + altId + "_" + addressPart + "_" + catCode;//altId + "_" + addressPart + "_" + catCode + "_Sub" + subCounter + "_Rev" + revisionCounter + "_" + resubCounter;
                }
            }
            // Don't rename files downloaded from BlueBeam
            if (description != 'Downloaded from BlueBeam by integration') {
                Avo_LogDebug("Checking for duplicate names ", 2);
                var duplicateCounter = checkForDuplicates(allDocs, newName, extension);
                if (duplicateCounter > 0) {
                    Avo_LogDebug(duplicateCounter + " duplicate(s) found. Renaming.", 2);
                    newName += "[" + duplicateCounter + "]";
                }
                newName += extension;
                document.setDocName(newName);
                document.setFileName(newName);
            } else {
                document.setDocName(fileName);
                document.setFileName(fileName);
            }

            //Avo_LogDebug("newName: " + newName, 2);


            var updateResult = aa.document.updateDocument(document);
            if (updateResult.getSuccess()) {
                Avo_LogDebug("Document number " + documentNo + " renamed successfully! ", 1);
                Avo_LogDebug(oldName + " ==> " + newName, 2);
            } else {
                Avo_LogDebug("*Warning: Failed to rename document " + oldName, 1);
            }
        } catch (ex) {
            Avo_LogDebug("**Error in BB_DUA(): " + ex.message, 1);
        }
    }
    aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC PROD: BB_DUA debug", debug);
})();