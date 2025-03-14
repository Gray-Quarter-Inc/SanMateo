//DUA:Building/*/*/*

// Residential or Commercial
if ((appMatch("Building/Residential/*/*", capId) == true) || (appMatch("Building/Commercial/*/*", capId) == true)) {
    //Script 175 Document Upload Received
    include("BLD_175_DUA_DocumentUploadReceived");

    if (publicUser == true) {
        //Script 346 ACA Update
        include("BLD_346_DUA_PRA_acaUpdate");

        //Script 386 Extension Status Update
        include("BLD_386_DUA_ExtensionStatusUpdate");

        //Script 387 Reinstate Status Update
        include("BLD_387_DUA_ReinstateStatusUpdate");
    }

}

if (appMatch("Building/Full Review/NA/NA", capId) == true) {
    if (publicUser == true) {
        //Script 346 ACA Update
        include("BLD_346_DUA_PRA_acaUpdate");
    }
}

if (appMatch("Building/Revision/NA/NA", capId) == true) {
    if (publicUser == true) {
        //Script 346 ACA Update
        include("BLD_346_DUA_PRA_acaUpdate");
    }
}

// BlueBeam integration - keep at the bottom
include("BB_DUA");