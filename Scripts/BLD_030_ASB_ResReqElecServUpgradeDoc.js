/*******************************************************
| Script/Function: resReqElecServUpgradeDoc() - (ID30)
| Created by: Nicolaj Bunting
| Created on: 26Oct20
| Usage: If ASI "Is the service upgrade less than 300 Amps" is "No" And no document of type "BLD_RES_EAMP" / "Load calculations | LOAD" 
| Or ASI "Require a temporary power pole" is "Yes" And no document of type "BLD_RES_EAMP" / "Site plan | SITE" Then block submittal and 
| display message "Please upload the required documentation based on the instructions"
| Modified by: (Jei Yang)
*********************************************************/
(function () {
    var allReqDocTypes = new Object();

    var lessThan300Amps = String(AInfo["Is the service upgrade less than 300 Amps"]);
    Avo_LogDebug("<300 A(" + lessThan300Amps + ")", 2); //debug

    if (lessThan300Amps.toUpperCase() == "NO") {
        allReqDocTypes["Load Calculations | LOAD"] = true;
    }

    //var powerPoleRequired = String(AInfo["Require a temporary power pole"]);
    //Avo_LogDebug("Power pole required(" + powerPoleRequired + ")", 2); //debug

    //if (powerPoleRequired.toUpperCase() == "YES") {
    //    allReqDocTypes["Site Plan | SITE"] = true;
    //}

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

        if (group.toUpperCase() != "BLD_RES_EAMP") {
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
    comment("Please upload the required documentation based on the instructions");
})();