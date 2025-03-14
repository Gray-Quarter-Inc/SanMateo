//DUA:PublicWorks/~/~/~

// Encroachment Permit
if (appMatch("PublicWorks/Permit/NA/NA", capId) == true) {
    if (publicUser == true) {
        //Script 414 ACA Document Update
        include("DPW_414_DUA_AcaDocUpdate");

        include("DPW_522_DUA_AcaExtensionRequested");
    }
}

// BlueBeam integration - keep at the bottom
include("BB_DUA");