/*------------------------------------------------------------------------------------------------------/
| Program: BATCH_ABOUT_TO_EXPIRE 
|
| Description: This batch is intended to run daily to set records in an "About to Expire" status.
|
| Parameters: 
|           recordType: The record type to process. Should be like 'Building/Permit/NA/NA'
|           expirationSearchStatus: The expiration status to search for. Should be like 'Active'
|           expirationStatusToSet: The expiration status to set on the record. Should be like 'About to Expire'
|           startDays: The number of days from today to start searching for records. Should be like '60'
|           daySpan: The number of days from the start date to search for records. Should be like '0'
|           testMode: If set to 'Y', the script will not make any changes to the records.
|           emailTemplate: (OPTIONAL) The email template to use. Should be like 'FIRE_PERMIT_ABOUT_TO_EXPIRE'
|           acaUrlLinkType: (OPTIONAL) The link type to use for the ACA URL. Should be like '1006'
|           appStatusToSet: (OPTIONAL) The application status to set on the record. Should be like 'About to Expire'
|           validAppStatuses: (OPTIONAL) A comma-separated list of valid application statuses. If set, only records with these app statuses will be processed.
|           
|   
| Version 1.0 - Base Version
|
/------------------------------------------------------------------------------------------------------*/
var myCapId = "";
var myUserId = "ADMIN";
var eventName = "";

/* TEST  */  var eventName = "SCRIPT_TEST";
/* CTRCA */  //var eventName = "ConvertToRealCapAfter";
/* ASA   */  //var eventName = "ApplicationSubmitAfter";
/* ASIUA */  //var eventName = "ApplicationSubmitAfter";
/* WTUA  */  //var eventName = "WorkflowTaskUpdateAfter";  wfTask = "License Issuance"; wfProcess = "XX"; wfComment = "XX";  wfStatus = "Issued";  wfDateMMDDYYYY = "01/27/2015";
/* IRSA  */  //var eventName = "InspectionResultSubmitAfter"; inspId=0;  inspType="Roofing"; inspResult="Failed"; inspResultComment = "Comment"; 
/* ISA   */  //var eventName = "InspectionScheduleAfter"; inspType = "Roofing";
/* PRA   */  //var eventName = "PaymentReceiveAfter";

