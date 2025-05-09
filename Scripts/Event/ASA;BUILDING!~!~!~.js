//ASA:Building/~/~/~

var publicAgencyProject = String(AInfo["Public Agency Project"]);

/* 368 MUST BE RAN FIRST TO UPDATE RECORD ID */
//Revision
if (appMatch("Building/Revision/NA/NA") == true) {
    if (publicUser != true) {
        //Script 368 Set Revision Record ID
        //include("BLD_368_ASA_CTRCA_SetRevRecId");

        //Script 382 Revision Submitted Email
        include("BLD_382_ASA_CTRCA_RevisionSubmittedEmail");

        //Script 391 Revision Alert
        include("BLD_391_ASA_CTRCA_RevisionAlert");
    }

    //Script 378 Revision Fee
    include("BLD_378_ASA_RevisionFee");
}

// Addition Alteration Tenant Improvements
if (appMatch("Building/Commercial/Add Alt Imp/NA", capId) == true) {
    //Script 445 Add Application Filing Full Review Fee
    include("BLD_445_ASA_AddAppFilFullRevFee");

    //Script 504 Add Affordable Housing Alteration-Addition Application Filing Full Review Fee
    include("BLD_504_ASA_AddAffordHousingAltAddAppFilFullRevFee");

    //Script 451 Commercial Add Total Square Footage
    include("BLD_451_ASA_ASIUA_ComAddTotalSQFoot");

    if (publicUser != true) {
        //Script 501 Add Application Filing Full Review Fee - County Project
        include("BLD_501_ASA_CTRCA_AddAppFilFullRevFeeCountyProj");
    }
}

// Commercial New
if (appMatch("Building/Commercial/New/NA", capId) == true) {

    applevel3 = aa.env.getValue('ApplicationTypeLevel3');
    if (capName == null) {
        updateShortNotes(applevel3);
        editAppName(getShortNotes());
    }


    //Script 459 Add Application Filing Full Review Fee
    include("BLD_459_ASA_AddAppFilFullRevFee");

    //Script 505 Add Affordable Housing Commercial New Application Filing Full Review Fee
    include("BLD_505_ASA_AddAffordHousingCommNewAppFilFullRevFee");

    if (publicUser != true) {
        //Script 474 Set Total Square Footage
        include("BLD_474_ASA_CTRCA_SetTotalSqFootage");

        //Script 502 Add Application Filing Full Review Fee - County Project
        include("BLD_502_ASA_CTRCA_AddAppFilFullRevFeeCountyProj");
    }
}

//Commercial Temporary Structure
if (appMatch("Building/Commercial/Temp Struc/NA", capId) == true) {
    //Script 399 Commercial Temporary Structure Fee
    include("BLD_399_ASA_TempStrucFee");

    //Script 526 Building Standard Fee
    include("BLD_526_WTUA_AddBuildingStandardFee");
}

// Residential or Commercial
if ((appMatch("Building/Residential/*/*", capId) == true)
    || (appMatch("Building/Commercial/*/*", capId) == true)) {
    //Script 348 lcpMidCoast() - temporarily off
    //lcpMidCoast();

    if (publicUser != true) {
        //Script 31 Send Permit Application Submitted Email
        include("BLD_031_ASA_CTRCA_SendPermitAppSubEmail");

        //Script 75 Set Expiration Date
        //include("BLD_075_ASA_CTRCA_SetExpDate");

        //Script 92 Set Applicant as Primary
        include("BLD_092_ASA_CTRCA_SetApplicantAsPrimary");

        //Script 345 Add Valuation
        include("BLD_345_ASA_CTRCA_AddValuation");
    }
}

// Residential Addition / Alteration to Existing Residence
if (appMatch("Building/Residential/Addition/NA", capId) == true) {
    if (publicUser != true) {
        //Script 362 Add ADU Review Flag
        include("BLD_362_ASA_CTRCA_AddAduRevFlag");

        //Script 392 Copy Parcel Attributes to ASI
        include("BLD_392_ASA_CTRCA_CopyParcelAttrToAsi");
    }
}

