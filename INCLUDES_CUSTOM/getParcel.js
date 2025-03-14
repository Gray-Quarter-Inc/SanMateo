function getParcel() {
    var parcelNumber = null;
    try {
        var parcelResult = aa.parcel.getParcelandAttribute(capId, null);
        //var parcelResult = aa.proxyInvoker.newInstance("com.accela.aa.aamain.parcel.ParcelModel");

        if (parcelResult.getSuccess()) {

            var parcels = parcelResult.getOutput().toArray();
            //will return the primary parcel
            for (var zz in parcels) {
                if (parcels[zz].getPrimaryParcelFlag() == "Y") {
                    parcelNumber = parcels[zz].getParcelNumber();
                }
            }

        } else {
            logDebug("**ERROR: Failed to get Parcel List " + parcelResult.getErrorMessage());
            return parcelNumber;
        }

    } catch (err) {
        return parcelNumber;
    }
    return parcelNumber;
}
