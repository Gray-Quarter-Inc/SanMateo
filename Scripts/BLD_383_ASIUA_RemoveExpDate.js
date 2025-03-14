/*******************************************************
| Script/Function: removeExpDate(ID383)
| Created by: Nicolaj Bunting
| Created on: 23Sep21
| Usage: On ASI update If ASI "Never Expires" is checked Then clear ASI "Date of Expiration"
| Modified by: ()
*********************************************************/
(function () {
    var neverExp = String(getAppSpecific("Never Expires", capId));
    Avo_LogDebug("Never Expires(" + neverExp + ")", 2); //debug

    if (neverExp.toUpperCase() != "CHECKED") {
        return;
    }

    editAppSpecific("Date of Expiration", null, capId);
})();