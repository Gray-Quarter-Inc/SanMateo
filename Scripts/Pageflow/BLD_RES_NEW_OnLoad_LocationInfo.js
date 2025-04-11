/*******************************************************
| Record Type: Building/Residential/~/~
| Pageflow: BLD Residential New
| Page: Location Information
| Event: OnLoad
| Modified by: ()
*********************************************************/
if (aa.env.getValue("ScriptName") == "Test") { 	// Setup parameters for Script Test.
    var CurrentUserID = "PUBLICUSER154461"; // Public User ID: rschug
    var CurrentUserID = "PUBLICUSER453828"; // Public User ID: banigo - Linda Charron
    var capIDString = "2019-LOG-0000050";		// Test Record from AA.
    var capIDString = "25TMP-001851";			// Test Temp Record from ACA.
    aa.env.setValue("ScriptCode", "Test");
    aa.env.setValue("CurrentUserID", CurrentUserID); 	// Current User
    sca = capIDString.split("-");
    if (sca.length == 3 && sca[1] == "00000") { // Real capId
        var capID = aa.cap.getCapID(sca[0], sca[1], sca[2]).getOutput();
        aa.print("capID: " + capID + ", capIDString: " + sca.join("-") + " sca");
    } else { // Alt capId
        capID = aa.cap.getCapID(capIDString).getOutput();
        aa.print("capID: " + capID + ", capIDString: " + capIDString);
    }
    capModel = aa.cap.getCapViewBySingle4ACA(capID);
    var itemCap = capModel;
    aa.print("itemCap: " + itemCap + (itemCap ? " " + itemCap.getClass() : ""));

    aa.env.setValue("CapModel", capModel);
    aa.print("CurrentUserID:" + CurrentUserID);
    aa.print("capIDString:" + capIDString);
    aa.print("capID:" + capID);
    aa.print("capModel:" + capModel);
    cap = capModel;
}

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

eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA, useCustomScriptFile));
eval(getScriptText("INCLUDES_CUSTOM", SA, useCustomScriptFile));
if (true) {
    function logDebug(dstr) {
        aa.print(dstr);
        debug += dstr + br;
    }
}

var currentUserID = aa.env.getValue("CurrentUserID");
Avo_LogDebug("CurrentUserID(" + currentUserID + ")", 2);    //debug
var parentCapIdString = String(cap.getParentCapID());
var parentCapId;
if (parentCapIdString) {
    var parentCapIdArr = parentCapIdString.split("-");
    parentCapId = aa.cap.getCapID(parentCapIdArr[0], parentCapIdArr[1], parentCapIdArr[2]).getOutput();
}
Avo_LogDebug("parentCapIdString(" + parentCapIdString + ")", 2);    //debug

var publicUserID = null;
var publicUser = false;
var publicUserEmail = "";
var publicUser = false;
if (currentUserID.indexOf("PUBLICUSER") == 0) { // ignore public users
	publicUserID = currentUserID;
	currentUserID = "ADMIN";
	publicUser = true;
}
logDebug("currentUserID: " + currentUserID + ", publicUserID: " + publicUserID);
if (publicUserID) {
    var publicUserModelResult = aa.publicUser.getPublicUserByPUser(publicUserID);
    if (publicUserModelResult.getSuccess() || !publicUserModelResult.getOutput()) {
        publicUserEmail = publicUserModelResult.getOutput().getEmail().toLowerCase();
        logDebug("publicUserEmail: " + publicUserEmail + " for " + publicUserID);
    } else {
        publicUserEmail = null;
        logDebug("publicUserEmail: " + publicUserEmail + " for " + publicUserID + " not found");
    }
}
var debugEmailTo = "rschug@truepointsolutions.com";
if (publicUserEmail.toLowerCase().indexOf("@_") >= 0) publicUserEmail = publicUserEmail.replace("@_","@");
if (publicUserEmail.toLowerCase().indexOf("turned_off") >= 0) publicUserEmail = publicUserEmail.replace("turned_off","");
if (publicUserEmail.toLowerCase().indexOf("turnedoff") >= 0) publicUserEmail = publicUserEmail.replace("turnedoff","");
if (publicUserEmail.toLowerCase().indexOf("@truepointsolutions.com") >= 0) debugEmailTo = publicUserEmail;
if (publicUserEmail.toLowerCase().indexOf("lindacharron13@gmail.com") >= 0) debugEmailTo = "lcharron@truepointsolutions.com;rschug@truepointsolutons.com";

var AInfo = new Array();						// Create array for tokenized variables
loadAppSpecific4ACA(AInfo); 					// Add AppSpecific Info

