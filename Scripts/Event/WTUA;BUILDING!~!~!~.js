//WTUA:Building/~/~/~

//Script 264 Review Status Update
include("BLD_264_WTUA_ReviewStatusUpdate");

//Script 270 Conditional Review Inspection
include("BLD_270_WTUA_ConditionalReviewInspection");

if (appMatch("Building/Residential/Demolition/NA", capId) == true) {
    if (wfTask == "Plan Preparation for Issuance") {
        if (wfStatus == "Final Stamping") {
            //Script 273 Demolition Final Stamping Review
            include("BLD_273_WTUA_DemoFinalStamping");
        }
    }
} else {
    //For any permits except for Demolition
    if (wfTask == "Plan Preparation for Issuance") {
        if (wfStatus == "Final Stamping") {
            //Script 266 Final Stamping Review
            include("BLD_266_WTUA_FinalStampingReview");
        }
    }
}

if (wfTask == "EC Pre-Construction") {
    if (wfStatus == "No Comment") {
        //Script 268 Secondary Review Close Task
        include("BLD_268_WTUA_SecRevCloseTask");
    }

    if (wfStatus == "Passed") {
        //Script 268 Secondary Review Close Task
        include("BLD_268_WTUA_SecRevCloseTask");
    }

    if (wfStatus == "Passed with Conditions") {
        //Script 268 Secondary Review Close Task
        include("BLD_268_WTUA_SecRevCloseTask");
    }

    if (wfStatus == "Hard Card Completed") {
        //Script 268 Secondary Review Close Task
        include("BLD_268_WTUA_SecRevCloseTask");
    }
}

if (wfTask == "Grading Permit") {
    if (wfStatus == "No Comment") {
        //Script 268 Secondary Review Close Task
        include("BLD_268_WTUA_SecRevCloseTask");
    }

    if (wfStatus == "Passed") {
        //Script 268 Secondary Review Close Task
        include("BLD_268_WTUA_SecRevCloseTask");
    }

    if (wfStatus == "Passed with Conditions") {
        //Script 268 Secondary Review Close Task
        include("BLD_268_WTUA_SecRevCloseTask");
    }

    if (wfStatus == "Hard Card Completed") {
        //Script 268 Secondary Review Close Task
        include("BLD_268_WTUA_SecRevCloseTask");
    }
}

if (wfTask == "PCB Monitoring") {
    if (wfStatus == "No Comment") {
        //Script 268 Secondary Review Close Task
        include("BLD_268_WTUA_SecRevCloseTask");
    }

    if (wfStatus == "Passed") {
        //Script 268 Secondary Review Close Task
        include("BLD_268_WTUA_SecRevCloseTask");
    }

    if (wfStatus == "Passed with Conditions") {
        //Script 268 Secondary Review Close Task
        include("BLD_268_WTUA_SecRevCloseTask");
    }

    if (wfStatus == "Hard Card Completed") {
        //Script 268 Secondary Review Close Task
        include("BLD_268_WTUA_SecRevCloseTask");
    }
}

if (wfTask == "Waste Management Review") {
    if (wfStatus == "No Comment") {
        //Script 268 Secondary Review Close Task
        include("BLD_268_WTUA_SecRevCloseTask");
    }

    if (wfStatus == "Passed") {
        //Script 268 Secondary Review Close Task
        include("BLD_268_WTUA_SecRevCloseTask");
    }

    if (wfStatus == "Passed with Conditions") {
        //Script 268 Secondary Review Close Task
        include("BLD_268_WTUA_SecRevCloseTask");
    }

    if (wfStatus == "Hard Card Completed") {
        //Script 268 Secondary Review Close Task
        include("BLD_268_WTUA_SecRevCloseTask");
    }
}

if (wfTask == "Review Consolidation") {
    if (wfStatus == "Plan Revisions Required") {
        //Script 36 Residential Plan Revision Required
        include("BLD_036_WTUA_ResPlanRevisionRequired");
    }
    if (wfStatus == "Resubmittal Required") {
        //Script 35 Send Resubmittal Required Email
        include("BLD_035_WTUA_SendResubmittalRequiredEmail");
    }
}

if (wfTask == "Application Submittal") {
    if (wfStatus == "Complete") {
        //Script 407 Update Green Halo Checklist
        include("BLD_407_WTUA_UpdateGreenHaloChecklist");
    }
}

