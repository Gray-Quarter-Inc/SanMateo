/*******************************************************
| Script Title: kitchenBathReqDoc(ID279)
| Created by: Jei Yang
| Created on: 13May21
| Event: Before
| Usage: If no doc of type 'Plan Set | PLANS"
| Or ASI "will you be moving / removing load bearing walls?" is "Yes" and no document of type 
| "Structural Calculations | SCALCS"
| Then block submittal, display message
| "The following document(s) are missing. To continue please upload a document of the following type(s):"
| + "-" + docType + "For further details please refer to the instructional text below."
| Modified by: ()
*********************************************************/
/*------------------------------------------------------------------------------------------------------/
| Main Loop
/-----------------------------------------------------------------------------------------------------*/
try {
    (function () {
        Avo_LogDebug("ID279 kitchenBathReqDoc()", 1);

        var allReqDocTypes = new Object();
        allReqDocTypes["Plan Set | PLANS"] = true;

        var loadBearingWalls = String(AInfo["Will you be moving / removing load bearing walls?"]);
        Avo_LogDebug("Changing load bearing walls?(" + loadBearingWalls + ")", 2); //debug
    
        if (loadBearingWalls.toUpperCase() == "YES") {
            allReqDocTypes["Structural Calculations | SCALCS"] = true;
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
        showDebug = false;
        showMessage = true;

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