/*------------------------------------------------------------------------------------------------------/
| Main Loop
/-----------------------------------------------------------------------------------------------------*/
try {
    //Script 355 Residential Revision Copy APO
    // include("BLD_355_OnLoad_ResRevCopyApo");
    var parcelCap = null, parentAltId = "";
    if (parentCapId) {
        var parentCap = aa.cap.getCapViewBySingle4ACA(parentCapId);
        var parentAltId = aa.cap.getCap(parentCapId).getOutput().capModel.altID;
        Avo_LogDebug("Parent(" + parentAltId + ")", 2);  //debug
    } else {
        Avo_LogDebug("parentCapId(" + parentCapId + ")", 2);  //debug
    }

    if (parcelCap) {
        // Copy Addresses
        var addrModel = parentCap.addressModel;
        if (addrModel) {
            addrModel.capID = cap.capID;

            cap.addressModel = addrModel;
            Avo_LogDebug("Copied address " + addrModel.displayAddress + " from parent " + parentAltId, 1);  //debug
        }

        var allAddrs = parentCap.getAddressModels();
        if (allAddrs && allAddrs.size() > 0) {
            Avo_LogDebug("Total Addresses(" + allAddrs.size() + ")", 2);    //debug

            for (var i = 0; i < allAddrs.size(); i++) {
                var addrModel = allAddrs.get(i);
                Avo_LogDebug(serialize(addrModel), 2);    //debug

                addrModel.capID = cap.capID;

                Avo_LogDebug("Address(" + addrModel.displayAddress + ")", 2);    //debug
            }

            cap.setAddressModels(allAddrs);
            Avo_LogDebug("Copied " + allAddrs.size().toString() + " address(es) from parent " + parentAltId, 1);   //debug
        }

        // Copy Parcels
        var capParcelModel = parentCap.parcelModel;
        if (capParcelModel) {
            capParcelModel.capIDModel = cap.capID;

            cap.parcelModel = capParcelModel;
            Avo_LogDebug("Copied parcel " + capParcelModel.parcelNumber + " from parent " + parentAltId, 1);  //debug
        }

        var allParcels = parentCap.getParcelList();
        if (allParcels && allParcels.size() > 0) {
            Avo_LogDebug("Total Parcels(" + allParcels.size() + ")", 2);    //debug

            for (var i = 0; i < allParcels.size(); i++) {
                var parcelModel = allParcels.get(i);

                parcelModel.capIDModel = cap.capID;

                Avo_LogDebug("Parcel(" + parcelModel.parcelNumber + ")", 2);    //debug
            }

            cap.setParcelList(allParcels);
            Avo_LogDebug("Copied " + allParcels.size().toString() + " parcel(s) from parent " + parentAltId, 1);   //debug
        }

        // Copy Owners
        var refOwnerModel = parentCap.ownerModel;
        if (refOwnerModel) {
            refOwnerModel.capID = cap.capID;

            cap.ownerModel = refOwnerModel;
            Avo_LogDebug("Copied ref owner " + refOwnerModel.ownerFullName + " from parent " + parentAltId, 1);  //debug
        }

        var ownerModel = parentCap.capOwnerModel;
        if (ownerModel) {
            cap.capOwnerModel = ownerModel;
            Avo_LogDebug("Copied owner " + ownerModel.ownerFullName + " from parent " + parentAltId, 1);  //debug
        }

        var allOwners = parentCap.capOwnerList;
        if (allOwners && allOwners.size() > 0) {
            Avo_LogDebug("Total Owners(" + allOwners.size() + ")", 2);    //debug

            for (var i = 0; i < allOwners.size(); i++) {
                var refOwnerModel = allOwners.get(i);

                refOwnerModel.capID = cap.capID;

                Avo_LogDebug("Owner(" + refOwnerModel.ownerFullName + ")", 2);    //debug
            }

            cap.capOwnerList = allOwners;
            Avo_LogDebug("Copied " + allOwners.size().toString() + " ref owner(s) from parent " + parentAltId, 1);   //debug
        }

    }

    aa.env.setValue("CapModel", cap);
} catch (ex) {
    Avo_LogDebug("**ERROR: " + ex.message, 1);
}

aa.sendMail("noreply@smcgov.org", debugEmailTo, "rschug@truepointsolutions.com", "SMC Test: BLD_RES_NEW_OnLoad_LocationInfo", debug); //debug

/*------------------------------------------------------------------------------------------------------/
| END Main Loop
/-----------------------------------------------------------------------------------------------------*/
if (debug.indexOf("**ERROR") > 0) {
    aa.env.setValue("ErrorCode", "1");
    aa.env.setValue("ErrorMessage", debug);
} else {
    if (cancel) {
        aa.env.setValue("ErrorCode", "-2");
        if (showMessage) aa.env.setValue("ErrorMessage", message);
        if (showDebug) aa.env.setValue("ErrorMessage", debug);
    } else {
        aa.env.setValue("ScriptReturnCode", "0");
        // message += "<img src='/citizenaccess/Admin/images/empty.gif' onload=\"$('.ACA_Message_Error').addClass('ACA_Message_Notice')
        //.removeClass('ACA_Message_Error'); \">";
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