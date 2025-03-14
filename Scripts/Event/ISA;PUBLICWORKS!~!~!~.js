//ISA:PublicWorks/*/*/*


// Residential or Commercial
if ((appMatch("PublicWorks/Permit/*/*", capId) == true)) {
    //Script 19 Send Inspection Scheduled Email
   
/*
    if (publicUser == true) {
        ////Script 199 Decrement ACA Inspections Remaining
        //include("BLD_199_ISA_DecAcaInspsRemain");
        include("DPW_520_ISA_SendInspReqEmail");
    } else {
        include("DPW_519_ISA_SendInspSchedEmail");
    }
*/
}


if (matches(currentUserID, "AVOCETTE") && showMessage != true) {
    showDebug = true;
    showMessage = true;
    comment(debug); //debug
}