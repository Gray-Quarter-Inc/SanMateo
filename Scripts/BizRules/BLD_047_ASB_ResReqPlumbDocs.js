/*******************************************************
| Script/Function: resReqPlumbDocs() - (ID47)
| Created by: Nicolaj Bunting
| Created on: 26Oct20
| Usage: On submit If ASI "New or Replacement Meter" is "New" And no document of type "BLD_RES_PLM" / "Will Server" Or ASI
| "Is the gas line running into a dedicated appliance" is "No" And no document of type "BLD_RES_PLM" / "Schematics" Then block submittal and display
| message "A required attachment is missing, please refer to the instructional text"
| Modified by: ()
*********************************************************/
(function () {
    var allReqDocTypes = new Object();

    var meter = String(AInfo["New or Replacement Meter"]);
    Avo_LogDebug("Meter(" + meter + ")", 2); //debug

    if (meter.toUpperCase() == "NEW") {
        allReqDocTypes["Will Serve | WSL"] = true;
    }

    var gasLine = String(AInfo["Gas line"]);
    Avo_LogDebug("Gas Line(" + gasLine + ")", 2); //debug

    if (gasLine.toUpperCase() == "CHECKED") {
        allReqDocTypes["Schematics | SCHEM"] = true;
    }

    if (Object.keys(allReqDocTypes).length == 0) {
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

        if (group.toUpperCase() != "BLD_RES_PLM") {
            continue;
        }

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