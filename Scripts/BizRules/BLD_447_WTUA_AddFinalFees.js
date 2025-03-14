/*******************************************************
| Script/Function: addFinalFees(ID447)
| Created by: Nicolaj Bunting
| Created on: 2Nov22
| Usage: When task "Plan Preparation for Issuance" status set to "Final Fees Assessment" add and invoice
| fee(s) from schedule "BLD_GEN"
| If ASI "Occupancy Change" is checked And "Addition" Is Not checked and "Alteration" is Not checked Then
| "BLD_010" with quantity of 330
| Else
| If ASI "Addition" is checked Then "BLD_047" using std choice
| "Building_Commercial_Add_RoadMitigationFee" with quantity of
| If ASI "Residential" is checked and "Residential Square Footage" > 0 Then "Residential Square Footage"
| * "Residential" in std choice
| + If ASI "Industrial" is checked and "Industrial Square Footage" > 0 Then "Industrial Square Footage" *
| If "F - Factory", "H - Hazard" in subgroup "PROPOSED OCCUPANCY TYPE?" is checked Then "Industrial" in
| std choice Else "Industrial Retail/Office"
| + If ASI "Warehouses" is checked and "Warehouses Square Footage" > 0 Then "Warehouses Square Footage"
| * "Warehouses" in std choice
| "BLD_067" with quantity of ASI "What is the construction valuation including labor and materials?"
| / 25000 rounded up to the nearest dollar
| "BLD_045" with quantity of ASI "What is the construction valuation including labor and materials?"
| * "Strong Motion Fee" in std choice "Building_Fee_Multipliers"
| For all keys in std choice "Building_Commerical_Add_ProjectFee" If ASI is checked Then
| Additions Fee quantity is 0.5 * ASI fieldname + " Square Footage" value * first comma separated value
| of fieldname in std choice "Building_Commerical_Add_ProjectFee", second value is fee code
| For all keys in std choice "Building_Commerical_Alt_ProjectFee" If ASI is checked Then
| Alterations Fee quantity is fieldname + " Valuation" value in std choice "Building_Permit_Valuation"
| fee code is fieldname in std choice "Building_Commerical_Alt_ProjectFee",
| If sum of Additions and Alterations fees < 330 and > 0 Then "BLD_010" with quantity 330 instead of
| "BLD_112" - "BLD_126",
| Call ID16
| Modified by: ()
*********************************************************/
(function () {
    var feeSched = "BLD_GEN";
    var feeResult, feeCode, quantity;

    var addFeeStdChoice = "Building_Commerical_Add_ProjectFee";

    var occChange = String(AInfo["Occupancy Change"]);
    Avo_LogDebug("Occupancy Change(" + occChange + ")", 2); //debug

    var add = String(AInfo["Addition"]);
    Avo_LogDebug("Addition(" + add + ")", 2); //debug

    var alt = String(AInfo["Alteration"]);
    Avo_LogDebug("Alteration(" + alt + ")", 2); //debug

    if (occChange == "CHECKED" && add != "CHECKED" && alt != "CHECKED") {
        // Building Permit Fee
        feeCode = "BLD_010";
        quantity = 381;
        feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, "Y");
        if (feeResult) {
            Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
        }
        else if (feeResult == null) {
            Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
        } else {
            Avo_LogDebug("Failed to add fee " + feeCode, 1);
        }

        return;
    }

    // Road Mitigation Fee
    if (add == "CHECKED") {
        var roadMitStdChoice = "Building_Commercial_Add_RoadMitigationFee";
        quantity = 0;

        var allFieldNames = ["Residential", "Industrial", "Warehouses"];
        for (var i in allFieldNames) {
            var fieldName = allFieldNames[i];
            var checkbox = String(AInfo[fieldName]);
            Avo_LogDebug(fieldName + "(" + checkbox + ")", 2);    //debug

            if (checkbox != "CHECKED") {
                continue;
            }

            var sqFt = parseFloat(AInfo[fieldName + " Square Footage"]);
            Avo_LogDebug(fieldName + " Sq. Ft.(" + sqFt + ")", 2);    //debug

            if (isNaN(sqFt) == true || sqFt <= 0) {
                continue;
            }

            var key = fieldName;

            if (fieldName == "Industrial") {
                useAppSpecificGroupName = true;

                var subgroupName = "PROPOSED OCCUPANCY TYPE?";

                var factory = String(getAppSpecific(subgroupName + ".F - Factory", capId));
                Avo_LogDebug("Factory(" + factory + ")", 2);    //debug

                var hazard = String(getAppSpecific(subgroupName + ".H - Hazard", capId));
                Avo_LogDebug("Hazard(" + hazard + ")", 2);    //debug

                useAppSpecificGroupName = false;

                if (factory != "CHECKED" && hazard != "CHECKED") {
                    key += " Retail/Office";
                }
            }

            var multiplier = parseFloat(lookup(roadMitStdChoice, key));

            quantity += multiplier * sqFt;
        }

        quantity = quantity.toFixed(2);

        if (quantity > 0) {
            feeCode = "BLD_047";
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
    }

    var conVal = parseFloat(AInfo["What is the construction valuation including labor and materials?"]);
    Avo_LogDebug("Con Val($" + conVal + ")", 2);    //debug

    if (isNaN(conVal) == true) {
        Avo_LogDebug("Construction valuation is not a valid number", 1);
        return;
    }

    // CA Bld Std Fee
    feeCode = "BLD_067";
    quantity = Math.ceil(conVal / 25000);
    feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, "Y");
    if (feeResult) {
        Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
    }
    else if (feeResult == null) {
        Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
    } else {
        Avo_LogDebug("Failed to add fee " + feeCode, 1);
    }

    // Strong-Motion Instrumentation Program Fee
    var feeAmount = parseFloat(lookup("Building_Fee_Multipliers", "Strong Motion Fee"));

    if (isNaN(feeAmount) != true) {
        feeCode = "BLD_045";
        quantity = Math.round(conVal * feeAmount * 100) / 100;  // Round to nearest cent
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

    //Mid-Coast Park Fee
    /*var assessableSpace = parseFloat(AInfo["Assessable Space"]);
    Avo_LogDebug("Assessable Space(" + assessableSpace + ")", 2); //debug

    if (isNaN(assessableSpace) == true) {
        assessableSpace = 0;
        Avo_LogDebug("Warning: Value of 'Assessable Space' ASI is not a number!", 2);
    }

    var parcelObj = new Object();
    loadParcelAttributes(parcelObj);

    var zoningAttrName = "ParcelAttribute.LPC MIDCOAST PROJECT AREA";
    var zoningAttr = String(parcelObj[zoningAttrName]);
    Avo_LogDebug(zoningAttrName + "(" + zoningAttr + ")", 2); //debug

    if (zoningAttr == "YES" && assessableSpace > 0) {
        feeCode = "BLD_081";
        quantity = assessableSpace;
        feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, "Y");
        if (feeResult) {
            Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
        }
        else if (feeResult == null) {
            Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
        } else {
            Avo_LogDebug("Failed to add fee " + feeCode, 1);
        }
    }*/

    // Add Fee
    var addFeeTotal = addAddFee(addFeeStdChoice, feeSched, false);
    Avo_LogDebug("Add Fees($" + addFeeTotal + ")", 2);  //debug

    // Alt Fee
    var altFeeTotal = addAltFee(feeSched, false);
    Avo_LogDebug("Alt Fees($" + altFeeTotal + ")", 2);  //debug

    var totalFees = addFeeTotal + altFeeTotal;
    Avo_LogDebug("Total Fees($" + totalFees + ")", 2);  //debug

    if (totalFees < 381 && totalFees > 0) {
        feeCode = "BLD_010";
        quantity = 381;
        feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, "Y");
        if (feeResult) {
            Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
        }
        else if (feeResult == null) {
            Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
        } else {
            Avo_LogDebug("Failed to add fee " + feeCode, 1);
        }

        //Script 16 Residential Percentage Fees
        include("BLD_016_ASA_ResPercentageFees");

        return;
    }

    addAddFee(addFeeStdChoice, feeSched, true);
    addAltFee(feeSched, true);

    //Script 16 Residential Percentage Fees
    include("BLD_016_ASA_ResPercentageFees");
})();

