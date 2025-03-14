/*******************************************************
| Script/Function: resetExpDate()
| Created by: Nicolaj Bunting
| Created on: 18Aug20
| Usage: When task status is set to "Permit Issued" If ASI "Permit Type" is "Encroachment" And ASI "Expiration Date" has a value then set "Expiration Date" to 365 days 
| from today
| Modified by: ()
*********************************************************/
(function () {
    var permitType = String(getAppSpecific("Permit Type", capId));
    Avo_LogDebug("Permit Type(" + permitType + ")", 2); //debug

    if (permitType !== "Encroachment") {
        return;
    }

    var fieldName = "Expiration Date";
    var expDate = getAppSpecific(fieldName, capId);
    Avo_LogDebug(fieldName + "(" + expDate + ")", 2); //debug

    if (!expDate || String(expDate).length == 0) {
        return;
    }

    expDate = dateAdd(null, 365);
    editAppSpecific(fieldName, expDate, capId);
    Avo_LogDebug('Set "' + fieldName + '" to "' + expDate + '"', 1);
})();