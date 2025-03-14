/*******************************************************
| Script/Function: addValuation(ID345)
| Created by: Nicolaj Bunting
| Created on: 23Jun21
| Usage: On submit If ASI "What is the construction valuation for this project including labor and materials?" has value
| Then add valuation where occupancy is "Manual Valuation", unit type is "NA", unit amount is ASI value, unit cost is 1
| Modified by: Jei Yang (24Jan22)
|               Add entry to the ASIT BLD_VAL subgroup VALUATION HISTORY
|               Valuation Amount =  "What is the construction valuation for this project including labor and materials?"
|               Valuation Update Date = "Today's date"
|               Revision Record ID = Record ID
*********************************************************/
(function () {
    var val = getAppSpecific("What is the construction valuation for this project including labor and materials?", capId);
    Avo_LogDebug("Valuation($" + val + ")", 2); //debug

    if (!val) {
        return;
    }

    var valNum = parseFloat(val);
    if (isNaN(valNum) == true) {
        return;
    }

    var bCalcValuatnScriptModel = aa.finance.createBCalcValuatnScriptModel();

    bCalcValuatnScriptModel.useTyp = "Manual Valuation";
    bCalcValuatnScriptModel.conTyp = "NA";
    bCalcValuatnScriptModel.unitValue = valNum;
    bCalcValuatnScriptModel.bCalcValuatn.unitCost = 1;

    bCalcValuatnScriptModel.auditID = currentUserID;
    bCalcValuatnScriptModel.capID = capId;

    var result = aa.finance.createBCalcValuatn(bCalcValuatnScriptModel);
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to add valuation. " + result.errorType + ": " + result.errorMessage, 1);
        return;
    }

    Avo_LogDebug("Added valuation of $" + valNum, 1);



    var tableName = "VALUATION HISTORY";
    var altId = aa.cap.getCap(capId).getOutput().capModel.altID;

    // Add a new row to the parent record's ASIT
    var rowToAdd = new Object();
    rowToAdd["Valuation Amount"] = String(valNum);
    rowToAdd["Valuation Update Date"] = aa.util.formatDate(new Date(), "MM/dd/yyyy");
    rowToAdd["Revision Record ID"] = altId;

    var success = addToASITable(tableName, rowToAdd, capId);
    if (success === false) {
        Avo_LogDebug('Failed to add new row to "' + tableName + '" table', 1);
        return;
    }

    Avo_LogDebug('Added new row to "' + tableName + '" table', 1);
})();