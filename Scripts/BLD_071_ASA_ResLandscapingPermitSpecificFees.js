/*******************************************************
| Script/Function: resLandscapingPermitSpecificFees() - (ID71)
| Created by: Nicolaj Bunting
| Created on: 6Nov20
| Usage: On ASA add and invoice fees from schedule "BLD_GEN": "BLD_034" with quantity of 1, If ASI "Outdoor Kitchen", "Fire Pit", "Outdoor pizza ovens", 
| "Outdoor fireplaces", "Trellis", "Arbor", "Free standing wall", or "Electric gate" are checked Then "BLD_059" with quantity of checked ASI, "BLD_012" with 
| quantity of 1, If ASI "Retaining wall" is checked Then "BLD_031" with quantity of 1
| Modified by: ()
*********************************************************/
(function () {
    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeResult, feeCode, quantity;

    // feeCode = "BLD_034";
    // quantity = 1;

    // feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
    // if (feeResult) {
    //     Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
    // }
    // else if (feeResult == null) {
    //     Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
    // } else {
    //     Avo_LogDebug("Failed to add fee " + feeCode, 1);
    // }

    var allFieldNames = ["Outdoor Kitchen", "Fire Pit", "Outdoor pizza ovens", "Outdoor fireplaces", "Trellis", "Arbor", "Free standing wall", "Electric gate"];
    quantity = 0;

    for (var i in allFieldNames) {
        var fieldName = allFieldNames[i];

        var value = String(getAppSpecific(fieldName, capId));
        Avo_LogDebug(fieldName + "(" + value + ")", 2);

        if (value.toUpperCase() != "CHECKED") {
            continue;
        }

        quantity++;
    }

    if (quantity > 0) {
        feeCode = "BLD_059";

        feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
        if (feeResult) {
            Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
        }
        else if (feeResult == null) {
            Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
        } else {
            Avo_LogDebug("Failed to add fee " + feeCode, 1);
        }
    }

    feeCode = "BLD_012";
    quantity = 1;

    feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
    if (feeResult) {
        Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
    }
    else if (feeResult == null) {
        Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
    } else {
        Avo_LogDebug("Failed to add fee " + feeCode, 1);
    }

    // Retaining wall
    var retainingWall = String(getAppSpecific("Retaining wall", capId));
    Avo_LogDebug("Retaining Wall(" + retainingWall + ")", 2);

    if (retainingWall.toUpperCase() != "CHECKED") {
        return;
    }

    feeCode = "BLD_031";
    quantity = 1;

    feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
    if (feeResult) {
        Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
    }
    else if (feeResult == null) {
        Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
    } else {
        Avo_LogDebug("Failed to add fee " + feeCode, 1);
    }
})();