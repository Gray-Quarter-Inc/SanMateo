/*******************************************************
| Record Type: Planning/~/~/~
| Pageflow: All Planning Apps with Jurisdiction checks
| Page: Location Information
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

var currentUserID = aa.env.getValue("CurrentUserID");
Avo_LogDebug("CurrentUserID(" + currentUserID + ")", 2);    //debug

if (currentUserID.indexOf("PUBLICUSER") == 0) { currentUserID = "ADMIN"; publicUser = true }  // ignore public users

var AInfo = new Array();						// Create array for tokenized variables
loadAppSpecific4ACA(AInfo); 					// Add AppSpecific Info

/*------------------------------------------------------------------------------------------------------/
| Main Loop
/-----------------------------------------------------------------------------------------------------*/
try {
    //Script 88 Check Zoning Designation
    include("SMC_088_Before_CheckZoningDesig");
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