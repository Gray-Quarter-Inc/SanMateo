/*******************************************************
| Script Title: tempStrucReqDoc(ID401)
| Created by: Jei Yang
| Created on: 19Apr22
| Event: ASB
| Usage: Always require "Plan Set | PLANS"
|        If ASI "Will traffic / pedestrian control be required for this event?"  == "Yes", require document type "Traffic / Pedestrian Control Plan | TRAFPED"
|        Same error message as others if document type is missing. 
| Modified by: 
*********************************************************/
(function () {
    Avo_LogDebug("ID401 tempStrucReqDoc()", 1);

    var allReqDocTypes = new Object();
    allReqDocTypes["Plan Set | PLANS"] = true;

    var trafficPedControl = String(AInfo["Will traffic / pedestrian control be required for this event?"]);
    Avo_LogDebug("Will traffic / pedestrian control be required for this event?(" + trafficPedControl + ")", 2); //debug

    if (trafficPedControl.toUpperCase() == "YES") {
        allReqDocTypes["Traffic / Pedestrian Control Plan | TRAFPED"] = true;
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
