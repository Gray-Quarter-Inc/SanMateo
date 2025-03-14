/*******************************************************
| Script Title: Batch_BB_RemoveTempRecordFolders(BB_B01)
| Created by: Tom Grzegorczyk
| Created on: 23Dec20
| Usage: Remove all TMP record folders from BlueBeam that are before the cut-off date
| Modified by: ()
*********************************************************/
/****************************************************************************************************************************
 IMPORTANT NOTE: IF USING COMMIT() - To test the script, it must be executed by setting the Script Transaction drop down to "Use User Transaction"
****************************************************************************************************************************/
/*------------------------------------------------------------------------------------------------------/
| START: USER CONFIGURABLE PARAMETERS
/------------------------------------------------------------------------------------------------------*/
var SCRIPT_VERSION = 3.0;

var showDebug = true;
var showMessage = false;
var message = "";
var debug = "";
var emailText;
//var maxSeconds = 4.5 * 60;
var br = "<br>";
var startDate = new Date();
var startTime = startDate.getTime(); // Start timer
//Validate workflow parameters
var paramsOK = true;
var useAppSpecificGroupName = false;
var appTypeArray;
var AInfo;

var timeExpired = false;
var timeOutInSeconds = 5 * 60 * 60;	// 5 Hours
/*------------------------------------------------------------------------------------------------------/
| END: USER CONFIGURABLE PARAMETERS
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: TEST DATA
/------------------------------------------------------------------------------------------------------*/
aa.env.setValue("module", "BUILDING");	//testing
aa.env.setValue("daysBeforeToday", "30");    //testing
/*------------------------------------------------------------------------------------------------------/
| END: TEST DATA
/------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------/
| Start: BATCH PARAMETERS
/------------------------------------------------------------------------------------------------------*/
var module = aa.env.getValue("module");
var daysBeforeToday = aa.env.getValue("daysBeforeToday");
//var param2 = aa.env.getValue("param2");
/*----------------------------------------------------------------------------------------------------/
| End: BATCH PARAMETERS
/------------------------------------------------------------------------------------------------------*/
sysDate = aa.date.getCurrentDate();
batchJobResult = aa.batchJob.getJobID();
batchJobName = String(aa.env.getValue("BatchJobName"));
currentUserID = "ADMIN";
useProductScript = true;
var useCustomScriptFile = true;  // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
var useSA = false;
var SA = null;
var SAScript = null;

// Set the system user
var result = aa.person.getUser(currentUserID);
if (result.getSuccess() != true) {
    Avo_LogDebug("Failed to get sys user " + currentUserID + ". " + result.errorType + ": " + result.errorMessage, 1);
} else {
    systemUserObj = result.getOutput();
}

eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA, useCustomScriptFile));
// eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA, useCustomScriptFile));
eval(getScriptText("INCLUDES_CUSTOM", SA, useCustomScriptFile));

//eval(getScriptText("INCLUDES_BATCH"));

// Include BlueBeam integration scripts
eval(getScriptText("BB_000_HELPERS"));
eval(getScriptText("BB_001_GETBLUEBEAMTOKEN"));
eval(getScriptText("BB_012_EXECUTEBATCHJOB"));

// Print debug using aa.print instead of aa.debug
useLogDebug = false;
debugLevel = 2;

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

batchJobID = 0;
if (batchJobResult.getSuccess()) {
    batchJobID = batchJobResult.getOutput();
    Avo_LogDebug("Batch Job " + batchJobName + " Job ID is " + batchJobID, 1);
}
else {
    Avo_LogDebug("Batch job ID not found " + batchJobResult.getErrorMessage(), 1);
}

/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/
if (paramsOK) {
    Avo_LogDebug("Start of Job", 1);

    if (timeExpired == true) {
        Avo_LogDebug("End of Job: Elapsed Time : " + elapsed() + " Seconds", 1);
    } else {
        try {
            (function () {
                Avo_LogDebug('B01 removeTempRecordFolders()', 1);
                // Get configuration
                var projectId = lookup("BB_CONFIGS", "PROJECT_ID");
                var adapterUrl = lookup("BB_CONFIGS", "URL");
                var parentFolderId = GETRECORDMODULEFOLDER(module.toUpperCase());
                if (adapterUrl == undefined || adapterUrl == null || adapterUrl == "") {
                    Avo_LogDebug("removeTempRecordFolders() - URL in BB_CONFIGS is not set", 1);
                    return;
                }
                if (projectId == undefined || projectId == null) {
                    Avo_LogDebug("removeTempRecordFolders() - PROJECT_ID in BB_CONFIGS is not set", 1);
                    return;
                }
                if (parentFolderId == null || parentFolderId == "") {
                    Avo_LogDebug("removeTempRecordFolders() - Record module folder not set", 1);
                    return;
                } else {
                    Avo_LogDebug("parentFolderId(" + parentFolderId+")", 2);
                }

                // Get token
                var token = GETBLUEBEAMTOKEN();
                if (token == null) {
                    Avo_LogDebug("removeTempRecordFolders() - Failed to get token from Accela BlueBeam Adapter", 1);
                    return;
                }
                // Prepare call parameters
                var endpoint = "remove_temp_folders";
                var date = Avo_GetToday();
                date.setDate(date.getDate() - Number(daysBeforeToday));
                var cutOffDate = aa.util.formatDate(date, "yyyy-MM-dd");
                Avo_LogDebug("cutOffDate(" + cutOffDate + ")", 2);

                var params = { projectId: projectId, parentFolderId: parentFolderId, cutOffDate: cutOffDate };
                // Execute call
                var result = EXECUTEBATCHJOB(adapterUrl, endpoint, params);
                if (result != null) {
                    Avo_LogDebug("removeTempRecordFolders()  - Batch job executed successfully", 2);
                }
                else {
                    Avo_LogDebug("removeTempRecordFolders()  - Batch job didn't return any result, please check preceding logs", 2);
                }
            })();
        }
        catch (e) {
            Avo_LogDebug("**Error in process " + e.message, 1);
        }
    }
}

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/
function elapsed() {
    var thisDate = new Date();
    var thisTime = thisDate.getTime();
    return ((thisTime - startTime) / 1000)
}

/** ************************************************************************************** 
*  
*/
function startTransaction(timeOutInSec) {
    aa.batchJob.beginTransaction(timeOutInSec);
    Avo_LogDebug(" *** A new transaction has been initiated", 1);
}

/** ************************************************************************************** 
*  
*/
function commit() {
    aa.batchJob.commitTransaction();
    Avo_LogDebug(" *** The transaction has been committed (script changes saved)", 1);
    // aa.batchJob.rollbackTransaction();	//testing
    // Avo_LogDebug(" *** The transaction has been rolled back (for testing)");	//testing
}

/** ************************************************************************************** 
*  
*/
function rollback() {
    aa.batchJob.rollbackTransaction();
    Avo_LogDebug(" *** The transaction has been rolled back (script changes are not saved)", 1);
}