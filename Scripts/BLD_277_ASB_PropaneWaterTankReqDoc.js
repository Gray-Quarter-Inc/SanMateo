/*******************************************************
| Script Title: propaneWaterTankReqDoc(ID277)
| Created by: Tom Grzegorczyk
| Created on: 7May21
| Event: ASB
| Usage: If document type 'Plan Set | PLANS" is not uploaded
|        If ASI "Is this for fire suppression use?" is set to "Yes" and document type 'NFPA 1142 Rural Water Supply Form | NFPA" is not uploaded
|        If ASI "Amount of new or replaced impervious surface (sq ft)" is greater than or equals to 150 and document type "C3 and C6 Checklist | C3C6" is not uploaded
| Modified by: ()
*********************************************************/
(function () {
    var allReqDocTypes = new Object();
    allReqDocTypes["Plan Set | PLANS"] = true;


    var fireSuppression = String(String(AInfo["Is this for fire suppression use?"]));
    Avo_LogDebug("Is this for fire suppression use?(" + fireSuppression + ")", 2); //debug

    if (fireSuppression == "Yes") {
        allReqDocTypes["NFPA 1142 Rural Water Supply Form | NFPA"] = true;
    }

    var surfaceAmt = parseInt(String(AInfo["Amount of new or replaced impervious surface (sq ft)"]));
    Avo_LogDebug("Amount of new or replaced impervious surface (sq ft)(" + surfaceAmt + ")", 2); //debug

    if (surfaceAmt >= 150) {
        allReqDocTypes["C3 and C6 Checklist | C3C6"] = true;
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
    comment("The following document(s) are missing. For further details please refer to the instructional text below.\n- " + Object.keys(allReqDocTypes).join("\n- "));
})();
