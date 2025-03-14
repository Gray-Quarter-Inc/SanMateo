/*
Script Name: PaymentReceiveBefore.js
Converted from Std Choice: PaymentReceiveBefore
 */

if (!publicUser && appMatch('Building/*/*/*') && !appMatch('Building/Residential/*/*') && balanceDue <= 0) {
    showMessage = true;
    comment('<font size=small><b>There are NO fees due:</b></font><br><br>Fees must be INVOICED with a balance DUE before a payment can me made.<br><br>');
    cancel = true;
    //  stop payment;
}
