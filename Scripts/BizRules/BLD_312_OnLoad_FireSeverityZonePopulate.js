/*******************************************************
| Script Title: fireSeverityZonePopulate(ID312)
| Created by: Tom Grzegorczyk
| Created on: 20May21
| Event: Pageflow/OnLoad
| Usage: 
| Modified by: ()
*********************************************************/
/*------------------------------------------------------------------------------------------------------/
| Main Loop
/-----------------------------------------------------------------------------------------------------*/
try {
    (function () {
        //showDebug = true;   //testing
        //cancel = true;
        Avo_LogDebug("ID312 fireSeverityZonePopulate()", 1);

        var parcelObj = new Object();
        loadParcelAttributes4ACA(parcelObj);

        //Copy parcel attribute "FIRE_SEVERITY_ZONE" and populate ASI "Fire severity zone"
        var fireSeverityZone = String(parcelObj["ParcelAttribute.FIRE_SEVERITY_ZONE"]);
        Avo_LogDebug("FIRE_SEVERITY_ZONE(" + fireSeverityZone + ")", 2); //debug

        editAppSpecific4ACA("Fire severity zone", fireSeverityZone);
    })();

    aa.env.setValue("CapModel", cap);
}
catch (ex) {
    Avo_LogDebug("ERROR: " + ex.message, 1);
}

aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC Supp: BLD_312_OnLoad_FireSeverityZonePopulate", debug); //debug

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