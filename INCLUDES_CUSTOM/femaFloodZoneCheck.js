function femaFloodZoneCheck() {
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
                //logDebug("Added GIS object - Active Parcels");
                //since add now get the gis objects
                var gisObjs = aa.gis.getCapGISObjects(capId);
                if (gisObjs.getSuccess()) {
                    var fGisObjs = gisObjs.getOutput();
                }

                //look for the Active Parcels GIS object
                for (var a1 in fGisObjs) {
                    //logDebug("The GIS object is - " + fGisObjs[a1].getGisTypeId());
                    if (fGisObjs[a1].getGisTypeId() == "Active Parcels") {
                        //logDebug("Found the Active Parcels GIS object");
                        fldZoneValueToSet = getGISBufferInfoCustom(gisService, "FEMA Flood Zones", -1, "FLD_ZONE");
                        spcZoneValueToSet = getGISBufferInfoCustom(gisService, "FEMA Flood Zones", -1, "SFHA_TF");
                        strValueToDisplay = evaluateResult(fldZoneValueToSet, "FLD_ZONE");

                        //possible update only if we received something from the buffer
                        if (strValueToDisplay != "NA" && fldZoneValueToSet.length >= 1) {
                            var bolFoundFEMA = false;
                            //check the flood zones values returned
                            //if special zone then set found FEMA to true
                            for (var x in spcZoneValueToSet) {
                                if (spcZoneValueToSet[x]["SFHA_TF"] == "T") {
                                    bolFoundFEMA = true;
                                }
                            }

                            if (!bolFoundFEMA) {
                                //check for code = D
                                for (var x in fldZoneValueToSet) {
                                    if (fldZoneValueToSet[x]["FLD_ZONE"] == "D") {
                                        bolFoundFEMA = true;
                                    }
                                }
                            }
                        }

                        //add a condition - FEMA zone check
                        if (bolFoundFEMA) {
                            //logDebug("The value is - " + strValueToDisplay);

                            updateParcelAttr("FEMA", "FEMA Zone Check Required");

                            var cType = "FEMA";
                            var cStatus = "Applied";
                            var cDesc = "FEMA Zone Check Required";
                            var cComment = "FEMA zone check required. The zone(s) are the following - " + strValueToDisplay + ". Please review the condition and set the Severity to Notice before processing the record.";

                            var cImpact = "Lock";
                            //addAppConditionCustom(cType, cStatus, cDesc, cComment, cImpact);
                            addStdConditionCustom(cType, cDesc, cComment);
                        }
                    }
                }
            }
        }
    }
}
/*----------------------------------------------------------------------------------------------------/
| GIS Related Functions
/----------------------------------------------------------------------------------------------------*/
/*******************************************************
| Script/Function: findParcelInGIS(parcelId)
| Created by: Mike Buell
| Created on: 02June17
| Usage: find parcel from REST service
| Modified by: 
| Modified on: 
*********************************************************/
