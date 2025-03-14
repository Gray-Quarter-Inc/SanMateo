function findParcelInGIS(parcelId) {
    //var url = "http://maps.smcgov.org/arcgis/rest/services/PLN/PLN_LAYERS_DMZ/MapServer/0/query";
    //var url = "http://maps.smcgov.org/arcgis/rest/services/COMMON/PLN_BASE/MapServer/1/query";
    //var url = "http://maps.smcgov.org/arcgis/rest/services/PLN/PLN_ACELLA/MapServer/0/query";
    var url = "https://gis.smcgov.org/maps/rest/services/PLANNING/PLN_LAYERS_DMZ/MapServer";

    var requestParameters = "?text=&geometry=&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&objectIds=&time=&returnCountOnly=false&returnIdsOnly=false&returnGeometry=true&maxAllowableOffset=&outSR=&outFields=*&f=pjson";
    requestParameters += "&where=APN%3D%27" + parcelId + "%27"

    // send http request
    var rootNode = aa.util.httpPost(url, requestParameters).getOutput();
    //show the ESRI string
    var esriString = (url + requestParameters);
    logDebug("The ESRI search string is - " + esriString);

    // get response in JSON format and parse
    var obj = JSON.parse(rootNode);

    if (obj) {
        return obj;
    }
    else {
        return null;
    }
}
/*******************************************************
| Script/Function: formatAddressAndOwnerZips(recordId)
| Created by: Nicolaj Bunting
| Created on: 31May17
| Usage: When the record is created adjust the Zip code for the Address and Owner to use the 9 digit "#####-####" format
| Modified by: Nic Bunting (12Oct17)
*********************************************************/
