/*******************************************************
| Script Title: resNewReqDoc(ID337)
| Created by: Jei Yang
| Created on: 17Jun21
| Event: Before
| Usage: If docuemnt type 'Plan Set | PLANS" is not uploaded
| Or ASI "Will the foundation for this project be on piers?" is "Yes" and no document of type
| "Geotechnical Report | GEO"
| Or the total value of the fields "Cut volume (cubic yds)" and "Fill volume (cubic yds)" is greater
| than 250 Cubic yards and no doc of type "Geotechnical Report | GEO"
| Or ASI
| "Amount of new or replaced impervious surface. Include sq ft from pools & spas as applicable (sq ft)"
| >= 150 and no document of type "C3 and C6 Checklist | C3C6"
| Then block submittal, display message
| "The following document(s) are missing. To continue please upload a document of the following type(s):"
| + "-" + docType + "For further details please refer to the instructional text below."
| Modified by: ()
*********************************************************/
/*------------------------------------------------------------------------------------------------------/
| Main Loop
/-----------------------------------------------------------------------------------------------------*/
try {
    (function () {
        Avo_LogDebug("ID337 resNewReqDoc()", 1);

        var allReqDocTypes = new Object();
        allReqDocTypes["Plan Set | PLANS"] = true;

        var typeOfStructure = String(AInfo["What type of residential structure is being constructed?"]);
        Avo_LogDebug("Struct Type(" + typeOfStructure + ")", 2); //debug

        var steeperThan3to1 = String(AInfo[
            "Is the current land area under the potential building footprint steeper than 3 to 1 ratio"]);
        Avo_LogDebug("Steeper than 3 to 1 ratio(" + steeperThan3to1 + ")", 2); //debug

        var foundationOnPiers = String(AInfo["Will the foundation for this project be on piers?"]);
        Avo_LogDebug("Will the foundation for this project be on piers?(" + foundationOnPiers + ")",
            2); //debug

        var cumulativeSqft = parseFloat(AInfo["Proposed cumulative square footage of conditioned space"]);
        Avo_LogDebug("Proposed cumulative square footage of conditioned space(" + cumulativeSqft + ")",
            2); //debug

        //var parcelObj = new Object();
        //loadParcelAttributes4ACA(parcelObj);

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

        var imperviousSurface = parseFloat(String(AInfo["Amount of new or replaced impervious surface. \
Include sq ft from pools & spas as applicable (sq ft)"]));
        Avo_LogDebug("Impervious surface(" + imperviousSurface + ")", 2); //debug

        if (!isNaN(imperviousSurface) && imperviousSurface >= 150) {
            allReqDocTypes["C3 and C6 Checklist | C3C6"] = true;
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
            Avo_LogDebug("Doc ID(" + docId + ")", 2);	//debug

            var filePath = docModel.fileName;
            Avo_LogDebug("Path(" + filePath + ")", 2);	//debug

            var name = docModel.docName;
            Avo_LogDebug("Name(" + name + ")", 2);  //debug

            var group = docModel.docGroup;
            Avo_LogDebug("Group(" + group + ")", 2); //debug

            var category = docModel.docCategory;
            Avo_LogDebug("Category(" + category + ")", 2); //debug

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
        showDebug = false;
        showMessage = true;

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

/*------------------------------------------------------------------------------------------------------/
| END Main Loop
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| BEGIN Functions
/------------------------------------------------------------------------------------------------------*/
function loadParcelAttributes4ACA(parcelAttrObj) {
    var capParcelModel = cap.parcelModel;
    var parcelModel = capParcelModel.parcelModel;

    //parcelArea += parcelModel.parcelArea;

    var allParcelAttrs = parcelModel.parcelAttribute.toArray();
    for (var i in allParcelAttrs) {
        var parcelAttr = allParcelAttrs[i];

        var attrName = String(parcelAttr.getB1AttributeName());
        var attrValue = parcelAttr.getB1AttributeValue();
        // Avo_LogDebug(attrName + "(" + attrValue + ")", 2);  //debug

        parcelAttrObj["ParcelAttribute." + attrName] = attrValue;
    }

    parcelAttrObj["ParcelAttribute.Block"] = parcelModel.getBlock();
    parcelAttrObj["ParcelAttribute.Book"] = parcelModel.getBook();
    parcelAttrObj["ParcelAttribute.CensusTract"] = parcelModel.getCensusTract();
    parcelAttrObj["ParcelAttribute.CouncilDistrict"] = parcelModel.getCouncilDistrict();
    parcelAttrObj["ParcelAttribute.ExemptValue"] = parcelModel.getExemptValue();
    parcelAttrObj["ParcelAttribute.ImprovedValue"] = parcelModel.getImprovedValue();
    parcelAttrObj["ParcelAttribute.InspectionDistrict"] = parcelModel.getInspectionDistrict();
    parcelAttrObj["ParcelAttribute.LandValue"] = parcelModel.getLandValue();
    parcelAttrObj["ParcelAttribute.LegalDesc"] = parcelModel.getLegalDesc();
    parcelAttrObj["ParcelAttribute.Lot"] = parcelModel.getLot();
    parcelAttrObj["ParcelAttribute.MapNo"] = parcelModel.getMapNo();
    parcelAttrObj["ParcelAttribute.MapRef"] = parcelModel.getMapRef();
    parcelAttrObj["ParcelAttribute.ParcelStatus"] = parcelModel.getParcelStatus();
    parcelAttrObj["ParcelAttribute.SupervisorDistrict"] = parcelModel.getSupervisorDistrict();
    parcelAttrObj["ParcelAttribute.Tract"] = parcelModel.getTract();
    parcelAttrObj["ParcelAttribute.PlanArea"] = parcelModel.getPlanArea();
}

/*------------------------------------------------------------------------------------------------------/
| END Functions
/------------------------------------------------------------------------------------------------------*/