function loadParcelAttributesTPS(thisArr) {
    // Modified version of the loadParcelAttributes()
    // Returns an associative array of Parcel Attributes
    // Optional second parameter, parcel number to load from
    // If no parcel is passed, function is using the ParcelValidatedNumber variable defined in the "BEGIN Event Specific Variables" list in ApplicationSubmitBefore

    var parcelNum = ParcelValidatedNumber;
    if (arguments.length == 2) parcelNum = arguments[1]; // use parcel number specified in args

    if (parcelNum.length != 0 && parcelNum != "" && parcelNum != null) {
        var fParcelObj = null;
        var parcelResult = aa.parcel.getParceListForAdmin(parcelNum, null, null, null, null, null, null, null, null, null);
        if (!parcelResult.getSuccess())
            logDebug("**ERROR: Failed to get Parcel object: " + parcelResult.getErrorType() + ":" + parcelResult.getErrorMessage());
        else
            var fParcelObj = parcelResult.getOutput()[0];


        if (!fParcelObj) {
            logDebug("Unable to retrieve parcel");
            return;
        }
        var fParcelModel = fParcelObj.parcelModel;

        var parcelAttrObj = fParcelModel.getParcelAttribute().toArray();
        for (z in parcelAttrObj)
            //thisArr["ParcelAttribute." + parcelAttrObj[z].getAttributeName()] = parcelAttrObj[z].getAttributeValue();
            thisArr["ParcelAttribute." + parcelAttrObj[z].getB1AttributeName()] = parcelAttrObj[z].getB1AttributeValue();
        // Explicitly load some standard values
        thisArr["ParcelAttribute.Block"] = fParcelModel.getBlock();
        thisArr["ParcelAttribute.Book"] = fParcelModel.getBook();
        thisArr["ParcelAttribute.CensusTract"] = fParcelModel.getCensusTract();
        thisArr["ParcelAttribute.CouncilDistrict"] = fParcelModel.getCouncilDistrict();
        thisArr["ParcelAttribute.ExemptValue"] = fParcelModel.getExemptValue();
        thisArr["ParcelAttribute.ImprovedValue"] = fParcelModel.getImprovedValue();
        thisArr["ParcelAttribute.InspectionDistrict"] = fParcelModel.getInspectionDistrict();
        thisArr["ParcelAttribute.LandValue"] = fParcelModel.getLandValue();
        thisArr["ParcelAttribute.LegalDesc"] = fParcelModel.getLegalDesc();
        thisArr["ParcelAttribute.Lot"] = fParcelModel.getLot();
        thisArr["ParcelAttribute.MapNo"] = fParcelModel.getMapNo();
        thisArr["ParcelAttribute.MapRef"] = fParcelModel.getMapRef();
        thisArr["ParcelAttribute.ParcelArea"] = fParcelModel.getParcelArea();
        thisArr["ParcelAttribute.ParcelStatus"] = fParcelModel.getParcelStatus();
        thisArr["ParcelAttribute.SupervisorDistrict"] = fParcelModel.getSupervisorDistrict();
        thisArr["ParcelAttribute.Tract"] = fParcelModel.getTract();
        thisArr["ParcelAttribute.PlanArea"] = fParcelModel.getPlanArea();
    }
}

