/*******************************************************
| Record Type: Building/~/~/~
| Pageflow: BLD Residential New
| Page: Attached Documents
| Event: Before
| Modified by: ()
*********************************************************/
/*----------------------------------------------------
 Global variables and includes
------------------------------------------------------*/
//Just the vars we need from INCLUDES_ACCELA_GLOBALS
/*------------------------------------------------------------------------------------------------------/
| BEGIN User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/
var showMessage = false;
var showDebug = false;
var useAppSpecificGroupName = false;

// Print debug using aa.print instead of aa.debug
var useLogDebug = true;
var debugLevel = 2;
/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/
var message = "";
var debug = "";
var br = "<BR>";
var useProductScripts = true;
var cancel = false;
var startDate = new Date();
var startTime = startDate.getTime();

var useCustomScriptFile = true;  // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
var SA = null;

var cap = aa.env.getValue("CapModel");
var capId = cap.getCapID();
var altId = capId.getCustomID();
var appType = cap.getCapType();
var appTypeString = String(appType);
var appTypeArray = appTypeString.split("/");

var parentCapIdString = String(cap.getParentCapID());
var parentCapId;
if (parentCapIdString) {
    var parentCapIdArr = parentCapIdString.split("-");
    parentCapId = aa.cap.getCapID(parentCapIdArr[0], parentCapIdArr[1], parentCapIdArr[2]).getOutput();
}

eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA, useCustomScriptFile));
eval(getScriptText("INCLUDES_CUSTOM", SA, useCustomScriptFile));

Avo_LogDebug('Record Type(' + appTypeString + ')', 2);  //debug

var currentUserID = aa.env.getValue("CurrentUserID");
Avo_LogDebug("CurrentUserID(" + currentUserID + ")", 2);    //debug

if (currentUserID.indexOf("PUBLICUSER") == 0) { currentUserID = "ADMIN"; publicUser = true }  // ignore public users

var AInfo = new Array();						// Create array for tokenized variables
loadAppSpecific4ACA(AInfo); 					// Add AppSpecific Info

/*------------------------------------------------------------------------------------------------------/
| Main Loop
/-----------------------------------------------------------------------------------------------------*/
try {
    // for all new permits - check for duplicate document types
    //if ((matches("Building/Residential/*/*", appTypeString) == true)
    //|| (matches("Building/Commercial/*/*", appTypeString) == true)) {
    //    //shawn say to add a check on record status - if record/application status is null then run the script
    //    include("BLD_228_Before_DocumentDuplicationCheck");
    //}

    // Residential Electrical Service Upgrade
    if (matches("Building/Residential/Electrical/Service Upgrade", appTypeString) == true) {
        //Script 30 Residential Require Electrical Service Upgrade Document
        include("BLD_030_Before_ResReqElecServUpgradeDoc");
    }

    // Residential HVAC, Furnace, Air Conditioning, and Heat Pump
    if (matches("Building/Residential/Mechanical/HVAC", appTypeString) == true) {
        //Script 51 Residential Require HVAC Documents
        include("BLD_051_Before_ResReqHvacDocs");
    }

    // Residential Plumbing
    if (matches("Building/Residential/Plumbing/NA", appTypeString) == true) {
        //Script 47 Residential Require Plumbing Documents
        include("BLD_047_Before_ResReqPlumbDocs");
    }

    // Residential Pool or Spa - Repair and New
    if (matches("Building/Residential/Pool or Spa/Repair and New", appTypeString) == true) {
        //Script 85 Residential Require Pool Documents
        include("BLD_085_Before_ResReqPoolDocs");
    }

    // Residential Siding and Stucco
    if (matches("Building/Residential/Siding and Stucco/NA", appTypeString) == true) {
        //Script 106 Residential Siding and Stucco Documents
        include("BLD_106_Before_SidingStuccoDoc");
    }

    // Residential Re-roof
    if (matches("Building/Residential/Re-Roof/NA", appTypeString) == true) {
        //Script 189 Residential Reroof Documents
        include("BLD_189_Before_ReroofReqDoc");
    }

    // Residential Window or Door
    if (matches("Building/Residential/Window or Door/NA", appTypeString) == true) {
        //Script 189 Residential Window or Door Documents
        include("BLD_187_Before_WindowReqDoc");
    }

    // Residential Water Heater
    if (matches("Building/Residential/Plumbing/Water Heater", appTypeString) == true) {
        //Script 197 Residential Water Heater Documents
        include("BLD_197_Before_WaterHeaterReqDoc");
    }

    // Residential Electrical Car Charger
    if (matches("Building/Residential/Electrical/Car Charger", appTypeString) == true) {
        //Script 212 Residential Electrical Car Charger Documents
        include("BLD_212_Before_PV_ESTO_RequireDoc");
    }

    // Residential Electrical PV Solar
    if (matches("Building/Residential/Electrical/PV Solar", appTypeString) == true) {
        //Script 211 Residential Electrical PV, ESS, EVC Documents
        include("BLD_211_Before_PV_ESS_RequireDoc");
    }

    // Residential Electrical PV Solar
    if (matches("Building/Residential/Electrical/Storage Systems", appTypeString) == true) {
        //Script 211 Residential Electrical PV, ESS, EVC Documents
        include("BLD_211_Before_PV_ESS_RequireDoc");
    }

    // Residential Electrical Generator
    if (matches("Building/Residential/Electrical/Generator", appTypeString) == true) {
        //Script 217 Residential Electrical Generator Documents
        include("BLD_218_Before_ElecGenReqDoc");
    }

    // Residential Skylight
    if (matches("Building/Residential/Skylight/NA", appTypeString) == true) {
        //Script 225 Residential Skylight
        include("BLD_225_Before_SkylightReqDoc");
    }

    // Residential Skylight
    if (matches("Building/Residential/Electrical/Temporary Power Pole", appTypeString) == true) {
        //Script 226 Residential Temporary Power Pole
        include("BLD_226_Before_TempPowerPoleReqDoc");
    }

    // Residential Fire
    if ((appMatch("Building/Residential/Fire/NA", capId) == true) || (appMatch("Building/Residential/Fire Systems/NA", capId) == true)) {
        //Script 229 Residential Fire
        include("BLD_229_Before_FireReqDoc");
    }

    // Residential Landscaping
    if (matches("Building/Residential/Landscaping/NA", appTypeString) == true) {
        //Script 229 Residential Landscaping
        include("BLD_238_Before_LandReqDoc");
    }

    // Residential Demolition
    if (matches("Building/Residential/Demolition/NA", appTypeString) == true) {
        //Script 245 Residential Demolition
        include("BLD_245_Before_PoolDemoReqDoc");
    }

    // Swimming Pool / Spa / Hot Tub / Pond
    if (matches("Building/Residential/Pool or Spa/NA", appTypeString) == true) {
        //Script 275 Pool Spa HotTub Require Doc
        include("BLD_275_PoolSpaHotTubRequireDoc");
    }

    // Residential Propane Water Tank
    if (matches("Building/Residential/Propane Tank/NA", appTypeString) == true) {
        //Script 277 Propane Water Tank Req Doc
        include("BLD_277_PropaneWaterTankReqDoc");
    }

    // Residential Deck and Patio
    if (matches("Building/Residential/Deck and Patio/NA", appTypeString) == true) {
        //Script 283 Deck Patio Req Doc
        include("BLD_283_Before_DeckPatioReqDoc");
    }

    //Residential Bath Kitchen Remodel
    if (matches("Building/Residential/Bath Kitchen Remodel/NA", appTypeString) == true) {
        //Script 279 Kitchen Bath Req Doc
        include("BLD_279_Before_KitchenBathReqDoc");
    }

    //Residential Addition
    if (matches("Building/Residential/Addition/NA", appTypeString) == true) {
        //Script 308 Addition Alt Req Doc
        include("BLD_308_Before_AddAltReqDoc");
    }

    //Residential Full Utilities
    if (matches("Building/Residential/Detached Structure/Full Utilities", appTypeString) == true) {
        //Script 341 Residential Detached Structure Req Doc
        include("BLD_341_Before_ResAccStruReqDoc");
    }

    //Residential New
    if (matches("Building/Residential/New/NA", appTypeString) == true) {
        //Script 337 Residential New Req Doc
        include("BLD_337_Before_ResNewReqDoc");
    }

    //Residential Revision
    if (matches("Building/Revision/NA/NA", appTypeString) == true) {
        //Script 379 Residential Revision Req Doc
        include("BLD_379_Before_RevisionReqDoc");
    }

    //Commercial Temporary Structure
    if (matches("Building/Commercial/Temp Struc/NA", appTypeString) == true) {
        //Script 401 Commercial Temporary Structure Req Doc
        include("BLD_401_Before_TempStrucReqDoc");
    }
}
catch (ex) {
    Avo_LogDebug("**ERROR: " + ex.message, 1);
}

