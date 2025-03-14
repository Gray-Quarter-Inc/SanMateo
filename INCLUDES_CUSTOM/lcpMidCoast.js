function lcpMidCoast() {
    //get the Accela parcel # 
    var parcelNumber = getParcel();
    logDebug("The parcel number is - " + parcelNumber);
    var gisService = "AGIS_SMCGOV";
    var valueToSet = new Array();
    var strMessage = "";
    var strValueToDisplay = "NA";
    var activeParcels = false;

    if (parcelNumber) {
        //now check to ensure Accela parcel exists in ESRI
        var gisParcel = findParcelInGIS(parcelNumber);

        //if we found parcel - add the parcel as a GIS Object
        if (gisParcel) {

            for (var a1 in fGisObjs) {
                if (fGisObjs[a1].getGisTypeId() == "Active Parcels") {
                    activeParcels = true;
                }
            }

            if (!activeParcels) {
                var gisObjectResult = aa.gis.addCapGISObject(capId, gisService, "Active Parcels", parcelNumber);
            }

            if (gisObjectResult.getSuccess()) {

                var gisObjs = aa.gis.getCapGISObjects(capId);
                if (gisObjs.getSuccess()) {
                    var fGisObjs = gisObjs.getOutput();
                }
                //look for the Active Parcels GIS object
                for (var a1 in fGisObjs) {
                    if (fGisObjs[a1].getGisTypeId() == "Active Parcels") {
                        logDebug("Found the Active Parcels GIS object");

                        valueToSet = getGISBufferInfoCustom(gisService, "LCP_MIDCOAST_PROJECT_AREA", -1, "OBJECTID_1");
                        strValueToDisplay = evaluateResult(valueToSet, "OBJECTID_1");
                        logDebug("Did we get some information - " + strValueToDisplay);

                        //update only if we did the buffer
                        if (strValueToDisplay != "NA") {
                            updateParcelAttr("LPC MIDCOAST PROJECT AREA", "Yes");
                            logDebug("Updated the LCP value");
                        }
                    }
                }
            }
        }
    }
}
