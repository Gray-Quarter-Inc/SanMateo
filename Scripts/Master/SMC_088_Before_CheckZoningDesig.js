/*******************************************************
| Script Title: checkZoningDesig(ID88)
| Created by: Nic Bunting
| Created on: 26Nov20
| Event: Before
| Usage: if parcel attribute "ParcelAttribute.ZONING DESIGNATION" is "NO DATA ASSIGNED" Then block submittal and display message
| "Warning: This parcel is outside the County jurisdiction and not within the City of San Carlos.
A record cannot be created using a parcel outside the county jurisdiction that is not a public works project or Zoning Violation in the City of San Carlos."
| Modified by: ()
*********************************************************/
/*------------------------------------------------------------------------------------------------------/
| Main Loop
/-----------------------------------------------------------------------------------------------------*/
try {
    (function () {
        Avo_LogDebug("ID88 checkZoningDesig()", 1);

        //showDebug = true;   //testing
        //cancel = true;  //testing

        var parcelObj = new Object();
        loadParcelAttributes4ACA(parcelObj);

        var zoningDesig = String(parcelObj["ParcelAttribute.ZONING DESIGNATION"]);
        Avo_LogDebug("Zoning Designation(" + zoningDesig + ")", 2); //debug

        if (zoningDesig.toUpperCase() != "NO DATA ASSIGNED") {
            return;
        }

        cancel = true;
        showMessage = true;
        comment("Warning: This parcel is outside the County jurisdiction and not within the City of San Carlos. \
A record cannot be created using a parcel outside the county jurisdiction that is not a public works project or Zoning Violation in the City of San Carlos.");
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
        //Avo_LogDebug(attrName + "(" + attrValue + ")", 2);  //debug

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