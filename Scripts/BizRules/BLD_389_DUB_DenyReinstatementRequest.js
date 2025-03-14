/*******************************************************
| Script/Function: denyReinstatementRequest() - (ID389)
| Created by: Jei Yang
| Created on: 25Nov21
| Usage: On document upload of "Reinstatement Request | REIN", if the record status is not "Expired" and ASI "Number of Expiration" is not (0 or 1),
|        Block submit and display message "This record cannot be reinstatement at this time".
| Modified by: ()
*********************************************************/
(function () {
    //cancel = true;  //testing
    //showDebug = true;   //testing
    var capToCheck = aa.cap.getCap(capId).getOutput();
    var status = String(capToCheck.getCapStatus());
    Avo_LogDebug("Status(" + status + ")", 2);  //debug

    //Record status check
    if (status == "Expired") {
        return;
    }

    //ASI 'Number of Expiration'
    var numOfExp = AInfo["Number of Expiration"];
    Avo_LogDebug("Number of Expiration(" + numOfExp + ")", 2); //debug

    if (numOfExp && (numOfExp == 0 || numOfExp == 1)) {
        return;
    }

    //Check if document category is "Reinstatement Request"
    var allDocs = documentModelArray.toArray();
    for (var i in allDocs) {
        var docModel = allDocs[i];

        var docId = docModel.documentNo
        Avo_LogDebug("Doc ID(" + docId + ")", 2);	//debug

        var name = String(docModel.docName);
        Avo_LogDebug("Name(" + name + ")", 2);	//debug

        var filename = String(docModel.fileName);
        Avo_LogDebug("Filename(" + filename + ")", 2);	//debug

        var group = String(docModel.docGroup);
        Avo_LogDebug("Group(" + group + ")", 2);    //debug

        var category = String(docModel.docCategory);
        Avo_LogDebug("Category(" + category + ")", 2);  //debug

        if (category != "Reinstatement Request | REINR") {
            continue;
        }

        cancel = true;
        if (publicUser == true) {
            showDebug = false;  // Disable debug in ACA
        }
        showMessage = true;
        comment("This record cannot be reinstatement at this time");
        return;
    }


})();

aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC Supp: BLD_389_DUB_DenyReinstatementRequest", debug); //debug