// Addition Alteration Tenant Improvements
if (appMatch("Building/Commercial/Add Alt Imp/NA", capId) == true) {
    if (wfTask == "Application Submittal") {
        if (wfStatus == "Fee Assessment") {
            //Script 446 Add Fees
            include("BLD_446_WTUA_AddFees");

            //Script 506 Add Affordable Housing Alteration-Addition Review Fees
            include("BLD_506_AddAffordHousingAltAddRevFees");
        }
    }

    if (wfTask == "Plan Preparation for Issuance") {
        if (wfStatus == "Final Fees Assessment") {
            //Script 447 Add Final Fees
            include("BLD_447_WTUA_AddFinalFees");

            //Script 507 Add Affordable Housing Alteration-Addition Final Fees
            include("BLD_507_WTUA_AddAffordHousingAltAddFinalFees");
        }
    }
}

// Commercial New
if (appMatch("Building/Commercial/New/NA", capId) == true) {
    if (wfTask == "Application Submittal") {
        if (wfStatus == "Fee Assessment") {
            //Script 460 Add Fees
            include("BLD_460_WTUA_AddFees");

            //Script 508 Add Affordable housing Commercial New Fees
            include("BLD_508_WTUA_AddAffordHousingCommNewFees");
        }
    }

    if (wfTask == "Plan Preparation for Issuance") {
        if (wfStatus == "Final Fees Assessment") {
            //Script 461 Add Commercial New Final Fees
            include("BLD_461_WTUA_AddComNewFinalFees");

            //Script 509 Add Affordable Housing Commercial New Final Fees
            include("BLD_509_WTUA_AddAffordHousingCommNewFinalFees");
        }
    }
}

// Pump Station Monitoring
if (appMatch("*/Pump Station Monitoring/*/*", capId) === true) {
    if (wfStatus === "Open Illicit Discharge Case") {

    }
}

// Residential or Commercial
if ((appMatch("Building/Residential/*/*", capId) == true)
    || (appMatch("Building/Commercial/*/*", capId) == true)) {
    if (wfStatus == "Additional Information Required") {
        //Script 33 Send Additional Information Required Email
        include("BLD_033_WTUA_SendAddInfoReqEmail");
    }

    if (wfStatus == "Canceled - Abandoned" || wfStatus == "Canceled - Applicant Request") {
        //Script 34 Send Cancelled Email
        include("BLD_034_WTUA_SendCancelledEmail");
    }

    if (wfTask == "Application Submittal") {
        if (wfStatus == "Complete") {
            //Script 32 Send Permit Application Submitted Email
            include("BLD_032_WTUA_SendPermitAppAccEmail");
        }
        if (wfStatus == "Incomplete") {
            //Script 33 Send Additional Information Required Email
            include("BLD_033_WTUA_SendAddInfoReqEmail");
        }
    }

    if (wfTask == "Civil Review Distribution") {
        if (wfStatus == "Routed for Review") {

        }
    }

    if (wfTask == "Environmental Health Review Distribution") {
        if (wfStatus == "Routed for Review") {

        }
    }

    if (wfTask == "Inspections") {
        //if (wfStatus == "081 No Hard Hold Revision") {
            //Script 136 No Hard Hold Revision
            //include("BLD_136_WTUA_NoHardHoldRevision");
        //}

        //if (wfStatus == "091 Hard Hold Revision") {
            //Script 137 Hard Hold Revision
            //include("BLD_137_WTUA_HardHoldRevision");
        //}

        if (wfStatus == "30 Day Extension") {
            //Script 375 Add 30 Day Extension
            include("BLD_375_WTUA_add30DayExt");

            //Script 395 Extension Status Update
            include("BLD_395_WTUA_ExtensionStatusUpdate")
        }

        if (wfStatus == "60 Day Extension") {
            //Script 374 Add 60 Day Extension
            include("BLD_374_WTUA_add60DayExt");

            //Script 395 Extension Status Update
            include("BLD_395_WTUA_ExtensionStatusUpdate")
        }

        if (wfStatus == "90 Day Extension") {
            //Script 159 Add 90 Day Extension
            include("BLD_159_WTUA_add90DayExt");

            //Script 395 Extension Status Update
            include("BLD_395_WTUA_ExtensionStatusUpdate")
        }

        if (wfStatus == "180 Day Extension") {
            //Script 76 Add 180 Day Extension
            include("BLD_076_WTUA_add180DayExt");

            //Script 395 Extension Status Update
            include("BLD_395_WTUA_ExtensionStatusUpdate")
        }

        if (wfStatus == "Reinstatement") {
            //Script 42 Send Reinstated Email
            include("BLD_042_WTUA_SendReinstatedEmail");
        }
    }

    if (wfTask == "Plan Review Distribution") {
        if (wfStatus == "Routed for Review") {
            ////Script 94 Auto Activate Civil Tasks
            //include("BLD_094_WTUA_AutoActivateCivilTasks");

            ////Script 95 Auto Activate Environmental Health Tasks
            //include("BLD_095_WTUA_AutoActivateEnvHealthTasks");

            ////Script 96 Auto Activate Planning Tasks
            //include("BLD_096_WTUA_AutoActivatePlanningTasks");
        }
    }

    if (wfTask == "Plan Preparation for Issuance") {
        if (wfStatus == "Ready Letter Issued") {
            //Script 366 Ready Letter Issued
            include("BLD_366_WTUA_ReadyLetter");
        }
    }

    if (wfTask == "Building Review" || wfTask == "Planning Review" || wfTask == "Public Works"
        || wfTask == "Civil and Drainage Review" || wfTask == "Environmental Health Review"
        || wfTask == "Sewer Review" || wfTask == "Water Review" || wfTask == "Fire Review"
        || wfTask == "Additional Review" || wfTask == "Review Consolidation") {
        if (wfStatus == "Additional Information Required" || wfStatus == "Resubmittal Required"
            || wfStatus == "Recommend Cancellation" || wfStatus == "Passed with Conditions"
            || wfStatus == "Passed" || wfStatus == "No Comment" || wfStatus == "Recommend Denial") {
            //Script 367 Review Consolidation
            include("BLD_367_WTUA_ReviewConsolidation");
        }
    }

    //if (wfTask == "Planning Review") {
        //if (wfStatus == "Passed with Conditions") {
            //Script 160 Final By Planning
            //include("BLD_160_WTUA_FinalByPlanning");
        //}
    //}

    if (wfTask == "Ready to Issue Permit") {
        if (wfStatus == "Permit Issued" || wfStatus == "Permit Re-Issued") {
            //Script 217 Send Permit Issued Email
            include("BLD_217_WTUA_SendPermitIssuedEmail");
        }
    }
}

