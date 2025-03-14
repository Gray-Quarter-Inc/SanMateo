//IRSA:PublicWorks/*/*/*

//Script Send Erosion Control Inspection Results Email
include("SMC_IRSA_SendErosionCtrlInspResultsEmail");

logDebug("ES_PWIRSA");

// Illicit Discharge Complaint
if (appMatch("*/Illicit Discharge/*/*") === true) {
    //Script Inspection Violation
    include("PW_IRSA_InspViolation");
}