var useProductInclude = true; //  set to true to use the "productized" include file (events->custom script), false to use scripts from (events->scripts)
var useProductScript = true;  // set to true to use the "productized" master scripts (events->master scripts), false to use scripts from (events->scripts)
var runEvent = true; // set to true to simulate the event and run all std choices/scripts for the record type.
/* master script code don't touch */ aa.env.setValue("EventName", eventName); var vEventName = eventName; var controlString = eventName; var tmpID = aa.cap.getCapID(myCapId).getOutput(); if (tmpID != null) {aa.env.setValue("PermitId1", tmpID.getID1()); aa.env.setValue("PermitId2", tmpID.getID2()); aa.env.setValue("PermitId3", tmpID.getID3());} aa.env.setValue("CurrentUserID", myUserId); var preExecute = "PreExecuteForAfterEvents"; var documentOnly = false; var SCRIPT_VERSION = 3.0; var useSA = false; var SA = null; var SAScript = null; var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_FOR_EMSE"); if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") {useSA = true; SA = bzr.getOutput().getDescription(); bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_INCLUDE_SCRIPT"); if (bzr.getSuccess()) {SAScript = bzr.getOutput().getDescription();} } if (SA) {eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA, useProductScript)); eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA, useProductScript));	/* force for script test*/ showDebug = true; eval(getScriptText(SAScript, SA, useProductScript));} else {eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useProductScript)); eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, useProductScript));} eval(getScriptText("INCLUDES_CUSTOM", null, useProductInclude)); if (documentOnly) {doStandardChoiceActions2(controlString, false, 0); aa.env.setValue("ScriptReturnCode", "0"); aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed."); aa.abortScript();} var prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX", vEventName); var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS"; var doStdChoices = true; var doScripts = false; var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice).getOutput().size() > 0; if (bzr) {var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "STD_CHOICE"); doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I"; var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "SCRIPT"); doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";} function getScriptText(vScriptName, servProvCode, useProductScripts) {if (!servProvCode) servProvCode = aa.getServiceProviderCode(); vScriptName = vScriptName.toUpperCase(); var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput(); try {if (useProductScripts) {var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);} else {var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");} return emseScript.getScriptText() + "";} catch (err) {return "";} } logGlobals(AInfo); if (runEvent && typeof (doStandardChoiceActions) == "function" && doStdChoices) try {doStandardChoiceActions(controlString, true, 0);} catch (err) {logDebug(err.message)} if (runEvent && typeof (doScriptActions) == "function" && doScripts) doScriptActions(); var z = debug.replace(/<BR>/g, "\r"); aa.print(z);
logDebug("<br><b>Intializing Batch Script...</b>");
/*------------------------------------------------------------------------------------------------------/
|
| START: USER CONFIGURABLE PARAMETERS
| 
/------------------------------------------------------------------------------------------------------*/
// aa.env.setValue("recordType", "Planning/Renewable/*/NA");
// aa.env.setValue("expirationSearchStatus", "Active");
// aa.env.setValue("expirationStatusToSet", "About to Expire");
// aa.env.setValue("startDays", "60");
// aa.env.setValue("daySpan", "1");
// aa.env.setValue("emailTemplate", "P_RENEWAL_NOTICE");
// aa.env.setValue("testMode", "Y");
// aa.env.setValue("acaUrlLinkType", "1006");
// aa.env.setValue("appStatusToSet", "About to Expire");
// aa.env.setValue("validAppStatuses", "");
/*------------------------------------------------------------------------------------------------------/
|
| END: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
|
| Start: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var recordTypeString = aa.env.getValue("recordType");
var recordTypeArray = recordTypeString.split("/");
if (recordTypeArray.length != 4) logDebug("<b>ERROR:</b> Record type parameter is incorrectly formatted. Should be like 'Building/Permit/NA/NA'");
else logDebug("Record type: " + recordTypeString);

var expirationSearchStatus = aa.env.getValue("expirationSearchStatus");
if (expirationSearchStatus.length() == 0) {
    logDebug("<b>ERROR:</b> 'expirationSearchStatus' was not set. Please set a value for 'expirationSearchStatus'");
} else {
    logDebug("Searching for records with expiration status: " + expirationSearchStatus);
}

var expStatus = aa.env.getValue("expirationStatusToSet");
if (expStatus.length() == 0) {
    logDebug("<b>WARNING:</b> No new expiration status was set. Exipiration status will not be updated");
    expStatus = null;
} else {
    logDebug("New expiration status: " + expStatus);
}

var startDays = aa.env.getValue("startDays");
if (startDays.length() == 0) logDebug("<b>ERROR:</b> 'startDays' was not set. Please set a value for 'startDays'");
var beginDate = dateAdd(null, parseInt(startDays, 10));

var daySpan = aa.env.getValue("daySpan");
if (daySpan.length() == 0) {
    logDebug("<b>WARNING:</b> 'daySpan' was not set. Only 1 day will be searched.");
    daySpan = 0;
}
var endDate = dateAdd(null, parseInt(startDays, 10) + parseInt(daySpan, 10));

logDebug("Searching for records between " + beginDate + " and " + endDate + "...");

var emailTemplate = aa.env.getValue("emailTemplate");
if (emailTemplate.length() == 0) {
    logDebug("<b>WARNING:</b> No email template was set. No emails will be sent");
    emailTemplate = null;
} else {
    logDebug("Email notifications will be sent using template: " + emailTemplate);
}

var testMode = aa.env.getValue("testMode") == "Y";
if (testMode) logDebug("<b>WARNING:</b> 'testMode' has been set. Records will not be modified");


var appStatus = aa.env.getValue("appStatusToSet");
if (appStatus.length() == 0) {
    logDebug("<b>WARNING:</b> 'appStatusToSet' was not set. App status will not be updated");
    appStatus = null;
} else {
    logDebug("New app status: " + appStatus);
}

var validAppStatusesString = aa.env.getValue("validAppStatuses");
var validAppStatuses;
if (validAppStatusesString.length() > 0) {
    var validAppStatusesArr = validAppStatusesString.split(",");
    validAppStatuses = {};
    for (var i in validAppStatusesArr) {
        validAppStatuses[validAppStatusesArr[i].trim()] = true;
    }
    logDebug("<b>WARNING:</b> 'validAppStatuses' has been set. Only records with these application statuses will be processed: <b>" + Object.keys(validAppStatuses).join(", ") + "</b>");
}

var acaUrlLinkType = aa.env.getValue("acaUrlLinkType");
if (acaUrlLinkType.length() == 0) {
    acaUrlLinkType = "1000";
} else {
    logDebug("ACA URL Link Type: " + acaUrlLinkType);
}
/*------------------------------------------------------------------------------------------------------/
|
| End: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
/------------------------------------------------------------------------------------------------------*/
try {
    var results = {};

    var records = aa.expiration.getLicensesByDate(expirationSearchStatus, beginDate, endDate).getOutput();
    records.forEach(function (record) {
        var result = {
            success: false,
            updatedExpirationStatus: !expStatus,
            updatedAppStatus: !appStatus,
            sentEmail: !emailTemplate,
            error: "",
        }

        capId = aa.cap.getCapID(record.capID.ID1, record.capID.ID2, record.capID.ID3).getOutput();
        cap = aa.cap.getCap(capId).getOutput();
        capName = cap.getSpecialText();

        // If the record does not have a valid application status, skip the rest of the process
        var currentAppStatus = cap.capStatus;
        if (validAppStatuses && !validAppStatuses[currentAppStatus]) {
            result.error = "Record status '" + currentAppStatus + "' is not valid.";
            results[capId.getCustomID()] = result;
            return;
        }

        // If Test Mode is enabled, skip the rest of the process
        if (testMode) {
            result.success = true;
            results[capId.getCustomID()] = result;
            return;
        }

        // Edit the expiration status
        var expr = record.b1Expiration;
        var emailParamExprDate = expr.expDate;
        if (expStatus) {
            expr.expStatus = expStatus;
            var editExpr_Result = aa.expiration.editB1Expiration(expr);
            result.updatedExpirationStatus = editExpr_Result.getSuccess();
            if (!result.updatedExpirationStatus) {
                result.error = editExpr_Result.getErrorMessage() + ": " + editExpr_Result.getErrorMessage();
            }
        }

        // Edit the application status
        if (appStatus) {
            var editStatus_Result = aa.cap.updateAppStatus(capId, "APPLICATION", appStatus, sysDate, "Updated via Batch Script", systemUserObj);
            result.updatedAppStatus = editStatus_Result.getSuccess();
            if (!result.updatedAppStatus) {
                result.error = editStatus_Result.getErrorMessage() + ": " + editStatus_Result.getErrorMessage();
            }
        }

        // Send the notification email
        if (emailTemplate) {
            var toEmail = getPrimaryContactsEmail(capId);
            var emailParams = aa.util.newHashtable();
            emailParams.put("$$altID$$", capId.getCustomID());
            emailParams.put("$$recordAlias$$", cap.capModel.appTypeAlias);
            var primaryAddress = aa.address.getAddressByCapId(capId).getOutput()[0];
            if (primaryAddress) {
                emailParams.put("$$capaddress$$", primaryAddress.displayAddress);
            }
            if (expStatus) {
                emailParams.put("$$expirationStatus$$", expStatus);
            }
            emailParams.put("$$acaRecordUrl$$", gqGetACAUrlL(capId, acaUrlLinkType));
            emailParams.put("$$expirationDate$$", emailParamExprDate);
            emailParams.put("$$EXPIREDATE$$", emailParamExprDate);
            var capIDScriptModel = aa.cap.createCapIDScriptModel(capId.ID1, capId.ID2, capId.ID3);
            var email_Result = aa.document.sendEmailAndSaveAsDocument("", toEmail, "", emailTemplate, emailParams, capIDScriptModel, []);
            result.sentEmail = email_Result.getSuccess();
            if (!result.sentEmail) {
                result.error = "Error sending email: " + email_Result.getErrorMessage();
            }
        }

        // Set the result for logging
        result.success = result.updatedExpirationStatus && result.sentEmail;
        results[capId.getCustomID()] = result;
    });

    // Organize the data for logging
    var successRecords = [];
    var failureRecords = {};
    for (var key in results) {
        if (results[key].success) {
            successRecords.push(key);
        } else {
            failureRecords[key] = results[key];
        }
    }

    // Log the results
    logDebug("<br><b>" + successRecords.length + "/" + records.length + " records were successful.</b>");
    if (successRecords.length > 0) {
        logDebug("Success Records:<br><b>" + successRecords.join("<br>") + "</b>");
    }
    if (Object.keys(failureRecords).length > 0) {
        logDebug("<br>Unsuccessful Records:");
        for (var i in failureRecords) {
            logDebug("<b>" + i + ":</b> " + failureRecords[i].error);
        }
    }

} catch (err) {
    logDebug(err)
}
aa.env.setValue("ScriptReturnCode", "0"); aa.env.setValue("ScriptReturnMessage", debug)
/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/------------------------------------------------------------------------------------------------------*/

//Custom Functions

function createFullCapRenewal(grp, typ, stype, cat, desc) {
    var appCreateResult = aa.cap.createApp(grp, typ, stype, cat, desc);
    if (appCreateResult.getSuccess()) {
        var newId = appCreateResult.getOutput();
        capModel = aa.cap.newCapScriptModel().getOutput();
        capDetailModel = capModel.getCapModel().getCapDetailModel();
        capDetailModel.setCapID(newId);
        aa.cap.createCapDetail(capDetailModel);
        return newId;
    }
    else
    {
        logDebug("**ERROR: adding parent App: " + appCreateResult.getErrorMessage());
    }

}
function createTempRecord(recordType) {
    var recordTypeArray = recordType.split("/");
    var ctm = aa.proxyInvoker.newInstance("com.accela.aa.aamain.cap.CapTypeModel").getOutput();
    ctm.setGroup(recordTypeArray[0]);
    ctm.setType(recordTypeArray[1]);
    ctm.setSubType(recordTypeArray[2]);
    ctm.setCategory(recordTypeArray[3]);
    //ctm.setSearchableInACA("Y");
    var temp_capId = aa.cap.createSimplePartialRecord(ctm, null, "INCOMPLETE EST").getOutput();
    return temp_capId;
}

function lookupL(stdChoice, stdValue) {
    var strControl;
    var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice, stdValue);

    if (bizDomScriptResult.getSuccess()) {
        var bizDomScriptObj = bizDomScriptResult.getOutput();
        strControl = "" + bizDomScriptObj.getDescription(); // had to do this or it bombs.  who knows why?
    }
    return strControl;
}

function gqGetACAUrlL(itemCap, routeId) {
    // returns the path to the record on ACA.  Needs to be appended to the site    
    var enableCustomWrapper = lookupL("ACA_CONFIGS", "ENABLE_CUSTOMIZATION_PER_PAGE");
    var acaUrl = lookupL("ACA_CONFIGS", "ACA_SITE");
    acaUrl = acaUrl.substr(0, acaUrl.toUpperCase().indexOf("/ADMIN"));
    var id1 = itemCap.getID1();
    var id2 = itemCap.getID2();
    var id3 = itemCap.getID3();
    var itemCapModel = aa.cap.getCap(itemCap).getOutput().getCapModel();
    if (!routeId) {
        routeId = "1000";
    }
    acaUrl += "/urlrouting.ashx?type=" + routeId;
    acaUrl += "&Module=" + itemCapModel.getModuleName();
    acaUrl += "&capID1=" + id1 + "&capID2=" + id2 + "&capID3=" + id3;
    acaUrl += "&agencyCode=" + aa.getServiceProviderCode();
    if (matches(enableCustomWrapper, "Yes", "YES"))
        acaUrl += "&FromACA=Y";

    return acaUrl;
}

function copyKeyInfo(srcCapId, targetCapId) {
    var hold_logDebug = logDebug;
    logDebug = function () {};
    //copy ASI infomation
    var AInfo = new Array();
	loadAppSpecific(AInfo, srcCapId);
    for (var asi in AInfo) {
        editAppSpecific(asi, AInfo[asi], targetCapId);
    }
    //copy License infomation
    copyLicensedProf(srcCapId, targetCapId);
    //copy Address infomation
    copyAddresses(srcCapId, targetCapId);
    //copy AST infomation
    copyASITables(srcCapId, targetCapId);
    //copy Parcel infomation
    copyParcels(srcCapId, targetCapId);
    //copy People infomation
    copyContacts(srcCapId, targetCapId);
    //copy Owner infomation
    var ownrObj = aa.owner.getOwnerByCapId(srcCapId).getOutput();
    for (var xx in ownrObj) {
        ownrObj[xx].setCapID(targetCapId);
        aa.owner.createCapOwnerWithAPOAttribute(ownrObj[xx]);
    }
    //Copy CAP condition information
    //copyConditions(srcCapId, targetCapId);
    //Copy additional info.
    var additionalInfo = aa.cap.getBValuatn4AddtInfo(srcCapId).getOutput();
	if (!!additionalInfo) {
		var capDetail = aa.cap.getCapDetail(srcCapId).getOutput();
		additionalInfo.setCapID(targetCapId);
		if (capDetail != null) {
			capDetail.setCapID(targetCapId);
		}
		aa.cap.editAddtInfo(capDetail, additionalInfo);
	}
    logDebug = hold_logDebug;
}
