//ISB:Building/~/~/~

//Script 237 Inspection Cancelled/Reschedule Block
include("BLD_237_ISB_InspectionCancelRescheduleBlock");

if (publicUser) {
    if (balanceDue > 0) {
        //Script 231 ACA Inspection Balance Due Block
        include("BLD_231_ISB_ACAInspectionBalanceDueBlock");
    }

    //Script 234 ACA Inspection Schedule Status Block
    include("BLD_234_ISB_ACAInspectionScheduleStatusBlock");
} else {
    if (balanceDue > 0) {
        //Script 232 AA Inspection Schedule Balance Due Block
        include("BLD_232_ISB_AAInspectionScheduleBalanceDueBlock");
    }

    //Script 233 AA Inspection Schedule Status Block
    include("BLD_233_ISB_AAInspectionScheduleStatusBlock");
}

// Residential or Commercial
if (appMatch("Building/*/*/*", capId) == true) {
    //Script 56 Check Inspections Task
    //include("BLD_056_ISB_CheckInspTask");

    if (publicUser == true) {
        //Script 198 Check ACA Inspections Remaining
        include("BLD_198_ISB_CheckAcaInspsRemain");
    }

    //Script 222 Check IVR Inspections Remaining
    include("BLD_222_ISB_CheckIvrInspsRemain");
}
// Residential
if (appMatch("Building/Revision/NA/NA", capId) == true) {
    //Script 396 Revision Inspection Block
    include("BLD_396_ISB_RevisionInspectionBlock");
}