/*------------------------------------------------------------------------------------------------------/
| END Main Loop
/-----------------------------------------------------------------------------------------------------*/
if (debug.indexOf("**ERROR") > 0) {
    aa.env.setValue("ErrorCode", "1");
    aa.env.setValue("ErrorMessage", debug);
}
else {
    if (cancel) {
        aa.env.setValue("ErrorCode", "-2");
        if (showMessage) aa.env.setValue("ErrorMessage", message);
        if (showDebug) aa.env.setValue("ErrorMessage", debug);
    }
    else {
        aa.env.setValue("ScriptReturnCode", "0");
        // message += "<img src='/citizenaccess/Admin/images/empty.gif' onload=\"$('.ACA_Message_Error').addClass('ACA_Message_Notice').removeClass('ACA_Message_Error');\">";
        if (showMessage) aa.env.setValue("ErrorMessage", message);
    }
}
/*------------------------------------------------------------------------------------------------------/
| BEGIN Functions
/------------------------------------------------------------------------------------------------------*/
function getScriptText(vScriptName, servProvCode, useProductScripts) {
    if (!servProvCode) servProvCode = aa.getServiceProviderCode();
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    try {
        if (useProductScripts) {
            var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
        } else {
            var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
        }
        return emseScript.getScriptText() + "";
    } catch (err) {
        return "";
    }
}

/*------------------------------------------------------------------------------------------------------/
| END Functions
/------------------------------------------------------------------------------------------------------*/