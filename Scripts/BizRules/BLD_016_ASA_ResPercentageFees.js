/*******************************************************
| Script/Function: resPercentageFees() - (ID16)
| Created by: Nicolaj Bunting
| Created on: 21Oct20
| Usage: On submit If ASI "Public Agency Project" is Not checked And event is ASA Else CTRCA Then add
| and invoice fees from schedule "BLD_GEN": "BLD_039", "BLD_040", "BLD_043" with quantity of 1
| Modified by: (Tom Grzegorczyk on 12May22 - added PW066,B047 to fee ignore list (Ticket 14844))
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
    var feeCode, quantity;
    eval(getScriptText("BLD_FeeCalculationFunctions"));

    // Percentage fees
    quantity = 0;
    var allFeeCodesToIngore = "BLD_045,BLD_067,BLD_047,BLD_081,BLD_039,BLD_040,BLD_043,BLD_082,\
BLD_084,PW066,B047,BLD_133,BLD_134,BLD_135,BLD_136,BLD_137,BLD_138,BLD_139,BLD_140,BLD_144,BLD_153";
    
    quantity = Avo_GetTotalFees(allFeeCodesToIngore, capId);
    Avo_LogDebug("Total fees excluding fee codes '" + allFeeCodesToIngore
        + "' ($" + quantity + ")", 2);  //debug

    feeCode = "BLD_039";
    assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);
    
    feeCode = "BLD_040";
    assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);

    feeCode = "BLD_043";
    assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);
})();