function addAddFee(stdChoice, feeSched, isAddingFees) {
    var feeTotal = 0;

    var result = aa.bizDomain.getBizDomain(stdChoice);
    if (result.getSuccess() !== true) {
        Avo_LogDebug("Failed to retrieve values from standard choice " + stdChoice + ". "
            + result.errorType + ": " + result.errorMessage, 1);
        return feeTotal;
    }

    var stdChoiceArray = result.getOutput().toArray();
    for (var i in stdChoiceArray) {
        var fieldName = String(stdChoiceArray[i].bizdomainValue);

        var checkbox = String(AInfo[fieldName]);
        Avo_LogDebug(fieldName + "(" + checkbox + ")", 2);  //debug

        if (checkbox != "CHECKED") {
            continue;
        }

        var sqFt = parseFloat(AInfo[fieldName + " Square Footage"]);
        Avo_LogDebug(fieldName + " Sq. Ft.(" + sqFt + ")", 2);    //debug

        if (isNaN(sqFt) == true || sqFt <= 0) {
            continue;
        }

        var feeInfo = String(stdChoiceArray[i].description).split(",");
        var feeAmount = parseFloat(feeInfo[0]);

        if (isNaN(feeAmount) == true) {
            Avo_LogDebug('Fee amount for "' + fieldName + '" is not a valid number', 1);
            continue;
        }

        var quantity = 0.5 * sqFt * feeAmount;

        feeTotal += quantity;

        if (isAddingFees != true) {
            continue;
        }

        var feeCode = feeInfo[1];

        var feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, "Y");
        if (feeResult) {
            Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
        }
        else if (feeResult == null) {
            Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
        } else {
            Avo_LogDebug("Failed to add fee " + feeCode, 1);
        }
    }

    return feeTotal;
}

