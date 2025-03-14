/*******************************************************
| Script Title: deckPatioReqDoc(ID283)
| Created by: Jei Yang
| Created on: 11May21
| Event: ASB
| Usage: If docuemnt type 'Plan Set | PLANS" is not uploaded
|        If ASI "Amount of new or replaced impervious surface. Include sq ft from pools & spas as applicable (sq ft)" has values greatere than 150 (integer no decimals) and document type "C3 and C6 Checklist | C3C6" is not uploaded
|        If ASI "Cut volume (cubic yds)" and "Fill volume (cubic yds)" has combined value of greater than or equals to 250, and document type "Geotechnical Report | GEO" is not uploaded
|        If ASI "Are you replacing dry rot or termite damage?" is set to "Yes" and document type Termite Report | TERMITE is not uploaded
| Modified by: ()
*********************************************************/
(function () {
    Avo_LogDebug("ID283 deckPatioReqDoc()", 1);

    var allReqDocTypes = new Object();
    allReqDocTypes["Plan Set | PLANS"] = true;


    var surfaceAmt = parseInt(String(AInfo["Amount of new or replaced impervious surface. Include sq ft from pools & spas as applicable (sq ft)"]));
    Avo_LogDebug("Amount of new or replaced impervious surface. Include sq ft from pools & spas as applicable (sq ft)(" + surfaceAmt + ")", 2); //debug

    if (!isNaN(surfaceAmt) && surfaceAmt >= 150) {
        allReqDocTypes["C3 and C6 Checklist | C3C6"] = true;
    }


    var cutVolume = parseFloat(String(AInfo["Cut volume (cubic yds)"]));
    Avo_LogDebug("Cut volume (cubic yds)(" + cutVolume + ")", 2); //debug

    var fillVolume = parseFloat(String(AInfo["Fill volume (cubic yds)"]));
    Avo_LogDebug("Fill volume (cubic yds)(" + fillVolume + ")", 2); //debug

    if (!isNaN(cutVolume) && !isNaN(fillVolume) && cutVolume + fillVolume > 250) {
        allReqDocTypes["Geotechnical Report | GEO"] = true;
    }


    var replacingDamage = String(AInfo["Are you replacing dry rot or termite damage?"]);
    Avo_LogDebug("Are you replacing dry rot or termite damage?(" + replacingDamage + ")", 2); //debug

    if (replacingDamage.toUpperCase() == "YES") {
        allReqDocTypes["Termite Report | TERMITE"] = true;
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
