/*******************************************************
| Script Title: Batch_ExpUpdate(ID374)
| Created by: Nic Bunting
| Created on: 15Jan21
| Usage: For all records of type "Building/Residential/~/~" If ASI "Date of Expiration" is Not blank Then add 5 days to date
| Modified by: ()
*********************************************************/
/****************************************************************************************************************************
 IMPORTANT NOTE: IF USING COMMIT() - To test the script, it must be executed by setting the Script Transaction drop down to 
 "Use User Transaction"
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
//aa.env.setValue("param1","Yes");	//testing
//aa.env.setValue("param1","No");	//testing
/*------------------------------------------------------------------------------------------------------/
| END: TEST DATA
/------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------/
| Start: BATCH PARAMETERS
/------------------------------------------------------------------------------------------------------*/
//var param1 = aa.env.getValue("param1");
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
                Avo_LogDebug('ID2374 expUpdate()', 1);

                var result = aa.cap.getByAppType("Building", "Residential");
                if (result.getSuccess() != true) {
                    Avo_LogDebug("Failed to find any Residential buildings. " + result.errorType + ": " + result.errorMessage, 1);
                    return;
                }

                var count = 0;

                var fieldName = "Date of Expiration";

                var allRecords = result.getOutput();
                for (var i in allRecords) {
                    var elapsedTime = elapsed();
                    if (elapsedTime > timeOutInSeconds) { //only continue if time hasn't expired
                        Avo_LogDebug("A script time-out has caused partial completion of this process.  Please re-run.  "
                            + elapsedTime.toString() +
                            " seconds elapsed, " + timeOutInSeconds + " allowed.", 1);
                        timeExpired = true;
                        break;
                    }

                    capId = allRecords[i].capID;

                    var altId = aa.cap.getCap(capId).getOutput().capModel.altID;
                    Avo_LogDebug(br + "Record(" + altId + ")", 2);  //debug

                    var expDateStr = String(getAppSpecific(fieldName, capId));
                    Avo_LogDebug("Exp Date(" + expDateStr + ")", 2);    //debug

                    if (!expDateStr || expDateStr.toLowerCase() == 'null' || expDateStr == 'undefined' || expDateStr.length == 0) {
                        continue;
                    }

                    var expDate = Avo_GetDateFromAccelaDateString(expDateStr);
                    if (!expDate) {
                        continue;
                    }

                    expDate.setDate(expDate.getDate() + 5);

                    expDateStr = aa.util.formatDate(expDate, "MM/dd/yyyy");
                    var success = editAppSpecific(fieldName, expDateStr, capId);
                    if (success === false) {
                        Avo_LogDebug('Failed to update ASI "' + fieldName + '"', 1);
                        continue
                    }

                    count++;
                    Avo_LogDebug('Set ASI "' + fieldName + '" to ' + expDateStr, 1);
                }

                Avo_LogDebug(br + 'Updated ASI "' + fieldName + '" on ' + count + ' residential building records', 1);
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