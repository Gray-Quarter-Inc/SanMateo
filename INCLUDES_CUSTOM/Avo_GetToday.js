function Avo_GetToday() {
    Avo_LogDebug("Avo_GetToday()", 1);

    var today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    return today;
}
/*******************************************************
| Script/Function: Avo_GetTotalFees([feeCodeIgnoreList], [recordId])
| Created by: Mike Buell
| Created on: 20Oct20
| Usage: Get the total fee amount on record, ignoring those fee codes in feeCodeIngoreList separated by commas
| Modified by: ()
*********************************************************/
