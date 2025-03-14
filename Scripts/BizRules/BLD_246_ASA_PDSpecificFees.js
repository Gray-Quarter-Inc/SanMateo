/*******************************************************
| Script/Function: pdSpecificFees() - (ID246)
| Created by: Jei Yang
| Created on: 30Mar21
| Usage: On ASA add and invoice fees from schedule "BLD_GEN": If parent is same record type Then "BLD_083" Else BLD_001, BLD_028, 
| BLD_002, BLD_031, BLD_033.
| Modified by: (GQ 12/26/2024 11008)
*********************************************************/
(function () {
    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeResult, feeCode, quantity;
    var quantity = 1;

    // Get parent
    if (!parentCapId) {
        parentCapId = getParent();
    }

    // Get parent record type
    if (parentCapId) {
        var parentCap = aa.cap.getCap(parentCapId).getOutput();
        var parentAltId = parentCap.capModel.altID;
        Avo_LogDebug("Parent(" + parentAltId + ")", 2);  //debug

        var capTypeModel = parentCap.capType;
        var recordType = String(capTypeModel);
        Avo_LogDebug("Parent Record Type(" + recordType + ")", 2); //debug

        if (recordType == appTypeString) {
            feeCode = "BLD_083";
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

            return;
        }
    }

    // Application fee (BLD_001)
    feeCode = "BLD_001";
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


    //BLD_028
    feeCode = "BLD_028";
    quantity = 0;
    var minorDemolition = getAppSpecific("Minor demolition", capId);
    Avo_LogDebug("Minor demolition(" + minorDemolition + ")", 2);
    var majorDemolition = getAppSpecific("Major demolition", capId);
    Avo_LogDebug("Major demolition(" + majorDemolition + ")", 2);
    var poolDemolition = getAppSpecific("Pool demolition", capId);
    Avo_LogDebug("Pool demolition(" + poolDemolition + ")", 2);

    if (minorDemolition && minorDemolition.toUpperCase() == "CHECKED") {
        quantity = 191;
    } else if (majorDemolition && majorDemolition.toUpperCase() == "CHECKED") {
        var isResidentialOrCommericial = String(getAppSpecific("Is this a residential, mixed use, or commercial project?", capId))
            .toLowerCase();
        Avo_LogDebug("Is this a residential, mixed use, or commercial project?(" + isResidentialOrCommericial + ")", 2);

        if (isResidentialOrCommericial == "mixed use" || isResidentialOrCommericial == "commercial / agricultural") {
            quantity = 347;
        } else if (isResidentialOrCommericial == "residential (single family)" || isResidentialOrCommericial ==
            "residential (multi family)") {
            quantity = 347;
        }
    } else if (poolDemolition && poolDemolition.toUpperCase() == "CHECKED") {
        var privateOrPublic = String(getAppSpecific("Is this pool or spa for private or public use?", capId)).toLowerCase();
        Avo_LogDebug("Is this pool or spa for private or public use?(" + privateOrPublic + ")", 2);

        if (privateOrPublic == "private") {
            quantity = 347;
        } else if (privateOrPublic == "public") {
            quantity = 347;
        }
    }


    if (quantity > 0) {
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

    //BLD_031
    quantity = 0;
    feeCode = "BLD_031";

    if (poolDemolition && poolDemolition.toUpperCase() == "CHECKED") {
        var typeOfFill = String(getAppSpecific("Type of fill being used to infill the pool?", capId));
        Avo_LogDebug("Type of fill being used to infill the pool?(" + typeOfFill + ")", 2);
        var cutVolumn = parseFloat(String(AInfo["Cut volume (cubic yds)"]));
        Avo_LogDebug("Cut volume (cubic yds)(" + cutVolumn + ")", 2); //debug
        var fillVolumn = parseFloat(String(AInfo["Fill volume (cubic yds)"]));
        Avo_LogDebug("Fill volume (cubic yds)(" + fillVolumn + ")", 2); //debug

        if (typeOfFill == "Engineered") {
            quantity = 191;
        }
        if (!isNaN(cutVolumn) && !isNaN(fillVolumn) && (cutVolumn + fillVolumn) > 250) {
            quantity = 191;
        }
    }

    if (quantity > 0) {
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

    //BLD_033 and BLD_069
    if (poolDemolition && poolDemolition.toUpperCase() == "CHECKED") {
        quantity = 191;
        feeCode = "BLD_033";
        feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
        if (feeResult) {
            Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
        }
        else if (feeResult == null) {
            Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
        } else {
            Avo_LogDebug("Failed to add fee " + feeCode, 1);
        }

        /*
        quantity = 1;
        feeCode = "BLD_069";
        feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
        if (feeResult) {
            Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
        }
        else if (feeResult == null) {
            Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
        } else {
            Avo_LogDebug("Failed to add fee " + feeCode, 1);
        }
        */
    }

    //BLD_013
    quantity = 1;
    feeCode = "BLD_013";

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