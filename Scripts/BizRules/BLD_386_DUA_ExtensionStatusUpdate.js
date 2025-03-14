/*******************************************************
| Script/Function: extensionStatusUpdate(ID386)
| Created by: Jei Yang
| Created on: 24Nov21
| Usage: When ACA user uploads the "Extension Request | EXTR" document,
|        Update record status to "Extension Requested"
| Modified by: ()
*********************************************************/
(function () {
    var allDocs = documentModelArray.toArray();
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

        //var group = String(docModel.docGroup);
        //Avo_LogDebug("Group(" + group + ")", 2);    //debug

        //if (group != "BLD_RES_RRF") {
        //    continue;
        //}

        var category = String(docModel.docCategory);
        Avo_LogDebug("Category(" + category + ")", 2);  //debug

        if (category != "Extension Request | EXTR") {
            continue;
        }

        // Update status
        updateAppStatus("Extension Requested", "Updated by ID386 extensionStatusUpdate", capId);
        return;
    }
})();

aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC Supp: BLD_386_DUA_extensionStatusUpdate", debug);    //debug