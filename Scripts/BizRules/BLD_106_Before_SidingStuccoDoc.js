/*******************************************************
| Script Title: resSidingStuccoDoc(ID106)
| Created by: Jei Yang
| Created on: 3Dev20
| Event: Before
| Usage: If ASI "Any exterior plywood replacement?" is "No" and no document of type "Site Plan | SITE"
| Or ASI "For partial siding/stucco replacement, does the new match existing colors and materials?" is
| "Yes" and no document of type "Photos of Existing Siding or Stucco | PHOTO" and parcel attributes
| "ZONING DESIGNATION", "ZONING 2", "ZONING 3", "ZONING 4" contain "CD" or "DR" And ASI "Color" is not
| "Earthtone" Then block submittal and display message 
| "The following document(s) are missing. To continue please upload a document of the following type(s):"
| + "-" + docType + "For further details please refer to the instructional text below."
| Modified by: ()
*********************************************************/
/*------------------------------------------------------------------------------------------------------/
| Main Loop
/-----------------------------------------------------------------------------------------------------*/
try {
    (function () {
        Avo_LogDebug("ID106 resSidingStuccoDoc()", 1);

        var allReqDocTypes = new Object();

        var matchesExisting = String(AInfo["For partial siding/stucco replacement, \
does the new match existing colors and materials?"]);
        Avo_LogDebug("Matches Existing(" + matchesExisting + ")", 2); //debug


        var parcelObj = new Object();
        loadParcelAttributes4ACA(parcelObj);

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

        if (matchesExisting.toUpperCase() != "YES" && cdOrDr) {
            allReqDocTypes["Colors/Finish and Materials | COLOR"] = true;
        } else if (matchesExisting.toUpperCase() == "YES" && cdOrDr) {
            allReqDocTypes["Photos of Existing Siding or Stucco | PHOTO"] = true;
        } else {
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

            var group = docModel.docGroup;
            Avo_LogDebug("Group(" + group + ")", 2); //debug

            var category = docModel.docCategory.toString().trim();
            Avo_LogDebug("Category(" + category + ")", 2); //debug

            if (category.indexOf('| COLOR') != -1) {
                delete allReqDocTypes['Colors/Finish and Materials | COLOR'];
            } else if (category.indexOf('| PHOTO') != -1) {
                delete allReqDocTypes['Photos of Existing Siding or Stucco | PHOTO'];
            }

            Avo_LogDebug("Found " + category + " doc", 1);
        }


        if (Object.keys(allReqDocTypes).length == 0) {
            return;
        }

        Avo_LogDebug(br + "No '" + Object.keys(allReqDocTypes).join("', '") + "' doc(s) found", 1);

        cancel = true;
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