function helperObjectInfo(theObj) {
    logDebug("Object info is - " + theObj.getClass());

    logDebug("The methods are - " + theObj.getClass());
    for (x in theObj) {
        if (typeof (theObj[x]) == "function") {
            logDebug("  " + x);
        }
    }
    logDebug("The properties are - " + theObj.getClass());
    for (x in theObj) {
        if (typeof (theObj[x]) != "function") {
            logDebug("  " + x + " = " + theObj[x]);
        }
    }
}
/*----------------------------------------------------------------------------------------------------/
| doConfigurableScriptActions
| A dummy function to prevent errors
| Created by Jei Yang 02/07/2022
/----------------------------------------------------------------------------------------------------*/
