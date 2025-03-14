/*******************************************************
| Script Title: resReqPoolDocs(ID85)
| Created by: Nic Bunting
| Created on: 23Nov20
| Event: Before
| Usage: If ASI "Surface Area" >= 500 and < 2500 and no document of type "BLD_RES_POOL" /
| "Prescriptive Compliance Form" Or > 2500 and no documents of type "BLD_RES_POOL" /
| "Performance Approach", "BLD_RES_POOL" / "Landscape", "BLD_RES_POOL" / "Soil" Or ASI
| "Inground or Onground" is "Inground" and no document of type "BLD_RES_POOL" /
| "Structural Plans and Calculations" Or ASI "Amount of paving and other impervious surface" > 150 and
| no document of type "BLD_RES_POOL" / "Stormwater Impervious Surface Calculation Form" Then block
| submittal and display message
| "The following document(s) are missing. To continue please upload a document of the following type(s):"
| + "-" + docType + "For further details please refer to the instructional text below."
| Modified by: ()
*********************************************************/
/*------------------------------------------------------------------------------------------------------/
| Main Loop
/-----------------------------------------------------------------------------------------------------*/
try {
    (function () {
        Avo_LogDebug("ID85 reqPoolDocs()", 1);

        var allReqDocTypes = new Object();

        var surfaceArea = parseFloat(AInfo["Surface Area"]);
        Avo_LogDebug("Surface Area(" + surfaceArea + ")", 2); //debug

        if (surfaceArea >= 500 && surfaceArea < 2500) {
            allReqDocTypes["Prescriptive Compliance Form | WELOPC"] = true;
        }

        if (surfaceArea >= 2500) {
            allReqDocTypes["Performance Approach | WELOPA"] = true;
            allReqDocTypes["Landscape | LAND"] = true;
            allReqDocTypes["Soil | SOIL"] = true;
        }

        var ground = String(AInfo["Inground or Onground"]);
        Avo_LogDebug("Ground(" + ground + ")", 2); //debug

        if (ground.toUpperCase() == "Inground".toUpperCase()) {
            allReqDocTypes["Structural Plans and Calculations | STRUC"] = true;
        }

        var pavingArea = parseFloat(AInfo["Amount of paving and other impervious surface"]);
        Avo_LogDebug("Paving Area(" + pavingArea + ")", 2); //debug

        if (pavingArea > 150) {
            allReqDocTypes["Stormwater Impervious Surface Calculation Form | ISCALC"] = true;
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
            Avo_LogDebug(br + "Doc ID(" + docId + ")", 2);	//debug

            var filePath = docModel.fileName;
            Avo_LogDebug("Path(" + filePath + ")", 2);	//debug

            var name = docModel.docName;
            Avo_LogDebug("Name(" + name + ")", 2);  //debug

            var group = docModel.docGroup;
            Avo_LogDebug("Group(" + group + ")", 2); //debug

            if (group.toUpperCase() != "BLD_RES_POOL") {
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

        Avo_LogDebug(br + "No " + Object.keys(allReqDocTypes).join(", ") + " doc(s) found", 1);

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