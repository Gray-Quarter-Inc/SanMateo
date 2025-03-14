/*******************************************************
| Script Title: waterHeaterReqDoc(ID197)
| Created by: Jei Yang
| Created on: 13Jan21
| Event: ASB
| Usage: IF ASI "If new location, where located?" == "Within garage"
|        and document type "Floor Plan | FLOOR" is not uploaded
|        block with message "A required attachment is missing, please refer to the instructional text"
| Modified by: ()
*********************************************************/
(function () {
    var allReqDocTypes = new Object();
    var resOrComm = String(AInfo["Residential or Commercial"]);
    Avo_LogDebug("Residential or Commercial(" + resOrComm + ")", 2); //debug

    var whereLocated = String(AInfo["If new location, where located?"]);
    Avo_LogDebug("If new location, where located?(" + whereLocated + ")", 2); //debug

    if (resOrComm.toUpperCase() == "COMMERCIAL" || (resOrComm.toUpperCase() == "RESIDENTIAL" && whereLocated.toUpperCase() == "WITHIN GARAGE")) {
        allReqDocTypes["Floor Plan | FLOOR"] = true;
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