// Residential Electric Car Charger
if (appMatch("Building/Residential/Electrical/Car Charger", capId) == true) {
    if (publicUser != true) {
        //Script 215 Route Electric Car Charger for Review
        //include("BLD_215_ASA_CTRCA_RouteElecCarChargerForReview");

        //Script 216 Activate Fire Review
        //include("BLD_216_ASA_CTRCA_activateFireReview");
    }
}

// Residential Electrical Service Upgrade
if (appMatch("Building/Residential/Electrical/Service Upgrade", capId) == true) {
    //Script 13 Residential Application Fee Easy Review
    include("BLD_013_ASA_ResAppFeeEasyReview");

    //Script 29 Residential Electrical Service Upgrade Permit Specific Fees
    include("BLD_029_ASA_ResElecServUpgradePermitSpecificFees");

    //Script 526 Building Standard Fee
    include("BLD_526_WTUA_AddBuildingStandardFee");

    //Script 100 Residential Application Name
    include("BLD_100_ASA_ResAppName");

    // do not issue in Backoffice - only ACA
    //if (publicUser != true) {
    //Script 53 Service Upgrade Automatic Issuance
    //    include("BLD_053_ASA_CTRCA_ServUpgradeAutoIssuance");

    //Script 101 Add Child Temporary Power Pole
    //include("BLD_101_ASA_CTRCA_AddChildTempPowerPole");

    //Script 114 Route for Review
    //    include("BLD_114_ASA_CTRCA_RouteElecUpgradeForReview");
    //}
}

// Residential HVAC, Furnace, Air Conditioning, and Heat Pump
if (appMatch("Building/Residential/Mechanical/HVAC", capId) == true) {
    //Script 13 Residential Application Fee Easy Review
    include("BLD_013_ASA_ResAppFeeEasyReview");

    //Script 20 Residential HVAC Permit Specific Fees
    include("BLD_020_ASA_ResHvacPermitSpecificFees");

    //Script 526 Building Standard Fee
    include("BLD_526_WTUA_AddBuildingStandardFee");

    //Script 100 Residential Application Name
    include("BLD_100_ASA_ResAppName");

    //Script 104 Residential Plumbing Permit Generate
    //include("BLD_104_ASA_CreateChildPlumbingPermit");

    //Script 25 HVAC Send Permit Issued Email
    //include("BLD_025_ASA_CTRCA_HvacSendPermitIssuedEmail");

    //Script 81 Route for Review
    //include("BLD_081_ASA_CTRCA_RouteHvacForReview");
    //}
}

// Residential Landscaping
if (appMatch("Building/Residential/Landscaping/NA", capId) == true) {
    //Script 100 Residential Application Name
    include("BLD_100_ASA_ResAppName");

    //Script 71 Residential Landscaping Permit Specific Fees
    //include("BLD_071_ASA_ResLandscapingPermitSpecificFees");

    //Script 86 Residential Landscaping Valuation Fees
    include("BLD_086_ASA_ResLandscapingValuationFees");

    //Script 239 Residential Landscaping Upfront Fees
    include("BLD_239_ASA_LandscapeUpfrontFees");
}

// Residential New Home
if (appMatch("Building/Residential/New/NA", capId) == true) {

    //Script 338 Residential New Upfront Fee
    include("BLD_338_ASA_ResNewUpfrontFee");

    //Script 278 Create Associated Forms
    include("BLD_278_ASA_AltResCreateAssociatedForms");

    //Script 100 Residential Application Name
    include("BLD_100_ASA_ResAppName");

    //Script 516 Residential New Affordable Housing Application Fee
    include("BLD_516_ASA_ResNewAffordHousingAppFee");

    //Script 515 Residential New Farm Labor Upfront Fee
    include("BLD_515_ASA_ResNewFarmLaborUpfrontFee");

    if (publicUser != true) {
        //Script 1 Create Child PV Solar
        include("BLD_001_ASA_CTRCA_CreateChildPVSolar");

        //Script 2 Create Child Fire
        include("BLD_002_ASA_CTRCA_CreateChildFire");

        //Script 3 Create Child Pool Spa
        include("BLD_003_ASA_CTRCA_CreateChildPoolSpa");

        //Script 4 Create Child Landscaping
        include("BLD_004_ASA_CTRCA_CreateChildLandscaping");

        //Script 5 Create Child Demolition
        include("BLD_005_ASA_CTRCA_CreateChildDemo");

        //Script 6 Create Child Electric Car Charger
        include("BLD_006_ASA_CTRCA_CreateChildElecCarCharger");

        //Script 7 Create Child Electrical Generator
        include("BLD_007_ASA_CTRCA_CreateChildElecGenerator");

        //Script 8 Create Child Propane Water Tank
        include("BLD_008_ASA_CTRCA_CreateChildPropaneWaterTank");

        //Script 9 Create Child Retaining Wall
        include("BLD_009_ASA_CTRCA_CreateChildRetainWall");

        //Script 10 Create Child Detached Accessory Electrical
        include("BLD_010_ASA_CTRCA_CreateChildDetachAccElec");

        //Script 11 Create Child Detached Accessory Non-Habitable
        include("BLD_011_ASA_CTRCA_CreateChildDetachAccNonHab");

        //Script 12 Create Child Energy Storage
        include("BLD_012_ASA_CTRCA_CreateChildEnergyStorage");

        //Script 363 Add ADU Review Flag
        include("BLD_363_ASA_CTRCA_AddAduRevFlag");

        //Script 392 Copy Parcel Attributes to ASI
        include("BLD_392_ASA_CTRCA_CopyParcelAttrToAsi");
    }
}

