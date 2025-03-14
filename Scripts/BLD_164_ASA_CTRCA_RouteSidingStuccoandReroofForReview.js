/*******************************************************
| Script/Function: routeSidingStuccoandReroofForReview() - (ID164)
| Created by: Jei Yang
| Created on: 17Dec20
| Usage: On submit If ASI "Color" is not "Earthtone", and parcel attribute "ZONING DESIGNATION",  or "ZONING 2", or "ZONING 3", or "ZONING 4"
|        includes values "CD" or "DR",
|        OR ASI "Materials" == "Other".
|        then set workflow task "Application Submittal" to status of "Complete" Complete the task "Plan Review Distribution"
|        with the status of "Routed for Review" and open up the "Planning Review" task.
| Modified by: ()
*********************************************************/
(function () {
    var altId = aa.cap.getCap(capId).getOutput().capModel.altID;

    var materialIsOther = String(getAppSpecific("Materials", capId));
    Avo_LogDebug("Materials(" + materialIsOther + ")", 2);  //debug

    if (materialIsOther.toUpperCase() != "OTHER") {

        var reqTempPole = String(getAppSpecific("Color", capId));
        Avo_LogDebug("Color(" + reqTempPole + ")", 2);  //debug
    
        if (reqTempPole.toUpperCase() == "EARTHTONE") {
            return;
        }
    
        var allZoningAttrs = ["ZONING DESIGNATION", "ZONING 2", "ZONING 3", "ZONING 4"];
        var requiredValueFound = false;
    
        var parcelObj = new Object();
        loadParcelAttributes(parcelObj);
        for (var i in allZoningAttrs) {
            var zoningAttrName = allZoningAttrs[i];
            var zoningAttr = String(parcelObj["ParcelAttribute." + zoningAttrName]);
            Avo_LogDebug(zoningAttrName + "(" + zoningAttr + ")", 2); //debug
    
            if (zoningAttr.indexOf("CD") != -1 || zoningAttr.indexOf("DR") != -1) {
                requiredValueFound = true;
            }
        }
    
        if (!requiredValueFound) {
            return;
        }
    }

    var taskName, status, success;

    // Update status and complete task
    taskName = "Application Submittal";
    status = "Complete";
    success = closeTask(taskName, status, "", "");
    if (success === false) {
        Avo_LogDebug('Failed to close task "' + taskName + '" with status of "' + status + '"', 1);
        return;
    }

    Avo_LogDebug('Closed task "' + taskName + '" with status of "' + status + '"', 1);

    taskName = "Plan Review Distribution";
    status = "Routed for Review";
    success = closeTask(taskName, status, "", "");
    if (success === false) {
        Avo_LogDebug('Failed to close task "' + taskName + '" with status of "' + status + '"', 1);
        return;
    }

    Avo_LogDebug('Closed task "' + taskName + '" with status of "' + status + '"', 1);

    //Open up the task
    taskName = "Planning Review";
    success = activateTask(taskName);
    if (success === false) {
        Avo_LogDebug('Failed to activate task "' + taskName + '"', 1);
        return;
    }

    Avo_LogDebug('Activated task "' + taskName + '"', 1);

    
    taskName = "Building Review";
    success = deactivateTask(taskName);
    if (success === false) {
        Avo_LogDebug('Failed to deactivate task "' + taskName + '"', 1);
        return;
    }

    Avo_LogDebug('Deactivated task "' + taskName + '"', 1);

    taskName = "Additional Review";
    success = deactivateTask(taskName);
    if (success === false) {
        Avo_LogDebug('Failed to deactivate task "' + taskName + '"', 1);
        return;
    }

    Avo_LogDebug('Deactivated task "' + taskName + '"', 1);
    
})();