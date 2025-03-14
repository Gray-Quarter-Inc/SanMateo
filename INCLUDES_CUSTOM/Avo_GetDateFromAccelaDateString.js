function Avo_GetDateFromAccelaDateString(dateStr) {
    dateStr = String(dateStr).trim();
    logDebug("Avo_GetDateFromAccelaDateString(" + dateStr + ")");

    if (!dateStr) {
        Avo_LogDebug("Date string is empty or null", 1);
        return null;
    }

    var dateStr = String(dateStr).trim();
    var dateStr = dateStr.split(" ")[0];

    var year, month, day;

    if (dateStr.indexOf("/") != -1) {
        var dateArr = dateStr.split("/");
        year = dateArr[2];
        month = dateArr[0];
        day = dateArr[1];
    } else if (dateStr.indexOf("-") != -1) {
        var dateArr = dateStr.split("-");
        year = dateArr[0];
        month = dateArr[1];
        day = dateArr[2];
    } else {
        year = dateStr.substring(4, dateStr.length);
        month = dateStr.substring(0, 2);
        day = dateStr.substring(2, 4);
    }

    if (!year) {
        return;
    }
    if (!month) {
        return;
    }
    if (!day) {
        return;
    }

    //Avo_LogDebug("Year(" + year + ")", 2); //debug
    //Avo_LogDebug("Month(" + month + ")", 2);   //debug
    //Avo_LogDebug("Day(" + day + ")", 2);   //debug

    var date = new Date(year, month - 1, day);
    return date;
}
/*******************************************************
| Script/Function: Avo_GetToday()
| Created by: Nicolaj Bunting
| Usage: get a javascript date object for today's date with time set to midnight
| Modified by: ()
*********************************************************/
