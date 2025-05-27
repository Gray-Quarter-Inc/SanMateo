/*------------------------------------------------------------------------------------------------------/
| Program: LicenseProfessionalLoader  Trigger: Batch    
| Version 1.0 - Base Version. 
| 
| 
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
|
| START: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var showMessage = false;				// Set to true to see results in popup window
var disableTokens = false;	
var showDebug = true;					// Set to true to see debug messages in email confirmation
var maxSeconds = 30 * 60;				// number of seconds allowed for batch processing, usually < 5*60
var autoInvoiceFees = "Y";    			// whether or not to invoice the fees added
var useAppSpecificGroupName = false;	// Use Group name when populating App Specific Info Values
var useTaskSpecificGroupName = false;	// Use Group name when populating Task Specific Info Values
var currentUserID = "ADMIN";
var publicUser = null;
var systemUserObj = aa.person.getUser("ADMIN").getOutput();
var GLOBAL_VERSION = 2.0

var cancel = false;

var vScriptName = aa.env.getValue("ScriptCode");
var vEventName = aa.env.getValue("EventName");
var timeExpired = false;
var startDate = new Date();
var startTime = startDate.getTime();
var message =	"";						// Message String
var debug = "";							// Debug String
var br = "<BR>";						// Break Tag
var feeSeqList = new Array();			// invoicing fee list
var paymentPeriodList = new Array();	// invoicing pay periods
var AInfo = new Array();
var partialCap = false;
var SCRIPT_VERSION = 3.0
var emailText = "";

var useSA = false;
var SA = null;
var SAScript = null;
var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_FOR_EMSE"); 
if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") { 
    useSA = true;   
    SA = bzr.getOutput().getDescription();
    bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_INCLUDE_SCRIPT"); 
    if (bzr.getSuccess()) { SAScript = bzr.getOutput().getDescription(); }
    }
    
if (SA) {
    eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS",SA));
    eval(getMasterScriptText(SAScript,SA));
    }
else {
    eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS"));
    }

override = "function logDebug(dstr){ if(showDebug) { aa.print(dstr); } }";
eval(override);

function getMasterScriptText(vScriptName)
{
    var servProvCode = aa.getServiceProviderCode();
    if (arguments.length > 1) servProvCode = arguments[1]; // use different serv prov code
    vScriptName = vScriptName.toUpperCase();    
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    try {
        var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(),vScriptName);
        return emseScript.getScriptText() + ""; 
        } 
	catch(err)
		{
		return "";
		}
}

function getScriptText(vScriptName)
{
    var servProvCode = aa.getServiceProviderCode();
    if (arguments.length > 1) servProvCode = arguments[1]; // use different serv prov code
    vScriptName = vScriptName.toUpperCase();    
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    try {
        var emseScript = emseBiz.getScriptByPK(servProvCode,vScriptName,"ADMIN");
        return emseScript.getScriptText() + ""; 
        } 
	catch(err)
		{
        return "";
		}
}
/*------------------------------------------------------------------------------------------------------/
|
| END: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/

var sysDate = aa.date.getCurrentDate();
var batchJobID = aa.batchJob.getJobID().getOutput();
var batchJobName = "" + aa.env.getValue("batchJobName");
/*----------------------------------------------------------------------------------------------------/
|
| Start: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/



/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
| 
/-----------------------------------------------------------------------------------------------------*/
try{
	logDebug("Start of Job");

	mainProcess();

    logDebug("End of Job: Elapsed Time : " + elapsed() + " Seconds");

    if (showDebug) {
        aa.env.setValue("EventName", "EXTERNAL_REVIEW_LOAD")
        aa.env.setValue("ScriptReturnCode", "0");
        aa.env.setValue("ScriptReturnMessage", "EXTERNAL_REVIEW_LOAD" + debug);   
    } 
}
catch (err) {
    aa.env.setValue("EventName", "EXTERNAL_REVIEW_LOAD")
    aa.env.setValue("ScriptReturnCode", "1");
    aa.env.setValue("ScriptReturnMessage", "EXTERNAL_REVIEW_LOAD" + debug + "   " + err);  
}

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/
function mainProcess() {

	try {
        jsonDataStr = getScriptText("EXTERNAL_REVIEWERS");
        jsonData = JSON.parse(jsonDataStr);

        for (var i in jsonData) {
            processLine(jsonData[i]);
        }
	}
	catch (err) {
		logDebug("Error processing file : " + err);
	}
}

function processLine(line) {
	try {
		today = new Date();
		servProvCode = aa.getServiceProviderCode();
		logDebug("servProvCode: " + servProvCode);
		licNumber = "";
		//var newLic = aa.licenseScript.createLicenseScriptModel();
		var newLicResult = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.LicenseModel");
		logDebug("successfully got model: " + newLicResult.getSuccess());
		if (newLicResult.getSuccess()){
			var newLic = newLicResult.getOutput();
			
		// set for all LP's
		// newLic.setAuditDate(sysDate);
		newLic.setAuditDate(today);
		newLic.setAuditID("ADMIN");
		newLic.setAuditStatus("A");
		newLic.setAgencyCode(servProvCode);
		newLic.setServiceProviderCode(servProvCode);

		newLic.setStateLicense(line.LicenseNumber);
		newLic.setLicState(line.LicenseState);
		newLic.setLicenseType(line.LicenseType);
		newLic.setBusinessName(line.BusinessName);
        if (line.Email && line.Email != "")
		    newLic.setEMailAddress(line.Email);

		oldLic = getRefLicenseProf(line.LicenseNumber);
		if (oldLic) {
			newLic.setLicSeqNbr(oldLic.getLicSeqNbr());
			licBusResult = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.LicenseBusiness");
			if (licBusResult.getSuccess()) {
				var licBus = licBusResult.getOutput();
				var licResult = licBus.editLicenseByPK(newLic);
				logDebug("Successfully updated license!")
			}else{
				logDebug("Error updating license: " + licBusResult.getErrorMessage());
			}
		}else{
			licBusResult = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.LicenseBusiness");
			logDebug("licBusResult.getSuccess(): " + licBusResult.getSuccess());
			if (licBusResult.getSuccess()) {
				var licBus = licBusResult.getOutput();
				var licResult = licBus.createLicense(newLic);
				logDebug("Successfully created license!")
			}else{
				logDebug("Error creating license: " + licBusResult.getErrorMessage());
			}
		}
	
		} // successful licProf model

	}catch (err){
		logDebug("Error processing line " + err);
	}
} // processLine function

/*------------------------------------------------------------------------------------------------------/
| <===========Internal Functions and Classes (Used by this script)
/------------------------------------------------------------------------------------------------------*/
function getParam(pParamName) //gets parameter value and logs message showing param value
{
	var ret = "" + aa.env.getValue(pParamName);
	logDebug("Parameter : " + pParamName + " = " + ret);
	return ret;
}

function isNull(pTestValue, pNewValue) {
	if (pTestValue == null || pTestValue == "")
		return pNewValue;
	else
		return pTestValue;
}

function elapsed() {
	var thisDate = new Date();
	var thisTime = thisDate.getTime();
	return ((thisTime - startTime) / 1000)
}


function logDebug(dstr) {
	aa.print(dstr + "\n")
	aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"), dstr)
}

