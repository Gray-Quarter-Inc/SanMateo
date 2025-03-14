/*******************************************************
| Script/Function: sidingStuccoDoc() - (ID111)
| Created by: Jei Yang
| Created on: 1Dev20
| Usage: If ASI "Any exterior plywood replacement?" is "No" and no document of type "Site Plan | SITE" Or ASI
| "For partial siding/stucco replacement, does the new match existing colors and materials?" is "Yes" and no document of type
| "Photos of Existing Siding or Stucco | PHOTO" and parcel attributes "ZONING DESIGNATION", "ZONING 2", "ZONING 3", "ZONING 4" contain
| "CD" or "DR" And ASI "Color" is not "Earthtone" Then block submittal and display message
| "A required attachment is missing, please refer to the instructional text"
| Modified by: ()
*********************************************************/
(function () {
    var allReqDocTypes = new Object();

    var exteriorReplacement = String(AInfo["Any exterior plywood replacement?"]);
    Avo_LogDebug("Exterior Replacement(" + exteriorReplacement + ")", 2); //debug

    if (exteriorReplacement.toUpperCase() == "NO") {
        allReqDocTypes["Site Plan | SITE"] = true;
    }

    var matchesExisting = String(AInfo["For partial siding/stucco replacement, does the new match existing colors and materials?"]);
    Avo_LogDebug("Matches Existing(" + matchesExisting + ")", 2); //debug

    var colour = String(AInfo["Color"]);
    Avo_LogDebug("Colour(" + colour + ")", 2);  //debug

    var parcelObj = new Object();
    loadParcelAttributes(parcelObj);

    var cdOrDr = false;

    var allParcelAttrNames = ["Zoning Designation", "Zoning 2", "Zoning 3", "Zoning 4"];
    for (var i in allParcelAttrNames) {
        var parcelAttrName = allParcelAttrNames[i];
        var zoningAttr = String(parcelObj["ParcelAttribute." + parcelAttrName.toUpperCase()]);
        Avo_LogDebug(parcelAttrName + "(" + zoningAttr + ")", 2); //debug

        if (zoningAttr.toUpperCase().indexOf("CD") != -1) {
            cdOrDr = true;
            break;
        }

        if (zoningAttr.toUpperCase().indexOf("DR") != -1) {
            cdOrDr = true;
            break;
        }
    }

    if (matchesExisting.toUpperCase() == "YES" && colour.toLowerCase() != "earthtone" && cdOrDr == true) {
        allReqDocTypes["Photos of Existing Siding or Stucco | PHOTO"] = true;
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