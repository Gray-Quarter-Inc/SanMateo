/*******************************************************
| Script/Function: hvacRequireDoc() - (ID87)
| Created by: Jei Yang
| Created on: 17Nov20
| Usage: If ASI "Furnace Is the appliance located in the lower level (basement or crawlspace) == "Y", and document type "Cross Sectional Plan (propane fueled furnaces located in basements) | CROSS" is not uploaded, block submit with the message "A required attachment is missing, please refer to the instructional text"
|        If ASI "AC Is the appliance located in the lower level (basement or crawlspace) == "Y", and document type "Cross Sectional Plan (propane fueled furnaces located in basements) | CROSS" is not uploaded, block submit with the message "A required attachment is missing, please refer to the instructional text"
|        If ASI "AC" is checked and if one or both of the doucment types "Air Conditioning Unit Site Plan | AC" and "Manufacturer Specification | MSPEC" are not uploaded, block submit with the message "A required attachment is missing, please refer to the instructional text"
|        If "Furnace Is the installation or replacement located in the garage" is "Y" and Doucment type "Floor Plan | FLOOR" is not uploaded, block submit with the message "A required attachment is missing, please refer to the instructional text"
|        If "AC Is the installation or replacement located in the garage" is "Y" and Doucment type "Floor Plan | FLOOR" is not uploaded, block submit with the message "A required attachment is missing, please refer to the instructional text"
| Modified by: ()
*********************************************************/
(function () {
    var allReqDocTypes = new Object();

    var locatedLowerlevel = String(AInfo["Furnace Is the appliance located in the lower level (basement or crawlspace)"]);
    Avo_LogDebug("Furnace Appliance located in the lower level(" + locatedLowerlevel + ")", 2); //debug

    if (locatedLowerlevel.toUpperCase() == 'YES') {    
        allReqDocTypes["Cross Sectional Plan (propane fueled furnaces located in basements) | CROSS"] = true;        
    } else {
        locatedLowerlevel = String(AInfo["AC Is the appliance located in the lower level (basement or crawlspace)"]);
        Avo_LogDebug("AC Appliance located in the lower level(" + locatedLowerlevel + ")", 2); //debug
        if (locatedLowerlevel.toUpperCase() == 'YES') {    
            allReqDocTypes["Cross Sectional Plan (propane fueled furnaces located in basements) | CROSS"] = true;        
        }
    }
    
    var ac = String(AInfo['AC']);
    Avo_LogDebug("AC(" + ac + ")", 2); //debug
    if (ac.toUpperCase() == "CHECKED") {
        allReqDocTypes["Air Conditioning Unit Site Plan | AC"] = true;
        allReqDocTypes["Manufacturer Specification | MSPEC"] = true;
    }

    var locatedInGarage = String(AInfo["Furnace Is the installation or replacement located in the garage"]);
    Avo_LogDebug("Furnace Is the installation or replacement located in the garage(" + locatedInGarage + ")", 2); //debug

    if (locatedInGarage.toUpperCase() == 'YES') {    
        allReqDocTypes["Floor Plan | FLOOR"] = true;        
    }
    
    var heatPump = String(AInfo["Heat Pump"]);
    Avo_LogDebug("Heat Pump(" + heatPump + ")", 2); //debug

    if (heatPump.toUpperCase() == "CHECKED") {
        allReqDocTypes["Heat Pump Floor Plan | HEAT"] = true;
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