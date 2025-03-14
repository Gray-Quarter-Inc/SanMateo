/*******************************************************
| Script/Function: acaInspectionBalanceDueBlock() - (ID231)
| Created by: Jei Yang
| Created on: 8Mar21
| Usage: On inspection scheduled, block inspection schedule request from ACA with the message "Inspection cannot be scheduled because there is a balance due on the record. The balance due is " + balanceDue + "."
| Modified by: ()
*********************************************************/
(function () {

    cancel = true;
    showMessage = true;
    Avo_LogDebug("acaInspectionBalanceDueBlock", 1);
    comment("Inspection cannot be scheduled because there is a balance due on the record. The balance due is " + balanceDue + ".");
    //comment(debug); //debug
})();