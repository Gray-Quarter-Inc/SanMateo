/*******************************************************
| Script Title: signsAwningsDocsCheck(ID491)
| Created by: Nic Bunting
| Created on: 7Jun23
| Event: Before
| Usage: If no document of type "BLD_SIGN" / "Plan Set | PLANS" Then block submittal and display message
| "The following document(s) are missing. For further details please refer to the instructional text below."
| + "-" + docType + "For further details please refer to the instructional text below."
| Modified by: ()
*********************************************************/
/*------------------------------------------------------------------------------------------------------/
| Main Loop
/-----------------------------------------------------------------------------------------------------*/
try {
    (function () {
        Avo_LogDebug("ID491 signsAwningsDocsCheck()", 1);

        var allReqDocTypes = new Object();
        allReqDocTypes["Plan Set | PLANS"] = true;

        var illumSign = parseFloat(AInfo["IllumSign"]);
        Avo_LogDebug("Number of Proposed Illuminated Sign(s)" + illumSign + ")", 2);   //debug

        var litAwnings = parseFloat(AInfo["LitAwnings"]);
        Avo_LogDebug("Number of Proposed Awnings with Lights" + litAwnings + ")", 2);   //debug

        if ((isNaN(illumSign) != true && illumSign > 0) || (isNaN(litAwnings) != true && litAwnings > 0)) {
            allReqDocTypes["Title 24 Compliance Documents | T24COM"] = true;
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

            if (group.toUpperCase() != "BLD_SIGN") {
                continue;
            }

            var category = docModel.docCategory;
            Avo_LogDebug("Category(" + category + ")", 2); //debug

            if (!(category in allReqDocTypes)) {
                continue;
            }

            //var uploadDate = new Date(docModel.fileUpLoadDate.time);
            //Avo_LogDebug("Upload Date(" + aa.util.formatDate(uploadDate, "MM/dd/yyyy") + ")", 2);   //debug

            delete allReqDocTypes[category];
            Avo_LogDebug("Found " + category + " doc", 1);
        }

        if (Object.keys(allReqDocTypes).length == 0) {
            return;
        }

        Avo_LogDebug(br + "No " + Object.keys(allReqDocTypes).join(", ") + " doc(s) found", 1);

        cancel = true;
        showMessage = true;
        showDebug = false;

        var msg = "The following document(s) are missing. \
For further details please refer to the instructional text below.";
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

aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "",
    "SMC Test: BLD_491_Before_SignsAwningsDocsCheck", debug); //debug

/*------------------------------------------------------------------------------------------------------/
| END Main Loop
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| BEGIN Functions
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| END Functions
/------------------------------------------------------------------------------------------------------*/