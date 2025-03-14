function getGISFeatureByIntersect(sUrl, sField, sValue, eUrl) {
    var sRequestParameters = "text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&having=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentOnly=false&datumTransformation=¶meterValues=&rangeValues=&quantizationParameters=&f=pjson";

    sRequestParameters = sRequestParameters + "&where=" + sField + "%3D" + sValue;

    // send http request
    var rootNode = aa.util.httpPost(sUrl, sRequestParameters).getOutput();
    // get response in JSON format and parse
    var obj = JSON.parse(rootNode);

    if (obj) {
        if (obj.features.length == 1) {
            var eRequestParameters = "where=&text=&objectIds=&time=&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&having=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentOnly=false&datumTransformation=¶meterValues=&rangeValues=&quantizationParameters=&f=pjson";
            eRequestParameters = eRequestParameters + "&geometry=" + JSON.stringify(obj.features[0].geometry) + "&geometryType=" + obj.geometryType;

            // send http request
            rootNode = aa.util.httpPost(eUrl, eRequestParameters).getOutput();
            // get response in JSON format and parse
            var obj2 = JSON.parse(rootNode);

            if (obj2) {
                return obj2;
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }
    else {
        return null;
    }
}

/*----------------------------------------------------------------------------------------------------/
| GIS Related Functions
/----------------------------------------------------------------------------------------------------*/
/*******************************************************
| Script/Function: getGISInfoCustom()
| Created by: Mike Buell
| Created on: 02June17
| Usage: get drill-down data for specific parcel number
| Modified by: 
| Modified on: 
*********************************************************/
