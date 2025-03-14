/*******************************************************
| Script/Function: windowAutoIssuance() - (ID177)
| Created by: Jei Yang
| Created on: 4Jan21
| Usage: On submit If ASI "Project Type" != "Commercial" and "Color" is "Earthtone" and parcel attribute
| "ZONING DESIGNATION",  or "ZONING 2", or "ZONING 3", or "ZONING 4" include values "CD" or "DR" or
| parcel attribute "ZONING DESIGNATION", AND "ZONING 2", AND "ZONING 3", AND "ZONING 4" does not include
| values "CD" or "DR" Then set workflow task "Application Submittal" to status of "Complete", set
| workflow task 'Ready to issue Permit" to status of "Permit issued", do not activate the next task after
| "Application Submittal". The only task that should be open is "Inspections"
| Modified by: ()
*********************************************************/
(function () {
    var projType = String(getAppSpecific("Project Type", capId));
    Avo_LogDebug("Project Type(" + projType + ")", 2);  //debug

    if (projType == "Commercial") {
        return;
    }

    var restrictedValueFound = false;

    var reqTempPole = String(getAppSpecific("Trim Color", capId));
    Avo_LogDebug("Trim Color(" + reqTempPole + ")", 2);  //debug

    var matchingColor = String(getAppSpecific(
        "For partial window/door replacement, does the new match the existing colors? ", capId));
    Avo_LogDebug("Matching colour?(" + matchingColor + ")", 2); //debug

    var allZoningAttrs = ["ZONING DESIGNATION", "ZONING 2", "ZONING 3", "ZONING 4"];

    var parcelObj = new Object();
    loadParcelAttributes(parcelObj);
    for (var i in allZoningAttrs) {
        var zoningAttrName = allZoningAttrs[i];
        var zoningAttr = String(parcelObj["ParcelAttribute." + zoningAttrName]);
        Avo_LogDebug(zoningAttrName + "(" + zoningAttr + ")", 2); //debug

        if (zoningAttr.indexOf("CD") != -1 || zoningAttr.indexOf("DR") != -1) {
            restrictedValueFound = true;
            break;
        }
    }

    if ((matchingColor.toUpperCase() != "YES")
        && (reqTempPole.toUpperCase() != "EARTHTONE") && restrictedValueFound) {
        return;
    }

    Avo_LogDebug("Auto Issued by ID 177", 2); // debug
    //If the restricted values are not found OR color is Earthtone.
    var taskName, status, success;

    // Update status and complete task

    taskName = "Application Submittal";
    status = "Complete";
    success = Avo_CloseTaskAsUser(taskName, status, "", "", "Online permits", false, null, capId);
    if (success === false) {
        return;
    }

    // Branch task
    taskName = "Ready to Issue Permit";
    status = "Permit Issued";
    success = Avo_BranchTaskAsUser(taskName, status, "", "", "Online permits", null, capId);
    if (success === false) {
        return;
    }

    //Script 384 Send Permit Auto Issued Email
    include("BLD_384_ASA_CTRCA_SendPermitAutoIssuedEmail");
})();