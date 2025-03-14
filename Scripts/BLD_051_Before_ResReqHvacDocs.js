/*******************************************************
| Script Title: resReqHvacDocs(ID51)
| Created by: Nic Bunting
| Created on: 3Nov20
| Event: Before
| Usage: If ASI "Furnace Is the appliance located in the lower level (basement or crawlspace)" is "Yes"
| or ASI "AC Is the appliance located in the lower level (basement or crawlspace)" is "Yes" and no
| document of type "BLD_RES_HVAC" /
| "Cross Sectional Plan (propane fueled furnaces located in basements) | CROSS"
| Or ASI "AC" is checked and no document of type "BLD_RES_HVAC" /
| "Air Conditioning Unit Site Plan | AC" and "Manufacturer Specification | MSPEC"
| Or ASI "Heat Pump" is "Yes" and no document of type "BLD_RES_HVAC" / "Heat pump floor plan | HEAT"
| Or ASI "Furnace Is the installation or replacement located in the garage" is "Yes" or ASI 
| "AC Is the installation or replacement located in the garage" is "Yes" and no document of type
| "BLD_RES_HVAC" / "Floor Plan | FLOOR" 
| Or ASI "Masonry or Concrete Chimney" is "Yes" and no document of type "BLD_RES_HVAC" /
| "Masonry or Concrete Chimney plans | CHIM"
| Or ASI "Project Type" is "Commercial" and "Duct Work" is checked and no document of type
| "BLD_RES_HVAC" / "Plans | DUCT"
| Or no document of type "Manufacturer Specification | MSPEC"
| Or no document of type "State Documents | T-24" and "Title 24 Compliance Documents | T24COM"
| Then block submittal and display message
| "The following document(s) are missing. 
| To continue please upload a document of the following type(s):"
| + "-" + docType + "For further details please refer to the instructional text below."
| Modified by: ()
*********************************************************/
/*----------------------------------------------------------------------------------------------------/
| Main Loop
/----------------------------------------------------------------------------------------------------*/
try {
    (function () {
        Avo_LogDebug("ID51 resReqHvacDocs()", 1);

        var allReqDocTypes = new Object();

        var furnaceLowerLevel = String(AInfo[
            "Furnace Is the appliance located in the lower level (basement or crawlspace)"]);
        Avo_LogDebug("Furnace Lower Level(" + furnaceLowerLevel + ")", 2); //debug

        var acLowerLevel = String(AInfo[
            "AC Is the appliance located in the lower level (basement or crawlspace)"]);
        Avo_LogDebug("AC Lower Level(" + acLowerLevel + ")", 2); //debug

        var furnaceFuelType = String(AInfo["Furnace Fuel Type"]);
        Avo_LogDebug("Furnace Fuel Type(" + furnaceFuelType + ")", 2); //debug

        var acFuelType = String(AInfo["AC Fuel Type"]);
        Avo_LogDebug("AC Fuel Type(" + acFuelType + ")", 2); //debug

        if ((furnaceLowerLevel.toUpperCase() == "YES"
            && furnaceFuelType.toUpperCase() == "PROPANE")
            || (acLowerLevel.toUpperCase() == "YES"
                && acFuelType.toUpperCase() == "PROPANE")) {
            allReqDocTypes[
                "Cross Sectional Plan (propane fueled furnaces located in basements) | CROSS"
            ] = true;
        }

        var ac = String(AInfo["AC"]);
        Avo_LogDebug("AC(" + ac + ")", 2); //debug

        if (ac.toUpperCase() == "CHECKED") {
            allReqDocTypes["Air Conditioning Unit Site Plan | AC"] = true;
            allReqDocTypes["Manufacturer Specification | MSPEC"] = true;
        }

        var heatPump = String(AInfo["Heat Pump"]);
        Avo_LogDebug("Heat Pump(" + heatPump + ")", 2); //debug

        if (heatPump.toUpperCase() == "CHECKED") {
            allReqDocTypes["Heat Pump Floor Plan | HEAT"] = true;
        }

        var furnaceGarage = String(AInfo[
            "Furnace Is the installation or replacement located in the garage"]);
        Avo_LogDebug("Furnace Garage(" + furnaceGarage + ")", 2); //debug

        if (furnaceGarage.toUpperCase() == "YES") {
            allReqDocTypes["Floor Plan | FLOOR"] = true;
        }

        var projType = String(AInfo["Project Type"]);
        Avo_LogDebug("Project Type(" + projType + ")", 2);  //debug

        var ductWork = String(AInfo["Duct Work"]);
        Avo_LogDebug("Duct Work(" + ductWork + ")", 2);  //debug

        if (projType == "Commercial" && ductWork.toUpperCase() == "CHECKED") {
            allReqDocTypes["Plans | DUCT"] = true;
        }

        allReqDocTypes["Manufacturer Specification | MSPEC"] = true;

        //allReqDocTypes["State Documents | T-24"] = true;
        allReqDocTypes["Title 24 Compliance Documents | T24COM"] = true;

        if (Object.keys(allReqDocTypes).length == 0) {
            return;
        }

        // Check docs
        var allDocs = new Array();
        var result = aa.document.getDocumentListByEntity(capId, "TMP_CAP");
        if (result.getSuccess() != true) {
            Avo_LogDebug("Failed to find any documents. "
                + result.errorType + ': ' + result.errorMessage, 1);
        } else {
            allDocs = result.getOutput().toArray();
        }

        Avo_LogDebug("Total Docs(" + allDocs.length + ")", 2);  //debug

        for (var i in allDocs) {
            var docModel = allDocs[i];

            var docId = docModel.documentNo;
            Avo_LogDebug(br + "Doc ID(" + docId + ")", 2);	//debug

            var filePath = docModel.fileName;
            Avo_LogDebug("Path(" + filePath + ")", 2);	//debug

            var name = docModel.docName;
            Avo_LogDebug("Name(" + name + ")", 2);  //debug

            var group = String(docModel.docGroup);
            Avo_LogDebug("Group(" + group + ")", 2); //debug

            if (group.toUpperCase() != "BLD_RES_HVAC") {
                continue;
            }

            var category = String(docModel.docCategory);
            Avo_LogDebug("Category(" + category + ")", 2); //debug

            if (!(category in allReqDocTypes)) {
                continue;
            }

            //var uploadDate = new Date(docModel.fileUpLoadDate.time);
            //Avo_LogDebug("Upload Date(" + aa.util.formatDate(uploadDate, "MM/dd/yyyy")
            //+ ")", 2);   //debug

            delete allReqDocTypes[category];
            Avo_LogDebug("Found " + category + " doc", 1);

            /*if (category == "State Documents | T-24") {
                delete allReqDocTypes["Title 24 Compliance Documents | T24COM"]
            }

            if (category == "Title 24 Compliance Documents | T24COM") {
                delete allReqDocTypes["State Documents | T-24"]
            }*/
        }

        if (Object.keys(allReqDocTypes).length == 0) {
            return;
        }

        Avo_LogDebug(br + "No " + Object.keys(allReqDocTypes).join(", ") + " doc(s) found", 1);

        cancel = true;
        showMessage = true;
        showDebug = false;

        var msg = "The following document(s) are missing. \
To continue please upload a document of the following type(s):";
        for (var i in Object.keys(allReqDocTypes)) {
            msg += "\n- " + Object.keys(allReqDocTypes)[i];
        }

        msg += "\nFor further details please refer to the instructional text below.";

        comment(msg);
    })();

    aa.env.setValue("CapModel", cap);
}
catch (ex) {
    Avo_LogDebug("ERROR: " + ex.message, 1);
}

/*----------------------------------------------------------------------------------------------------/
| END Main Loop
/----------------------------------------------------------------------------------------------------*/

/*----------------------------------------------------------------------------------------------------/
| BEGIN Functions
/----------------------------------------------------------------------------------------------------*/

/*----------------------------------------------------------------------------------------------------/
| END Functions
/----------------------------------------------------------------------------------------------------*/