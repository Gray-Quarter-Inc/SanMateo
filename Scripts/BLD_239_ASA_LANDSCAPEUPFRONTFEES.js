//BLD_239_ASA_LandscapeUpfrontFees
/*******************************************************
| Script/Function: landscpeUpfrontFees() - (ID239)
| Created by: Jei Yang
| Created on: 16Mar21
| Usage: On ASA add and invoice fees from schedule "BLD_GEN": BLD_057, 045, 
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
    var feeResult, feeCode, quantity;
    var quantity = 1;

    //BLD_057
    feeCode = "BLD_057";

    feeResult = updateFee(feeCode, feeSched, "FINAL", quantity, invoiceFee);
    if (feeResult) {
        Avo_LogDebug("Fee " + feeCode + " has been added with quantity of " + quantity, 1);
    }
    else if (feeResult == null) {
        Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of " + quantity, 1);
    } else {
        Avo_LogDebug("Failed to add fee " + feeCode, 1);
    }
    
    //BLD_042 as 3% of the total fees in the list
    //include("BLD_017_ASA_ResCreditCardFee");
})();
