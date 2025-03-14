/*******************************************************
| Script/Function: activateFireReview() - (ID216)
| Created by: Nicolaj Bunting
| Created on: 22Jan21
| Usage: On submit If parcel attribute "FIRE DISTRICT" is "Woodside Fire Protection District" Then activate task "Fire Review"
| Modified by: ()
*********************************************************/
(function () {
    var parcelObj = new Object();
    loadParcelAttributes(parcelObj);

    var fireDistrict = String(parcelObj["ParcelAttribute.FIRE DISTRICT"]);
    Avo_LogDebug("Fire District(" + fireDistrict + ")", 2); //debug

    if (fireDistrict != "Woodside Fire Protection District") {
        return;
    }

    // Activate task
    var taskName = "Fire Review";
    var success = activateTask(taskName);
    if (success === false) {
        Avo_LogDebug('Failed to activate task "' + taskName + '"', 1);
        return;
    }
})();