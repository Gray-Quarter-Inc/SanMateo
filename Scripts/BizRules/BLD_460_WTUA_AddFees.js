/*******************************************************
| Script/Function: addFees(ID460)
| Created by: Nicolaj Bunting
| Created on: 4Apr23
| Usage: When task "Application Submittal" status set to "Fee Assessment" add and invoice fees from
| schedule "BLD_GEN"
| "BLD_013" with quantity of 4.88,
| If ASI "Impervious Surface" >= 150 Then "BLD_069" with quantity of If "Impervious Surface" >= 750 Then
| 572 Else 191,
| For all keys in std choice "Building_Commerical_Add_PlanCheckFee" If ASI is checked Then add and
| invoice fee with quantity of 0.5 * ASI fieldname + " Square Footage" value * first comma separated
| value of fieldname in std choice "Building_Commerical_Add_PlanCheckFee", second value is fee code
| Modified by: ()
*********************************************************/
(function () {
    var feeSched = "BLD_GEN";
    var feeCode, quantity, feeResult;

    // Planning Review Fee
    feeCode = "BLD_013";
    quantity = 4.88;
    feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, "Y");
    if (feeResult) {
        Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
    }
    else if (feeResult == null) {
        Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
    } else {
        Avo_LogDebug("Failed to add fee " + feeCode, 1);
    }

    // Civil & Drainage Fee
    var impervSurf = parseFloat(AInfo["Impervious Surface"]);
    Avo_LogDebug("Impervious Surface(" + impervSurf + ")", 2);  //debug

    if (isNaN(impervSurf) != true && impervSurf >= 150) {
        feeCode = "BLD_069";
        quantity = 191;

        if (impervSurf >= 750) {
            quantity = 572;
        }

        feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, "Y");
        if (feeResult) {
            Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
        }
        else if (feeResult == null) {
            Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
        } else {
            Avo_LogDebug("Failed to add fee " + feeCode, 1);
        }
    }

    // Plan Check Fees
    var stdChoiceArray = new Array();

    var stdChoice = "Building_Commerical_Add_PlanCheckFee";
    var result = aa.bizDomain.getBizDomain(stdChoice);
    if (result.getSuccess() !== true) {
        Avo_LogDebug("Failed to retrieve values from standard choice " + stdChoice + ". "
            + result.errorType + ": " + result.errorMessage, 1);
    } else {
        stdChoiceArray = result.getOutput().toArray();
    }

    var subGroup = "ADDITION PROJECT TYPES";
    for (var i in stdChoiceArray) {
        var fieldName = String(stdChoiceArray[i].bizdomainValue);

        var checkbox = String(AInfo[fieldName]);
        Avo_LogDebug(fieldName + "(" + checkbox + ")", 2);  //debug

        if (checkbox != "CHECKED") {
            continue;
        }

        var sqFootage = parseFloat(AInfo[fieldName + " Square Footage"]);
        Avo_LogDebug(fieldName + " Sq. Footage(" + sqFootage + ")", 2);   //debug

        if (isNaN(sqFootage) == true || sqFootage <= 0) {
            Avo_LogDebug("Invalid " + fieldName + " sq. footage", 1);
            continue;
        }

        var details = String(stdChoiceArray[i].description).split(",");
        if (details.length < 2) {
            Avo_LogDebug("Plan Check fee details for " + fieldName + " are invalid", 1);
            continue;
        }

        var multiplier = parseFloat(details[0]);
        if (isNaN(multiplier) == true) {
            Avo_LogDebug("Invalid fee multiplier for " + fieldName, 1);
            continue;
        }

        feeCode = details[1];
        quantity = 0.5 * multiplier * sqFootage;
        feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, "Y");
        if (feeResult) {
            Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
        }
        else if (feeResult == null) {
            Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
        } else {
            Avo_LogDebug("Failed to add fee " + feeCode, 1);
        }
    }
})();

function getValuationAmount(valuation) {
    var valStdChoice = "Building_Permit_Valuation";
    const regex = /(.+) to (.+)/g;

    var result = aa.bizDomain.getBizDomain(valStdChoice);
    if (result.getSuccess() !== true) {
        Avo_LogDebug("Failed to retrieve values from standard choice " + valStdChoice + ". "
            + result.errorType + ": " + result.errorMessage, 1);
        return -1;
    }

    var stdChoiceArray = result.getOutput().toArray();
    for (var i = 0; i < stdChoiceArray.length; i++) {
        var range = String(stdChoiceArray[i].bizdomainValue);
        Avo_LogDebug("Range(" + range + ")", 2);    //debug

        regex.lastIndex = 0;

        var match = regex.test(range);
        var min = parseFloat(range.replace(',', ''));
        var max = -1;

        if (match == true) {
            regex.lastIndex = 0;
            match = regex.exec(range);
            min = parseFloat(match[1].replace(',', ''));
            max = parseFloat(match[2].replace(',', ''));
        }

        Avo_LogDebug("Min($" + min + "), Max($" + max + ")", 2);    //debug

        if (valuation < min || (max != -1 && valuation > max)) {
            continue;
        }

        var desc = stdChoiceArray[i].description;
        Avo_LogDebug("Desc(" + desc + ")", 2);   //debug

        var amount = parseFloat(desc);

        if (isNaN(amount) == true || String(desc).indexOf("valuation") != -1) {
            var formula = String(desc).replace('valuation', valuation);
            Avo_LogDebug("Formula(" + formula + ")", 2);    //debug

            amount = parseFloat(eval(formula));
        }

        Avo_LogDebug("Fee Amount($" + amount + ")", 2);  //debug

        return amount;
    }

    return -1;
}