function addAltFee(feeSched, isAddingFees) {
    var feeTotal = 0;

    var altFeeStdChoice = "Building_Commerical_Alt_ProjectFee";
    var result = aa.bizDomain.getBizDomain(altFeeStdChoice);
    if (result.getSuccess() !== true) {
        Avo_LogDebug("Failed to retrieve values from standard choice " + altFeeStdChoice + ". "
            + result.errorType + ": " + result.errorMessage, 1);
        return feeTotal;
    }

    var stdChoiceArray = result.getOutput().toArray();
    for (var i in stdChoiceArray) {
        var fieldName = String(stdChoiceArray[i].bizdomainValue);

        var checkbox = String(AInfo[fieldName]);
        Avo_LogDebug(fieldName + "(" + checkbox + ")", 2);  //debug

        if (checkbox != "CHECKED") {
            continue;
        }

        var valuation = parseFloat(AInfo[fieldName + " Valuation"]);
        Avo_LogDebug("Valuation($" + valuation + ")", 2);   //debug

        if (isNaN(valuation) == true) {
            Avo_LogDebug("Invalid " + fieldName + " valuation", 1);
            continue;
        }

        var amount = getValuationAmount(valuation);
        if (amount <= 0) {
            Avo_LogDebug("Failed to get valid valuation amount", 1);
            continue;
        }

        quantity = amount;

        if (quantity <= 0 || isNaN(quantity) == true) {
            return feeTotal;
        }

        feeTotal += quantity;

        if (isAddingFees != true) {
            continue;
        }

        feeCode = String(stdChoiceArray[i].description);

        var feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, "Y");
        if (feeResult) {
            Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
        }
        else if (feeResult == null) {
            Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
        } else {
            Avo_LogDebug("Failed to add fee " + feeCode, 1);
        }
    }

    return feeTotal;
}

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