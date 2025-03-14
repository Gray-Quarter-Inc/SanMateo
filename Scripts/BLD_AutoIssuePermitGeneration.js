/*******************************************************
| Script Title: Batch_AutoIssuePermitGeneration
| Created by: Jei Yang
| Created on: 4Nov21
| Usage: For all records of type "Building/Residential/Mechanical/HVAC", "Building/Residential/Siding and Stucco/NA", "Building/Residential/Window or Door/NA",
|        "Building/Residential/Plumbing/NA", "Building/Residential/Plumbing/Water Heater", "Building/Residential/Re-Roof/NA", "Building/Residential/Electrical/Service Upgrade"
|        For all records that have in workflow history,
|        Workflow task = "Ready to Issue Permit", Status = "Permit Issued", Action By = "Online Permits" in the previous day
|        Generate report "building Permit" and attach to record. 
|        Include a parameter called "RunDate" where if run date is populated run for the day before run date
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
var runDate = aa.env.getValue("runDate");
//var runDate = "12/02/2021"; // TESTING
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
                Avo_LogDebug('AutoIssuePermitGeneration Batch()', 1);

                var result = aa.cap.getByAppType("Building", "Residential");
                if (result.getSuccess() != true) {
                    Avo_LogDebug("Failed to find any Residential buildings. " + result.errorType + ": " + result.errorMessage, 1);
                    return;
                }

                var count = 0;

                var dateToCheck = Avo_GetToday();
                runDate = String(runDate);
                Avo_LogDebug("Run Date(" + runDate + ")", 2);   //debug

                const regex = /(\d{2}[\/]\d{2}[\/]\d{4})/;
                if (runDate && runDate.toLowerCase() != "null" && runDate.length > 0 && regex.test(runDate)) {
                    dateToCheck = Avo_GetDateFromAccelaDateString(runDate);
                }

                dateToCheck.setDate(dateToCheck.getDate() - 1);
                Avo_LogDebug("dateToCheck(" + dateToCheck + ")", 2);	//debug
                var dateToCheckStr = aa.util.formatDate(dateToCheck, "MM/dd/yyyy");


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
                    var cap = aa.cap.getCap(capId).getOutput();

                    var altId = cap.capModel.altID;
                    //Avo_LogDebug(br + "Record(" + altId + ")", 2);  //debug

                    var capTypeModel = cap.capType;
                    var recordType = String(capTypeModel);
                    //Avo_LogDebug("Record Type(" + recordType + ")", 2); //debug

                    var capGroup = String(capTypeModel.getGroup());
                    if (capGroup != "Building") {
                        continue;
                    }

                    var capType = String(capTypeModel.getType());
                    if (capType != "Residential") {
                        continue;
                    }

                    //var capSubType = String(capTypeModel.getSubType());
                    //var capCategory = String(capTypeModel.getCategory());
                    //var recordSubType = capSubType + "/" + capCategory;
            
                    /*
                        For all records of type "Building/Residential/Mechanical/HVAC", "Building/Residential/Siding and Stucco/NA", "Building/Residential/Window or Door/NA",
                |       "Building/Residential/Plumbing/NA", "Building/Residential/Plumbing/Water Heater", "Building/Residential/Re-Roof/NA", "Building/Residential/Electrical/Service Upgrade"
                |       For all records that have in workflow history,
                |       Workflow task = "Ready to Issue Permit", Status = "Permit Issued", Action By = "Online Permits" in the previous day
                |       Generate report "Building Permit" and attach to record. 
                |       Include a parameter called "RunDate" where if run date is populated run for the day before run date
                    */

                    switch (recordType) {
                        case "Building/Residential/Mechanical/HVAC":
                        case "Building/Residential/Siding and Stucco/NA":
                        case "Building/Residential/Window or Door/NA":
                        case "Building/Residential/Plumbing/NA":
                        case "Building/Residential/Plumbing/Water Heater":
                        case "Building/Residential/Re-Roof/NA":
                        case "Building/Residential/Electrical/Service Upgrade":
                            Avo_LogDebug(altId + ' - ' + recordType);
                            break;

                        default:
                            //Avo_LogDebug('"' + recordType + '" is not a supported record type', 1); //debug
                            continue;
                    }


                    // Get the task status change date
                    // #workflow, #date, #status, #history, #taskHistory, #wfHistory
                    var result = aa.workflow.getWorkflowHistory(capId, "Ready to Issue Permit", aa.util.newQueryFormat());
        
                    if (result.getSuccess() != true) {
                        Avo_LogDebug("Failed to get status history. " + result.errorType + ': ' + result.errorMessage, 1);
                        continue;
                    }
                    var statusHistory = result.getOutput();

                    if (statusHistory.length == 0) {
                        continue;
                    }
                    var taskFound = false;
                    
                    for(var j in statusHistory) {
                        var statusModel = statusHistory[j];

                        var statusDate = new Date(statusModel.dispositionDate.epochMilliseconds);
                        var statusDateStr = aa.util.formatDate(statusDate, "MM/dd/yyyy")
                        if (statusDateStr != dateToCheckStr) {
                            continue;
                        }

                        var status = statusModel.disposition;
                        if (status != "Permit Issued") {
                            continue;
                        }

                        Avo_LogDebug("taskDescription: " + statusModel.taskDescription +  " / statusDate: " + statusDateStr + " / taskStatus: " + status, 2);
                        
                        var wfActionBy = statusModel.taskItem.sysUser;
                        if (!wfActionBy) {
                            Avo_LogDebug("ActionBy is not defined.", 1);
                            continue;
                        }
                        var username = "ONLINE PERMITS";

                        /*
                        Avo_LogDebug(" --------------------------------------------------- " , 2);
                        var result = aa.people.getPublicUserByUserName(username);

                        //userID
                        if (result.getSuccess() != true) {
                            Avo_LogDebug("Failed to get user " + username + ". " + result.errorType + ": " + result.errorMessage, 1);
                            return false;
                        }
                    
                        var userModel = result.getOutput();
                        for (x in userModel) {
                            if (typeof userModel[x] != "function") {
                                Avo_LogDebug("  " + x + " = " + userModel[x], 2);
                            }
                        }
                        */

                        var wfActionByName = wfActionBy.fullName;
                        if (wfActionByName.toUpperCase() != username) {
                            Avo_LogDebug("-------wfActionByUserID is not 'Online Permits'-------", 2);
                            continue;
                        }

                        Avo_LogDebug("Task 'Ready to Issue Permit' set to 'Permit Issued' by 'Online Permits' found", 2);
                        taskFound = true;
                        break;
                    }
                    if (!taskFound) {
                        continue;
                    }

                    //Generate report "Building Permit" and attach to record. 
                    var reportName = "Building Permit";
                    var reportParams = aa.util.newHashMap();
                    reportParams.put("capid", altId);

                    var capTypeModel = cap.getCapType();
                    var module = String(capTypeModel.getGroup());
                    Avo_LogDebug("Module(" + module + ")", 2); //debug

                    var report = generateReport(capId, reportName, module, reportParams);
                    Avo_LogDebug('Generated report "' + reportName + '"', 1);


                    count++;
                }

                Avo_LogDebug(br + 'Generate "Building Permit" report for ' + count + ' residential building records', 1);
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

