/*******************************************************
| Script Title: Batch_PermitCancelled(ID377)
| Created by: Nic Bunting
| Created on: 13Sep21
| Usage: For all records of type "Building/Residential/~/~" If ASI "Date of Expiration" was 545 days ago Then set record status to 
| "Cancelled"
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
//aa.env.setValue("RunDate","03/11/2024");	//testing
//aa.env.setValue("param1","No");	//testing
/*------------------------------------------------------------------------------------------------------/
| END: TEST DATA
/------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------/
| Start: BATCH PARAMETERS
/------------------------------------------------------------------------------------------------------*/
var runDate = aa.env.getValue("RunDate");
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
                Avo_LogDebug('ID377 permitCancelled()', 1);

                var fiveFortyFiveDaysAgo = Avo_GetToday();

                runDate = String(runDate);
                Avo_LogDebug("Run Date(" + runDate + ")", 2);   //debug

                const regex = /(\d{1,2}[\/]\d{2}[\/]\d{4})/;
                if (runDate && runDate.toLowerCase() != "null" && runDate.length > 0 && regex.test(runDate)) {
                    fiveFortyFiveDaysAgo = Avo_GetDateFromAccelaDateString(runDate);
                }

                fiveFortyFiveDaysAgo.setDate(fiveFortyFiveDaysAgo.getDate() - 545);

                var fiveFortyFiveDaysAgoStr = aa.util.formatDate(fiveFortyFiveDaysAgo, "MM/dd/yyyy");
                Avo_LogDebug("545 Days ago(" + fiveFortyFiveDaysAgoStr + ")", 2);   //debug

                var fieldName = "Date of Expiration";
                var result = aa.cap.getCapIDsByAppSpecificInfoField(fieldName, fiveFortyFiveDaysAgoStr);
                if (result.getSuccess() != true) {
                    Avo_LogDebug('Failed to find any records with an exp date of ' + fiveFortyFiveDaysAgoStr + '. '
                        + result.errorType + ': ' + result.errorMessage, 1);
                    return;
                }

                var recordCount = 0;
                var templateCount = 0;
                var template = "BLD_PERMITCANCELLED";

                var allRecords = result.getOutput();
                for (var i in allRecords) {
                    var elapsedTime = elapsed();
                    if (elapsedTime > timeOutInSeconds) { //only continue if time hasn't expired
                        Avo_LogDebug("A script time-out has caused partial completion of this process.  Please re-run.  "
                            + elapsedTime.toString() + " seconds elapsed, " + timeOutInSeconds + " allowed.", 1);
                        timeExpired = true;
                        break;
                    }

                    capId = allRecords[i].capID;

                    var result = aa.cap.getCap(capId);
                    if (result.getSuccess() != true) {
                        Avo_LogDebug(br + 'Failed to get cap for ' + capId + '. ' + result.errorType + ': ' + result.errorMessage, 1);
                        continue;
                    }

                    var cap = result.getOutput();
                    var capModel = cap.capModel;
                    var altId = cap.capModel.altID;
                    Avo_LogDebug(br + "Record(" + altId + ")", 2);  //debug

                    var capTypeModel = cap.capType;
                    var recordType = String(capTypeModel);
                    Avo_LogDebug("Record Type(" + recordType + ")", 2); //debug

                    var capGroup = String(capTypeModel.getGroup());
                    if (capGroup != "Building") {
                        continue;
                    }

                    var capType = String(capTypeModel.getType());
                    if (capType != "Residential") {
                        continue;
                    }

                    updateAppStatus("Cancelled", "Updated by ID377 permitCancelled", capId);
                    recordCount++;
                    Avo_LogDebug('Set record status to "Cancelled" on record ' + altId, 1);


                    // Send reminder
                    var params = aa.util.newHashtable();

                    addParameter(params, "$$altID$$", altId);

                    var result = aa.address.getAddressByCapId(capId);
                    if (result.getSuccess() != true) {
                        Avo_LogDebug('Failed to get addresses on record ' + altId + '. ' + result.errorType + ": " + result.errorMessage, 1);
                        continue;
                    }

                    var addr = "";
                    var allAddressModels = result.getOutput();
                    Avo_LogDebug("Total Addrs(" + allAddressModels.length + ")", 2);    //debug

                    for (var i in allAddressModels) {
                        var addressModel = allAddressModels[i];
                        if (allAddressModels.length > 1 && addressModel.primaryFlag != "Y") {
                            continue;
                        }

                        addr = String(addressModel.displayAddress);
                        if (!addr || addr.length == 0 || addr.toLowerCase() == "null") {
                            addr = addressModel.houseNumberStart + " " + (addressModel.streetDirection ? addressModel.streetDirection + " " : "")
                                + addressModel.streetName + " " + addressModel.streetSuffix + (addressModel.unitStart ? " " + addressModel.unitType
                                    + " " + addressModel.unitStart : "") + ", " + addressModel.city + ", " + addressModel.state + ", " + addressModel.zip;

                        }

                        Avo_LogDebug("Address(" + addr + ")", 2);   //debug

                        break;
                    }
                    addParameter(params, "$$address$$", addr);

                    var result = aa.parcel.getParcelByCapId(capId, aa.util.newQueryFormat());
                    if (result.getSuccess() != true) {
                        Avo_LogDebug('Failed to get parcels on record ' + altId + '. ' + result.errorType + ": " + result.errorMessage, 1);
                        continue;
                    }

                    var parcelNum = 'None';
                    var allParcelModels = result.getOutput().toArray();
                    for (var i in allParcelModels) {
                        var parcelModel = allParcelModels[i];
                        if (allParcelModels.length > 1 && parcelModel.primaryParcelFlag != "Y") {
                            continue;
                        }

                        parcelNum = parcelModel.parcelNumber;
                        Avo_LogDebug("Parcel #(" + parcelNum + ")", 2);	//debug
                        break;
                    }
                    addParameter(params, "$$parcelNumber$$", parcelNum);

                    var alias = capModel.appTypeAlias;
                    Avo_LogDebug("Alias(" + alias + ")", 2);    //debug
                    addParameter(params, "$$appType$$", alias);

                    // Send notification to all Applicant contacts
                    var allContacts = getContactArray(capId);
                    for (var i in allContacts) {
                        var peopleModel = allContacts[i].peopleModel;
                        var contactTypeFlag = peopleModel.contactTypeFlag;
                        Avo_LogDebug("Contact type flag(" + contactTypeFlag + ")", 2);  //debug

                        var name = "";
                        if (contactTypeFlag == "individual") {
                            name = String(allContacts[i].firstName + " " + allContacts[i].lastName);
                        }
                        if (contactTypeFlag == "organization") {
                            name = String(allContacts[i].businessName);
                        }

                        Avo_LogDebug("Name(" + name + ")", 2);  //debug

                        var email = allContacts[i].email;
                        if (!email || String(email).length == 0 || String(email).indexOf("@") == -1 || String(email).indexOf(".") == -1) {
                            Avo_LogDebug("Invalid email " + email, 1);
                            continue;
                        }

                        var contactType = String(allContacts[i].contactType);
                        Avo_LogDebug("Contact type(" + contactType + ")", 2);	//debug

                        if (contactType != "Applicant") {
                            continue;
                        }

                        var success = sendNotification(null, email, "", template, params, new Array(), capId);
                        if (success == true) {
                            Avo_LogDebug('Notification "' + template + '" sent to "' + contactType + '" ' + name + ' at ' + email, 1);
                            templateCount++;
                        } else {
                            Avo_LogDebug('Failed to send notification "' + template + '" to "' + contactType + '" ' + name + ' at ' + email, 1);
                        }
                    }

                    // Send notification to Lic Prof
                    var allLicProfs = getLicenseProfessional(capId);
                    for (var i in allLicProfs) {
                        var licNum = allLicProfs[i].licenseNbr;
                        Avo_LogDebug("Lic #(" + licNum + ")", 2);   //debug

                        var name = String(allLicProfs[i].contactFirstName + " " + allLicProfs[i].contactLastName);
                        //var name = String(allLicProfs[i].businessName);

                        Avo_LogDebug("Name(" + name + ")", 2);  //debug

                        var email = allLicProfs[i].email;
                        if (!email || String(email).length == 0 || String(email).indexOf("@") == -1 || String(email).indexOf(".") == -1) {
                            Avo_LogDebug("Invalid email " + email, 1);
                            continue;
                        }

                        var licType = allLicProfs[i].licenseType;
                        Avo_LogDebug("Lic Type(" + licType + ")", 2);   //debug

                        var success = sendNotification(null, email, "", template, params, new Array(), capId);
                        if (success == true) {
                            Avo_LogDebug('Notification "' + template + '" sent to "' + licType + '" ' + name + ' at ' + email, 1);
                            templateCount++;
                        } else {
                            Avo_LogDebug('Failed to send notification "' + template + '" to "' + licType + '" ' + name + ' at ' + email, 1);
                        }
                    }

                    // Send notification to Owner
                    var result = aa.owner.getOwnerByCapId(capId);
                    if (result.getSuccess() != true) {
                        Avo_LogDebug("Failed to get owners for record " + altId + ". " + result.errorType + ": " + result.errorMessage, 1);
                        continue;
                    }

                    var allOwners = result.getOutput();
                    for (var i in allOwners) {
                        var owner = allOwners[i];

                        var name = owner.ownerFullName;
                        Avo_LogDebug("Name(" + name + ")", 2);  //debug

                        var email = owner.email;
                        if (!email || String(email).length == 0 || String(email).indexOf("@") == -1 || String(email).indexOf(".") == -1) {
                            Avo_LogDebug("Invalid email " + email, 1);
                            continue;
                        }

                        if (allOwners.length > 1 && owner.primaryOwner != "Y") {
                            continue;
                        }

                        var success = sendNotification(null, email, "", template, params, new Array(), capId);
                        if (success == true) {
                            Avo_LogDebug('Notification "' + template + '" sent to owner ' + name + ' at ' + email, 1);
                            templateCount++;
                        } else {
                            Avo_LogDebug('Failed to send notification "' + template + '" to owner ' + name + ' at ' + email, 1);
                        }
                    }
                }
                Avo_LogDebug(br + 'Cancelled ' + recordCount + ' Residential building record(s)', 1);
                Avo_LogDebug(br + br + 'Sent ' + templateCount + ' "' + template + '" reminder(s)', 1);
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