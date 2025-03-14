/*******************************************************
| Script/Function: conditionalReviewInspection() - (ID270)
| Created by: Jei Yang
| Created on: 26Apr21
| Usage: Add inspection type "Final by Fire" in the pending status
| Modified by: (Tom Grzegorczyk 29Jul22 requested via incident report 15425 
                - Update to schedule inspection instead. The inspection should schedule out 30 days from status update (on a work day), and not to anyone specific.)
*********************************************************/
(function () {
    var inspectionName;

    if (wfStatus != "Passed with Conditions") {
        return;
    }

    //if (wfTask == "Planning Review") {
    //    inspectionName = "Final by Planning";

    if (wfTask == "Public Works") {
        inspectionName = "Final by Public Works";

    } else if (wfTask == "Civil and Drainage Review") {
        inspectionName = "Final by Civil and Drainage";

    } else if (wfTask == "Environmental Health Review") {
        inspectionName = "Final by Environmental Health";

    } else if (wfTask == "Fire Review") {
        inspectionName = "Final by Fire";

    } else if (wfTask == "Geotechnical Review") {
        inspectionName = "Final by Geotechnical";

    } else if (wfTask == "Additional Review") {
        inspectionName = "Final Additional";

    } else if (wfTask == "Water Review") {
        inspectionName = "Final by Water District";

    } else if (wfTask == "Sewer Review") {
        inspectionName = "Final by Sewer District";

    } else if (wfTask == "Waste Management Review") {
        inspectionName = "Final by Waste Management";

    } else {
        return;
    }

    var inspDateStr = dateAdd(null, 29);
    inspDateStr = nextWorkDay(inspDateStr);
    var inspDate = Avo_GetDateFromAccelaDateString(inspDateStr);
    var today = Avo_GetToday();
    var days = dateDiffDays(today, inspDate);
    Avo_LogDebug("Scheduling inspection in " + days + " days (first available workday)", 2);	//debug
    scheduleInspection(inspectionName, days);
})();


function dateDiffDays(date1, date2) {
    Avo_LogDebug("dateDiffDays - date1(" + date1 + ")", 2);	//debug
    Avo_LogDebug("dateDiffDays - date2(" + date2 + ")", 2);	//debug
    var diffInTime = date2.getTime() - date1.getTime();
    var diffInDays = diffInTime / (1000 * 3600 * 24);
    return diffInDays;
}