// Residential Plumbing
if (appMatch("Building/Residential/Plumbing/NA", capId) == true) {
    //Script 13 Residential Application Fee Easy Review
    include("BLD_013_ASA_ResAppFeeEasyReview");

    //Script 526 Building Standard Fee
    include("BLD_526_WTUA_AddBuildingStandardFee");

    //Script 48 Residential Plumbing Permit Specific Fees
    include("BLD_048_ASA_ResPlumbPermitSpecificFees");

    //Script 100 Residential Application Name
    include("BLD_100_ASA_ResAppName");

    //if (publicUser != true) {
    //    //Script 18 OTC Auto Issuance
    //    include("BLD_018_ASA_CTRCA_OtcAutoIssuance");

    //Script 172 Plumbing Add Inspection
    //    include("BLD_172_ASA_CTRCA_PlmAddInspection");
    //}
}

// Residential Pool or Spa - Repair and New
if (appMatch("Building/Residential/Pool or Spa/Repair and New", capId) == true) {
    //Script 70 Residential Pool & Spa Install Permit Specific Fees
    include("BLD_070_ASA_ResPoolSpaInstallPermitSpecificFees");
}

// Residential Pool or Spa - Demolition
if (appMatch("Building/Residential/Pool or Spa/Demolition", capId) == true) {
    //Script 70 Residential Pool & Spa Install Permit Specific Fees
    include("BLD_073_ASA_ResPoolSpaDemoFees");
}

// Residential PV Solar
if (appMatch("Building/Residential/Electrical/PV Solar", capId) == true) {
    //Script 68 Residential PV Solar Permit Specific Fees
    include("BLD_068_ASA_ResPvSolarPermitSpecificFees");

    //Script 526 Building Standard Fee
    include("BLD_526_WTUA_AddBuildingStandardFee");

    //Script 100 Residential Application Name
    include("BLD_100_ASA_ResAppName");

    if (publicUser != true) {
        //Script 213 Route PV Solar for Review
        //include("BLD_213_ASA_CTRCA_RoutePvSolarForReview");

        //Script 216 Activate Fire Review
        //include("BLD_216_ASA_CTRCA_activateFireReview");
    }
}

// Residential Re-Roof
if (appMatch("Building/Residential/Re-Roof/NA", capId) == true) {
    //Script 13 Residential Application Fee Easy Review
    include("BLD_013_ASA_ResAppFeeEasyReview");

    //Script 526 Building Standard Fee
    include("BLD_526_WTUA_AddBuildingStandardFee");

    //Script 21 Residential Reroof Permit Specific Fees
    include("BLD_021_ASA_ResReroofPermitSpecificFees");

    //Script 100 Residential Application Name
    include("BLD_100_ASA_ResAppName");

    //if (publicUser != true) {
    //    //Script 164 Residential Re-roof For Review
    //    include("BLD_164_ASA_CTRCA_RouteSidingStuccoandReroofForReview");

    //Script 178 Residential Reroof Auto Issuance
    //    include("BLD_178_ASA_CTRCA_ReroofAutoIssuance");
    //}
}

