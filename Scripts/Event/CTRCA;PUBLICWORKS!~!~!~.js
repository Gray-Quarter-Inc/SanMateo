//CTRCA:PublicWorks/*/*/*

// Encroachment Permit
if (appMatch("PublicWorks/Permit/NA/NA", capId) == true) {
    //Script 406 Set Detail Description
    include("DPW_406_CTRCA_SetDetailDesc");
}


// BlueBeam integration - keep at the bottom
include("BB_CTRCA");