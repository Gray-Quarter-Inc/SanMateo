//IRSA:Building/*/*/*

// Residential or Commercial
if ((appMatch("Building/Residential/*/*", capId) == true) || (appMatch("Building/Commercial/*/*", capId) == true)) {

    //Script 26 Send Inspection Resulted Email
    /* Disabled via SERVICE REQUEST 15241 - stop inspection result email */
    //include("BLD_026_IRSA_SendInspResultEmail");

    //Script 356 Expiration Inspection Pass Extension
    include("BLD_356_IRSA_ExpInspPassExt");

    if (inspType == "081 No Hard Hold") {
        if (inspResult == "No Hard Hold") {
            //Script BB 011 Increment Revision Number
            include("BB_011_INCREVSUBCYCLE");

            //Script 167 No Hard Hold Result
            include("BLD_167_IRSA_NoHardHoldResult");
        }
    }

    if (inspType == "091 Revision Required No Inspection") {
        if (inspResult == "Hard Hold") {
            //Script BB 011 Increment Revision Number
            include("BB_011_INCREVSUBCYCLE");

            //Script 168 Hard Hold Result
            include("BLD_168_IRSA_HardHoldResult");
        }
    }

    if (inspType == "901 Building Final") {
        if (inspResult == "Pass") {
            //Script 38 Building Finaled
            include("BLD_038_IRSA_BuildingFinaled");
        }
    }
}

if (matches(currentUserID, "AVOCETTE")) {
    showMessage = true;
    comment(debug); //debug
}