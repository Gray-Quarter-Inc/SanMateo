/*******************************************************
| Script/Function: checkRoofTearOffInsp() - (ID118)
| Created by: Nicolaj Bunting
| Created on: 30Nov20
| Usage: When inspection "901 Building Final" has result set to "Pass" If ASI "Is roof tear off required?" is "Yes" And no inspection of 
| type "501 Roof Tear-Off" with result of "Pass" Then block submittal and display message "A 501 Roof Tear-Off inspection is required"
| Modified by: ()
*********************************************************/
(function () {
    var allReqPassedInsps = new Object();

    var roofTearOff = String(getAppSpecific("Is roof tear off required?", capId));
    Avo_LogDebug("Roof Tear Off(" + roofTearOff + ")", 2); //debug

    if (roofTearOff.toUpperCase() == "YES") {
        allReqPassedInsps["501 Roof Tear-Off"] = true;
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

        if (inspResult != "Pass") {
            continue;
        }

        delete allReqPassedInsps[inspType];
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
    comment("A 501 Roof Tear-Off inspection is required");
})();

//aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC Test: BLD_118_IRSB_CheckRoofTearOffInsp", debug); //debug