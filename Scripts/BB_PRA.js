
/*******************************************************
| Script/Function: BB_PRA
| Created by: Tom Grzegorczyk   
| Created on: 25 May 2022
| Usage: Run BlueBeam integration for Payment Received After (PRA) event
| Modified by: ()
*********************************************************/
var adapterUrl = lookup("BB_CONFIGS", "URL");
var projectId = lookup("BB_CONFIGS", "PROJECT_ID");

eval(getScriptText("BB_000_HELPERS"));
eval(getScriptText("BB_001_GETBLUEBEAMTOKEN"));
eval(getScriptText("BB_005_UPDATEBLUEBEAMFOLDER"));
eval(getScriptText("BB_007_GETFOLDERITEMS"));
eval(getScriptText("BB_008_GETFOLDERBYNAME"));
(function () {
    Avo_LogDebug("BB_CTRCA - Initiated", 1);
    var debug = null;

    if (adapterUrl == undefined || adapterUrl == null || adapterUrl == "") {
        Avo_LogDebug("BB_DUAA - URL in BB_CONFIGS is not set", 1);
        return;
    }
    var projectId = lookup("BB_CONFIGS", "PROJECT_ID");
    if (projectId == undefined || projectId == null) {
        Avo_LogDebug("BB_PRA - PROJECT_ID in BB_CONFIGS is not set", 1);
    }
    Avo_LogDebug("BB_PRA - capId: " + capId, 2);
    var result = aa.cap.getCap(capId);
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get cap for record " + capId + ". " + result.errorType + ": " + result.errorMessage, 1);
        return;
    }

    var cap = result.getOutput();
    var capModel = cap.capModel;
    //aa.sendMail("noreply@smcgov.org", "tom.grzegorczyk@avocette.com", "", "SMC PROD: BB_CTRCA", "BB_CTRCA - Initiated. PublicUser: " + publicUser);
    if (cap && capModel) {
        try {
            //Avo_LogDebug("projectId: " + projectId);
            var folderId = getAppSpecific("Record Folder Id");
            //Avo_LogDebug("folderId: " + folderId);
            if (folderId != null) {
                //Get token
                var token = GETBLUEBEAMTOKEN();
                if (token != null) {
                    Avo_LogDebug("BB_PRA - altID: " + capModel.altID, 2);
                    var name = capModel.altID + ' - ' + getAddressPart();
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
                            Avo_LogDebug("BB_PRA - Record module folder not found", 1);
                            return;
                        }
                        Avo_LogDebug('moduleFolderId: ' + moduleFolderId, 1);

                        var d = new Date();
                        var year = d.getFullYear();
                        var yearFolderId = GETFOLDERBYNAME(token, projectId, moduleFolderId, year);
                        if (yearFolderId == null) {
                            Avo_LogDebug("BB_PRA - Year folder not found for module '" + module.toUpperCase() + "'", 1);
                            return false;
                        }
                        parentFolderId = yearFolderId;
                        Avo_LogDebug("parentFolderId2: " + parentFolderId, 2);
                    }

                    // Update record folder
                    var result = UPDATEBLUEBEAMFOLDER(token, projectId, folderId, name, parentFolderId);
                    if (result == true) {
                        Avo_LogDebug("BB_PRA - Record Folder successfully updated", 1);
                    } else {
                        Avo_LogDebug("BB_PRA - Record Folder update failed", 1);
                    }

                } else {
                    Avo_LogDebug("BB_PRA - Failed to get token from Accela BlueBeam Adapter", 1);
                }
            }
        } catch (ex) {
            Avo_LogDebug("**Error in BB_PRA: " + ex.message, 1);
        }

        //Update document names
        updateDocumentNames(capModel.altID, module);

    } else {
        Avo_LogDebug("Cap or CapModel not found.", 1);
    }
    //aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC PROD: BB_PRA", debug);
})();

if (debug != null) {
    //aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC PROD: BB_CTRCA", debug);
}

if (appMatch("Building/Revision/NA/NA") == true) {
    aa.sendMail("noreply@smcgov.org", "jei.yang@avocette.com", "", "SMC PROD: BB_CTRCA - Revision", debug);
} else {
    aa.sendMail("noreply@smcgov.org", "jei.yang@avocette.com", "", "SMC PROD: BB_CTRCA - Non-Revision", debug);
}
