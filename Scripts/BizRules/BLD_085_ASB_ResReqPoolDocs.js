/*******************************************************
| Script/Function: resReqPoolDocs() - (ID85)
| Created by: Nicolaj Bunting
| Created on: 23Nov20
| Usage: On submit If ASI "Surface Area" has value of 500 - 2499 and no document of type "BLD_RES_POOL" / "Prescriptive Compliance Form" Or has value 2500+ 
| and no documents of type "BLD_RES_POOL" / "Performance Approach", "BLD_RES_POOL" / "Landscape", "BLD_RES_POOL" / "Soil" Or ASI "Inground or Onground" is
| "Inground" and no document of type "BLD_RES_POOL" / "Structural Plans and Calculations" Or ASI "Amount of paving and other impervious surface" > 150 and 
| no document of type "BLD_RES_POOL" / "Stormwater Impervious Surface Calculation Form" Then block submittal and display message 
| "Please upload the required documents"
| Modified by: ()
*********************************************************/
(function () {
    var allReqDocTypes = new Object();

    var surfaceArea = parseFloat(AInfo["Surface Area"]);
    Avo_LogDebug("Surface Area(" + surfaceArea + ")", 2); //debug

    if (surfaceArea >= 500 && surfaceArea < 2500) {
        allReqDocTypes["Prescriptive Compliance Form"] = true;
    }

    if (surfaceArea >= 2500) {
        allReqDocTypes["Performance Approach"] = true;
        allReqDocTypes["Landscape"] = true;
        allReqDocTypes["Soil"] = true;
    }

    var ground = String(AInfo["Inground or Onground"]);
    Avo_LogDebug("Ground(" + ground + ")", 2); //debug

    if (ground.toUpperCase() == "Inground".toUpperCase()) {
        allReqDocTypes["Structural Plans and Calculations"] = true;
    }

    var pavingArea = parseFloat(AInfo["Amount of paving and other impervious surface"]);
    Avo_LogDebug("Paving Area(" + pavingArea + ")", 2); //debug

    if (pavingArea > 150) {
        allReqDocTypes["Stormwater Impervious Surface Calculation Form"] = true;
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

        if (group.toUpperCase() != "BLD_RES_POOL") {
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
    comment("Please upload the required documents");
})();