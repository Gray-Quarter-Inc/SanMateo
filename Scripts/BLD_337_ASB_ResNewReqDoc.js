//BLD_337_ASB_ResNewReqDoc
/*******************************************************
| Script Title: resNewReqDoc(ID337)
| Created by: Jei Yang
| Created on: 17Jun21
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

    var typeOfStructure = String(AInfo["What type of residential structure is being constructed?"]);
    Avo_LogDebug("What type of residential structure is being constructed?(" + typeOfStructure + ")", 2); //debug
    
    var steeperThan3to1 = String(AInfo["Is the current land area under the potential building footprint steeper than 3 to 1 ratio"]);
    Avo_LogDebug("Is the current land area under the potential building footprint steeper than 3 to 1 ratio(" + steeperThan3to1 + ")", 2); //debug

    var foundationOnPiers = String(AInfo["Will the foundation for this project be on piers?"]);
    Avo_LogDebug("Will the foundation for this project be on piers?(" + foundationOnPiers + ")", 2); //debug

    var cumulativeSqft = parseFloat(AInfo["Proposed cumulative square footage of conditioned space"]);
    Avo_LogDebug("Proposed cumulative square footage of conditioned space(" + cumulativeSqft + ")", 2); //debug

    //var parcelObj = new Object();
    //loadParcelAttributes(parcelObj);

    //var faultZones = String(parcelObj["ParcelAttribute.FAULT ZONES"]);
    //Avo_LogDebug("FAULT ZONES(" + faultZones + ")", 2); //debug

    //var landslideZones = String(parcelObj["ParcelAttribute.LANDSLIDES ZONES"]);
    //Avo_LogDebug("LANDSLIDES ZONES(" + landslideZones + ")", 2); //debug

    if (typeOfStructure != "ADU (Detached)") {
        allReqDocTypes["Geotechnical Report | GEO"] = true;
    } else if (steeperThan3to1.toUpperCase() == "YES" || foundationOnPiers.toUpperCase() == "YES"
            || (!isNaN(cumulativeSqft) && cumulativeSqft > 1000)
            /*|| faultZones.toUpperCase() == "YES" || landslideZones.toUpperCase() == "YES"*/) {
        allReqDocTypes["Geotechnical Report | GEO"] = true;
    }

    /*
    var cutVolume = parseFloat(String(AInfo["Cut volume (cubic yds)"]));
    Avo_LogDebug("Cut volume (cubic yds)(" + cutVolume + ")", 2); //debug

    var fillVolume = parseFloat(String(AInfo["Fill volume (cubic yds)"]));
    Avo_LogDebug("Fill volume (cubic yds)(" + fillVolume + ")", 2); //debug

    if (!isNaN(cutVolume) && !isNaN(fillVolume) && cutVolume + fillVolume > 250) {
        allReqDocTypes["Geotechnical Report | GEO"] = true;
    }
    */

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