// Residential Electrical PV Solar
if (appMatch("Building/Residential/Electrical/PV Solar", capId) == true) {
    if (wfTask == "Plan Review Distribution") {
        if (wfStatus == "Routed for Review") {
            //Script 83 Electrical PV Solar Review
            //include("BLD_083_WTUA_PVSolarReview");
        }
    }
}

// Residential Electrical Service Upgrade
if (appMatch("Building/Residential/Electrical/Service Upgrade", capId) == true) {
    if (wfTask == "Building Review") {
        if (wfStatus == "Passed") {
            //Script 115 Issue Electrical Service Upgrade Permit
            include("BLD_115_WTUA_IssueElecServiceUpgradePermit");
        }

        if (wfStatus == "Passed with Conditions") {
            //Script 115 Issue Electrical Service Upgrade Permit
            include("BLD_115_WTUA_IssueElecServiceUpgradePermit");
        }
    }

    if (wfTask == "Planning Review") {
        if (wfStatus == "Passed") {
            //Script 115 Issue Electrical Service Upgrade Permit
            include("BLD_115_WTUA_IssueElecServiceUpgradePermit");
        }

        if (wfStatus == "Passed with Conditions") {
            //Script 115 Issue Electrical Service Upgrade Permit
            include("BLD_115_WTUA_IssueElecServiceUpgradePermit");
        }
    }
}

// Residential Electrical Temporary Power Pole
if (appMatch("Building/Residential/Electrical/Temporary Power Pole", capId) == true) {
    if (wfTask == "Planning Review") {
        if (wfStatus == "Passed") {
            //Script 109 Issue OTC Permit
            include("BLD_109_WTUA_IssueOtcPermit");
        }

        if (wfStatus == "Passed with Conditions") {
            //Script 109 Issue OTC Permit
            include("BLD_109_WTUA_IssueOtcPermit");
        }
    }
}

