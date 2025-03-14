//ISA:Building/*/*/*

// Residential or Commercial
if ((appMatch("Building/Residential/*/*", capId) == true) || (appMatch("Building/Commercial/*/*", capId) == true)) {
    //Script 19 Send Inspection Scheduled Email
    include("BLD_019_ISA_SendInspSchedEmail");

    if (publicUser == true) {
        ////Script 199 Decrement ACA Inspections Remaining
        //include("BLD_199_ISA_DecAcaInspsRemain");
    }
}

//(function () {
//    switch (String(inspType)) {
//        case "Final - T.24":
//        case "Final AntiEntrapment Device":
//        case "Final CO - Smoke Alarm":
//        case "Final Drainage Public Works":
//        case "Final Other":
//        case "Final Other Permit":
//        case "Final SWN":
//        case "Final by Cal Trans":
//        case "Final by Fire":
//        case "Final by Fish & Game":
//        case "Final by Geotechnical":
//        case "Final by Green Building":
//        case "Final by Health":
//        case "Final by Planning":
//        case "Final by Public Works":
//        case "Final by Sewer District":
//        case "Final by Waste Management":
//        case "Final by Water District":
//        case "Height Verification":
//        case "Setback Verification":
//        case "WELO":
//            logDebug("Notifications not supported for inspection of type " + inspType);
//            return;
//    }

//    // Send email to applicant when an inspection is scheduled
//    // emailNotificationNoAttachmentRemoteInspection(contactTypesList,notificationTemplateOnsite,notificationTemplateRemote,vCapId)
//    //emailNotificationNoAttachmentRemoteInspection("Applicant", "SS_INSPECTION_SCHEDULED", "SS_INSPECTION_SCHEDULED_FOR_REMOTE", capId);
//})();