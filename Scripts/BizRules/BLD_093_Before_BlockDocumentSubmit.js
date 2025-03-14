/*******************************************************
| Script/Function: blockDocumentSubmit() - (ID93)
| Created by: Jei Yang
| Created on: 16Nov21
| Usage: On document upload If doc desc is Not "Downloaded from BlueBeam by integration" And record status is not "Received" or not 
| "Additional Info Required" And not null And any task "Application Submittal", "Review Consolidation", "Inspections" is not active Then 
| block submittal and display message "Cannot upload documents at this stage of the permit process"
| Modified by: ()
*********************************************************/
/*------------------------------------------------------------------------------------------------------/
| Main Loop
/-----------------------------------------------------------------------------------------------------*/
try {
    (function () {
        //showDebug = true;   //testing
        //cancel = true;
        Avo_LogDebug("ID093 blockDocumentSubmit()", 1);


        // Check docs
        var allDocs = new Array();
        var result = aa.document.getDocumentListByEntity(capId, "TMP_CAP");
        if (result.getSuccess() != true) {
            Avo_LogDebug("Failed to find any documents. " + result.errorType + ': ' + result.errorMessage, 1);
        } else {
            allDocs = result.getOutput().toArray();
        }

        Avo_LogDebug("Total Docs(" + allDocs.length + ")", 2);  //debug

        for (var i in allDocs) {
            var docModel = allDocs[i];

            var docId = docModel.documentNo;
            Avo_LogDebug("Doc ID(" + docId + ")", 2);	//debug

            var filePath = docModel.fileName;
            Avo_LogDebug("Path(" + filePath + ")", 2);	//debug

            var name = docModel.docName;
            Avo_LogDebug("Name(" + name + ")", 2);  //debug

            var group = docModel.docGroup;
            Avo_LogDebug("Group(" + group + ")", 2); //debug

            var category = docModel.docCategory;
            Avo_LogDebug("Category(" + category + ")", 2); //debug

            var docDesc = String(docModel.docDescription);
            Avo_LogDebug("Doc Desc(" + docDesc + ")", 2);   //debug
    
            if (docDesc != "Downloaded from BlueBeam by integration") {
                continue;
            }
    
            Avo_LogDebug("Found document uploaded by integration. Exiting", 1);
            return;
        }

            
        var capToCheck = aa.cap.getCap(capId).getOutput();
        var status = String(capToCheck.getCapStatus());
        Avo_LogDebug("Status(" + status + ")", 2);  //debug

        if (status == "Received" || status == "Additional Info Required" || status.toLowerCase() == "null") {
            return;
        }

        //flags for workflow tasks. (false: inactive / true: active)
        var f_appSubmittal = false;
        var f_reviewConsol = false;
        var f_inspections = false;

        var result = aa.workflow.getTasks(capId);
        if (result.getSuccess() != true) {
            Avo_LogDebug('Failed to get tasks. ' + result.errorType + ': ' + result.errorMessage, 1);
            return;
        }

        var allTasks = result.getOutput();
        for (var i in allTasks) {
            var task = allTasks[i];
            var taskName = task.getTaskDescription();
            var isActive = task.activeFlag == "Y";
            var isComplete = task.completeFlag == "Y";
            Avo_LogDebug('Task "' + taskName + '" (Active: ' + isActive + ', Complete: ' + isComplete + ')', 2);	//debug  
            if (taskName == "Application Submittal" && isActive && !isComplete) {
                f_appSubmittal = true;
            }

            if (taskName == "Review Consolidation" && isActive && !isComplete) {
                f_reviewConsol = true;
            }

            if (taskName == "Inspections" && isActive && !isComplete) {
                f_inspections = true;
            }

            Avo_LogDebug('"' + taskName + '" Active(' + isActive.toString() + ")", 2);	//debug
        }

        if (f_appSubmittal == true || f_reviewConsol == true || f_inspections == true) {
            return;
        }

        Avo_LogDebug('The tasks are all inactive.', 2);	//debug

        cancel = true;
        showMessage = true;
        comment("The following document(s) are missing. For further details please refer to the instructional text below.\n- " + Object.keys(allReqDocTypes).join("\n- "));
    })();

    aa.env.setValue("CapModel", cap);
}
catch (ex) {
    Avo_LogDebug("ERROR: " + ex.message, 1);
}

aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC Supp: BLD_277_PropaneWaterTankReqDoc", debug); //debug

/*------------------------------------------------------------------------------------------------------/
| END Main Loop
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| BEGIN Functions
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| END Functions
/------------------------------------------------------------------------------------------------------*/