// Residential HVAC, Furnace, Air Conditioning, and Heat Pump
if (appMatch("Building/Residential/Mechanical/HVAC", capId) == true) {
    if (wfTask == "Application Submittal") {
        if (wfStatus == "Complete") {

        }
    }

    if (wfTask == "Planning Review") {
        if (wfStatus == "Passed") {
            ////Script 82 Issue Permit
            //include("BLD_082_WTUA_IssuePermit");
        }
    }
}

// Residential Plumbing
if (appMatch("Building/Residential/Plumbing/NA", capId) == true) {
    if (wfTask == "Planning Review") {
        if (wfStatus == "Passed") {
            //Script 109 Issue OTC Permit
            include("BLD_109_WTUA_IssueOtcPermit");
        }

        if (wfStatus == "Passed with Conditions") {
            //Script 109 Issue OTC Permit
            include("BLD_109_WTUA_IssueOtcPermit");
        }
    }
}

// Residential Pool or Spa - Repair and New
if (appMatch("Building/Residential/Pool or Spa/Repair and New", capId) == true) {
    if (wfTask == "Ready to Issue Permit") {
        if (wfStatus == "Final Fees Assessment") {
            //Script 72 Residential Pool or Spa Final Fees Assessment
            include("BLD_072_WTUA_ResPoolSpaInstallIssuanceFees");
        }
    }
}

// Residential Re-Roof
if (appMatch("Building/Residential/Re-Roof/NA", capId) == true) {
    if (wfTask == "Planning Review") {
        if (wfStatus == "Passed") {
            //Script 109 Issue OTC Permit
            include("BLD_109_WTUA_IssueOtcPermit");
        }

        if (wfStatus == "Passed with Conditions") {
            //Script 109 Issue OTC Permit
            include("BLD_109_WTUA_IssueOtcPermit");
        }
    }
}

// Residential Siding and Stucco
if (appMatch("Building/Residential/Siding and Stucco/NA", capId) == true) {
    if (wfTask == "Planning Review") {
        if (wfStatus == "Passed") {
            //Script 109 Issue OTC Permit
            include("BLD_109_WTUA_IssueOtcPermit");
        }

        if (wfStatus == "Passed with Conditions") {
            //Script 109 Issue OTC Permit
            include("BLD_109_WTUA_IssueOtcPermit");
        }
    }
}

// Residential Water Heater
if (appMatch("Building/Residential/Plumbing/Water Heater", capId) == true) {
    if (wfTask == "Planning Review") {
        if (wfStatus == "Passed") {
            //Script 109 Issue OTC Permit
            include("BLD_109_WTUA_IssueOtcPermit");
        }

        if (wfStatus == "Passed with Conditions") {
            //Script 109 Issue OTC Permit
            include("BLD_109_WTUA_IssueOtcPermit");
        }
    }
}

// Residential Window or Door
if (appMatch("Building/Residential/Window or Door/NA", capId) == true) {
    if (wfTask == "Planning Review") {
        if (wfStatus == "Passed") {
            //Script 109 Issue OTC Permit
            include("BLD_109_WTUA_IssueOtcPermit");
        }

        if (wfStatus == "Passed with Conditions") {
            //Script 109 Issue OTC Permit
            include("BLD_109_WTUA_IssueOtcPermit");
        }
    }
}

// Residential Landscaping
if (appMatch("Building/Residential/Landscaping/NA", capId) == true) {
    if (wfTask == "Application Submittal") {
        if (wfStatus == "Fee Assessment") {
            //Script 240 Landscape Review Fees
            include("BLD_240_WTUA_LandscapeReviewFees");
        }
    }

    if (wfTask == "Plan Preparation for Issuance") {
        if (wfStatus == "Final Fees Assessment") {
            //Script 241 Landscape Permit Fees
            include("BLD_241_WTUA_LandscapePermitFees");
        }
    }
}

// Residential Pool or Spa
if (appMatch("Building/Residential/Pool or Spa/NA", capId) == true) {
    if (wfTask == "Application Submittal") {
        if (wfStatus == "Fee Assessment") {
            //Script 285 Pool or Spa Hot Tub Review Fee
            include("BLD_285_WTUA_PoolSpaHotTubReviewFee");
        }
    }
    if (wfTask == "Plan Preparation for Issuance") {
        if (wfStatus == "Final Fees Assessment") {
            //Script 286 Pool or Spa Hot Tub Permit Fee
            include("BLD_286_WTUA_PoolSpaHotTubPermitFee");
        }
    }
}

