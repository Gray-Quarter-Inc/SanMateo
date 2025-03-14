/*******************************************************
| Script/Function: reinstateStatusUpdate(ID387)
| Created by: Jei Yang
| Created on: 25Nov21
| Usage: When ACA user uploads the "Reinstatement Request | REINR" document,
|        Update record status to "Reinstatement Requested"
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

        if (category != "Reinstatement Request | REINR") {
            continue;
        }

        // Update status
        updateAppStatus("Reinstatement Requested", "Updated by ID387 reinstateStatusUpdate", capId);
        return;
    }
})();

aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC Supp: BLD_387_DUA_reinstateStatusUpdate", debug);    //debug