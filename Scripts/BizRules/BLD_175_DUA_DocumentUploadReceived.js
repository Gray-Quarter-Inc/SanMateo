/*******************************************************
| Script/Function: documentUploadReceived()
| Created by: Jei Yang
| Created on: 22Dec20
| Usage: When any document is uploaded from ACA, set record status to "Document Uploaded"
| Modified by: ()
*********************************************************/
(function () {
    var result = aa.cap.getCap(capId);
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get cap for record " + capId + ". " + result.errorType + ": " + result.errorMessage, 1);
        return;
    }

    var cap = result.getOutput();
    var isTemp = String(cap.capClass) == "INCOMPLETE TMP" || String(cap.capClass == "INCOMPLETE CAP") || String(cap.capClass == "INCOMPLETE EST");
    Avo_LogDebug("Temp(" + isTemp.toString() + ")", 2);	//debug

    if(isTemp) {
        return;
    }
    
    var result = aa.document.getCapDocumentList(capId, currentUserID);
    if (!result.getSuccess()) {
        Avo_LogDebug("Failed to find any documents. " + result.errorType + ': ' + result.errorMessage, 1);
        return;
    }
    var docs = result.getOutput();
    if (docs.length == 0) {
        return;
    }
    updateAppStatus("Document Uploaded", "Updated by script");

})();