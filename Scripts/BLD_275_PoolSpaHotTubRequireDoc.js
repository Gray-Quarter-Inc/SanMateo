/*******************************************************
| Script Title: poolSpaHotTubRequireDoc(ID275)
| Created by: Tom Grzegorczyk
| Created on: 6May21
| Event: Before
| Usage: If no document of type "Plan Set | PLANS"
| Or ASI
| "Amount of new or replaced impervious surface. Include sq ft from pools & spas as applicable (sq ft)"
| >= 150 sq ft and no document of type "C3 and C6 Checklist | C3C6"
| Or ASI
| "Amount of rehabilitated or new irrigated landscaping area. Including sq ft from pools, spas, ponds"
| >= 500 and < 2500 and no document of type "WELO Prescriptive Compliance Form | WELOPC"
| Or ASI
| "Amount of rehabilitated or new irrigated landscaping area. Including sq ft from pools, spas, ponds"
| >= 2500 (integer no decimals) and no document of type "WELO Performance Approach | WELOPA"
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
        Avo_LogDebug("ID275 poolSpaHotTubRequireDoc()", 1);

        var allReqDocTypes = new Object();
        allReqDocTypes["Plan Set | PLANS"] = true;

        var newOrReplacedSurface = parseInt(String(AInfo["Amount of new or replaced impervious surface. \
Include sq ft from pools & spas as applicable (sq ft)"]));
        Avo_LogDebug("Impervious surface(" + newOrReplacedSurface + ")", 2); //debug

        if (newOrReplacedSurface >= 150) {
            allReqDocTypes["C3 and C6 Checklist | C3C6"] = true;
        }

        var landscapingArea = parseInt(String(AInfo[
            "Amount of rehabilitated or new irrigated landscaping area. \
Including sq ft from pools, spas, ponds"]));
        Avo_LogDebug("Landscaping area(" + landscapingArea + ")", 2); //debug

        if (landscapingArea >= 500 && landscapingArea < 2500) {
            allReqDocTypes["WELO Prescriptive Compliance Form | WELOPC"] = true;
        } else if (landscapingArea >= 2500) {
            allReqDocTypes["WELO Performance Approach | WELOPA"] = true;
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