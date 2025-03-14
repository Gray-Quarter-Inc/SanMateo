/*******************************************************
| Script Title: deckPatioReqDoc(ID283)
| Created by: Jei Yang
| Created on: 11May21
| Event: Before
| Usage: If no doc of type 'Plan Set | PLANS"
| Or ASI
| "Amount of new or replaced impervious surface. Include sq ft from pools & spas as applicable (sq ft)"
| >= 150 and no document of type "C3 and C6 Checklist | C3C6"
| Or sum of ASI "Cut volume (cubic yds)" and "Fill volume (cubic yds)">= 250 and no document of type
| "Geotechnical Report | GEO"
| Or ASI "Are you replacing dry rot or termite damage?" is "Yes" and no document of type
| "Termite Report | TERMITE"
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
        Avo_LogDebug("ID283 deckPatioReqDoc()", 1);

        var allReqDocTypes = new Object();
        allReqDocTypes["Plan Set | PLANS"] = true;

        var surfaceAmt = parseInt(String(AInfo["Amount of new or replaced impervious surface. \
Include sq ft from pools & spas as applicable (sq ft)"]));
        Avo_LogDebug("Impervious surface(" + surfaceAmt + ")", 2); //debug

        if (surfaceAmt >= 150) {
            allReqDocTypes["C3 and C6 Checklist | C3C6"] = true;
        }

        var cutVolume = parseFloat(String(AInfo["Cut volume (cubic yds)"]));
        Avo_LogDebug("Cut volume (cubic yds)(" + cutVolume + ")", 2); //debug

        var fillVolume = parseFloat(String(AInfo["Fill volume (cubic yds)"]));
        Avo_LogDebug("Fill volume (cubic yds)(" + fillVolume + ")", 2); //debug

        if (cutVolume + fillVolume >= 250) {
            allReqDocTypes["Geotechnical Report | GEO"] = true;
        }

        var replacingDamage = String(AInfo["Are you replacing dry rot or termite damage?"]);
        Avo_LogDebug("Are you replacing dry rot or termite damage?(" + replacingDamage + ")", 2); //debug

        if (replacingDamage.toUpperCase() == "YES") {
            allReqDocTypes["Termite Report | TERMITE"] = true;
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