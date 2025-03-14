/*******************************************************
| Script/Function: checkIvrInspsRemain() - (ID222)
| Created by: Nicolaj Bunting
| Created on: 15Jan21
| Usage: On inspection scheduled If record status is Not in "IGNORE_RSTATUS_LIST" of std choice
| "ACA_INSPECTION_LIMIT" And current user is "IVRUSER" And total records with record status Not in ignore
| list And inspections scheduled for "InspectionDate" of type Not in "IGNORE_LIST" is greater than
| MAX_UNITS in table "CALENDAR" where CALENDAR_NAME is AREA#_BUILDING_INSPECTION matching Area # in parcel
| attribute "BUILDING INSPECTION AREA" Then block submittal and display message "IVR_USER_AREA_LIMIT"
| Modified by: ()
*********************************************************/
(function () {
    //if (cancel == true) {
    //    Avo_LogDebug('Event has already been cancelled', 2);   //debug
    //    return;
    //}

    //cancel = true;  //testing
    //showDebug = true;   //testing

    // Check user
    if (matches(currentUserID, "IVRUSER") != true) {
        Avo_LogDebug('User is not "IVRUSER"', 2);   //debug
        return;
    }

    var cap = aa.cap.getCap(capId).getOutput();
    var status = String(cap.getCapStatus());
    Avo_LogDebug("Status(" + status + ")", 2);  //debug

    var stdChoice = "ACA_INSPECTION_LIMIT";

    // Get status ignore list
    var ignoreStatuses = String(lookup(stdChoice, "IGNORE_RSTATUS_LIST"));
    Avo_LogDebug("Ignore Statuses(" + ignoreStatuses + ")", 2);   //debug

    var ignoreStatusesArr = ignoreStatuses.split(",");
    var allStatusesToIgnore = new Object();

    for (var i in ignoreStatusesArr) {
        var statusToIgnore = ignoreStatusesArr[i];
        //Avo_LogDebug("Status to Ignore(" + statusToIgnore + ")", 2);    //debug

        if (status == statusToIgnore) {
            return;
        }

        allStatusesToIgnore[statusToIgnore] = true;
    }

    // Get Scheduled date
    var InspectionDate = String(aa.env.getValue("InspectionDate"));
    Avo_LogDebug("Insp Date(" + InspectionDate + ")", 2);   //debug

    var inspDate = Avo_GetDateFromAccelaDateString(InspectionDate);
    var inspDateStr = aa.util.formatDate(inspDate, "MM/dd/yyyy");
    Avo_LogDebug("Scheduled Date(" + inspDateStr + ")", 2);	//debug

    var result = aa.inspection.getInspections(InspectionDate, InspectionDate);
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get inspections scheduled for " + inspDateStr + ". "
            + result.errorType + ": " + result.errorMessage, 1);
        return;
    }

    // Get insp type ignore list
    var ignoreTypes = String(lookup(stdChoice, "IGNORE_LIST"));
    Avo_LogDebug("Ignore Types(" + ignoreTypes + ")", 2);   //debug

    var ignoreTypesArr = ignoreTypes.split(",");
    var allTypesToIgnore = new Object();

    for (var i in ignoreTypesArr) {
        var typeToIgnore = ignoreTypesArr[i];
        //Avo_LogDebug("Type to Ignore(" + typeToIgnore + ")", 2);    //debug

        allTypesToIgnore[typeToIgnore] = true;
    }

    var parcelObj = new Object();
    loadParcelAttributes(parcelObj);

    var area = String(parcelObj["ParcelAttribute.BUILDING INSPECTION AREA"]);
    Avo_LogDebug("Insp Area(" + area + ")", 2); //debug

    if (matches(area, null, "null", "", undefined, "undefined") == true) {
        area = getBldInspArea(capId);
        Avo_LogDebug("Insp Area(" + area + ")", 2); //debug
    }

    //if (matches(area, null, "null", "", undefined, "undefined") == true) {
    //    cancel = true;
    //    showMessage = true;
    //    comment("Invalid area provided");
    //    Avo_LogDebug("Invalid area provided", 1);
    //    return;
    //}

    const regex = /AREA(\d+)/i;
    var num = regex.exec(area)[1];

    var allInsps = result.getOutput();
    Avo_LogDebug("Total Scheduled Insps(" + allInsps.length + ")", 2);  //debug

    var allInspRecords = new Object();

    // Add current record
    var altId = aa.cap.getCap(capId).getOutput().capModel.altID;
    allInspRecords[altId] = true;

    for (var i in allInsps) {
        var insp = allInsps[i];

        var inspCapId = insp.capID;
        if (!inspCapId) {
            Avo_LogDebug("Invalid capId " + inspCapId + " associated with inspection", 1);
            continue;
        }

        var result = aa.cap.getCap(inspCapId);
        if (result.getSuccess() != true) {
            Avo_LogDebug("Failed to get cap for record " + inspCapId + ". "
                + result.errorType + ": " + result.errorMessage, 1);
            continue;
        }

        var capToCheck = result.getOutput();
        if (!capToCheck) {
            Avo_LogDebug("Invalid cap", 1);
            continue;
        }

        var altIdToCheck = capToCheck.capModel.altID;
        Avo_LogDebug(br + "Record(" + altIdToCheck + ")", 2);	//debug

        if (altIdToCheck in allInspRecords) {
            continue;
        }

        var statusToCheck = String(capToCheck.getCapStatus());
        Avo_LogDebug("Status(" + statusToCheck + ")", 2);  //debug

        if (statusToCheck in allStatusesToIgnore) {
            continue;
        }

        var inspType = String(insp.inspectionType);
        Avo_LogDebug("Insp Type(" + inspType + ")", 2);	//debug

        if (inspType in allTypesToIgnore) {
            continue;
        }

        var status = String(insp.documentDescription);
        Avo_LogDebug("Status(" + status + ")", 2);  //debug

        if (status != 'Insp Scheduled' && status != 'Insp Rescheduled') {
            continue;
        }

        // Get Area
        var areaToCheck = getBldInspArea(inspCapId);
        Avo_LogDebug("Area to Check(" + areaToCheck + ")", 2);  //debug

        if (areaToCheck != area) {
            continue;
        }

        var schedDate = new Date(insp.scheduledDate.epochMilliseconds);
        Avo_LogDebug("Scheduled Date(" + aa.util.formatDate(schedDate, "MM/dd/yyyy") + ")", 2); //debug

        allInspRecords[altIdToCheck] = true;
    }

    Avo_LogDebug(br + "Total Scheduled Insp Records(" + Object.keys(allInspRecords).length
        + ")", 2);   //debug

    Avo_LogDebug("Insp Records(" + Object.keys(allInspRecords).join(', ') + ")", 2);    //debug

    // Get Calendar name
    var calendarName = "AREA" + num + "_BUILDING_INSPECTION";

    eval(getScriptText("BLD_GetInspLimitForDate"));
    var inspLimit = getInspLimitForDate(calendarName, inspDateStr);
    Avo_LogDebug("Area Insp Limit(" + inspLimit + ")", 2); //debug

    var inspLimitNum = parseInt(inspLimit, 10);

    if (isNaN(inspLimitNum) != true && inspLimitNum >= Object.keys(allInspRecords).length) {
        return;
    }

    cancel = true;
    showMessage = true;
    comment("IVR_USER_AREA_LIMIT");
    Avo_LogDebug("IVR_USER_AREA_LIMIT", 1);

    comment(debug); //debug
})();

function getBldInspArea(recordId) {
    var altId = aa.cap.getCap(recordId).getOutput().capModel.altID;

    var result = aa.parcel.getParcelandAttribute(recordId, null);
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get parcel attributes for record " + altId + '. '
            + result.errorType + ': ' + result.errorMessage, 1);
        return false;
    }

    var allParcels = result.getOutput().toArray();
    for (var i in allParcels) {
        var parcelModel = allParcels[i];

        var allParcelAttrs = parcelModel.parcelAttribute.toArray();
        for (var j in allParcelAttrs) {
            var parcelAttr = allParcelAttrs[j];

            var attrName = parcelAttr.b1AttributeName;

            if (attrName != "BUILDING INSPECTION AREA") {
                continue;
            }

            return String(parcelAttr.b1AttributeValue);
        }
    }

    return null;
}

//aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "",
//    "SMC Prod: BLD_222_ISB_CheckIvrInspsRemain", debug); //debug