// Residential Siding and Stucco
if (appMatch("Building/Residential/Siding and Stucco/NA", capId) == true) {
    //Script 13 Residential Application Fee Easy Review
    include("BLD_013_ASA_ResAppFeeEasyReview");

    //Script 526 Building Standard Fee
    include("BLD_526_WTUA_AddBuildingStandardFee");

    //Script 23 Residential Siding Stucco Permit Specific Fees
    include("BLD_023_ASA_ResSidingStuccoPermitSpecificFees");

    //Script 100 Residential Application Name
    include("BLD_100_ASA_ResAppName");

    //if (publicUser != true) {
    //Script 164 Residential Siding and Stucco For Review
    //    include("BLD_164_ASA_CTRCA_RouteSidingStuccoandReroofForReview");

    //Script 176 Residential Siding and Stucco Auto Issuance
    //    include("BLD_176_ASA_CTRCA_SidingStuccAutoIssuance");
    //}
}

// Residential Temporary Power Pole
if (appMatch("Building/Residential/Electrical/Temporary Power Pole", capId) == true) {
    // Backoffice
    if (publicUser != true) {
        //Script 112 Route for Review
        //include("BLD_112_ASA_CTRCA_RouteForReview");
        //Script 227 Specific Fee
        //include("BLD_227_ASA_CTRCA_TempPowerPoleSpecificFee");
    }
}

// Residential Water Heater
if (appMatch("Building/Residential/Plumbing/Water Heater", capId) == true) {
    //Script 13 Residential Application Fee Easy Review
    include("BLD_013_ASA_ResAppFeeEasyReview");

    //Script 49 Residential Water Heater Permit Specific Fees
    include("BLD_049_ASA_ResWaterHeaterPermitSpecificFees");

    //Script 526 Building Standard Fee
    include("BLD_526_WTUA_AddBuildingStandardFee");

    //Script 100 Residential Application Name
    include("BLD_100_ASA_ResAppName");

    // Backoffice
    //if (publicUser != true) {
    //Script 107 Add Water Heater Children
    //include("BLD_107_ASA_CTRCA_AddWaterHeaterChildren");

    //Script 108 Route Water Heater for Review
    //    include("BLD_108_ASA_CTRCA_RouteWaterHeaterForReview");

    //Script 110 Water Heater Auto Issuance
    //    include("BLD_110_ASA_CTRCA_WaterHeaterAutoIssuance");
    //}
}

// Residential Window or Door
if (appMatch("Building/Residential/Window or Door/NA", capId) == true) {
    //Script 13 Residential Application Fee Easy Review
    include("BLD_013_ASA_ResAppFeeEasyReview");

    //Script 22 Residential Window/Door Permit Specific Fees
    include("BLD_022_ASA_ResWindowDoorPermitSpecificFees");

    //Script 526 Building Standard Fee
    include("BLD_526_WTUA_AddBuildingStandardFee");

    //Script 100 Residential Application Name
    include("BLD_100_ASA_ResAppName");
 
    //if (publicUser != true) {
    //Script 18 OTC Auto Issuance
    //include("BLD_018_ASA_CTRCA_OtcAutoIssuance");

    //Script 166 Route Window Door for Review
    //    include("BLD_166_ASA_CTRCA_RouteWindowDoorForReview");

    //Script 177 Residential Window Auto Issuance
    //    include("BLD_177_ASA_CTRCA_WindowAutoIssuance");
    //}
}

// Residential Demolition
if (appMatch("Building/Residential/Demolition/NA", capId) == true) {
    //Script 78 Residential Demolition Fee
    include("BLD_078_ASA_ResDemoFees");

    //Script 246 Residential PD Specific Fee
    include("BLD_246_ASA_PDSpecificFees");

    //Script 526 Building Standard Fee
    include("BLD_526_WTUA_AddBuildingStandardFee");
    
    //Script 100 Residential Application Name
    include("BLD_100_ASA_ResAppName");
}

// Energy Storage Systems
if (appMatch("Building/Residential/Electrical/Storage Systems", capId) == true) {
    //Script 79 Residential Electrical Storage System Fee
    include("BLD_079_ASA_ResElecStorageFees");

    //Script 526 Building Standard Fee
    include("BLD_526_WTUA_AddBuildingStandardFee");
    
    //Script 100 Residential Application Name
    include("BLD_100_ASA_ResAppName");
}

