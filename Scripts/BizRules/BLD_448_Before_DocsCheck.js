/*******************************************************
| Script Title: docsCheck(ID448)
| Created by: Nicolaj Bunting
| Created on: 2Nov22
| Event: Before
| Usage: If no doc of type "Plan Set | PLANS" Or ASI "Impervious Surface" >= 150 and no doc of type
| "C3 and C6 Checklist | C3C6" Or ASI "Occupancy Change" is checked and no doc of type
| "Accessibility Form | ACCESS" or "Title 24 Compliance Documents | T24COM" Then block submittal, display
| message
| "The following document(s) are missing. For further details please refer to the instructional text below.\n- "
| + all missing doc types
| Modified by: ()
*********************************************************/
/*------------------------------------------------------------------------------------------------------/
| Main Loop
/-----------------------------------------------------------------------------------------------------*/
(function () {
    var allReqDocTypes = new Object();
    allReqDocTypes["Plan Set | PLANS"] = true;

    var impervSurface = parseFloat(AInfo["Impervious Surface"]);
    Avo_LogDebug("Impervious Surface(" + impervSurface + ")", 2);   //debug

    if (isNaN(impervSurface) != true && impervSurface >= 150) {
        allReqDocTypes["C3 and C6 Checklist | C3C6"] = true;
    }

    var occChange = String(AInfo["Occupancy Change"]);
    Avo_LogDebug("Occupancy Change(" + occChange + ")", 2); //debug

    if (occChange == "CHECKED") {
        allReqDocTypes["Accessibility Form | ACCESS"] = true;
        allReqDocTypes["Title 24 Compliance Documents | T24COM"] = true;
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

        var category = docModel.docCategory;
        Avo_LogDebug("Category(" + category + ")", 2); //debug

        if (!(category in allReqDocTypes)) {
            continue;
        }

        delete allReqDocTypes[category];
        Avo_LogDebug("Found " + category + " doc", 1);
    }

    if (Object.keys(allReqDocTypes).length == 0) {
        return;
    }

    Avo_LogDebug(br + "No " + Object.keys(allReqDocTypes).join(", ") + " doc(s) found", 1);

    cancel = true;
    showMessage = true;
    comment("The following document(s) are missing. \
For further details please refer to the instructional text below.\n- "
        + Object.keys(allReqDocTypes).join("\n- "));
})();

aa.env.setValue("CapModel", cap);

//aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC Test: BLD_448_Before_DocsCheck", debug); //debug

/*------------------------------------------------------------------------------------------------------/
| END Main Loop
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| BEGIN Functions
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| END Functions
/------------------------------------------------------------------------------------------------------*/