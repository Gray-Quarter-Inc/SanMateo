/*******************************************************
| Script Title: skylightReqDoc(ID25)
| Created by: Jei Yang
| Created on: 22Feb21
| Event: ASB
| Usage: Always require doc type Plan Set |  PLANS
If ASI "Cumulative square footage of all skylights / sun tunnels being installed" is greater than 15 SQ Ft, require document type (State Documents - T24| T24)
same error message as others if document type if missing
| Modified by: ()
*********************************************************/
(function () {
    var allReqDocTypes = new Object();
    allReqDocTypes["Plan Set | PLANS"] = true;

    var sqft = String(AInfo["Cumulative Square footage of all skylights / sun tunnels being installed"]);
    Avo_LogDebug("Cumulative Square footage of all skylights / sun tunnels being installed(" + sqft + ")", 2); //debug

    if (parseFloat(sqft) >= 15) {
        allReqDocTypes["State Documents - T24 | T24"] = true;
    } else {
        return;
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
    comment("The following document(s) are missing. For further details please refer to the instuctional text below.\n- " + Object.keys(allReqDocTypes).join("\n- "));
})();