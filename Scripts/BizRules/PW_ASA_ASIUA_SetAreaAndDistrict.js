/*******************************************************
| Script/Function: setAreaAndDistict()
| Created by: Nicolaj Bunting
| Created on: 18Aug20
| Usage: on submit set ASI "Community Area" to value of "COMMUNITY AREA" parcel attribute, ASI "Sewer District" to value of "SEWER DISTRICT" parcel attribute
| Modified by: ()
*********************************************************/
(function () {
    editAppSpecific("Community Area", parcelArr["ParcelAttribute.COMMUNITY AREA"], capId);
    editAppSpecific("Sewer District", parcelArr["ParcelAttribute.SEWER DISTRICT"], capId);
})();