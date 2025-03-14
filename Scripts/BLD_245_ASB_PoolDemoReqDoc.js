/*******************************************************
| Script Title: poolDemoReqDoc(ID245)
| Created by: Jei Yang
| Created on: 29Mar21
| Event: ASB
| Usage: require document type Plan set | PLANS
|        If ASI "Type of fill being used to infill the pool? = "Engineered" require document type "Geotechnical Enginner Letter | GEOLTR"
|        If ASI "Type of fill being used to infill the pool? = "Unengineered" require document type "Owner Letter | OWNER"
|        If ASI " Method of pool water discharge" = "Public sewer (not in storm drain)" require document type "Sewer Permit | SEWER"
|        If ASI " Method of pool water discharge" = "Irrigation use on property (not in storm drain) require document type "De-chlorination Verification Letter | DECHL"
| Modified by: ()
*********************************************************/
(function () {
    var allReqDocTypes = new Object();
    allReqDocTypes["Plan Set | PLANS"] = true;

/*
    var typeOfFill = String(AInfo["Type of fill being used to infill the pool?"]);
    Avo_LogDebug("Type of fill being used to infill the pool?(" + typeOfFill + ")", 2); //debug

    if (typeOfFill == "Engineered") {
        allReqDocTypes["Geotechnical Engineer Letter | GEOLTR"] = true;
    } else if (typeOfFill == "Unengineered") {
        allReqDocTypes["Owner Letter | OWNER"] = true;
    }

    var methodOfDischarge = String(AInfo["Method of pool water discharge"]);
    Avo_LogDebug("Method of pool water discharge(" + methodOfDischarge + ")", 2); //debug

    if (methodOfDischarge == "Public sewer (not in storm drain)") {
        allReqDocTypes["Sewer Permit | SEWER"] = true;
    } else if (methodOfDischarge == "Irrigation use on property (not in storm drain)") {
        allReqDocTypes["De-chlorination Verification Letter | DECHL"] = true;
    }

*/
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