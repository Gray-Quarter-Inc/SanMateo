function getGISInfoCustom(svc, parcelNumber, layer, attributename) {

    var distanceType = "feet";
    var strMessage = "";
    var retArray = new Array();
    //if (!esriParcelObject) {
    //    return retString;
    //}
    //get parcel object
    var fGisObjs = aa.gis.getParcelGISObjects(parcelNumber);
    //var fGisObj = esriParcelObject;
    //helperObjectInfo(fGisObj);
    if (fGisObjs.getSuccess()) {
        fGisObj = fGisObjs.getOutput()[0];
    }
    //set buffer object
    var bufferTargetResult = aa.gis.getGISType(svc, layer); // get the buffer target
    if (bufferTargetResult.getSuccess()) {
        var buf = bufferTargetResult.getOutput();
        buf.addAttributeName(attributename);
    }

    var bufchk = aa.gis.getBufferByRadius(fGisObj, "-1", distanceType, buf);

    if (bufchk.getSuccess()) {
        var proxArr = bufchk.getOutput();
        logDebug("Proximity result object - " + proxArr);
        helperObjectInfo(proxArr);
    } else {
        strMessage = strMessage + "**WARNING: Retrieving Buffer Check Results. Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage();
        logDebug(strMessage);
        return retArray;
    }

    for (a2 in proxArr) {
        var proxObj = proxArr[a2].getGISObjects(); // if there are GIS Objects here, we're done
        logDebug("GOT SOME OBJECTS");
        logDebug(proxObj[0]);
        for (z1 in proxObj) {
            var n = proxObj[z1].getAttributeNames();
            var v = proxObj[z1].getAttributeValues();

            logDebug("Here is the info - " + proxObj[z1].getAttributeNames() + " - " + proxObj[z1].getAttributeValues());

            var valArray = new Array();

            //
            // 09/18/08 JHS Explicitly adding the key field of the object, since getBufferByRadius will not pull down the key field
            // hardcoded this to GIS_ID
            //

            valArray["GIS_ID"] = proxObj[z1].getGisId()
            for (n1 in n) {
                valArray[n[n1]] = v[n1];
                //aa.print("Attribute: " + n[n1] + " Value: " + v[n1])
            }
            retArray.push(valArray);
        }

    }

    return retArray
}
/**
* Add Inspection Schedule After Parameters for use in Notification Templates. 
* This should be called from InspectionScheduleAfter Event
*
* @param params {HashMap}
* @return {HashMap}
*/

