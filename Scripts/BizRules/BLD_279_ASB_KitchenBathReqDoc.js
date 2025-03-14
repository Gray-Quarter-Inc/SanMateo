/*******************************************************
| Script Title: kitchenBathReqDoc(ID279)
| Created by: Jei Yang
| Created on: 13May21
| Event: ASB
| Usage: If docuemnt type 'Plan Set | PLANS" is not uploaded
|        If ASI "will you be moving / removing load bearing walls?" is set to "Yes" and the document type "Structural Calculations" is not uploaded
|        Block Submit with same error message as other require doc scripts
| Modified by: ()
*********************************************************/
(function () {
    Avo_LogDebug("ID279 kitchenBathReqDoc()", 1);

    var allReqDocTypes = new Object();
    allReqDocTypes["Plan Set | PLANS"] = true;


    var loadBearingWalls = String(AInfo["Will you be moving / removing load bearing walls?"]);
    Avo_LogDebug("Will you be moving / removing load bearing walls?(" + loadBearingWalls + ")", 2); //debug

    if (loadBearingWalls.toUpperCase() == "YES") {
        allReqDocTypes["Structural Calculations | SCALCS"] = true;
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
