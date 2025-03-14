/*******************************************************
| Script/Function: loadValidatedParcelAttr()
| Created by: Nicolaj Bunting
| Created on: 18Aug20
| Usage: on submit If ParcelValidatedNumber has a value then load parcel attributes TPS into ASI
| Modified by: ()
*********************************************************/
(function () {
    Avo_LogDebug("Parcel Validated #(" + ParcelValidatedNumber + ")", 2);   //debug

    if (ParcelValidatedNumber == null || ParcelValidatedNumber.length == 0 || ParcelValidatedNumber == "") {
        return;
    }

    //loadParcelAttributesTPS(AInfo);
})();