//DUB:Building/*/*/*

// Residential or Commercial
if ((appMatch("Building/Residential/*/*") == true) || (appMatch("Building/Commercial/*/*") == true)) {
    if (publicUser == true) {
        //Script 93 Block Document Submission
        //include("BLD_093_DUB_BlockDocumentSubmit");
    }

    // Disabled as per #23512
    //Script 228 DUB Document Duplication Check
    //include("BLD_228_Before_DocumentDuplicationCheck");

    //Script 389 Deny Reinstatement Request
    include("BLD_389_DUB_DenyReinstatementRequest");

    //Script 394 Extension Request Block
    include("BLD_394_DUB_ExtensionRequestBlock");
}

if (appMatch("Building/Commercial/*/*") == true) {
    // Disabled as per #23512
    //shawn say to add a check on record status - if record/application status is null then run the script
    //Script 228 DUB Document Duplication Check
    //include("BLD_228_Before_DocumentDuplicationCheck");
}