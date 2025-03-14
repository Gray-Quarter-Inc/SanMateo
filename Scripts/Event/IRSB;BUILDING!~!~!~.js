//IRSB:Building/*/*/*

if (inspResult == "Pass") {
    //Script 271 PreSite Inspection Block
    include("BLD_271_IRMB_PreSiteInspectionBlock");
}

// Residential or Commercial
if ((appMatch("Building/Residential/*/*", capId) == true) || (appMatch("Building/Commercial/*/*", capId) == true)) {
    if (inspType == "901 Building Final") {
        if (inspResult == "Pass") {
            //Script 105 Check Building Final Inspection
            include("BLD_105_IRSB_CheckBuildingFinalInsp");

            //Script 188 Check Final Inspections Passed
            include("BLD_188_IRSB_CheckFinalInspsPassed");

            //Script 390 Block 901 Building Final
            include("BLD_390_IRSB_Block901BuildingFinal");
        }
    }
}

// Residential PV Solar
if (appMatch("Building/Residential/Electrical/PV Solar", capId) == true) {
    if (inspType == "901 Building Final") {
        if (inspResult == "Pass") {
            //Script 118 Check Roof Tear-off Inspection
            include("BLD_118_IRSB_CheckRoofTearOffInsp");
        }
    }
}