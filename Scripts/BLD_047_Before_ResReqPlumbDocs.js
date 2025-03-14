/*******************************************************
| Script Title: resReqPlumbDocs(ID47)
| Created by: Nic Bunting
| Created on: 30Oct20
| Event: Before
| Usage: If ASI "New or Replacement Meter" is "New" And no document of type "BLD_RES_PLM" / "Will Serve"
| Or ASI "Is the gas line running into a dedicated appliance" is "No" And no document of type
| "BLD_RES_PLM" / "Schematics" Then block submittal and display message
| "The following document(s) are missing. To continue please upload a document of the following type(s):"
| + "-" + docType + "For further details please refer to the instructional text below."
| Modified by: ()
*********************************************************/
/*------------------------------------------------------------------------------------------------------/
| Main Loop
/-----------------------------------------------------------------------------------------------------*/
try {
    (function () {
        Avo_LogDebug("ID47 resReqPlumbDocs()", 1);

        var allReqDocTypes = new Object();

        var meter = String(AInfo["New or Replacement Meter"]);
        Avo_LogDebug("Meter(" + meter + ")", 2); //debug

        if (meter.toUpperCase() == "NEW") {
            allReqDocTypes["Will Serve Letter | WSL"] = true;
        }

        var gasLine = String(AInfo["Gas line"]);
        Avo_LogDebug("Gas Line(" + gasLine + ")", 2); //debug

        if (gasLine.toUpperCase() == "CHECKED") {
            allReqDocTypes["Schematics | SCHEM"] = true;
        }

        if (Object.keys(allReqDocTypes).length == 0) {
            return;
        }

        // Check docs
        var allDocs = new Array();
        var result = aa.document.getDocumentListByEntity(capId, "TMP_CAP");
        if (result.getSuccess() != true) {
            Avo_LogDebug("Failed to find any documents. "
                + result.errorType + ': ' + result.errorMessage, 1);
        } else {
            allDocs = result.getOutput().toArray();
        }

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

            if (group.toUpperCase() != "BLD_RES_PLM") {
                continue;
            }

            var category = docModel.docCategory;
            Avo_LogDebug("Category(" + category + ")", 2); //debug

            if (!(category in allReqDocTypes)) {
                continue;
            }

            //var uploadDate = new Date(docModel.fileUpLoadDate.time);
            //Avo_LogDebug("Upload Date(" + aa.util.formatDate(uploadDate, "MM/dd/yyyy")
            //+ ")", 2);   //debug

            delete allReqDocTypes[category];
            Avo_LogDebug("Found " + category + " doc", 1);
        }

        if (Object.keys(allReqDocTypes).length == 0) {
            return;
        }

        Avo_LogDebug("No " + Object.keys(allReqDocTypes).join(", ") + " doc(s) found", 1);

        cancel = true;
        showMessage = true;
        showDebug = false;

        var msg = "The following document(s) are missing. \
To continue please upload a document of the following type(s):";
        for (var i in Object.keys(allReqDocTypes)) {
            msg += "\n- " + Object.keys(allReqDocTypes)[i];
        }

        msg += "\nFor further details please refer to the instructional text below.";

        comment(msg);
    })();

    aa.env.setValue("CapModel", cap);
}
catch (ex) {
    Avo_LogDebug("ERROR: " + ex.message, 1);
}

/*------------------------------------------------------------------------------------------------------/
| END Main Loop
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| BEGIN Functions
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| END Functions
/------------------------------------------------------------------------------------------------------*/