// Residential Electrical Car Charger
if (appMatch("Building/Residential/Electrical/Car Charger", capId) == true) {
    //Script 74 Residential Electrical Car Charger
    include("BLD_074_ASA_ResElecCarChargerFees");

    //Script 526 Building Standard Fee
    include("BLD_526_WTUA_AddBuildingStandardFee");
    
    //Script 100 Residential Application Name
    include("BLD_100_ASA_ResAppName");
}

// Residential Electrical Temporary Power Pole
if (appMatch("Building/Residential/Electrical/Temporary Power Pole", capId) == true) {
    //Script 100 Residential Application Name
    include("BLD_100_ASA_ResAppName");

    //Script 13 Residential Application Fee Easy Review
    include("BLD_013_ASA_ResAppFeeEasyReview");

    //Script 526 Building Standard Fee
    include("BLD_526_WTUA_AddBuildingStandardFee");
    
    //Script 227 - add temp power pile fee - depends on res versus comm
    include("BLD_227_ASA_CTRCA_TempPowerPoleSpecificFee");
}

//Residential Electrical Generator
if (appMatch("Building/Residential/Electrical/Generator", capId) == true) {
    //Script 104 Residential Plumbing Permit Generate
    //include("BLD_104_ASA_CreateChildPlumbingPermit");

    //Script 100 Residential Application Name
    include("BLD_100_ASA_ResAppName");

    //Script 13 Residential Application Fee Easy Review
    include("BLD_013_ASA_ResAppFeeEasyReview");

    //if (publicUser != true) {
    //Script 219 Residential Electrical Generator Specific Fees
    include("BLD_219_ASA_CTRCA_ElecGenSpecificFees");
    //}

    //Script 526 Building Standard Fee
    include("BLD_526_WTUA_AddBuildingStandardFee");
}

//Residential Skylight
if (appMatch("Building/Residential/Skylight/NA", capId) == true) {
    //Script 13 Residential Application Fee Easy Review
    include("BLD_013_ASA_ResAppFeeEasyReview");

    //Script 223 Residential Skylight Permit Specific Fees
    include("BLD_223_ASA_CTRCA_SkyLightPermSpecificFees");

    //Script 526 Building Standard Fee
    include("BLD_526_WTUA_AddBuildingStandardFee");
    
    //Script 100 Residential Application Name
    include("BLD_100_ASA_ResAppName");

    if (publicUser != true) {

        //Script 224 Residential Skylight Route For  Review
        include("BLD_224_ASA_CTRCA_SkylightRouteForReview");
    }
}

//Residential Fire
if ((appMatch("Building/Residential/Fire/NA", capId) == true)  || (appMatch("Building/Residential/Fire Systems/NA", capId) == true)) {
    //Script 13 Residential Application Fee Easy Review
    include("BLD_013_ASA_ResAppFeeEasyReview");

    //Script 230 Residential Fire Permit Specific Fee
    include("BLD_230_ASA_FirePermitSpecificFee");

    //Script 526 Building Standard Fee
    include("BLD_526_WTUA_AddBuildingStandardFee");
    
    //Script 100 Residential Application Name
    include("BLD_100_ASA_ResAppName");

    if (publicUser != true) {
        //Script 236 Residential Fire Sprinkler Inspection
        include("BLD_236_ASA_FireSprinklerInspection");
    }
}

//Residential Pool or Spa
if (appMatch("Building/Residential/Pool or Spa/NA", capId) == true) {
    //Script 274 Residential Pool or Spa Hot tub Specific Fees
    include("BLD_274_ASA_PoolSpaHotTubSpecificFees");

    //Script 100 Residential Application Name
    include("BLD_100_ASA_ResAppName");
}

//Residential Addition
if (appMatch("Building/Residential/Addition/NA", capId) == true) {
    //Script 278 Create Associated Forms
    include("BLD_278_ASA_AltResCreateAssociatedForms");

    //Script 309 Addition Alt Upfront Fee
    include("BLD_309_ASA_AddAltUpfrontFee");
}

