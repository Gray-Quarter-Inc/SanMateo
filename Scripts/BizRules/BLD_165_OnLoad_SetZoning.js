/*******************************************************
| Script Title: setZoning(ID165)
| Created by: Nic Bunting
| Created on: 18Dec20
| Event: Onload
| Usage: Set ASI "Zoning" to parcel attribute "ZONING DESIGNATION"
|        Copy Parcel attribute "SEWER DISTRICT" and populate ASI "Sewer district"
|        Copy Parcel attribute "WATER SUPPLY OR DISTRICT" and populate ASI "Water district"
| Modified by: ()
*********************************************************/
/*------------------------------------------------------------------------------------------------------/
| Main Loop
/-----------------------------------------------------------------------------------------------------*/
try {
    (function () {
        Avo_LogDebug("ID165 setZoning()", 1);

        var parcelObj = new Object();
        loadParcelAttributes4ACA(parcelObj);

        //Copy parcel attribute "Zoning Designation" and populate ASI "Zoning"
        var zoningDesig = String(parcelObj["ParcelAttribute.ZONING DESIGNATION"]);
        Avo_LogDebug("Zoning Designation(" + zoningDesig + ")", 2); //debug

        //Copy Parcel attribute "SEWER DISTRICT" and populate ASI "Sewer district"
        var sewerDistrict = String(parcelObj["ParcelAttribute.SEWER DISTRICT"]);
        Avo_LogDebug("SEWER DISTRICT(" + sewerDistrict + ")", 2); //debug

        //Copy Parcel attribute "WATER SUPPLY OR DISTRICT" and populate ASI "Water district"
        var waterSupply = String(parcelObj["ParcelAttribute.WATER SUPPLY OR DISTRICT"]);
        Avo_LogDebug("WATER SUPPLY OR DISTRICT(" + waterSupply + ")", 2); //debug

        editAppSpecific4ACA("Zoning", zoningDesig);
        editAppSpecific4ACA("Sewer district", sewerDistrict);
        editAppSpecific4ACA("Water district", waterSupply);
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