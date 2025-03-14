/*******************************************************
| Script Title: Batch_ExpPermit(ID67)
| Created by: Nic Bunting
| Created on: 27Aug21
| Usage: For all "Building/Residential/~/~" records below If task "Inspections" is active And ASI "Date of Expiration" is today Then
| close inspections task with status "Expired", send notification "BLD_PERMITEXPIRED_1STEXP" to all "Applicant" contacts CCing all 
| "Owner/Builder" contacts and license profs,
| If date of exp was 365 days ago And no active tasks, send notification "BLD_PERMITEXPIRED_2NDEXP":
| amounts below:
| Record Type                               Fee codes
| ~/~/Addition/NA                           BLD_010
| ~/~/Deck and Patio/NA                     BLD_010
| ~/~/Detached Structure/Full Utilities     BLD_010
| ~/~/New/NA                                BLD_010
| ~/~/Propane Tank/NA                       BLD_010
|
| ~/~/Plumbing/NA                           BLD_012
| ~/~/Plumbing/Water Heater                 BLD_012
|
| ~/~/Electrical/Generator                  BLD_015
|
| ~/~/Fire/NA                               BLD_024
|
| ~/~/Re-Roof/NA                            BLD_025
|
| ~/~/Window or Door/NA                     BLD_026
|
| ~/~/Siding and Stucco/NA                  BLD_027
| ~/~/Skylight/NA                           BLD_027
|
| ~/~/Demolition/NA                         BLD_028
|
| ~/~/Electrical/Temporary Power Pole       BLD_052
|
| ~/~/Bath Kitchen Remodel/NA               BLD_010 + BLD_014
|
| ~/~/Pool or Spa/NA                        BLD_010 + BLD_059
|
| ~/~/Electrical/Car Charger                BLD_014 + BLD_016
|
| ~/~/Electrical/Service Upgrade            BLD_014 + BLD_061
|
| ~/~/Electrical/Storage Systems            BLD_014 + BLD_016 + BLD_060 + BLD_061
|
| ~/~/Electrical/PV Solar                   BLD_014 + BLD_016 + BLD_017 + BLD_025 + BLD_060 + BLD_061
|
| ~/~/Mechanical/HVAC                       BLD_002 + BLD_012 + BLD_018 + BLD_019 + BLD_020 + BLD_021 + BLD_022
|
| ~/~/Landscaping/NA                        BLD_010 + BLD_068 + BLD_070 + BLD_071 + BLD_072 + BLD_073 + BLD_074 + BLD_075
| Modified by: (10Dec21 Jei Yang - Do not assess/invoice fees anymore. Remove the fee invoice part.)
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
//aa.env.setValue("RunDate", "08/21/2022");	//testing
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
eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA, useCustomScriptFile));
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
                Avo_LogDebug('ID67 expPermit()', 1);

                var today = Avo_GetToday();

                runDate = String(runDate);
                Avo_LogDebug("Run Date(" + runDate + ")", 2);   //debug

                const regex = /(\d{2}[\/]\d{2}[\/]\d{4})/;
                if (runDate && runDate.toLowerCase() != "null" && runDate.length > 0 && regex.test(runDate)) {
                    today = Avo_GetDateFromAccelaDateString(runDate);
                }

                // 	Discounted Reinstatement Fee
                processPermits(today, "Expired", null, "BLD_PERMITEXPIRED_1STEXP");

                var elapsedTime = elapsed();
                if (elapsedTime > timeOutInSeconds) { //only continue if time hasn't expired
                    Avo_LogDebug("A script time-out has caused partial completion of this process.  Please re-run.  "
                        + elapsedTime.toString() + " seconds elapsed, " + timeOutInSeconds + " allowed.", 1);
                    timeExpired = true;
                    return;
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

function processPermits(expDate, status, reinstateFeeCode, template) {
    var expDateStr = aa.util.formatDate(expDate, "MM/dd/yyyy");
    Avo_LogDebug(br + "Exp Date(" + expDateStr + ")", 2);	//debug

    var fieldName = "Date of Expiration";

    var feeSched = "BLD_GEN";

    var taskName = "Inspections";

    var result = aa.cap.getCapIDsByAppSpecificInfoField(fieldName, expDateStr);
    if (result.getSuccess() != true) {
        Avo_LogDebug('Failed to find any records with an Exp date of ' + expDateStr + '. '
            + result.errorType + ': ' + result.errorMessage, 1);
        return;
    }

    var count = 0;

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

        var cap = aa.cap.getCap(capId).getOutput();

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

        if (status != null) {
            // Check if Inspections task is active
            var result = aa.workflow.getTask(capId, taskName);
            if (result.getSuccess() != true) {
                Avo_LogDebug('Failed to get task "' + taskName + '" for record ' + altId + '. '
                    + result.errorType + ": " + result.errorMessage, 1);
                continue;
            }

            var taskObj = result.getOutput();

            var processCode = taskObj.processCode;
            Avo_LogDebug("Process(" + processCode + ")", 2);    //debug

            var isActive = taskObj.activeFlag == "Y";
            Avo_LogDebug("Active(" + String(isActive) + ")", 2);	//debug

            if (isActive != true) {
                continue;
            }

            var isComplete = taskObj.completeFlag == "Y";
            Avo_LogDebug("Complete(" + String(isComplete) + ")", 2);	//debug

            if (isComplete == true) {
                continue;
            }
        } else {
            // Check for active tasks
            var hasActiveTask = false;
            var result = aa.workflow.getTasks(capId);
            if (result.getSuccess() != true) {
                Avo_LogDebug('Failed to get task "' + taskName + '" for record ' + altId + '. '
                    + result.errorType + ": " + result.errorMessage, 1);
                continue;
            }

            var allTasks = result.getOutput();
            for (var j in allTasks) {
                var taskObj = allTasks[i];

                var taskName = taskObj.taskDescription;
                Avo_LogDebug("Task(" + taskName + ")", 2);  //debug

                var processCode = taskObj.processCode;
                Avo_LogDebug("Process(" + processCode + ")", 2);    //debug

                var isActive = taskObj.activeFlag == "Y";
                Avo_LogDebug("Active(" + String(isActive) + ")", 2);	//debug

                if (isActive != true) {
                    continue;
                }

                var isComplete = taskObj.completeFlag == "Y";
                Avo_LogDebug("Complete(" + String(isComplete) + ")", 2);	//debug

                if (isComplete == true) {
                    continue;
                }

                Avo_LogDebug('Task "' + taskName + '" is active on record ' + altId, 1);

                hasActiveTask = true;
                break;
            }

            if (hasActiveTask == true) {
                continue;
            }

            Avo_LogDebug('No active tasks on record ' + altId, 1);

            var capToCheck = aa.cap.getCap(capId).getOutput();
            var status = String(capToCheck.getCapStatus());
            Avo_LogDebug("CAP Status(" + status + ")", 2);  //debug
        
            if (status && status.toLowerCase() == "cancelled") {
                continue;
            }

            if (status && status.toLowerCase() == "finaled") {
                continue;
            }
        }

        var capSubType = String(capTypeModel.getSubType());
        var capCategory = String(capTypeModel.getCategory());
        var recordSubType = capSubType + "/" + capCategory;
        
        var allFeeCodes = new Object();
        /*
        switch (recordSubType) {
            case "Addition/NA":
            case "Deck and Patio/NA":
            case "Detached Structure/Full Utilities":
            case "New/NA":
            case "Propane Tank/NA":
                allFeeCodes["BLD_010"] = true;
                break;

            case "Plumbing/NA":
            case "Plumbing/Water Heater":
                allFeeCodes["BLD_012"] = true;
                break;

            case "Electrical/Generator":
                allFeeCodes["BLD_015"] = true;
                break;

            case "Fire/NA":
                allFeeCodes["BLD_024"] = true;
                break;

            case "Re-Roof/NA":
                allFeeCodes["BLD_025"] = true;
                break;

            case "Window or Door/NA":
                allFeeCodes["BLD_026"] = true;
                break;

            case "Siding and Stucco/NA":
            case "Skylight/NA":
                allFeeCodes["BLD_027"] = true;
                break;

            case "Demolition/NA":
                allFeeCodes["BLD_028"] = true;
                break;

            case "Electrical/Temporary Power Pole":
                allFeeCodes["BLD_052"] = true;
                break;

            case "Bath Kitchen Remodel/NA":
                allFeeCodes["BLD_010"] = true;
                allFeeCodes["BLD_014"] = true;
                break;

            case "Pool or Spa/NA":
                allFeeCodes["BLD_010"] = true;
                allFeeCodes["BLD_059"] = true;
                break;

            case "Electrical/Car Charger":
                allFeeCodes["BLD_014"] = true;
                allFeeCodes["BLD_016"] = true;
                break;

            case "Electrical/Service Upgrade":
                allFeeCodes["BLD_014"] = true;
                allFeeCodes["BLD_061"] = true;
                break;

            case "Electrical/Storage Systems":
                allFeeCodes["BLD_014"] = true;
                allFeeCodes["BLD_016"] = true;
                allFeeCodes["BLD_060"] = true;
                allFeeCodes["BLD_061"] = true;
                break;

            case "Electrical/PV Solar":
                allFeeCodes["BLD_014"] = true;
                allFeeCodes["BLD_016"] = true;
                allFeeCodes["BLD_017"] = true;
                allFeeCodes["BLD_025"] = true;
                allFeeCodes["BLD_060"] = true;
                allFeeCodes["BLD_061"] = true;
                break;

            case "Mechanical/HVAC":
                allFeeCodes["BLD_002"] = true;
                allFeeCodes["BLD_012"] = true;
                allFeeCodes["BLD_018"] = true;
                allFeeCodes["BLD_019"] = true;
                allFeeCodes["BLD_020"] = true;
                allFeeCodes["BLD_021"] = true;
                allFeeCodes["BLD_022"] = true;
                break;

            case "Landscaping/NA":
                allFeeCodes["BLD_010"] = true;
                allFeeCodes["BLD_068"] = true;
                allFeeCodes["BLD_070"] = true;
                allFeeCodes["BLD_071"] = true;
                allFeeCodes["BLD_072"] = true;
                allFeeCodes["BLD_073"] = true;
                allFeeCodes["BLD_074"] = true;
                allFeeCodes["BLD_075"] = true;
                break;

            default:
                Avo_LogDebug('"' + recordType + '" is not a supported record type', 1);
                continue;
        }
        
        if (Object.keys(allFeeCodes).length == 0) {
            Avo_LogDebug('No permit fees associated with record type "' + recordType + '"', 1);
            continue;
        }
        */
       
        // Send notification
        var allApplicantEmails = new Array();
        var ccEmailList = "";
        var contactTypeToFind = "Applicant";

        /* Number of Expiration Check */
        var numOfExp = parseInt(getAppSpecific("Number of Expiration", capId));
        Avo_LogDebug("Number of Expiration(" + numOfExp + ")", 2);    //debug
        if (isNaN(numOfExp))
            numOfExp = 0;
            
        if (numOfExp == 2) {
            // if Number of Expiration is 2, add Owner to the ccList.
            var allOwners = new Array();
            var result = aa.owner.getOwnerByCapId(capId);
            if (result.getSuccess() != true) {
                Avo_LogDebug("Failed to get record owners. " + result.errorType + ": " + result.errorMessage, 1);
            } else {
                allOwners = result.getOutput();
            }
        
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
        
                if (ccEmailList.length > 0) {
                    ccEmailList += "; ";
                }

                ccEmailList += email;
            }

            // Send email template: BLD_PERMITCANCELLED to the Applicant, Owner (APO Owner) and all licensed professionals
            template = "BLD_PERMITCANCELLED";
        }

        var allContacts = getContactArray(capId);
        for (var j in allContacts) {
            var peopleModel = allContacts[j].peopleModel;
            var contactTypeFlag = peopleModel.contactTypeFlag;
            Avo_LogDebug("Contact type flag(" + contactTypeFlag + ")", 2);  //debug

            var name = "";
            //if (contactTypeFlag == "organization") {
            name = String(allContacts[j].businessName);
            //}
            //if (contactTypeFlag == "individual") {
            if (name.length == 0 || name.toLowerCase() == 'null') {
                name = String(allContacts[j].firstName + " " + allContacts[j].lastName);
            }

            Avo_LogDebug("Name(" + name + ")", 2);  //debug

            var email = allContacts[j].email;
            Avo_LogDebug("Email(" + email + ")", 2);    //debug

            if (!email || String(email).length == 0 || String(email).indexOf("@") == -1 || String(email).indexOf(".") == -1) {
                Avo_LogDebug("Invalid email " + email, 1);
                continue;
            }

            var contactType = String(allContacts[j].contactType);
            Avo_LogDebug("Contact type(" + contactType + ")", 2);	//debug

            if (contactType == contactTypeToFind) {
                allApplicantEmails.push(email);
            }
            
            if (numOfExp < 2 && contactType == "Owner/Builder") {
                if (ccEmailList.length > 0) {
                    ccEmailList += "; ";
                }

                ccEmailList += email;
            }
        }

        if (allApplicantEmails.length == 0) {
            Avo_LogDebug('Failed to find any "' + contactTypeToFind + '" contacts on record ' + altId, 1);
        } else {
            // Get all Lic Prof emails
            var allLicProfs = new Array();
            result = aa.licenseProfessional.getLicensedProfessionalsByCapID(capId);
            if (result.getSuccess() != true) {
                Avo_LogDebug('Failed to get Lic Profs on record ' + altId + '. ' + result.errorType + ": " + result.errorMessage, 1);
            } else {
                allLicProfs = result.getOutput();
            }

            for (var i in allLicProfs) {
                var licProf = allLicProfs[i];

                var licNum = licProf.licenseNbr;
                Avo_LogDebug("Lic #(" + licNum + ")", 2);   //debug

                var name = String(licProf.contactFirstName + " " + licProf.contactLastName);
                //var name = String(allLicProfs[i].businessName);

                Avo_LogDebug("Name(" + name + ")", 2);  //debug

                var licType = licProf.licenseType;
                Avo_LogDebug("Lic Type(" + licType + ")", 2);   //debug

                var email = licProf.email;
                Avo_LogDebug("Email(" + email + ")", 2);    //debug

                if (!email || String(email).length == 0 || String(email).indexOf("@") == -1 || String(email).indexOf(".") == -1) {
                    Avo_LogDebug("Invalid email " + email, 1);
                    continue;
                }

                if (ccEmailList.length > 0) {
                    ccEmailList += "; ";
                }

                ccEmailList += email;
            }

            Avo_LogDebug("CC(" + ccEmailList + ")", 2); //debug

            // Get address
            var addr = "";
            var allAddressModels = new Array();
            result = aa.address.getAddressByCapId(capId);
            if (result.getSuccess() != true) {
                Avo_LogDebug('Failed to get addresses on record ' + altId + '. ' + result.errorType + ": " + result.errorMessage, 1);
            } else {
                allAddressModels = result.getOutput();
            }

            for (var i in allAddressModels) {
                var addressModel = allAddressModels[i];
                if (allAddressModels.length > 1 && addressModel.primaryFlag != "Y") {
                    continue;
                }

                addr = String(addressModel.displayAddress);
                if (!addr || addr.length == 0 || addr.toLowerCase() == "null") {
                    addr = addressModel.houseNumberStart + " " + (addressModel.streetDirection ? addressModel.streetDirection + " " : "")
                        + addressModel.streetName + " " + addressModel.streetSuffix + (addressModel.unitStart ? " " + addressModel.unitType
                            + " " + addressModel.unitStart : "") + ", " + addressModel.city + ", " + addressModel.state
                        + (addressModel.zip ? ", " + addressModel.zip : '');
                }

                Avo_LogDebug("Address(" + addr + ")", 2);	//debug
                break;
            }

            // Get parcel #
            var parcelNum = "";
            var allParcelModels = new Array();
            result = aa.parcel.getParcelByCapId(capId, aa.util.newQueryFormat());
            if (result.getSuccess() != true) {
                Avo_LogDebug('Failed to get parcels on record ' + altId + '. ' + result.errorType + ": " + result.errorMessage, 1);
            } else {
                allParcelModels = result.getOutput().toArray();
            }

            for (var i in allParcelModels) {
                var parcelModel = allParcelModels[i];
                if (allParcelModels.length > 1 && parcelModel.primaryParcelFlag != "Y") {
                    continue;
                }

                parcelNum = parcelModel.parcelNumber;
                Avo_LogDebug("Parcel #(" + parcelNum + ")", 2);	//debug
                break;
            }

            // Get record alias
            var recordAlias = cap.capModel.appTypeAlias;
            Avo_LogDebug("Alias(" + recordAlias + ")", 2);    //debug

            var params = aa.util.newHashtable();
            addParameter(params, "$$altID$$", altId);
            addParameter(params, "$$address$$", addr);
            addParameter(params, "$$parcelNumber$$", parcelNum);
            addParameter(params, "$$appType$$", recordAlias);

            for (var j in allApplicantEmails) {
                var emailToSendTo = allApplicantEmails[j];

                var success = sendNotification(null, emailToSendTo, ccEmailList, template, params, new Array(), capId);
                if (success == true) {
                    Avo_LogDebug('Notification "' + template + '" sent to "' + contactTypeToFind + '" ' + name + ' at ' + emailToSendTo, 1);
                } else {
                    Avo_LogDebug('Failed to send notification "' + template + '" to "' + contactTypeToFind + '" ' + name + ' at '
                        + emailToSendTo, 1);
                }
            }
        }

        if(numOfExp == 2) {
            // if Number of Expiration is 2, close the task "Inspections" with the status of "Canceled - Abandoned" and skip fee invoice
            var success = closeTask(taskName, "Canceled - Abandoned", "Updated by ID67 expPermit", "", processCode);
            if (success === false) {
                Avo_LogDebug('Failed to close task "' + taskName + '" with status of "' + status + '" on record ' + altId, 1);
                continue;
            }
            Avo_LogDebug('Closed task "' + taskName + '" with the status of "' + status + '". Skipping fee issurance.', 1);
            continue;
        } else {
            numOfExp++;
            editAppSpecific("Number of Expiration", numOfExp, capId);
            Avo_LogDebug("Set Number of Expiration to " + numOfExp, 1);
        }



        // Get fee amount sum
        /*
        result = aa.finance.getFeeItemInvoiceByCapID(capId, aa.util.newQueryFormat());
        if (result.getSuccess() != true) {
            Avo_LogDebug('Failed to get invoiced fee items for record ' + altId + '. '
                + result.errorType + ': ' + result.errorMessage, 1);
            continue;
        }

        var quantity = 0;

        var allFeeItems = result.getOutput();
        for (var j in allFeeItems) {
            var feeItem = allFeeItems[j];

            var feeId = feeItem.feeSeqNbr;
            var feeCode = feeItem.feeCode;
            Avo_LogDebug("Fee Code(" + feeCode + ")", 2);   //debug

            if (!(feeCode in allFeeCodes)) {
                continue;
            }

            //var desc = feeItem.feeDescription;
            //var feeSched = feeItem.feeSchedule;
            //var feePeriod = feeItem.paymentPeriod;
            //var invoiceNum = feeItem.invoiceNbr;
            var amount = feeItem.fee;
            Avo_LogDebug("Amount($" + amount + ")", 2); //debug

            quantity += amount;
            //var quantity = feeItem.unit;
        }

        if (quantity == 0) {
            Avo_LogDebug("Failed to find any matching permit fee codes", 1);
            continue;
        }

        var feeResult = updateFee(reinstateFeeCode, feeSched, "FINAL", quantity, "Y");
        if (feeResult) {
            Avo_LogDebug("Fee " + reinstateFeeCode + " has been added to record " + altId + " with quantity of " + quantity, 1);
        }
        else if (feeResult == null) {
            Avo_LogDebug("Fee " + reinstateFeeCode + " has been adjusted on record " + altId + " to a quantity of " + quantity, 1);
        } else {
            Avo_LogDebug("Failed to add fee " + reinstateFeeCode + " to record " + altId, 1);
        }
        */

        if (status == null) {
            count++;
            continue;
        }

        // Close task
        var success = closeTask(taskName, status, "Updated by ID67 expPermit", "", processCode);
        if (success === false) {
            Avo_LogDebug('Failed to close task "' + taskName + '" with status of "' + status + '" on record ' + altId, 1);
            continue;
        }

        count++;
        Avo_LogDebug('Closed task "' + taskName + '" with status of "' + status + '" on record ' + altId, 1);
    }
    
    if (reinstateFeeCode) {
        Avo_LogDebug(br + 'Expired ' + count + ' record(s) with expiration date of ' + expDateStr + ' and added reinstatement fee '
        + reinstateFeeCode, 1);
    } else {
        Avo_LogDebug(br + 'Expired ' + count + ' record(s) with expiration date of ' + expDateStr, 1);
    }
    
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