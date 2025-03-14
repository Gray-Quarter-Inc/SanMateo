/*******************************************************
| Script/Function: checkFinalInspsPassed() - (ID188)
| Created by: Nicolaj Bunting
| Created on: 11Jan21
| Usage: When inspection "901 Building Final" has result set to "Pass" If inspection type containing "Final" except 
| "901 Building Final" with most recent result date (if applicable) doesn't have a result of "Pass" And isn't cancelled Then block 
| submittal and display message "Cannot be finaled due to outstanding final inspections from other agencies"
| Modified by: ()
*********************************************************/
(function () {
    if (cancel == true) {
        return;
    }

    // Check inspections
    var result = aa.inspection.getInspections(capId);
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to find any inspections. " + result.errorType + ": " + result.errorMessage, 1);
        return;
    }

    var allInsps = result.getOutput();
    Avo_LogDebug("Total Insps(" + allInsps.length + ")", 2);  //debug

    var invalidFinalInspFound = false;

    var allFinalInspTypes = new Object();

    for (var i in allInsps) {
        var insp = allInsps[i];

        var inspTypeToCheck = String(insp.inspectionType);
        Avo_LogDebug(br + "Insp Type(" + inspTypeToCheck + ")", 2); //debug

        if (inspTypeToCheck == "901 Building Final") {
            continue;
        }

        if (inspTypeToCheck.toUpperCase().indexOf('FINAL') == -1) {
            continue;
        }

        var inspStatus = String(insp.documentDescription);
        Avo_LogDebug("Insp Status(" + inspStatus + ")", 2); //debug

        var inspResultToCheck = String(insp.inspectionStatus);
        Avo_LogDebug("Insp Result(" + inspResultToCheck + ")", 2); //debug

        if (inspResultToCheck == "Cancelled" || inspResultToCheck == "Canceled") {
            continue;
        }
        if (!insp.inspectionStatusDate) {
            //For "Rescheduled" inspections which don't have status date
            continue;
        }

        var inspStatusDateToCheck = new Date(insp.inspectionStatusDate.epochMilliseconds);
        Avo_LogDebug("Insp Status Date(" + aa.util.formatDate(inspStatusDateToCheck, "MM/dd/yyyy") + ")", 2);	//debug

        if (inspResultToCheck == "Pass" || inspResultToCheck == "Passed" || inspStatus == "Insp Cancelled") {
            // Check for most recent time
            if (inspTypeToCheck in allFinalInspTypes) {
                var latestInspStatusDate = new Date(allFinalInspTypes[inspTypeToCheck].inspectionStatusDate.epochMilliseconds);
                Avo_LogDebug("Insp Status Date to Check(" + aa.util.formatDate(latestInspStatusDate, "MM/dd/yyyy") + ")", 2);	//debug

                if (latestInspStatusDate.getTime() > inspStatusDateToCheck.getTime()) {
                    Avo_LogDebug(inspTypeToCheck + " inspection on " + aa.util.formatDate(latestInspStatusDate, "MM/dd/yyyy")
                        + " is more recent than current inspection. Ignoring", 1);
                    continue;
                }
            }

            allFinalInspTypes[inspTypeToCheck] = insp;
            continue;
        }

        Avo_LogDebug("Found incomplete " + inspTypeToCheck + " inspection", 1);

        invalidFinalInspFound = true;
        break;
    }

    Avo_LogDebug("", 2);    //debug

    if (invalidFinalInspFound != true && Object.keys(allFinalInspTypes).length > 0) {
        for (var inspTypeToCheck in allFinalInspTypes) {
            var insp = allFinalInspTypes[inspTypeToCheck];

            Avo_LogDebug(br + "Insp Type(" + inspTypeToCheck + ")", 2); //debug

            var inspResultToCheck = String(insp.inspectionStatus);
            Avo_LogDebug("Insp Result(" + inspResultToCheck + ")", 2); //debug

            if (inspResultToCheck == "Pass" || inspResultToCheck == "Passed") {
                continue;
            }

            Avo_LogDebug("Found failed " + inspTypeToCheck + " inspection", 1);

            invalidFinalInspFound = true;
            break;
        }
    }

    if (invalidFinalInspFound != true) {
        return;
    }

    cancel = true;
    showMessage = true;
    if (publicUser == true) {
        showDebug = false;  // Hide debug in ACA
    }
    comment("Cannot be finaled due to outstanding final inspections from other agencies");
})();