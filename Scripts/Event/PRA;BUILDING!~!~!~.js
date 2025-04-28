//PRA:Building/~/~/~

// Residential
if (appMatch("Building/Residential/*/*", capId) == true) {
    if (publicUser == true) {
        include("BLD_346_DUA_PRA_acaUpdate");
        
    }

    //Script 376 Reinstatement
    include("BLD_376_PRA_Reinstatment");
}

// Auto Issue Permit
if (appMatch("Building/Auto Issue/NA/NA", capId) == true) {
    //Script 514 Set Issuance Status
    include("BLD_514_PRA_SetIssStatus");
}

// Building Permit
if (appMatch("Building/Full Review/NA/NA", capId) == true) {
    if (publicUser == true) {
        //Script 346 ACA Update
        include("BLD_346_DUA_PRA_acaUpdate");
    }
}

// Building Permit Revision
if (appMatch("Building/Revision/NA/NA", capId) == true) {
    if (publicUser == true) {
        //Script 346 ACA Update
        include("BLD_346_DUA_PRA_acaUpdate");
    }
}


// All Building Commercial
if (appMatch("Building/Commercial/*/*", capId) == true) {
    if (publicUser == true) {
        //Script 346 ACA Update
        include("BLD_346_DUA_PRA_acaUpdate");
    }
}

// BlueBeam integration - keep at the bottom 
if (appMatch("Building/Revision/NA/NA", capId) == true) {
    include("BB_PRA");
}