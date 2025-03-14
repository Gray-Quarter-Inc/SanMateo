/*******************************************************
| Script/Function: extensionRequestBlock() - (ID521)
| Created by: 
| Created on: 
| Usage: Block upload of the document type "Extension request | PWEX | 98" 
|        with the message "Extensions can only be requested once the permit has been issued and has not yet expired"
| Modified by: ()
*********************************************************/
(function () {
    //cancel = true;  //testing
    //showDebug = true;   //testing
    var capToCheck = aa.cap.getCap(capId).getOutput();
    var status = String(capToCheck.getCapStatus());
    Avo_LogDebug("Status(" + status + ")", 2);  //debug

    //Record status check
    if (status == "Permit Issued") {
        return;
    }

    //Check if document category is "Extension Request"
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

        if (category != "Extension Request | PWEX | 98") {
            continue;
        }

        cancel = true;
        if (publicUser == true) {
            showDebug = false;  // Disable debug in ACA
        }
        showMessage = true;
        comment("Extensions can only be requested once the permit has been issued and has not yet expired");
        return;
    }

})();

aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC Prod: DPW_521_DUB_ExtensionRequestBlock", debug); //debug
