//ASIUA:Building/~/~/~

// Residential or Commercial
if ((appMatch("Building/Residential/*/*", capId) == true) || (appMatch("Building/Commercial/*/*", capId) == true)) {
    //Script 383 Remove Expiration Date
    include("BLD_383_ASIUA_RemoveExpDate");
}


// Addition Alteration Tenant Improvements
if (appMatch("Building/Commercial/Add Alt Imp/NA", capId) == true) {
    include("BLD_451_ASA_ASIUA_ComAddTotalSQFoot");
}


//Green Halo - keep at the bottom
var manualCreation = getAppSpecific("Manual Creation");
if (manualCreation == "CHECKED") {
    //Script 475 Update Green Halo Checklist
    include("BLD_475_ASIUA_UpdateGreenHaloChecklist");

    editAppSpecific("Manual Creation", null);
}

// BlueBeam integration - keep at the bottom
include("BB_ASIUA");