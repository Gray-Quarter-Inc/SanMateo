/*******************************************************
| Script Title: propaneWaterTankSpecificFees(ID276)
| Created by: Tom Grzegorczyk
| Created on: 6May21
| Usage: On ASA If parent is same record type Then add and invoice fee from schedule "BLD_GEN" "BLD_083" Else
|   1) Assess and invoice fee BLD_001 quantity =1
|   2) Assess and Invoice fee BLD_067
|       Calculation as follows:
|       Valuation amount = ASI "What is the construction valuation of this project including labor and materials?"
|       (Valuation amount /$25,000) the minimum fee is $1.0
|       It is $1 per 25,0000 of the valuation amount and fraction there of (always round up to the next dollar value even if it is only 1 cent over)
|       For example: If thevaluation amount is 60,000. (60,000/25,000 = 2.4) rounding up to the next dollar, BLD_067 = $3
|   3) Assess and invoice fee BLD_013 quantity =1
|   4) If toal value  from the ASIs "Cut volume (cubic yds)" and "Fill volume (cubic yds)" is greater than 250,  assess and inovice fee BLD_031 quantity = 191
|   5) Assess and inovice fee BLD_033
|       Calculation as follows:
|       ASI "Amount of new or replaced impervious surface (sq ft)" = 0 to 749 (integer no decimal) quantity = 191
|       ASI "Amount of new or replaced impervious surface (sq ft)" >= 750(integer no decimal) quantity = 572
|   6) Assess and invoice fee BLD_010 (Permit Fee)
|       The Project Valuation is tracked by ASI "What is the construction valuation of this project including labor and materials?"
|       Please refer to valuation table below for fee quantity
|       for example of the ASI "What is the construction valuation of this project including labor and materials?" = 1250, fee amount (fee quantity) = $330
|   Project valuation	    |   Permit Fee
|   ____________________________________________________________________________________________________________________________________________________
|   $0 - $1,000             |   $191.00
|   $1,001 - $5,000         |	$381.00
|   $5,001 - $10,000        |	$572.00
|   $10,001 - $20,000       |	$1,143.00
|   $20,001 - $30,000       |	$1,525.00
|   $30,001 - $40.000       |	$1,906.00
|   $40,001 - $50,000       |	$2,287.00
|   $50,001 - $75,000       |	$3.430.00
|   $75,001 - $100,000      |	$4,574.00
|   $100,001 - $500,000     |	$4,574.00 for the first $100,000 of valuation plus $23.00 tor each additional $1,000 of valuation or fraction thereof
|   $500,001 and up	        |   $13,814.00 for the first $500,000 of valuation plus $23.00 tor each additional $1,000 of valuation or fraction thereof
|   ____________________________________________________________________________________________________________________________________________________
|   7) Assess and invoice fee BLD_011
|       Calculation as follows
|       Fee amount (fee quantity) = (Permit fee)*0.65
|       The valuation field of the permit is ASI "What is the construction valuation of this project including labor and materials?"
|       Please refer to valuation table below for fee quantity
|       for example of the ASI "What is the construction valuation of this project including labor and materials?" = 1250, fee amount (fee quantity) = 
| 330*0.65 = $214.5
|   Project valuation	    |   Permit Fee
|   ____________________________________________________________________________________________________________________________________________________
|   $0 - $1,000             |   $191.00
|   $1,001 - $5,000         |	$381.00
|   $5,001 - $10,000        |	$572.00
|   $10,001 - $20,000       |	$1,143.00
|   $20,001 - $30,000       |	$1,525.00
|   $30,001 - $40.000       |	$1,906.00
|   $40,001 - $50,000       |	$2,287.00
|   $50,001 - $75,000       |	$3.430.00
|   $75,001 - $100,000      |	$4,574.00
|   $100,001 - $500,000     |	$4,574.00 for the first $100,000 of valuation plus $23.00 tor each additional $1,000 of valuation or fraction thereof
|   $500,001 and up	        |   $13,814.00 for the first $500,000 of valuation plus $23.00 tor each additional $1,000 of valuation or fraction thereof
|   ____________________________________________________________________________________________________________________________________________________
|
| Modified by: (GQ 12-26-2024 11008)
*********************************************************/
(function () {
    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeCode, quantity;

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

    eval(getScriptText("BLD_FeeCalculationFunctions"));

    // Assess and invoice fee BLD_001
    feeCode = 'BLD_001';
    quantity = 1;
    assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);
    quantity = 0;

    var constrValAmount = Number(AInfo["What is the construction valuation of this project including labor and materials?"]);
    Avo_LogDebug("'What is the construction valuation of this project including labor and materials?': " + constrValAmount, 2); //debug

    //Assess and Invoice fee BLD_067 
    feeCode = 'BLD_067';
    quantity = calcFee_BLD_067(constrValAmount);
    assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);
    quantity = 0;

    //Assess and invoice fee BLD_013 quantity =1
    feeCode = 'BLD_013';
    quantity = 1;
    assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);
    quantity = 0;


    var cutVolume = Number(AInfo["Cut volume (cubic yds)"]);
    Avo_LogDebug("'Cut volume (cubic yds)': " + cutVolume, 2); //debug
    var fillVolume = Number(AInfo["Fill volume (cubic yds)"]);
    Avo_LogDebug("'Fill volume (cubic yds)': " + fillVolume, 2); //debug

    // Assess and invoice fee BLD_031
    feeCode = 'BLD_031';
    var totalVolume = cutVolume + fillVolume;
    if (totalVolume > 250) {
        quantity = 191;
        assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);
        quantity = 0;
    }

    var newOrReplacedSurface = Number(AInfo["Amount of new or replaced impervious surface (sq ft)"]);
    Avo_LogDebug("'Amount of new or replaced impervious surface (sq ft)': " + newOrReplacedSurface, 2); //debug
    // Assess and invoice fee BLD_033
    feeCode = 'BLD_033';
    var surface = newOrReplacedSurface;
    if (surface >= 0 && surface < 749) {
        quantity = 191;
    } else if (surface >= 750) {
        quantity = 572
    } else {
        quantity = 0;
    }
    assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);
    quantity = 0;


    var constrVal = Number(AInfo["What is the construction valuation of this project including labor and materials?"]);
    Avo_LogDebug("'What is the construction valuation of this project including labor and materials?': " + constrVal, 2); //debug

    // Assess and invoice fee BLD_010 (Permit Fee)
    feeCode = 'BLD_010';
    quantity = calcPermitFee_BLD_010_BLD_011(constrVal);
    assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);
    quantity = 0;

    // Assess and invoice fee BLD_011
    feeCode = 'BLD_011';
    var fee = 0;
    fee = calcPermitFee_BLD_010_BLD_011(constrVal);
    quantity = fee * 0.65;
    assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);
    quantity = 0;
})();