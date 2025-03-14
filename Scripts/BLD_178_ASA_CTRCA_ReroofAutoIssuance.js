/*******************************************************
| Script/Function: reroofAutoIssuance() - (ID178)
| Created by: Jei Yang
| Created on: 4Jan21
| Usage: On submit If ASI "Color" is "Earthtone" and parcel attribute "ZONING DESIGNATION",  or "ZONING 2", or "ZONING 3", or "ZONING 4"
|        include values "CD" or "DR",
|        or parcel attribute "ZONING DESIGNATION", AND "ZONING 2", AND "ZONING 3", AND "ZONING 4"
|        does not include values "CD" or "DR",
|        AND if ASI "Materials" is not "Other",
|        then set workflow task "Application Submittal" to status of "Complete" 
|        Set the workflow task 'Ready to issue Permit" to status of "Permit issued"
|        Do not activate the next task after Application Submittal. The only task that should be open is "Inspections"
| Modified by: ()
*********************************************************/
(function () {
    if (!publicUser) {
        return;
    }
    var altId = aa.cap.getCap(capId).getOutput().capModel.altID;
    var earthtoneFound = false;
    var restrictedValueFound = false;

    var materialIsOther = String(getAppSpecific("Materials", capId));
    Avo_LogDebug("Materials(" + materialIsOther + ")", 2);  //debug

    if (materialIsOther.toUpperCase() == "OTHER") {
        return;
    }

    var reqTempPole = String(getAppSpecific("Color", capId));
    Avo_LogDebug("Color(" + reqTempPole + ")", 2);  //debug

    if (reqTempPole.toUpperCase() == "EARTHTONE") {
        earthtoneFound = true;
    }

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
    
    if (!earthtoneFound && restrictedValueFound) {
        return;
    }
    Avo_LogDebug("Auto Issued by ID 178", 2); // debug
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