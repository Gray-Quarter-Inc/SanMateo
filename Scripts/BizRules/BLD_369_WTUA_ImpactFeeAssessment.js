/*******************************************************
| Script/Function: accStruReviewFee() - (ID343)
| Created by: Jei Yang
| Created on: 27Aug21
| Usage: If workflow task "Plan Preparation for Issuance" is set to the status of "Final Fees Assessment"
AND ASI "Impact Fee" == "Required" AND ASI "Is affordable housing included in this project?" =="No"

| Modified by: ()
*********************************************************/
(function () {
    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeResult, feeCode, quantity;
    var quantity = 0;
    eval(getScriptText("BLD_FeeCalculationFunctions"));

    //BLD_084
    var impactFee = String(AInfo["Impact fee"]);
    Avo_LogDebug("Impact fee(" + impactFee + ")", 2); //debug
    var affordableHousing = String(AInfo["Is affordable housing included in this project?"]);
    Avo_LogDebug("Is affordable housing included in this project?(" + affordableHousing + ")", 2); //debug

    if (impactFee.toUpperCase() == "REQUIRED" && affordableHousing.toUpperCase() == "NO") {
        feeCode = "BLD_084";
        quantity = 0;

        //sqft1
        var sqft1 = parseInt(AInfo["Sq Ft 1"]);
        Avo_LogDebug("Sq Ft 1(" + sqft1 + ")", 2); //debug
        if (!isNaN(sqft1) && sqft1 > 2500) {
            quantity += 5 * (sqft1 - 2500);
        }
        //sqft2
        var sqft2 = parseInt(AInfo["Sq Ft 2"]);
        Avo_LogDebug("Sq Ft 2(" + sqft2 + ")", 2); //debug
        if (!isNaN(sqft2)) {
            if (sqft2 <= 2500) {
                quantity += sqft2 * 5;
            } else {
                quantity += (2500 * 5) + 12.5 * (sqft2 - 2500);
            }
        }
        //sqft3
        var sqft3 = parseInt(AInfo["Sq Ft 3"]);
        Avo_LogDebug("Sq Ft 3(" + sqft3 + ")", 2); //debug
        if (!isNaN(sqft3)) {
            quantity += 15 * sqft3;
        }
        //sqft4
        var sqft4 = parseInt(AInfo["Sq Ft 4"]);
        Avo_LogDebug("Sq Ft 4(" + sqft4 + ")", 2); //debug
        if (!isNaN(sqft4)) {
            if (sqft4 <= 2500) {
                quantity += sqft4 * 5;
            } else {
                quantity += (2500 * 5) + 12.5 * (sqft4 - 2500);
            }
        }
        //sqft5
        var sqft5 = parseInt(AInfo["Sq Ft 5"]);
        Avo_LogDebug("Sq Ft 5(" + sqft5 + ")", 2); //debug
        if (!isNaN(sqft5)) {
            quantity += 10 * sqft5;
        }
        //sqft6
        var sqft6 = parseInt(AInfo["Sq Ft 6"]);
        Avo_LogDebug("Sq Ft 6(" + sqft6 + ")", 2); //debug
        if (!isNaN(sqft6)) {
            if (sqft6 <= 3500) {
                //quantity += 0;
            } else {
                quantity += 10 * sqft6;
            }
        }
        //sqft7
        var sqft7 = parseInt(AInfo["Sq Ft 7"]);
        Avo_LogDebug("Sq Ft 7(" + sqft7 + ")", 2); //debug
        if (!isNaN(sqft7)) {
            if (sqft7 <= 3500) {
                //quantity += 0;
            } else {
                quantity += 25 * sqft7;
            }
        }
        //sqft8
        var sqft8 = parseInt(AInfo["Sq Ft 8"]);
        Avo_LogDebug("Sq Ft 8(" + sqft8 + ")", 2); //debug
        if (!isNaN(sqft8)) {
            if (sqft8 <= 3500) {
                //quantity += 0;
            } else {
                quantity += 5 * sqft8;
            }
        }

    }

    assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);

})();