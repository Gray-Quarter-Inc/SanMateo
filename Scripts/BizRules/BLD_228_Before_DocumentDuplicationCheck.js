/*******************************************************
| Script Title: documentduplicationcheck(ID228)
| Created by: Mike Buell
| Created on: 22Feb21
| Event: Before
| Usage: Make sure document types are no uploaded 2x. (Exception: 'Plan Set | PLANS')
| Modified by: ()
*********************************************************/
/*------------------------------------------------------------------------------------------------------/
| Main Loop
/-----------------------------------------------------------------------------------------------------*/
try {
    (function () {
        //showDebug = true;   //testing
        //cancel = true;
        Avo_LogDebug("ID228 documentDuplicationCheck()", 1);
        var capToCheck = aa.cap.getCap(capId).getOutput();
        var status = String(capToCheck.getCapStatus());
        Avo_LogDebug("Status(" + status + ")", 2);  //debug
    
        if (status && status.toLowerCase() != "null") {
            return;
        }

        // Check new doc to upload
        var newDoc = documentModelArray.toArray()[0];
        var newDocCategory = String(newDoc.docCategory);
        Avo_LogDebug("Category of the document to upload(" + newDocCategory + ")", 2);  //debug

        if (newDocCategory == "Plan Set | PLANS") {
            return;
        }

        // Existing documents
        var allDocs = new Array();
        var result = aa.document.getDocumentListByEntity(capId, "TMP_CAP");
        if (result.getSuccess() != true) {
            Avo_LogDebug("Failed to find any documents. " + result.errorType + ': ' + result.errorMessage, 1);
        } else {
            allDocs = result.getOutput().toArray();
            //var loopAllDocs = result.getOutput().toArray();
        }

        Avo_LogDebug("Total Existing Docs(" + allDocs.length + ")", 2);  //debug

        var multipleDocTypes = "N";

        for (var i in allDocs) {
            var docModel = allDocs[i];
            var category = docModel.docCategory;
            Avo_LogDebug("Category(" + category + ")", 2); //debug

            if (newDocCategory == category) {
                Avo_LogDebug("Found " + category + " doc", 1);
                multipleDocTypes = "Y";
                break;
            }
        }

        if(multipleDocTypes == "N") {
            return;
        }

        cancel = true;
        showMessage = true;
        comment("Only (1) document upload per Document Type is allowed. Please group documents into single PDFs, if necessary. Please see our Electronic File Submittal Requirements for more information. The link for Electronic File Submittal Requirement is: https://planning.smcgov.org/sites/planning.smcgov.org/files/press-release/files/SMC_Planning_ElectronicFileSubmittalRequirements_v04.pdf");
    })();

    aa.env.setValue("CapModel", cap);
}
catch (ex) {
    Avo_LogDebug("ERROR: " + ex.message, 1);
}

aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC Supp: BLD_030_Before_ResReqElecServUpgradeDoc", debug); //debug

/*------------------------------------------------------------------------------------------------------/
| END Main Loop
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| BEGIN Functions
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| END Functions
/------------------------------------------------------------------------------------------------------*/