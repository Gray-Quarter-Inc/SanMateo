function Avo_LogDebug(debug, importance) {
    //logDebug("Avo_LogDebug(" + debug + ", " + importance.toString() + ")");

    var br = "<br>";

    if (arguments.length < 2 || !importance) {
        importance = 2; // default value
    }

    if (isNaN(importance) == true) {
        var message = "Importance must be an integer";
        if (useLogDebug == true) {
            logDebug(message);
        } else {
            aa.print(message + br);
        }
        return;
    }

    if (importance < 0) {
        var message = "Importance can't be negative";
        if (useLogDebug == true) {
            logDebug(message);
        } else {
            aa.print(message + br);
        }
    }

    if (importance > debugLevel) {
        return;
    }

    if (useLogDebug == true) {
        logDebug(debug);
    } else {
        aa.print(debug + br);
    }
}
/*******************************************************
| Script/Function: Avo_NewRevisionCheck()
| Created by: Jei Yang
| Created on: 10Dec21
| Usage: Check if ASI 'Updated Revision ID' is null.
         When the function returns true, this new Revision record has been successfully created and converted to CAP record.
         This is an alternative to CTRCA event which is currently having a timing issue. 
| Modified by: ()
*********************************************************/
