/*******************************************************
| Script/Function: paymentDueToReceived(ID403)
| Created by: Tom Grzegorczyk
| Created on: 01Jun22
| Usage: When record status "Payment Due" and a payment is made, change record status from "Payment Due" to "Payment Received"
| Modified by: ()
*********************************************************/
(function () {
    var capToCheck = aa.cap.getCap(capId).getOutput();
    var status = String(capToCheck.getCapStatus());
    Avo_LogDebug("Status(" + status + ")", 2);  //debug

    if (status != "Payment Due") {
        return;
    }
    var newStatus = "Payment Received";
    Avo_LogDebug("Updating to new status '" + newStatus + "'", 1);
    updateAppStatus(newStatus, "", capId);
})();
