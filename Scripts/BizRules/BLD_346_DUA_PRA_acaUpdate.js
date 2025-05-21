/*******************************************************
| Script/Function: acaUpdate(ID346)
| Created by: Nicolaj Bunting
| Created on: 23Jun21
| Usage: On payment or document upload If in ACA And cap is complete And wf has history Then set record status to "ACA Update"
| Modified by: Jei Yang - 346 is skipped for the document type 'Reinstatement Request | REINR' and 'Extension Request | EXTR'.
|              Jei Yang - 346 is skipped when DUA event is triggered by Revision record creation. 
|                         When the doc is added to its parent permit (Entity Type = Related Record) skip the status update.
|              Tom Grzegorczyk - record type exceptions only for PRA event     
|              TP  - 12338 - changed functionality          
*********************************************************/
(function () {
    try {

        var comment = "";
        if (controlString == "DocumentUploadAfter") {
            var isRevisionPermit = appMatch("Building/Revision/NA/NA", capId);

            var allDocs = documentModelArray.toArray();
            var skippedForThisDocType = true;
            var isRevisionDoc = true; //if entity type is 'Related Record', 
            for (var i in allDocs) {
                var docModel = allDocs[i];

                var docId = docModel.documentNo
                Avo_LogDebug("Doc ID(" + docId + ")", 2);	//debug

                var name = String(docModel.docName);
                Avo_LogDebug("Name(" + name + ")", 2);	//debug

                var filename = String(docModel.fileName);
                Avo_LogDebug("Filename(" + filename + ")", 2);	//debug

                var uploadDate = new Date(docModel.fileUpLoadDate.time);
                Avo_LogDebug("Upload Date(" + aa.util.formatDate(uploadDate, "MM/dd/yyyy") + ")", 2);   //debug

                var group = String(docModel.docGroup);
                Avo_LogDebug("Group(" + group + ")", 2);    //debug

                var category = String(docModel.docCategory);
                Avo_LogDebug("Category(" + category + ")", 2);  //debug

                var entityType = String(docModel.entityType);
                Avo_LogDebug("Entity Type(" + entityType + ")", 2);

                if (category != "Reinstatement Request | REINR" && category != "Extension Request | EXTR") {
                    skippedForThisDocType = false;
                }
                if (group != "BLD_REV") {
                    isRevisionDoc = false;
                }
            }
            if (skippedForThisDocType) {
                Avo_LogDebug("346 is skipped for the document type 'Reinstatement Request | REINR' and 'Extension Request | EXTR'.", 2);  //debug
                return;
            }
            if (isRevisionDoc && !isRevisionPermit) {
                //For Related Records - DUA event triggered for parent permit when doc is added to its Revision.
                Avo_LogDebug("346 is skipped when DUA event is triggered by Related Record.", 2);  //debug
                return;
            }
        }

        if (appMatch("Building/Residential/Window or Door/NA", capId) == true
            || appMatch("Building/Residential/Plumbing/Water Heater", capId) == true
            || appMatch("Building/Residential/Plumbing/NA", capId) == true
            || appMatch("Building/Residential/Re-Roof/NA", capId) == true
            || appMatch("Building/Residential/Siding and Stucco/NA", capId) == true
            || appMatch("Building/Residential/Electrical/Service Upgrade", capId) == true
            || appMatch("Building/Residential/Mechanical/HVAC", capId) == true) {
            //Record type exceptions 
            if (!capId) {
                return;
            }

            var result = aa.cap.getCap(capId);
            if (result.getSuccess() != true) {
                Avo_LogDebug("Failed to get cap. " + result.errorType + ': ' + result.errorMessage, 1);
                return;
            }

            var cap = result.getOutput();
            var completeCap = cap.isCompleteCap();
            Avo_LogDebug("Complete(" + completeCap.toString() + ")", 2); //debug

            if (completeCap != true) {
                Avo_LogDebug("Record is only temporary", 1);
                return;
            }
            if (controlString = "DocumentUploadAfter") {
                comment = "Document(s) uploaded";
                updateAppStatus("ACA Update", comment, capId);
            }
            if (controlString = "PaymentReceiveAfter") {
                comment = "Payment Received";
                updateAppStatus("ACA Update", comment, capId);
            }

        } else {
            var wfHist = aa.workflow.getWorkflowHistory(capId, aa.util.newQueryFormat());
            if (!wfHist.getSuccess) {
                Avo_LogDebug("No workflow history", 1);
                return;
            }

            if (wfHist.getSuccess) {
                wfHist = wfHist.getOutput();
                if (wfHist.length = 0) {
                    Avo_LogDebug("Workflow History length is 0", 1);
                    return;
                }
                if (wfHist.length > 0) {
                    if (controlString == "DocumentUploadAfter") {
                        comment = "Document(s) uploaded";
                        updateAppStatus("ACA Update", comment, capId);
                    }
                    if (controlString == "PaymentReceiveAfter") {
                        comment = "Payment Received";
                        updateAppStatus("ACA Update", comment, capId);
                    }
                }
            }
        }
    } catch (ex) {
        Avo_LogDebug("**Error in acaUpdate(ID346): " + ex.message, 1);
    }
})();

//aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC PROD: BLD_346_DUA_PRA_acaUpdate", debug);    //debug
