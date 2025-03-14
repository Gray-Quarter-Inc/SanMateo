function multipleFEMAZones() {
    //get the Accela parcel # 
    var parcelNumber = getParcel();
    logDebug("The parcel number is - " + parcelNumber);
    var gisService = "AGIS_SMCGOV";
    var valueToSet = new Array();
    var strMessage = "";
    var strValueToDisplay = "NA";

    if (parcelNumber) {
        //now check to ensure Accela parcel exists in ESRI
        var gisParcel = findParcelInGIS(parcelNumber);

        //if we found parcel - add the parcel as a GIS Object
        if (gisParcel) {
            var gisObjectResult = aa.gis.addCapGISObject(capId, gisService, "Active Parcels", parcelNumber);
            if (gisObjectResult.getSuccess()) {
                logDebug("Added GIS object - Active Parcels");

                //since add now get the gis objects
                var gisObjs = aa.gis.getCapGISObjects(capId);
                if (gisObjs.getSuccess()) {
                    var fGisObjs = gisObjs.getOutput();
                }

                //look for the Active Parcels GIS object
                for (var a1 in fGisObjs) {
                    logDebug("The GIS object is - " + fGisObjs[a1].getGisTypeId());

                    if (fGisObjs[a1].getGisTypeId() == "Active Parcels") {
                        logDebug("Found the Active Parcels GIS object");
                        valueToSet = getGISBufferInfoCustom(gisService, "FEMA Flood Zones", -1, "FLD_ZONE");
                        strValueToDisplay = evaluateResult(valueToSet, "FLD_ZONE");
                        logDebug("Did we get some information - " + strValueToDisplay);

                        //update only if we did the buffer
                        if (strValueToDisplay != "NA" && valueToSet.length > 1) {
                            updateParcelAttr("FEMA", "Multiple FEMA Zones");
                        }

                        //add a condition - multiple FEMA zones
                        if (valueToSet.length > 1) {

                            logDebug("Let's add a condition");
                            var cType = "Parcel";
                            var cStatus = "Applied";
                            var cDesc = "Multiple FEMA Zones";
                            var cComment = "Multiple FEMA zones have been found for the Parcel attached to this record. The zones are the following - " + strValueToDisplay + ". Please review the condition and set the Severity to Notice before processing the record.";

                            var cImpact = "Lock";
                            //addAppConditionCustom(cType, cStatus, cDesc, cComment, cImpact);
                            addStdConditionCustom(cType, cDesc, cComment);

                        }

                        //logDebug("Did we get some information - " + valueToSet[0]["FLD_ZONE"]);

                        //logDebug("The FEMA values are - " + valueToSet);
                    }
                }
            }
        }
    }
}
