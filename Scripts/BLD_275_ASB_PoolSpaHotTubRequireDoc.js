/*******************************************************
| Script Title: poolSpaHotTubRequireDoc(ID275)
| Created by: Tom Grzegorczyk
| Created on: 6May21
| Event: ASB
| Usage: On submit If document type "Plan Set | PLANS" is not uploaded
| Or ASI
| "Amount of new or replaced impervious surface. Include sq ft from pools & spas as applicable (sq ft)"
| >= 150 and document type "C3 and C6 Checklist | C3C6" is not uploaded
| Or ASI
| "Amount of rehabilitated or new irrigated landscaping area. Including sq ft from pools, spas, ponds"
| >= 500 and < 2500 and document type "WELO Prescriptive Compliance Form | WELOPC" is not uploaded
| Or ASI
| "Amount of rehabilitated or new irrigated landscaping area. Including sq ft from pools, spas, ponds"
| >= 2500 And document type "WELO Performance Approach | WELOPA" is not uploaded
| Or ASI "Project Type" is "Commercial" And document types "Structural Calculations | SCALCS",
| "Geotechnical Report | GEO" are not uploaded
| Then block submittal, display message "The following document(s) are missing. 
| To continue please upload a document of the following type(s):"
| + "-" + docType + "For further details please refer to the instructional text below."
| Modified by: ()
*********************************************************/
(function () {
    var allReqDocTypes = new Object();
    allReqDocTypes["Plan Set | PLANS"] = true;

    var newOrReplacedSurface = parseInt(AInfo["Amount of new or replaced impervious surface. \
Include sq ft from pools & spas as applicable (sq ft)"], 10);
    Avo_LogDebug("New or Replaced Surface(" + newOrReplacedSurface + ")", 2); //debug

    if (newOrReplacedSurface >= 150) {
        allReqDocTypes["C3 and C6 Checklist | C3C6"] = true;
    }

    var landscapingArea = parseInt(AInfo["Amount of rehabilitated or new irrigated landscaping area. \
Including sq ft from pools, spas, ponds"], 10);
    Avo_LogDebug("Landscaping Area(" + landscapingArea + ")", 2); //debug

    if (landscapingArea >= 500 && landscapingArea < 2500) {
        allReqDocTypes["WELO Prescriptive Compliance Form | WELOPC"] = true;
    } else if (landscapingArea >= 2500) {
        allReqDocTypes["WELO Performance Approach | WELOPA"] = true;
    }

    var projType = String(AInfo["Project Type"]);
    Avo_LogDebug("Project Type(" + projType + ")", 2);  //debug

    if (projType == "Commercial") {
        allReqDocTypes["Structural Calculations | SCALCS"] = true;
        allReqDocTypes["Geotechnical Report | GEO"] = true;
    }

    // Check docs
    var allDocs = aa.env.getValue("DocumentModelList");
    for (var i = 0; i < allDocs.size(); i++) {
        var docModel = allDocs.get(i);

        var name = String(docModel.fileName);
        Avo_LogDebug("Name(" + name + ")", 2);  //debug

        var group = String(docModel.docGroup);
        Avo_LogDebug("Group(" + group + ")", 2);    //debug

        var category = String(docModel.docCategory);
        Avo_LogDebug("Category(" + category + ")", 2);  //debug

        if (!(category in allReqDocTypes)) {
            continue;
        }

        delete allReqDocTypes[category];
        Avo_LogDebug("Found " + category + " doc", 1);
    }

    if (Object.keys(allReqDocTypes).length == 0) {
        return;
    }

    Avo_LogDebug("No " + Object.keys(allReqDocTypes).join(", ") + " doc(s) found", 1);

    cancel = true;
    showMessage = true;

    var msg = "The following document(s) are missing. \
To continue please upload a document of the following type(s):";
    for (var i in Object.keys(allReqDocTypes)) {
        msg += "\n- " + Object.keys(allReqDocTypes)[i];
    }

    msg += "\nFor further details please refer to the instructional text below.";

    comment(msg);
})();