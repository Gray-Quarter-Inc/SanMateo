/*******************************************************
| Script/Function: resPlumbPermitSpecificFees() - (ID48)
| Created by: Nicolaj Bunting
| Created on: 27Oct20
| Usage: On ASA add and invoice fees from schedule "BLD_GEN": "BLD_012" with quantity of total checked ASI "Sewer line", "Water line", "Gas line"
| Modified by: ()
*********************************************************/
(function () {

    var pubAgencyProj = String(AInfo["Public Agency Project"]);
    if (controlString == "ApplicationSubmitAfter" && pubAgencyProj == "CHECKED") {
        return;
    }
    if (controlString == "ConvertToRealCapAfter" && pubAgencyProj != "CHECKED") {
        return;
    }

    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeResult, feeCode;
    var quantity = 0;
    var resOrComm = String(AInfo["Residential or Commercial"]);
    Avo_LogDebug("Residential or Commercial(" + resOrComm + ")", 2); //debug

    // Permit fee
    feeCode = "BLD_012";

    var allFieldNames = ["Sewer line", "Water line", "Gas line"];
    for (var i in allFieldNames) {
        var fieldName = allFieldNames[i];

        var value = String(getAppSpecific(fieldName, capId));
        Avo_LogDebug(fieldName + '(' + value + ')', 2); //debug

        if (value.toUpperCase() != "CHECKED") {
            continue;
        }

        quantity++;
    }

    if (quantity == 0) {
        return;
    }

    if (resOrComm.toUpperCase() == "COMMERCIAL") {
        quantity *= 381;
    } else {
        quantity *= 191;
    }

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