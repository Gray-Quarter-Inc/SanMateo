//WTUA:PublicWorks/*/*/*

logDebug("ES_PW_WorkflowTaskUpdateAfter");

// Pump Station Monitoring
if (appMatch("*/Pump Station Monitoring/*/*") === true) {
    if (wfStatus === "Open Illicit Discharge Case") {
        //Script Add Child Illicit Discharge Permit
        include("PW_WTUA_AddChildIllicitDischargePermit");
    }
}

if (wfStatus === "Cancelled") {
    //Script Inspection Violation
    include("SMC_WTUA_CancelPermit");
}


// BlueBeam integration - keep at the bottom
include("BB_WTUA");