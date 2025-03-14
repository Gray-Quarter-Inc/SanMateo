/*******************************************************
| Script/Function: routeWindowDoorForReview() - (ID166)
| Created by: Nicolaj Bunting
| Created on: 18Dec20
| Usage: On submit If ASI "Project Type" != "Commercial" and parcel attribute "ZONING DESIGNATION",
| "ZONING 2", "ZONING 3", "ZONING 4" contains "CD", "DR" And ASI "Trim Color" is Not "Earthtone" and ASI
| "For partial window/door replacement, does the new match the existing colors?" is either 'No' or
| 'Not Applicable', Then close task "Application Submittal" with status of "Complete",
| "Plan Review Distribution" with status of "Routed for Review", deactivate tasks "Building Review",
| "Additional Review"
| Modified by: Jei Yang
*********************************************************/
(function () {
    var projType = String(getAppSpecific("Project Type", capId));
    Avo_LogDebug("Project Type(" + projType + ")", 2);  //debug

    if (projType == "Commercial") {
        return;
    }

    var trimColour = String(getAppSpecific("Trim Color", capId));
    Avo_LogDebug("Trim Colour(" + trimColour + ")", 2); //debug

    var matchingColor = String(getAppSpecific(
        "For partial window/door replacement, does the new match the existing colors? ", capId));
    Avo_LogDebug("Matching Colour?(" + matchingColor + ")", 2); //debug

    var parcelObj = new Object();
    loadParcelAttributes(parcelObj);

    var validZone = false;

    var allZoningAttrs = ["ZONING DESIGNATION", "ZONING 2", "ZONING 3", "ZONING 4"];
    for (var i in allZoningAttrs) {
        var zoningAttrName = allZoningAttrs[i];
        var zoningAttr = String(parcelObj["ParcelAttribute." + zoningAttrName]);
        Avo_LogDebug(zoningAttrName + "(" + zoningAttr + ")", 2); //debug

        if (zoningAttr.indexOf("CD") == -1 && zoningAttr.indexOf("DR") == -1) {
            continue;
        }

        Avo_LogDebug("Valid zone", 2);  //debug

        validZone = true;
        break;
    }

    if ((matchingColor.toLowerCase() == "yes")
        || (trimColour.toLowerCase() == "earthtone") || !validZone) {
        return;
    }

    var taskName, status, success;

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