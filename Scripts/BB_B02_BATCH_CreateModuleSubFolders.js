/*******************************************************
| Script Title: Batch_BB_CreateModuleSubFolders(BB_B02)
| Created by: Tom Grzegorczyk
| Created on: 20Jan21
| Usage: Create a sub-folder within all of the module folders named by current year or with a custom name
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
//aa.env.setValue("folderName", "TESTING");	//testing
/*------------------------------------------------------------------------------------------------------/
| END: TEST DATA
/------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------/
| Start: BATCH PARAMETERS
/------------------------------------------------------------------------------------------------------*/
var folderName = aa.env.getValue("folderName");
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

//Lookup BluebEam config
var projectId = lookup("BB_CONFIGS", "PROJECT_ID");
var adapterUrl = lookup("BB_CONFIGS", "URL"); 
var rootFolderId = lookup("BB_CONFIGS", "ROOT_FOLDER_ID");
// Include BlueBeam integration scripts
eval(getScriptText("BB_000_HELPERS"));
eval(getScriptText("BB_001_GETBLUEBEAMTOKEN"));
eval(getScriptText("BB_002_CREATEBLUEBEAMFOLDER"));
eval(getScriptText("BB_007_GETFOLDERITEMS"));

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
                Avo_LogDebug('B02 createModuleSubFolders()', 1);
                // Get configuration
                if (adapterUrl == undefined || adapterUrl == null || adapterUrl == "") {
                    Avo_LogDebug("createModuleSubFolders() - URL in BB_CONFIGS is not set", 1);
                    return;
                }
                if (projectId == undefined || projectId == null) {
                    Avo_LogDebug("createModuleSubFolders() - PROJECT_ID in BB_CONFIGS is not set", 1);
                    return;
                }
                if (rootFolderId == undefined || rootFolderId == null) {
                    Avo_LogDebug("createModuleSubFolders() - ROOT_FOLDER_ID in BB_CONFIGS is not set", 1);
                    return;
                }
                // Set a default name for new folders
                var d = new Date();
                var year = d.getFullYear();
                var newFolderName = year;
                if (folderName != null && folderName != "") {
                    newFolderName = folderName;
                }
                Avo_LogDebug("createModuleSubFolders() - New folder names will be set to: " + newFolderName, 1);
                // Get token
                var token = GETBLUEBEAMTOKEN();
                if (token == null) {
                    Avo_LogDebug("createModuleSubFolders() - Failed to get token from Accela BlueBeam Adapter", 1);
                    return;
                }
                // Get all module folders from project root folder
                if (token != null && projectId != null && rootFolderId != null) {
                    var response = GETFOLDERITEMS(token, projectId, rootFolderId);
                    if (response.ProjectFolders) {
                        var folders = response.ProjectFolders;
                        for (var f in folders) {
                            var folder = response.ProjectFolders[f];
                            if (folder.Name) {
                                // Create new folder
                                var result = CREATEBLUEBEAMFOLDER(token, projectId, newFolderName, folder.Id, "Folder created by integration");
                                if (result != null) {
                                    var subFolderId = result["Id"];
                                    if (subFolderId != null) {
                                        Avo_LogDebug("createModuleSubFolders() - '" + folder.Name + "/" + newFolderName + "' folder created successfully", 1);
                                    }
                                }
                            }
                        }
                    } else {
                        Avo_LogDebug("createModuleSubFolders() - No folders found in BlueBeam for projectId(" + projectId + ")", 2);
                    }
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