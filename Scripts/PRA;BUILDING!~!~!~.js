//PRA:Building/~/~/~

// Residential
if (appMatch("Building/Residential/*/*", capId) == true) {
    if (publicUser == true) {
        if (appMatch("Building/Residential/Window or Door/NA", capId) != true
            && appMatch("Building/Residential/Plumbing/Water Heater", capId) != true
            && appMatch("Building/Residential/Plumbing/NA", capId) != true
            && appMatch("Building/Residential/Re-Roof/NA", capId) != true
            && appMatch("Building/Residential/Siding and Stucco/NA", capId) != true
            && appMatch("Building/Residential/Electrical/Service Upgrade", capId) != true
            && appMatch("Building/Residential/Mechanical/HVAC", capId) != true) {
            //Script 346 ACA Update
            include("BLD_346_DUA_PRA_acaUpdate");
        }
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