//ASB:Building/~/~/~

parcelArr = new Array;
//loadParcelAttributes(parcelArr);

if (appMatch("*/Zoning Violation/*/*") != true) {
    //Script 88 Check Zoning Designation
    //include("SMC_088_ASB_CheckZoningDesig");
}

// Commercial Temporary Structure
if (appMatch("Building/Commercial/Temp Struc/NA") == true) {
    if (publicUser != true) {
        //Script 401 Commercial Temporary Structure Required Document
        include("BLD_401_ASB_TempStrucReqDoc");
    }
}

// Residential Electrical Service Upgrade
if (appMatch("Building/Residential/Electrical/Service Upgrade") == true) {
    if (publicUser != true) {
        //Script 30 Residential Require Electrical Service Upgrade Document
        include("BLD_030_ASB_ResReqElecServUpgradeDoc");
    }
}

// Residential HVAC, Furnace, Air Conditioning, and Heat Pump
if (appMatch("Building/Residential/Mechanical/HVAC") == true) {
    if (publicUser != true) {
        //Script 87 Residential Mechanical HVAC
        include("BLD_087_ASB_HVACRequireDoc");
    }
}

// Residential New Home
if (appMatch("Building/Residential/New/NA") == true) {
    if (publicUser != true) {
        //Script 337 New Residential Req Doc
        include("BLD_337_ASB_ResNewReqDoc");
    }
}

// Residential Plumbing
if (appMatch("Building/Residential/Plumbing/NA") == true) {
    if (publicUser != true) {
        //Script 47 Residential Require Plumbing Documents
        include("BLD_047_ASB_ResReqPlumbDocs");
    }
}

// Residential Pool or Spa - Repair and New
if (appMatch("Building/Residential/Pool or Spa/Repair and New") == true) {
    //Script 85 Residential Require Pool Documents
    if (publicUser != true) {
        include("BLD_085_ASB_ResReqPoolDocs");
    }
}

// Residential Re-Roof
if (appMatch("Building/Residential/Re-Roof/NA") == true) {
    if (publicUser != true) {
        //Script 189 Residential Reroof 
        //include("BLD_189_ASB_ReroofReqDoc"); //Script 189 Residential Reroof
    }
}

// Residential Siding and Stucco
if (appMatch("Building/Residential/Siding and Stucco/NA") == true) {
    if (publicUser != true) {
        //Script 111 Residential Siding and Stucco
        //include("BLD_111_ASB_SidingStuccoDoc"); //Disabling due to undefined parcel error.
    }
}

// Residential Water Heater
if (appMatch("Building/Residential/Plumbing/Water Heater") == true) {
    if (publicUser != true) {
        //Script 197 Residential Water Heater 
        include("BLD_197_ASB_WaterHeaterReqDoc");
    }
}

// Residential Window or Door
if (appMatch("Building/Residential/Window or Door/NA") == true) {
    if (publicUser != true) {
        //Script 187 Residential Window or Door
        //include("BLD_187_ASB_WindowReqDoc"); //Disabling due to undefined parcel error.
    }
}

// Residential Skylight
if (appMatch("Building/Residential/Skylight/NA") == true) {
    if (publicUser != true) {
        //Script 225 Residential Skylight
        include("BLD_225_ASB_SkylightReqDoc"); 
    }
}

// Residential Landscaping
if (appMatch("Building/Residential/Landscaping/NA") == true) {
    if (publicUser != true) {
        //Script 225 Residential Landscaping
        include("BLD_238_ASB_LandReqDoc"); 
    }
}

// Residential Demolition
if (appMatch("Building/Residential/Demolition/NA") == true) {
    if (publicUser != true) {
        //Script 245 Residential Demolition
        include("BLD_245_ASB_PoolDemoReqDoc"); 
    }
}

// Swimming Pool / Spa / Hot Tub / Pond
if (appMatch("Building/Residential/Pool or Spa/NA") == true) {
    if (publicUser != true) {
        //Script 275 Pool Spa HotTub Require Doc
        include("BLD_275_ASB_PoolSpaHotTubRequireDoc");
    }
}


// Residential Propane Water Tank
if (appMatch("Building/Residential/Propane Tank/NA") == true) {
    if (publicUser != true) {
        //Script 277 Propane Water Tank Req Doc
        include("BLD_277_ASB_PropaneWaterTankReqDoc");
    }
}

// Residential Deck and Patio
if (appMatch("Building/Residential/Deck and Patio/NA") == true) {
    if (publicUser != true) {
        //Script 283 Deck Patio Req Doc
        include("BLD_283_ASB_DeckPatioReqDoc");
    }
}

// Residential Kitchen Bath
if (appMatch("Building/Residential/Bath Kitchen Remodel/NA") == true) {
    if (publicUser != true) {
        //Script 279 Kitchen Bath Req Doc
        include("BLD_279_ASB_KitchenBathReqDoc");
    }
}

// Residential Addition
if (appMatch("Building/Residential/Addition/NA") == true) {
    if (publicUser != true) {
        //Script 308 Addition Alt Req Doc
        include("BLD_308_ASB_AddAltReqDoc");
    }
}

// Residential Full Utilities
if (appMatch("Building/Residential/Detached Structure/Full Utilities") == true) {
    if (publicUser != true) {
        //Script 341 Residential Detached Structure Req Doc
        include("BLD_341_ASB_ResAccStruReqDoc");
    }
}

// Building Permit Revision
if (appMatch("Building/Revision/NA/NA") == true) {
    if (publicUser != true) {
        //Script 379 Residential Revision Required Document
        include("BLD_379_ASB_RevisionReqDoc");
    }
}