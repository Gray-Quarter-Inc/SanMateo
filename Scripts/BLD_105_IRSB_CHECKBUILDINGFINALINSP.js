/*******************************************************
| Script/Function: checkBuildingFinalInsp() - (ID105)
| Created by: Nicolaj Bunting
| Created on: 27Nov20
| Usage: When inspection "901 Building Final" has result set to "Pass" If ASI "Is a new clean out being installed or replaced" is "Yes" 
| And no inspection of type "Final by Sewer" with result of "Pass" Or ASI "Is the work done in the public right of way" is "Yes" 
| And no inspection fo type "Final by Public Works" with result of "Pass" Then block submittal and display message
| "Cannot be finaled due to outstanding final inspections from other agencies"
| Modified by: Tom Grzegorczyk on 08Dec22 - accepting both "Final by Sewer" and "Final by Sewer District" as it is a same inspection (in diff env)
*********************************************************/
(function () {
    var allReqPassedInsps = new Object();

    var cleanOut = String(getAppSpecific("Is a new clean out being installed or replaced", capId));
    Avo_LogDebug("Clean Out(" + cleanOut + ")", 2); //debug

    if (cleanOut) {
        if (cleanOut.toUpperCase() == "YES") {
            allReqPassedInsps["Final by Sewer"] = true;
            allReqPassedInsps["Final by Sewer District"] = true;
        }
    }

    var publicRightOfWay = String(getAppSpecific("Is the work done in the public right of way", capId));
    Avo_LogDebug("Public Right of Way(" + publicRightOfWay + ")", 2); //debug
    if (publicRightOfWay) {
        if (publicRightOfWay.toUpperCase() == "YES") {
            allReqPassedInsps["Final by Public Works"] = true;
        }
    }

    if (Object.keys(allReqPassedInsps).length == 0) {
        return;
    }

    // Check inspections
    var allInsps = new Array();
    var result = aa.inspection.getInspections(capId);
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to find any inspections. " + result.errorType + ": " + result.errorMessage, 1);
    } else {
        allInsps = result.getOutput();
    }

    Avo_LogDebug("Total Insps(" + allInsps.length + ")", 2);  //debug

    for (var i in allInsps) {
        var insp = allInsps[i];

        var inspType = String(insp.inspectionType);
        Avo_LogDebug("Insp Type(" + inspType + ")", 2); //debug

        if (!(inspType in allReqPassedInsps)) {
            continue;
        }

        var inspResult = String(insp.inspectionStatus);
        Avo_LogDebug("Insp Result(" + inspResult + ")", 2); //debug

        if (inspResult != "Pass" || inspResultToCheck != "Passed") {
            continue;
        }


        if (inspType == "Final by Sewer" || inspType == "Final by Sewer District") {
            delete allReqPassedInsps["Final by Sewer"];
            delete allReqPassedInsps["Final by Sewer District"];
        } else {
            delete allReqPassedInsps[inspType];
        }
        Avo_LogDebug("Found passed " + inspType + " inspection", 1);
    }

    if (Object.keys(allReqPassedInsps).length == 0) {
        return;
    }

    Avo_LogDebug(br + "No passed " + Object.keys(allReqPassedInsps).join(", ") + " inspection(s) found", 1);

    cancel = true;
    showMessage = true;
    if (publicUser == true) {
        showDebug = false;  // Hide debug in ACA
    }
    comment("Cannot be finaled due to outstanding final inspections from other agencies");
})();