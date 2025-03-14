/*******************************************************
| Script/Function: setExpDate() - (ID75)
| Created by: Nicolaj Bunting
| Created on: 10Nov20
| Usage: On submit set ASI "Expiration Date" to 365 days from today
| Modified by: ()
*********************************************************/
(function () {
    var today = Avo_GetToday();
    var yearFromNow = Avo_GetToday();
    //yearFromNow.setDate(yearFromNow.getDate() + 365);

    var buildingTypeArray = ["Apartment", "Apartment (With attached ADU)", "Townhome", "Townhome (With attached ADU)",
                            "Condominium", "Condominium (With attached ADU)"];

    // ASI field for Building/Residential/Addition/NA
    //var typeOfBuilding = getAppSpecific("What type of residential building is this structure?", capId);
    //Avo_LogDebug("What type of residential building is this structure?(" + typeOfBuilding + ")", 2);    //debug

    // ASI field for Building/Residential/New/NA
    var typeOfStructure = getAppSpecific("What type of residential structure is being constructed?", capId);
    Avo_LogDebug("What type of residential structure is being constructed?(" + typeOfStructure + ")", 2);    //debug
    

    //if (typeOfBuilding && buildingTypeArray.indexOf(String(typeOfBuilding)) != -1) {
    //    // 24 months from now
    //    yearFromNow.setMonth(yearFromNow.getMonth() + 24);
    //} else 
    if (typeOfStructure && buildingTypeArray.indexOf(String(typeOfStructure)) != -1) {
        // 24 months from now
        yearFromNow.setMonth(yearFromNow.getMonth() + 24);
    } else {
        // 12 months from now
        yearFromNow.setMonth(yearFromNow.getMonth() + 12);
    }
    
    // Leap year (Feb 29) check
    if (today.getMonth() == 1 && today.getDate() == 29) {
        // Should be updated to Feb 28 instead of Mar 1
        yearFromNow.setDate(yearFromNow.getDate() - 1);
    }

    var yearFromNowStr = aa.util.formatDate(yearFromNow, "MM/dd/yyyy");
    Avo_LogDebug("12 Months from Now(" + yearFromNowStr + ")", 2);	//debug

    editAppSpecific("Date of Expiration", yearFromNowStr, capId);
    Avo_LogDebug('Set "Date of Expiration" to ' + yearFromNowStr, 1);
})();