function evaluateResult(valueToSet, attributeName) {
    strValueToDisplay = "NA";

    if (valueToSet.length == 1) {
        strValueToDisplay = valueToSet[0][attributeName];
    }
    else if (valueToSet.length > 1) {
        strValueToDisplay = "";

        if (attributeName == "Shape_Area") {
            strValueToDisplay = Math.round(valueToSet[0][attributeName]);
        } else {
            for (var x in valueToSet) {
                //if (strValueToDisplay.indexOf(valueToSet[x][attributeName]) == -1) {
                strValueToDisplay = strValueToDisplay + valueToSet[x][attributeName] + " | ";
                //}
            }

            strValueToDisplay = strValueToDisplay.substring(0, strValueToDisplay.length - 3)
        }
    }

    return strValueToDisplay;
}
