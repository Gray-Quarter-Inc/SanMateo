//BLD_341_ASB_ResAccStruReqDoc
/*******************************************************
| Script Title: resAccStruReqDoc(ID341)
| Created by: Jei Yang
| Created on: 15Jun21
| Event: ASB
| Usage: if Plan Set | Plans document is missing
|        If "Will the foudnation for this project be on piers?" is set to "Yes" OR If the total number of "Cut volume (cubic yds) and "Fill volume (cubic yds)" is greater than 250 and document type "Geotechnical Report | GEO"
|        is missing.
|        If "Amount of new ore repalced impervious surface. Include sq ft from pools & spas as applicable (sq ft)" is greater than or equals to 150, and document type "C3 and C6 Checklist | C3C6"  is missing
| Modified by: 
*********************************************************/
(function () {
    Avo_LogDebug("ID341 resAccStruReqDoc()", 1);

    var allReqDocTypes = new Object();
    allReqDocTypes["Plan Set | PLANS"] = true;

    var foundationOnPiers = String(AInfo["Will the foundation for this project be on piers?"]);
    Avo_LogDebug("Will the foundation for this project be on piers?(" + foundationOnPiers + ")", 2); //debug

    if (foundationOnPiers.toUpperCase() == "YES") {
        allReqDocTypes["Geotechnical Report | GEO"] = true;
    }


    var cutVolume = parseFloat(String(AInfo["Cut volume (cubic yds)"]));
    Avo_LogDebug("Cut volume (cubic yds)(" + cutVolume + ")", 2); //debug

    var fillVolume = parseFloat(String(AInfo["Fill volume (cubic yds)"]));
    Avo_LogDebug("Fill volume (cubic yds)(" + fillVolume + ")", 2); //debug

    if (!isNaN(cutVolume) && !isNaN(fillVolume) && cutVolume + fillVolume > 250) {
        allReqDocTypes["Geotechnical Report | GEO"] = true;
    }


    var imperviousSurface = parseFloat(String(AInfo["Amount of new or replaced impervious surface. Include sq ft from pools & spas as applicable (sq ft)"]));
    Avo_LogDebug("Amount of new or replaced impervious surface. Include sq ft from pools & spas as applicable (sq ft)(" + imperviousSurface + ")", 2); //debug

    if (!isNaN(imperviousSurface) && imperviousSurface >= 150) {
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
    comment("The following document(s) are missing. For further details please refer to the instuctional text below.\n- " + Object.keys(allReqDocTypes).join("\n- "));

})();
