/*******************************************************
| Script/Function: resLandscapingValuationFees() - (ID86)
| Created by: Jei Yang
| Created on: 13Nov20
| Usage: Assess and Invoice fee BLD_010 from fee schedule BLD_GEN.
|        The valuation is tracked by ASI "Estimated cost of work".
| Modified by: ()
*********************************************************/
(function () {
    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeResult, feeCode, quantity;

    feeCode = "BLD_028";
    quantity = 191;

    var costOfWork = parseFloat(getAppSpecific("Estimated cost of work", capId));
    Avo_LogDebug("Estimated cost of work(" + costOfWork + ")", 2);

    if (isNaN(costOfWork) == true || costOfWork <= 0) {
        return;
    }

    if (costOfWork > 1000 && costOfWork <= 5000) {
        quantity = 381;
    } else if (costOfWork > 5000 && costOfWork <= 10000) {
        quantity = 572;
    } else if (costOfWork > 10000 && costOfWork <= 20000) {
        quantity = 1143;
    } else if (costOfWork > 20000 && costOfWork <= 30000) {
        quantity = 1525;
    }else if (costOfWork > 30000 && costOfWork <= 40000) {
        quantity = 1906;
    } else if (costOfWork > 40000 && costOfWork <= 50000) {
        quantity = 2287;
    }  else if (costOfWork > 50000 && costOfWork <= 75000) {
        quantity = 3430;
    } else if (costOfWork > 75000 && costOfWork <= 100000) {
        quantity = 4574;
    } else if (costOfWork > 100000 && costOfWork < 500000) {
        //$4574 plus $23 for each additional 1,000 or fraction thereof 
        quantity = 4574 + 23 * Math.ceil((costOfWork - 100001) / 1000);
    } else if (costOfWork >= 500000) {
        //$13,814 plus $23 for each additional 1,000 or fraction thereof
        quantity = 13814 + 23 * Math.ceil((costOfWork - 500000) / 1000);
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