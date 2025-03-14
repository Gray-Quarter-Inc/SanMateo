/*******************************************************
| Script/Function: BB_006_UPLOADFILE
| Created by: Tom Grzegorczyk
| Created on: 6 Nov 2020
| Usage: This function is used to upload files to BlueBeam and updating the document status and document description
| Prerequisites: This script requires some of the functions from BB_000_HELPERS.js please include make sure it's included whenever using this script
| Modified by: ()
*********************************************************/
eval(getScriptText("BB_003_CREATEBLUEBEAMFILE"));

//Uploads all files to BlueBeam
function UPLOADFILES(token, recordFolderId) {
    // Get all documents on a record
    var result = aa.document.getCapDocumentList(capId, "ADMIN");
    if (result.getSuccess() != true) {
        Avo_LogDebug(
            "BB_006_UPLOADFILE UPLOADFILES() - Failed to find any documents. " +
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
        //Check template
        if (doc.template != null) {
            var result = UPLOADFILE(token, doc, projectId, recordFolderId);
            if (result == true) {
                Avo_LogDebug("BB_006_UPLOADFILE UPLOADFILES() - File uploaded successfully", 2);
            }
        } else {
            Avo_LogDebug("BB_006_UPLOADFILE UPLOADFILES() documentId(" + documentId + ") fileName(" + doc.getFileName() + ") - No template found. Skipping. ", 2);
        }
    }
    return true;
}

function UPLOADFILE(token, docModel, projectId, parentFolderId) {
    if (!token) {
        Avo_LogDebug("BB_006_UPLOADFILE - Token not provided", 1);
        return false;
    }
    if (docModel == null && documentModel) {
        docModel = documentModel;
    }

    var documentId = docModel.documentNo;
    var document = aa.document.getDocumentByPK(documentId).getOutput();
    Avo_LogDebug("BB_006_UPLOADFILE documentId: " + documentId, 2);
    var docStatus = lookup("BB_CONFIGS", "DOCUMENT STATUS");
    if (adapterUrl == undefined || adapterUrl == null || adapterUrl == "") {
        Avo_LogDebug("BB_006_UPLOADFILE - URL in BB_CONFIGS is not set", 1);
        return;
    }

    if (document != null) {
        if (document.template == null) {
            document.getTemplate();
        }
        //Check to see if document template exists
        if (document.template != null) {

            //Get document template
            var forms = document.template.templateForms;
            if (forms != null) {
                var fileId = GETDOCUMENTASI(
                    forms,
                    "BLUEBEAM",
                    "File Id"
                );
                if (fileId == '') {
                    fileId = null;
                }
                //Get document status
                var status = document.getDocStatus();
                Avo_LogDebug("BB_006_UPLOADFILE current status: " + status, 2);
                if (fileId == null && status != docStatus) {
                    var fileName = document.getFileName();
                    var environment = BluebeamConfig.Environment;
                    //Upload document to BlueBeam
                    response = CREATEBLUEBEAMFILE(token, fileName, projectId, parentFolderId, documentId, environment);
                    Avo_LogDebug("response: " + JSON.stringify(response), 2);

                    //Update Document Description
                    if (response["Id"] != null) {
                        //Update document parameters in Accela - flip to 'docStatus when document uploaded to BB
                        docModel.setDocStatus(docStatus);
                        docModel.setDocStatusDate(aa.util.now());

                        var updateResult = aa.document.updateDocument(docModel);
                        if (updateResult.getSuccess()) {
                            Avo_LogDebug("BB_006_UPLOADFILE - Document Status updated to '" + docStatus + "'", 2);
                        } else {
                            Avo_LogDebug("*Warning in BB_006_UPLOADFILE: Document Status update failed!", 2);
                        }

                        //Populate the document custom field with BB ID
                        var fileId = response["Id"];
                        var updateAsiResult = UpdateDocumentASI(document.template, fileId, docModel);
                        if (updateAsiResult) {
                            Avo_LogDebug("BB_006_UPLOADFILE - BlueBeam File Id updated successfully", 2);
                        } else {
                            Avo_LogDebug("BB_006_UPLOADFILE - Failed to update BlueBeam File Id", 2);
                        }
                        return updateAsiResult;
                    }
                } else {
                    return false;
                }
            } else {
                Avo_LogDebug("BB_006_UPLOADFILE - Document Data Fields (ASI) not found.", 1);
                return false;
            }

        } else {
            Avo_LogDebug("BB_006_UPLOADFILE - Document Not Found", 1);
            return false;
        }
    }
}

function UpdateDocumentASI(template, fileId, docModel) {
    try {
        EDITDOCUMENTASI(template, "BLUEBEAM", "File Id", fileId, docModel);
        // Uncheck 'Manual Upload' checkbox
        EDITDOCUMENTASI(template, "BLUEBEAM", "Manual Upload", null, docModel);
        return true;
    } catch (ex) {
        Avo_LogDebug("BB_006_UPLOADFILE UpdateDocumentASI() - error message: " + ex, 1);
        return false;
    }
}

