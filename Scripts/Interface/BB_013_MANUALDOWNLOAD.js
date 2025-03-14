/*******************************************************
| Script/Function: BB_013_MANUALDOWNLOAD
| Created by: Tom Grzegorczyk
| Created on: 16 Feb 2021
| Usage: Executes a manual download of files from BlueBeam 
| Prerequisites: This script requires some of the functions from BB_000_HELPERS.js please include make sure it's included whenever using this script
| Modified by: ()
*********************************************************/
eval(getScriptText("BB_004_GETBLUEBEAMFILE"));
eval(getScriptText("BB_007_GETFOLDERITEMS"));
eval(getScriptText("BB_008_GETFOLDERBYNAME"));
eval(getScriptText("BB_009_CREATEDOCUMENT"));

// Downloads all revised files and creates document wrappers
// Parameters:
    // token - adapter session token
    // folderName - BlueBeam Project Record sub folder to look for files
    // projectId - ID of the project that holds Record Folders for this environment
    // recordFolderId - ID of the Record Folder for the current CAP (stored in 'Record Folder Id' ASI)
    // docGroup - Document group that downloaded document will use
    // docCategory - Document category that downloaded document will use
function DOWNLOADFILES(token, folderName, projectId, recordFolderId, docGroup, docCategory) {
    var success = true;
    var folderId;
    if (folderName == null || folderName == "") {
        folderId = recordFolderId;
        Avo_LogDebug("downloadFiles() - Record root folder. Folder Id: " + folderId, 2);
    } else {
        // Get Download folder Id
        folderId = GETFOLDERBYNAME(token, projectId, recordFolderId, folderName);
        if (folderId == null) {
            Avo_LogDebug("downloadFiles() - 'Accela Download' Folder Not Found", 1);
            //showComment("BlueBeam integration failed. Record Folder not found. ");
            return false;
        }
        Avo_LogDebug("downloadFiles() - Folder '" + folderName + "' found. Folder Id: " + folderId, 2);
    }
    // Get files from the download folder
    var files = getFiles(token, projectId, folderId);
    if (files.length > 0) {
        // Download all files and create documents for them
        for (var f in files) {
            var fileDetails = files[f];
            if (fileDetails.Name && fileDetails.DownloadUrl) {
                Avo_LogDebug("fileDetails.Name: " + fileDetails.Name, 2);
                Avo_LogDebug("fileDetails.DownloadUrl: " + fileDetails.DownloadUrl, 2);
                var created = createNewDocument(fileDetails, token, docGroup, docCategory);
                if (created == false) {
                    success = false;
                }
            }
        }
    } else {
        Avo_LogDebug("downloadFiles() - No files found in 'Accela Download' folder", 1);
        //showComment("BlueBeam integration failed. No files found in 'Accela Download' folder. ");
        return false;
    }

    if (success == false) {
        //showComment("BlueBeam integration failed. Check logs for error.");
        return false;
    }
    return success;
}

//Retrieves file URL's for all the files located in the target folder
function getFiles(token, projectId, folderId) {
    var files = [];
    try {
        var response = GETFOLDERITEMS(token, projectId, folderId);
        if (response.ProjectFiles) {
            var files = response.ProjectFiles;
            for (var f in files) {
                file = files[f];
                if (file.Id) {
                    var fileDetails = GETBLUEBEAMFILE(token, projectId, file.Id);
                    if (fileDetails.DownloadUrl) {
                        files.push(fileDetails);
                    }
                }
            }
        }
    } catch (ex) {
        Avo_LogDebug("**Error in getFiles(token," + projectId + "," + folderId + "): " + ex.message, 1);
    }
    return files;
}

// Creates new document in Accela
function createNewDocument(file, token, group, category) {
    try {
        //Set props
        var docGroup = group;
        var docCategory = category;
        var description = "Downloaded from BlueBeam by integration";
        var numIndex = file.Name.lastIndexOf(".");
        var extension = file.Name.substr(numIndex + 1);
        var fileType = getContentType(extension);
        var fileName = file.Name;
        var url = file.DownloadUrl;
        var environment = BluebeamConfig.Environment;

        // Create document
        var newDocResult = CREATEDOCUMENT(token, capId, docGroup, docCategory, fileType, fileName, url, description, environment);
        //Avo_LogDebug("createDocument() - newDocResult: " + newDocResult, 1);
        if (newDocResult != null && newDocResult.status == 200 && newDocResult.result.length > 0) {
            var documentNo = null;
            if (newDocResult.result[0].id) {
                documentNo = newDocResult.result[0].id;
            }
            if (documentNo == null) {
                Avo_LogDebug("createDocument() - Failed to created document: " + doc.getFileName(), 1);
                return false;
            }
            Avo_LogDebug("createDocument() - New document Id: " + documentNo, 1);
            // Update File Id ASI
            var document = aa.document.getDocumentByPK(documentNo).getOutput();
            if (document && document.template) {
                var forms = document.template.templateForms;
                if (forms) {
                    var updateAsiResult = UpdateDocumentASI(document.template, file.Id, file.Name, doc);
                    if (updateAsiResult == true) {
                        Avo_LogDebug("createDocument() - Successfully updated BlueBeam File Id ASI for document: " + doc.getFileName(), 1);
                    } else {
                        Avo_LogDebug("createDocument() - Failed to update BlueBeam File Id ASI for document: " + doc.getFileName(), 1);
                    }
                }
            }
            return true;
        }
        else {
            Avo_LogDebug("createDocument() - Failed to created document: " + doc.getFileName(), 1);
            return false;
        }
    } catch (ex) {
        Avo_LogDebug("**Error in createDocument(): " + ex.message, 1);
        return false;
    }
}

function getContentType(fileType) {
    fileType = fileType.toLowerCase();
    switch (fileType) {
        case "pdf":
            return "application/pdf";
        case "doc":
            return "application/msword";
        case "docx":
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        case "zip":
            return "application/zip";
        case "tif":
            return "image/tiff";
        case "tiff":
            return "image/tiff";
        case "txt":
            return "text/plain";
        case "gif":
            return "image/gif";
        case "jpeg":
            return "image/jpeg";
        case "jpg":
            return "image/jpeg";
        case "png":
            return "image/png";
        case "PNG":
            return "image/x-png";
        case "rtf":
            return "application/rtf";
        case "xls":
            return "application/vnd.ms-excel";
        case "xlsx":
            return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    }
    return "Not Supported";
}