/*******************************************************
| Script/Function: docsCheck(ID448)
| Created by: Nicolaj Bunting
| Created on: 2Nov22
| Usage: On submit If no doc of type "Plan Set | PLANS" Or ASI "Impervious Surface" >= 150 and no doc of type
| "C3 and C6 Checklist | C3C6" Or ASI "Occupancy Change" is checked and no doc of type
| "Accessibility Form | ACCESS" or "Title 24 Compliance Documents | T24COM" Then block submittal, display
| message
| "The following document(s) are missing. For further details please refer to the instructional text below.\n- "
| + all missing doc types
| Modified by: ()
*********************************************************/
(function () {
    var allReqDocTypes = new Object();
    allReqDocTypes["Plan Set | PLANS"] = true;

    var impervSurface = parseFloat(AInfo["Impervious Surface"]);
    Avo_LogDebug("Impervious Surface(" + impervSurface + ")", 2);   //debug

    if (isNaN(impervSurface) != true && impervSurface >= 150) {
        allReqDocTypes["C3 and C6 Checklist | C3C6"] = true;
    }

    var occChange = String(AInfo["Occupancy Change"]);
    Avo_LogDebug("Occupancy Change(" + occChange + ")", 2); //debug

    if (occChange == "CHECKED") {
        allReqDocTypes["Accessibility Form | ACCESS"] = true;
        allReqDocTypes["Title 24 Compliance Documents | T24COM"] = true;
    }

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

    Avo_LogDebug(br + "No " + Object.keys(allReqDocTypes).join(", ") + " doc(s) found", 1);

    cancel = true;
    showMessage = true;
    comment("The following document(s) are missing. \
For further details please refer to the instructional text below.\n- "
        + Object.keys(allReqDocTypes).join("\n- "));
})();