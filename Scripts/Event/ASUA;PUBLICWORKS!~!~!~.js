//ASUA:PublicWorks/~/~/~

// All Permits
if (appMatch("PublicWorks/Permit/*/*", capId) == true) {
    if (appStatus == "Payment Due") {
        //Script 450 Inactivate Workflow when Cancelled
        include("DPW_450_ASUA_InactivateWorkflowWhenCancelled");
    }
}

// Encroachment Permit
if (appMatch("PublicWorks/Permit/NA/NA", capId) == true) {
    if (appStatus == "Payment Due") {
        //Script 404 Send Payment Due Email
        include("DPW_404_ASUA_SendPaymentDueEmail");
    }
    if (appStatus == "Expired") {
        //Script 454 Inactivate Workflow when Expired
        include("DPW_454_ASUA_InactivateWorkflowWhenExpired");
    }
}

if (matches(currentUserID, "AVOCETTE") && showMessage != true) {
    showDebug = true;
    showMessage = true;
    comment(debug); //debug
}