// Residential Bath Kitchen Remodel
if (appMatch("Building/Residential/Bath Kitchen Remodel/NA", capId) == true) {
    if (wfTask == "Application Submittal") {
        if (wfStatus == "Fee Assessment") {
            //Script 281 Kitchen Bath Review Fees
            include("BLD_281_WTUA_KitchenBathReviewFees");
        }
    }
    if (wfTask == "Plan Preparation for Issuance") {
        if (wfStatus == "Final Fees Assessment") {
            //Script 282 Kitchen Bath Permit Fee
            include("BLD_282_WTUA_KitchenBathPermitFee");
        }
    }
}

//Residential Addition
if (appMatch("Building/Residential/Addition/NA", capId) == true) {
    if (wfTask == "Application Submittal") {
        if (wfStatus == "Fee Assessment") {
            //Script 310 Addition Alt Review Fee
            include("BLD_310_WTUA_AddAltReviewFee");
        }
    }
    if (wfTask == "Plan Preparation for Issuance") {
        if (wfStatus == "Final Fees Assessment") {
            //Script 311 Addition Alt Permit Fee
            include("BLD_311_WTUA_AddAltPermitFee");
        }
    }
}

//Residential Full Utilities
if (appMatch("Building/Residential/Detached Structure/Full Utilities", capId) == true) {
    if (wfTask == "Application Submittal") {
        if (wfStatus == "Fee Assessment") {
            //Script 343 Acc Struc Review Fee
            include("BLD_343_WTUA_AccStruReviewFee");
        }
    }
    if (wfTask == "Plan Preparation for Issuance") {
        if (wfStatus == "Final Fees Assessment") {
            //Script 344 Acc Struc Permit Fee
            include("BLD_344_WTUA_AccStruPermitFee");
        }
    }
}

//Residential New
if (appMatch("Building/Residential/New/NA", capId) == true) {
    if (wfTask == "Application Submittal") {
        if (wfStatus == "Fee Assessment") {
            //Script 339 Residential New Review Fee
            include("BLD_339_WTUA_ResNewReviewFee");

            //Script 518 Add Affordable Housing Residential New Fees
            include("BLD_518_WTUA_AddAffordHousingResNewFees");
        }
    }
    if (wfTask == "Plan Preparation for Issuance") {
        if (wfStatus == "Final Fees Assessment") {
            //Script 340 Residential New Permit Fee
            include("BLD_340_WTUA_ResNewPermitFee");

            //Script 369 Residential Impact Fee Assessment
            include("BLD_369_WTUA_ImpactFeeAssessment");

            //Script 517 Residential Affordable Housing Percentage Fees
            include("BLD_517_WTUA_ResAffordHousingPerFees");
        }
    }
}

//Residential Revision
if (appMatch("Building/Revision/NA/NA", capId) == true) {
    if (wfTask == "Application Submittal") {
        if (wfStatus == "Complete") {
            //Script 368 Revision Record ID Conversion
            include("BLD_368_ASA_CTRCA_SetRevRecId");

            //Script 380 Revision Accepted Email
            include("BLD_380_WTUA_RevisionAcceptedEmail");
        }

        if (wfStatus == "Incomplete") {
            //Script 381 Revision Additional Info Email
            include("BLD_381_WTUA_RevisionAdditionalInfoEmail");
        }
    }

    if (wfStatus == "Additional Information Required") {
        //Script 381 Revision Additional Info Email
        include("BLD_381_WTUA_RevisionAdditionalInfoEmail");
    }

    if(wfTask == "Plan Preparation for Issuance"){
        if(wfStatus == "Ready Letter Issued") {
            //Script 366 Ready Letter Issued
            include("BLD_366_WTUA_ReadyLetter");
        }
    }
    
    if (wfTask == "Ready to Issue Permit") {
        if (wfStatus == "Permit Issued") {
            //Script 397 Send Permit Issued Email
            include("BLD_397_WTUA_RevisionPermitIssuedEmail");
        }
    }
}

if (matches(currentUserID, "AVOCETTE", "GRAYQUARTER") && showMessage != true) {
    showDebug = true;
    showMessage = true;
    comment(debug); //debug
}

// BlueBeam integration - keep at the bottom
include("BB_WTUA");