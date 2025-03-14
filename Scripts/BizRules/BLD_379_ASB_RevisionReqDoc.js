//BLD_379_ASB_RevisionReqDoc
/*******************************************************
| Script Title: revisionReqDoc(ID379)
| Created by: Jei Yang
| Created on: 17Sep21
| Event: ASB
| Usage: If document type "Revision Letter | REVLTR" is not uploaded, block submit and display error message.
| Modified by: 
*********************************************************/
(function () {
    Avo_LogDebug("ID379 revisionReqDoc()", 1);

    var allReqDocTypes = new Object();
    allReqDocTypes["Revision Letter | REVLTR"] = true;

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