//Residential Deck and Patio
if (appMatch("Building/Residential/Deck and Patio/NA", capId) == true) {
    //Script 100 Residential Application Name
    include("BLD_100_ASA_ResAppName");

    //Script 284 Deck and Patio Specific Fee
    include("BLD_284_ASA_DeckPatioSpecificFee");
}

/*
if(theApp == "Building/Residential/Alteration/NA") {
    var parentId = getParentByCapId(capId);

    if(parentId){
         var parentCap = aa.cap.getCap(parentId).getOutput();
        //get the custom ID - the ID you see as a user - not needed but kept in code
        var parentCustomId = parentCap.getCapID().getCustomID();
        var childCustomId = parentCustomId + "-" + "01"
        var updateCapAltIdResult = aa.cap.updateCapAltID(capId, childCustomId);

    }
}
if(theApp == "Building/Residential/Window or Door/NA") {
    var parentId = getParentByCapId(capId);

    if(parentId){
         var parentCap = aa.cap.getCap(parentId).getOutput();
        //get the custom ID - the ID you see as a user - not needed but kept in code
        var parentCustomId = parentCap.getCapID().getCustomID();
        var childCustomId = parentCustomId + "-" + "02"
        var updateCapAltIdResult = aa.cap.updateCapAltID(capId, childCustomId);

    }
}
if(theApp == "Building/Residential/Siding and Stucco/NA") {
    var parentId = getParentByCapId(capId);

    if(parentId){
         var parentCap = aa.cap.getCap(parentId).getOutput();
        //get the custom ID - the ID you see as a user - not needed but kept in code
        var parentCustomId = parentCap.getCapID().getCustomID();
        var childCustomId = parentCustomId + "-" + "03"
        var updateCapAltIdResult = aa.cap.updateCapAltID(capId, childCustomId);

    }
}
*/

// Residential Propane Water Tank
if (appMatch("Building/Residential/Propane Tank/NA", capId) == true) {
    //Script 276 Propane Water Tank Specific Fees
    include("BLD_276_ASA_PropaneWaterTankSpecificFees");

    //Script 100 Residential Application Name
    include("BLD_100_ASA_ResAppName");
}


// Residential Bath Kitchen Remodel
if (appMatch("Building/Residential/Bath Kitchen Remodel/NA", capId) == true) {
    //Script 100 Residential Application Name
    include("BLD_100_ASA_ResAppName");

    //Script 280 Kitchen Bath Upfront Fees
    include("BLD_280_ASA_KitchenBathUpfrontFees");
}

// Residential Addition
if (appMatch("Building/Residential/Addition/NA", capId) == true) {
    //Script 335 Populate Tsunami fields with GIS
    //include("BLD_335_ASA_PopulateTsunamiGIS");

    //Script 336 Populate Tsunami fields with GIS
    //include("BLD_336_ASA_PopulateGeoTechZoneGIS");

    //Script 100 Residential Application Name
    include("BLD_100_ASA_ResAppName");
}

//Residential Full Utilities
if (appMatch("Building/Residential/Detached Structure/Full Utilities", capId) == true) {
    //Script 342 Acc Struc Upfront
    include("BLD_342_WTUA_AccStruUpfrontFee");

    //Script 278 Create Associated Forms
    include("BLD_278_ASA_AltResCreateAssociatedForms");

    //Script 100 Residential Application Name
    include("BLD_100_ASA_ResAppName");
}

// Signs and Awnings
if (appMatch("Building/Commercial/Signs and Awnings/NA", capId) == true) {
    //Script 490 Add Signs & Awnings Fees
    include("BLD_490_ASA_AddSignsAwningsFees");
}

