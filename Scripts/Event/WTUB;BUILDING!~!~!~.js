//WTUB:Building/*/*/*

if (balanceDue > 0) {
    if (wfTask == "Ready to Issue Permit") {
        if (wfStatus == "Permit Issued" || wfStatus == "Permit Re-Issued") {
            //Script 199 Balance Due Block Issuance
            include("BLD_199_WTUB_BalanceDueBlockIssuance");
        }
    }
}

if (wfTask == "Ready to Issue Permit") {
    if (wfStatus == "Permit Issued") {
        //Script 267 Secondary Review Block
        include("BLD_267_WTUB_SecondaryReviewBlock");

        //Script 269 Checklist Items Block
        include("BLD_269_WTUB_CheckListItemsBlock")
    } else if (wfStatus == "Permit Re-Issued") {
        //Script 267 Secondary Review Block
        include("BLD_267_WTUB_SecondaryReviewBlock");

        //Script 269 Checklist Items Block
        include("BLD_269_WTUB_CheckListItemsBlock")
    }
}

if (wfTask == "Review Consolidation") {
    if (wfStatus == "Approved - Plan Prep for Issuance") {
        //Script 265 Review Approval Block
        include("BLD_265_WTUB_ReviewApprovalBlock");
    }
}

if (appMatch("Building/Residential/Demolition/NA", capId) == true) {
    if (wfTask == "Ready to Issue Permit") {
        if (wfStatus == "Permit Issued" || wfStatus == "Permit Re-Issued") {
            //Script 263 Pool Demoition Require Document
            include("BLD_263_WTUB_PoolDemoReqDoc");
        }
    }
}

// Residential New Single Family / Multi Family / Manufactured / Detached ADU
if (appMatch("Building/Residential/New/NA", capId) == true) {
    if (wfTask == "Plan Preparation for Issuance") {
        if (wfStatus == "Ready Letter Issued") {
            ////Script 364 Affordable Housing Impact Fee Block
            //include("BLD_364_WTUB_AffordableHousingImpactFeeBlock");
        }
    }
}

// Residential New Permit
if (appMatch("Building/Residential/*/*", capId) == true) {
    if (wfTask == "Civil and Drainage Review" || wfTask == "Public Works" 
        || wfTask == "Environmental Health Review" || wfTask == "Geotechnical Review" || wfTask == "Planning Review") {
        if (wfStatus == "Passed" || wfStatus == "Passed with Conditions") {
            //Script 365 Sub-process Block
            include("BLD_365_WTUB_SubProcessBlock");
        }
            
    }
}

//script 199 - BLD_RES_199_BalanceDueBlockIssuance
if (wfStatus == "Permit Issued" && balanceDue > 0) {
    cancel = true;
    showMessage = true;
    comment("This permit has fees owing - the permit cannot be issued.");
}

//script 199 - BLD_RES_199_BalanceDueBlockIssuance
if (appMatch("Building/Residential/Electrical/Service Upgrade", capId) == true ||
    appMatch("Building/Residential/Mechanical/HVAC", capId) == true ||
    appMatch("Building/Residential/Plumbing/NA", capId) == true ||
    appMatch("Building/Residential/Re-Roof/NA", capId) == true ||
    appMatch("Building/Residential/Siding and Stucco/NA", capId) == true ||
    appMatch("Building/Residential/Plumbing/Water Heater", capId) == true ||
    appMatch("Building/Residential/Window or Door/NA", capId) == true) {

    if ((wfTask == "Building Review" || wfTask == "Planning Review") && (wfStatus == "Passed" || wfStatus == "Passed with Conditions")
        && balanceDue > 0) {
        cancel = false;
        showMessage = true;
        comment("This permit has fees owing - the OTC building permit may be issued with fees owing.");
    }
}