/*
if (appMatch("Building/Residential/Window or Door/NA", capId) != true
    && appMatch("Building/Residential/Plumbing/Water Heater", capId) != true
    && appMatch("Building/Residential/Plumbing/NA", capId) != true
    && appMatch("Building/Residential/Re-Roof/NA", capId) != true
    && appMatch("Building/Residential/Siding and Stucco/NA", capId) != true
    && appMatch("Building/Residential/Mechanical/HVAC", capId) != true
    && appMatch("Building/Residential/Electrical/Service Upgrade", capId) != true) {
    
    if (publicUser != true) {
        //Script 384 Residential Permit Auto Issued Email
        include("BLD_384_ASA_CTRCA_SendPermitAutoIssuedEmail");
    }
}
*/
if(!publicUser){ //12878-GQ-JF-5/7/2025
	if(appMatch('Building/Auto Issue/NA/NA', capId) ){
		   var unitAmount1 = aa.cap.getBValuatn4AddtInfo(capId).getOutput()
		   var unitAmount = unitAmount1.getEstimatedValue()
		}

		if(matches(appTypeString,'Building/Commercial/Add Alt Imp/NA', 'Building/Commercial/New/NA','Building/Residential/Deck and Patio/NA', 
				   'Building/Residential/Bath Kitchen Remodel/NA', 'Building/Residential/Pool or Spa/NA')){
		   unitAmount = getAppSpecific('What is the construction valuation including labor and materials?')
		}
		
		if(matches(appTypeString,'Building/Residential/Demolition/NA', 'Building/Residential/Electrical/Generator', 'Building/Residential/Electrical/Car Charger',
				   'Building/Residential/Electrical/Service Upgrade', 'Building/Residential/Electrical/Storage Systems', 'Building/Residential/Fire Systems/NA',
				   'Building/Residential/Mechanical/HVAC', 'Building/Residential/Plumbing/Water Heater', 
				   'Building/Residential/Electrical/PV Solar', 'Building/Residential/Re-Roof/NA', 'Building/Residential/Siding and Stucco/NA',
				   'Building/Residential/Skylight/NA', 'Building/Residential/Electrical/Temporary Power Pole', 'Building/Commercial/Temp Struc/NA',
				   'Building/Residential/Plumbing/Water Heater', 'Building/Residential/Window or Door/NA')){
		   unitAmount = getAppSpecific('Valuation')
		}
		
		if(appMatch('Building/Residential/Propane Tank/NA',capId) ){
		   unitAmount = getAppSpecific('What is the construction valuation of this project including labor and materials?')
		}

//		if(matches(appTypeString,'Building/Residential/Addition/NA', 'Building/Residential/Detached Structure/Full Utilities', 'Building/Residential/New/NA')){
//		   unitAmount = getAppSpecific('What is the construction valuation for this project including labor and materials?')
//		}
		if(appMatch('Building/Commercial/Signs and Awnings/NA',capId)){
			unitAmount = getAppSpecific('ConstValuation')
		}
		if(unitAmount){
			var bcv = aa.finance.createBCalcValuatnScriptModel();
				bcv.setCapID(capId);
				bcv.setUseTyp("Manual Valuation");
				bcv.setConTyp("NA");
				bcv.setVersion(1);
				bcv.setUnitValue(unitAmount);
				bcv.setAuditStatus("A");
				bcv.setAuditID(currentUserID);
				createResult = aa.finance.createBCalcValuatn(bcv);
		if (createResult.getSuccess())
			aa.print("New Valuation has been created successfully for record: " + capId.getCustomID());
		else
			aa.print("Failed to create a new Valuation for record: " + capId.getCustomID() + ", " + createResult.getErrorMessage());
		}
}
//************Keeping the fee scripts at the bottom to prevent any fee amount discrepancy issue.************
//Exclude Landscaping
if (appMatch("Building/Residential/Landscaping/NA", capId) != true
    && appMatch("Building/Residential/Pool or Spa/NA", capId) != true
    && appMatch("Building/Residential/Bath Kitchen Remodel/NA", capId) != true
    && appMatch("Building/Residential/Confirmation/NA", capId) != true
    && appMatch("Building/Residential/Addition/NA", capId) != true
    && appMatch("Building/Residential/New/NA", capId) != true
    && appMatch("Building/Residential/Detached Structure/Full Utilities", capId) != true
    && appMatch("Building/Commercial/New/NA", capId) != true
    && appMatch("Building/Commercial/Add Alt Imp/NA", capId) != true) {
    //Script 16 Residential Percentage Fees (NEEDS TO BE ISSUED AT THE END)
    include("BLD_016_ASA_ResPercentageFees");

    //ACA
    //if (publicUser == true) {
    //Script 17 Residential Credit Card Fee
    //include("BLD_017_ASA_ResCreditCardFee");
    //}
}

// BlueBeam integration - keep at the bottom
include("BB_ASA");
