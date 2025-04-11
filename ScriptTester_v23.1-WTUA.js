/*------------------------------------------------------------------------------------------------------/
| Program : ScriptTester_v23.1.js
| Event   : ScriptTester
|
| Usage   : Test Script Master Script by Accela.  See accompanying documentation and release notes.
|           Update User Configurable Parameters section as needed for test record, user & event info.
|           Update Override Standard Functions section as needed for updates to standard functions.
|           Update Custom Code section as needed for a new business rules that are being tested.
|           Add new Custom Functions as needed to end of script.
|
| Client  : N/A
| Action# : N/A
|
| Notes   : 07/01/2020 RS Updated for 9.0 to include doConfigurableScriptActions & other masterscript updates
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START User Configurable Parameters
|
|     Only variables in the following section may be changed.  If any other section is modified, this
|     will no longer be considered a "Master" script and will not be supported in future releases.  If
|     changes are made, please add notes above.
/------------------------------------------------------------------------------------------------------*/
var myCapId = "REV2025-00658-001";		// Replace with Alt ID of test record
var myUserId = "ADMIN";			// Replace with User ID of test user.

// Uncomment the event you would like to test be sure to provide event related variables.
var eventName = ""
/* ASA  */ var eventName = "ApplicationSubmitAfter";
/* ASIUA  */ //var eventName = "ApplicationSpecificInfoUpdateAfter";
/* CTRCA */ //var eventName = "ConvertToRealCapAfter";
/* ASIUA */ //var eventName = "ApplicationSpecificInfoUpdateAfter";
/* ACAA */  //var eventName = "ApplicationConditionAddAfter"; conditionId = null; // if conditionId is null then use all conditions on record.
/* WTUA */  var eventName = "WorkflowTaskUpdateAfter"; wfTask = "Application Submittal"; wfStatus = "Complete";  // Requires wfTask, wfStatus rest of info from Workflow if task found.
/* IRSB */  //var eventName = "InspectionResultSubmitBefore"; inspResult = "Requires Reinspection"; inspResultComment = "Test"; inspType = "Routine"; inspId = 19876471;
/* IRSA */  //var eventName = "InspectionResultSubmitAfter" ; inspResult = "Pass"; inspResultComment = "Comment";  inspType = "Check Job Status"
/* ISA  */  //var eventName = "InspectionScheduleAfter"; inspType = "Routine"; inspId = 19876471;
/* PRA  */  //var eventName = "PaymentReceiveAfter";  
/* FAB  */  //var eventName = "FeeAssessBefore"; FeeItemsList = new java.lang.String("[CC-BLD-G-002|CC-BLD-G-003|CC-BLD-G-004|CC-BLD-G-005]"); FeeItemsQuantityList = new java.lang.String("[1|1|1|1]"); NumberOfFeeItems = 4;

var overrideStdFunctions = false;
var useProductInclude = true; //  set to true to use the "productized" include file (events->custom script), false to use scripts from (events->scripts)
var useProductScript = true;  // set to true to use the "productized" master scripts (events->master scripts), false to use scripts from (events->scripts)
var runEvent = true; // set to true to simulate the event and run all std choices/scripts for the record type.

/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/
var showMessage = false;		// Set to true to see results in popup window
var showDebug = false;			// Set to true to see debug messages in popup window
var disableTokens = false;		// turn off tokenizing of std choices (enables use of "{} and []")
var useAppSpecificGroupName = false;	// Use Group name when populating App Specific Info Values
var useTaskSpecificGroupName = false;	// Use Group name when populating Task Specific Info Values
var enableVariableBranching = true;	// Allows use of variable names in branching.  Branches are not followed in Doc Only
var maxEntries = 99;			// Maximum number of std choice entries.  Entries must be Left Zero Padded

var cancel = false;

var vScriptName = aa.env.getValue("ScriptCode");
var vEventName = aa.env.getValue("EventName");

var startDate = new Date(aa.util.now());
var startTime = startDate.getTime();
var message = "";									// Message String
var debug = "";										// Debug String, do not re-define if calling multiple
var br = "<BR>";									// Break Tag
var feeSeqList = new Array();						// invoicing fee list
var paymentPeriodList = new Array();				// invoicing pay periods

/*------------------------------------------------------------------------------------------------------/
|	BEGIN Set Environment Parameters								***** Do not touch this section *****
/------------------------------------------------------------------------------------------------------*/
aa.env.setValue("CurrentUserID", myUserId);
aa.env.setValue("EventName", eventName); var vEventName = eventName; var eventType = (eventName.indexOf("Before") > 0 ? "Before" : "After");
var controlString = eventName; var tmpID = aa.cap.getCapID(myCapId).getOutput();
if (tmpID != null) { aa.env.setValue("PermitId1", tmpID.getID1()); aa.env.setValue("PermitId2", tmpID.getID2()); aa.env.setValue("PermitId3", tmpID.getID3()); }
if (eventName.indexOf("Before") > 0) {
    var preExecute = "PreExecuteForBeforeEvents";
} else {
    var preExecute = "PreExecuteForAfterEvents";
}
var documentOnly = false;
_setEnvEventParameters(tmpID);

/*******************************************************************************************************/
/************************************ Master Script Code don't touch ***********************************/
/*******************************************************************************************************/
/*------------------------------------------------------------------------------------------------------/
|	BEGIN Master Script Code									***** Do not touch this section *****
/------------------------------------------------------------------------------------------------------*/
var SCRIPT_VERSION = 9.0;
var useCustomScriptFile = true;  // if true, use Events->Custom Script and Master Scripts, else use Events->Scripts->INCLUDES_*
var useSA = false;
var SA = null;
var SAScript = null;
var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_FOR_EMSE");
if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") {
    useSA = true;
    SA = bzr.getOutput().getDescription();
    bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_INCLUDE_SCRIPT");
    if (bzr.getSuccess()) {
        SAScript = bzr.getOutput().getDescription();
    }
}

try {
    var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS";
    var doStdChoices = true; // compatibility default
    var doScripts = false;
    var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice).getOutput().size() > 0;
    if (bzr) {
        var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "STD_CHOICE");
        doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";
        var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "SCRIPT");
        doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";
        var bvr3 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "USE_MASTER_INCLUDES");
        if (bvr3.getSuccess()) { if (bvr3.getOutput().getDescription() == "No") useCustomScriptFile = false };
    }

    if (SA) {
        eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA, useCustomScriptFile));
        eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA, useCustomScriptFile));
        eval(getScriptText(SAScript, SA));
    } else {
        eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useCustomScriptFile));
        eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, useCustomScriptFile));
    }
/* force for script test*/ showDebug = true;

    eval(getScriptText("INCLUDES_CUSTOM", null, useCustomScriptFile));

    if (documentOnly) {
        doStandardChoiceActions(controlString, false, 0);
        aa.env.setValue("ScriptReturnCode", "0");
        aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed.");
        aa.abortScript();
    }

    var prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX", vEventName);
} catch (err) {
    aa.print("A JavaScript Error occurred: " + err.message + " at line " + err.lineNumber + " stack: " + err.stack);
}

/* old getScriptText
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
*/

function getScriptText(vScriptName, servProvCode, useProductScripts) {
    // Modified version to include script location & version if applicable
    // Modified to add optional search in Events>Master Script if script not in Events>Scripts.
    var loadScriptFailover = (arguments.length > 3 && arguments[3] == true ? true : false);
    if (!servProvCode) servProvCode = aa.getServiceProviderCode();
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    try {
        if (typeof (debug) == "undefined") debug = "";
        if (typeof (br) == "undefined") br = "<BR>";
        var emseScript = null;
        var vScriptNamePrefix = "", scriptTextMsg = "";
        if (useProductScripts) {
            var vScriptNamePrefix = "Events>Master Scripts>";
            if (vScriptName == "INCLUDES_CUSTOM") vScriptNamePrefix = "Events>Custom Script>";
            var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
        } else {
            var vScriptNamePrefix = "Events>Scripts>";
            try {
                var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
            } catch (err1) {
                var emseScript = null;
            }
            if (emseScript == null && loadScriptFailover) { // Check Master if not in Scripts
                try {
                    var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
                    if (emseScript && emseScript.scriptText) {
                        var vScriptNamePrefix = "Events>Master Scripts>";
                        if (vScriptName == "INCLUDES_CUSTOM") vScriptNamePrefix = "Events>Custom Script>";
                    }
                } catch (err2) {
                    var emseScript = null;
                }
            }
        }
        var scriptText = (emseScript && emseScript.scriptText ? String(emseScript.scriptText + "").trim() : "");
        if (scriptText.length > 0) {
            var scriptTextMsg = "...... Loading script: " + vScriptNamePrefix + vScriptName
                + (emseScript.scriptName && emseScript.sripteCode != vScriptName ? ", Name: " + emseScript.scriptName : "")
                + (emseScript.sripteCode && emseScript.sripteCode != vScriptName ? ", Code: " + emseScript.sripteCode : "")
                + (emseScript.masterScriptVersion ? ", Version: " + emseScript.masterScriptVersion : "")
                + ", length: " + scriptText.length
            // + (emseScript.auditDate ? ", auditDate: " + emseScript.auditDate : "")
            // + (emseScript.auditID ? ", auditID: " + emseScript.auditID : "")
            // + (emseScript.auditStatus ? ", auditStatus: " + emseScript.auditStatus : "")
            // + (emseScript.description ? ", description: " + emseScript.description : "")
            // + (emseScript.scriptInitializer ? ", scriptInitializer: " + emseScript.scriptInitializer : "")
            // + (emseScript.serviceProviderCode ? ", serviceProviderCode: " + emseScript.serviceProviderCode : "")
            // + (emseScript.scriptText ? ", Text: " + String(emseScript.scriptText).substring(106, 146) + " ..." : "")
            // + br + describe_TPS(emseScript)
            if (scriptTextMsg) {
                if (typeof (logDebug) == "undefined") {
                    debug += scriptTextMsg + br;
                } else {
                    logDebug(scriptTextMsg);
                }
            }
        }
        return scriptText;
    } catch (err) {
        if (err.message.indexOf("ScriptNotFoundException") > 0) {
            var scriptTextMsg = "...... Loading script: " + vScriptNamePrefix + vScriptName + " not found.";
            var scriptTextMsg = "ERROR: Loading script: " + vScriptNamePrefix + vScriptName + " at line " + err.lineNumber + " : " + err.message
        } else if (vScriptNamePrefix != "Events>Scripts>") {
            var scriptTextMsg = "ERROR: Loading script: " + vScriptNamePrefix + vScriptName + ": " + err.message
        } else {
            var scriptTextMsg = "ERROR: Loading script: " + vScriptNamePrefix + vScriptName + " at line " + err.lineNumber + " : " + err.message
        }
        if (typeof (logDebug) == "undefined") {
            aa.print(scriptTextMsg);
            aa.print("Stack: " + err.stack);
        } else {
            logDebug(scriptTextMsg);
            if (scriptErrorMsg.indexOf(" not found") < 0)
                logDebug("Stack: " + err.stack);
        }
        return "";
    }
}

/*------------------------------------------------------------------------------------------------------/
|	END Master Script Code
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| 	BEGIN Override Standard Functions								<<<< Update as necessary >>>>>
/------------------------------------------------------------------------------------------------------*/
if (overrideStdFunctions) { // override Standard Functions 
    logDebug("=====");
    logDebug("Overriding functions...");
    logDebug("=====");

    // Set Font colors for EMSE Standard Choice.
    lastErrorMsg = "";      // Used by custom logDebug function for tracking last error.
    formatErrorB = "";      // formatting for custom error messages
    formatErrorE = "";
    formatErrorB = "<font color=Red><b>";
    formatErrorE = "<b></font>";
    stdChoiceCriteriaBeginTrue = "<font color=Blue>";
    stdChoiceCriteriaEndTrue = "</font>";
    stdChoiceCriteriaBeginFalse = "<font color=LightBlue>";
    stdChoiceCriteriaEndFalse = "</font>"
    stdChoiceActionBegin = "<font color=BlueViolet>";
    stdChoiceActionEnd = "</font>"
    stdChoiceDisabledBegin = "<font color=LightGray>";
    stdChoiceDisabledEnd = "</font>"
    stdChoiceDisabledBegin = "";		// Do not display disabled standard choices.
    stdChoiceDisabledBegin = "";

    function doStandardChoiceActions(stdChoiceEntry, doExecution, docIndent) {
        var thisDate = new Date();
        var thisTime = thisDate.getTime();
        var lastEvalTrue = false;
        stopBranch = false;  // must be global scope
        logDebug("Executing : " + stdChoiceEntry + "," + doExecution + "," + docIndent + ", Elapsed Time: " + ((thisTime - startTime) / 1000) + " Seconds (Override)")
        var pairObjArray = getScriptAction(stdChoiceEntry);
        if (!doExecution) docWrite(stdChoiceEntry, true, docIndent);
        try {
            for (xx in pairObjArray) {
                doObj = pairObjArray[xx];
                if (doExecution) {
                    if (doObj.enabled) {
                        if (stopBranch) {
                            stopBranch = false;
                            break;
                        }
                        try {
                            stdChoiceCriteriaBegin = stdChoiceCriteriaBeginFalse
                            stdChoiceCriteriaEnd = stdChoiceCriteriaEndFalse
                            if (eval(token(doObj.cri)) || (lastEvalTrue && doObj.continuation)) {
                                stdChoiceCriteriaBegin = stdChoiceCriteriaBeginTrue
                                stdChoiceCriteriaEnd = stdChoiceCriteriaEndTrue
                            }
                            logDebug(aa.env.getValue("CurrentUserID") + " : " + stdChoiceEntry + " : #" + doObj.ID + " : Criteria : " + stdChoiceCriteriaBegin + doObj.cri + stdChoiceCriteriaEnd, 2)
                            if (eval(token(doObj.cri)) || (lastEvalTrue && doObj.continuation)) {
                                logDebug(aa.env.getValue("CurrentUserID") + " : " + stdChoiceEntry + " : #" + doObj.ID + " : Action : " + stdChoiceActionBegin + doObj.act + stdChoiceActionEnd, 2)
                                eval(token(doObj.act));
                                lastEvalTrue = true;
                            }
                            else {
                                if (doObj.elseact) {
                                    logDebug(aa.env.getValue("CurrentUserID") + " : " + stdChoiceEntry + " : #" + doObj.ID + " : Else : " + stdChoiceActionBegin + doObj.elseact + stdChoiceActionEnd, 2)
                                    eval(token(doObj.elseact));
                                }
                                lastEvalTrue = false;
                            }
                        }
                        catch (err) {
                            showDebug = 3;
                            logDebug("**ERROR** An error occurred in the following standard choice " + stdChoiceEntry + "#" + doObj.ID + "  Error:  " + err.message);
                        }
                    } else if (stdChoiceDisabledBegin != "") { // Disabled
                        logDebug(stdChoiceDisabledBegin + aa.env.getValue("CurrentUserID") + " : " + stdChoiceEntry + " : #" + doObj.ID + " : <DISABLED> : " + doObj.cri + stdChoiceDisabledEnd, 2)
                    }
                }
                else // just document
                {
                    docWrite("|  ", false, docIndent);
                    var disableString = "";
                    if (!doObj.enabled) disableString = "<DISABLED>";
                    if (doObj.elseact)
                        docWrite("|  " + doObj.ID + " " + disableString + " " + doObj.cri + " ^ " + doObj.act + " ^ " + doObj.elseact, false, docIndent);
                    else
                        docWrite("|  " + doObj.ID + " " + disableString + " " + doObj.cri + " ^ " + doObj.act, false, docIndent);
                    for (yy in doObj.branch) {
                        doStandardChoiceActions(doObj.branch[yy], false, docIndent + 1);
                    }
                }
            } // next sAction
            if (!doExecution) docWrite(null, true, docIndent);
        } catch (err) {
            showDebug = 3;
            var context = "doStandardChoiceActions (" + stdChoiceEntry + ")";
            logDebug("**ERROR** An error occurred in " + context + " Line " + err.lineNumber + " Error:  " + err.message);
            logDebug("Stack: " + err.stack);
        }
        var thisDate = new Date();
        var thisTime = thisDate.getTime();
        logDebug("Finished: " + stdChoiceEntry + ", Elapsed Time: " + ((thisTime - startTime) / 1000) + " Seconds")
    }

    function doScriptActions() {
        logDebug("Overriding doScriptActions() from INCLUDES_ACCELA_FUNCTIONS with Debug Email Version");
        try {
            include(prefix + ":" + "*/*/*/*");
            if (typeof (appTypeArray) == "object") {
                include(prefix + ":" + appTypeArray[0] + "/*/*/*");
                include(prefix + ":" + appTypeArray[0] + "/" + appTypeArray[1] + "/*/*");
                include(prefix + ":" + appTypeArray[0] + "/" + appTypeArray[1] + "/" + appTypeArray[2] + "/*");
                include(prefix + ":" + appTypeArray[0] + "/*/" + appTypeArray[2] + "/*");
                include(prefix + ":" + appTypeArray[0] + "/*/" + appTypeArray[2] + "/" + appTypeArray[3]);
                include(prefix + ":" + appTypeArray[0] + "/*/*/" + appTypeArray[3]);
                include(prefix + ":" + appTypeArray[0] + "/" + appTypeArray[1] + "/*/" + appTypeArray[3]);
                include(prefix + ":" + appTypeArray[0] + "/" + appTypeArray[1] + "/" + appTypeArray[2] + "/" + appTypeArray[3]);
            }
        } catch (err) {
            showDebug = 3;
            var context = "doScriptActions (include)";
            logDebug("**ERROR** An error occurred in " + context + " Line " + err.lineNumber + " Error:  " + err.message);
            logDebug("Stack: " + err.stack);
        }

        // Send Debug Email
        try {
            if (typeof (debugEmailTo) == "undefined") { debugEmailTo = ""; }
            if (typeof (controlString) == "undefined") { controlString = ""; }
            if (debugEmailTo != "") {
                var environment = (typeof (envName) == "undefined" ? "" : (envName == "PROD" ? "" : envName));
                var reportPopup = (showMessage && message.indexOf("/portlets/reports/reportShow.do?") >= 0); // Report Popup in message?
                var debugError = (debug.indexOf("**" + "ERROR") > 0); // Error in debug?
                var capIDMsg = (typeof (capIDString) == "undefined" ? "" : capIDString + " ") + (typeof (capId) == "undefined" ? "" : capId + " ");
                logDebug("showMessage (" + showMessage + ") " + (reportPopup ? " with Report Popup" : "") + " " + message.replace("/portlets/reports/reportShow.do?", "").replace("**" + "ERROR", "** ERROR"));
                logDebug("debug (" + showDebug + ") " + (debugError ? " with ERROR" : "") + ", debugEmailTo: " + debugEmailTo);
                result = aa.sendMail(sysFromEmail, debugEmailTo, "", environment + " DEBUG: " + capIDMsg + controlString + (debugError ? " - Failed" : ""), debug);
                if (result.getSuccess()) {
                    logDebug(environment + " DEBUG Email sent to " + debugEmailTo);
                    if (reportPopup && !debugError) { showDebug = false; aa.print(String("===== DEBUG =====<BR>" + debug).replace(/<BR>/g, "\r")); }  // Allow Popup to show so showDebug must be false;
                    if (publicUser && !debugError) { showDebug = false; } // Don't display debug message in ACA unless ERROR. So debug does prevent page from advancing.
                } else {
                    logDebug("Failed to send DEBUG Email to " + debugEmailTo);
                }
                if (debugError) showDebug = true;
            }
        } catch (err) {
            showDebug = 3;
            var context = "doScriptActions (sendDebugEmail)";
            logDebug("ERROR: An error occurred in " + context + " Line " + err.lineNumber + " Error:  " + err.message);
            logDebug("Stack: " + err.stack);
        }
    }

    function doConfigurableScriptActions() {
        var module = "";

        if (appTypeArray && appTypeArray[0] != undefined) {
            module = appTypeArray[0];
        }

        if (typeof capId !== 'undefined' && capId) {
            if (module == "") {
                var itemCap = aa.cap.getCap(capId).getOutput();
                var itemCapModel = itemCap.getCapModel();
                module = itemCapModel.getModuleName();
            }
        }

        if (module != "") {
            rulesetName = "CONFIGURABLE_RULESET_" + module;
            rulesetName = rulesetName.toUpperCase();
            logDebug("rulesetName: " + rulesetName);

            try {
                var configRuleset = getScriptText(rulesetName);
                if (configRuleset == "") {
                    logDebug("No JSON file exists for this module.");
                } else {
                    var configJSON = JSON.parse(configRuleset);

                    // match event, run appropriate configurable scripts
                    settingsArray = [];
                    if (configJSON[controlString]) {
                        var ruleSetArray = configJSON[controlString];
                        var scriptsToRun = ruleSetArray.StandardScripts;
                        var customScriptsToRun = ruleSetArray.CustomScripts;
                        var script;
                        var validScript;

                        for (var s in scriptsToRun) {

                            if (exists(scriptsToRun[s], customScriptsToRun)) {
                                logDebug("doConfigurableScriptActions scriptsToRun[s]: " + scriptsToRun[s] + " Overridden in CustomScripts, Skipped.");
                                continue;
                            }

                            logDebug("doConfigurableScriptActions scriptsToRun[s]: " + scriptsToRun[s]);
                            script = scriptsToRun[s];
                            validScript = getScriptText(script);
                            if (validScript != "") {
                                logDebug("Script " + script + " exist and executed from Non-Master scripts");
                                eval(validScript);
                            } else {
                                eval(getScriptText(script, null, true)); // now calling this section from master scripts
                            }
                        }
                        for (var cs in customScriptsToRun) {
                            logDebug("doConfigurableScriptActions customScriptsToRun[cs]: " + customScriptsToRun[cs]);
                            script = customScriptsToRun[cs];
                            validScript = getScriptText(script);
                            if (validScript == "") {
                                logDebug("Configurable custom script " + script + " does not exist.");
                            } else {
                                eval(validScript);
                            }
                        }
                    }
                }
            } catch (err) {
                logDebug("ERROR: doConfigurableScriptActions " + rulesetName + " Error Message:" + err.message);
            }
        }
        // Send Debug Email
        try {
            if (typeof (debugEmailTo) == "undefined") { debugEmailTo = ""; }
            if (typeof (controlString) == "undefined") { controlString = ""; }
            if (debugEmailTo != "") {
                var environment = (typeof (envName) == "undefined" ? "" : (envName == "PROD" ? "" : envName));
                var reportPopup = (showMessage && message.indexOf("/portlets/reports/reportShow.do?") >= 0); // Report Popup in message?
                var debugError = (debug.indexOf("**" + "ERROR") > 0); // Error in debug?
                var capIDMsg = (typeof (capIDString) == "undefined" ? "" : capIDString + " ") + (typeof (capId) == "undefined" ? "" : capId + " ");
                logDebug("showMessage (" + showMessage + ") " + (reportPopup ? " with Report Popup" : "") + " " + message.replace("/portlets/reports/reportShow.do?", "").replace("**" + "ERROR", "** ERROR"));
                logDebug("debug (" + showDebug + ") " + (debugError ? " with ERROR" : "") + ", debugEmailTo: " + debugEmailTo);
                result = aa.sendMail(sysFromEmail, debugEmailTo, "", environment + " DEBUG: " + capIDMsg + controlString + (debugError ? " - Failed" : ""), debug);
                if (result.getSuccess()) {
                    logDebug(environment + " DEBUG Email sent to " + debugEmailTo);
                    if (reportPopup && !debugError) { showDebug = false; aa.print(String("===== DEBUG =====<BR>" + debug).replace(/<BR>/g, "\r")); }  // Allow Popup to show so showDebug must be false;
                    if (publicUser && !debugError) { showDebug = false; } // Don't display debug message in ACA unless ERROR. So debug does prevent page from advancing.
                } else {
                    logDebug("Failed to send DEBUG Email to " + debugEmailTo);
                }
                if (debugError) showDebug = true;
            }
        } catch (err) {
            showDebug = 3;
            var context = "doScriptActions (sendDebugEmail)";
            logDebug("ERROR: An error occurred in " + context + " Line " + err.lineNumber + " Error:  " + err.message);
            logDebug("Stack: " + err.stack);
        }
    }

    function logDebug(dstr) {
        if (typeof (showDebug) == "undefined") showDebug = true;
        if (typeof (debug) == "undefined") debug = "";
        if (typeof (br) == "undefined") br = "<BR>";
        if (typeof (formatErrorB) == "undefined") formatErrorB = "";
        if (typeof (formatErrorE) == "undefined") formatErrorE = "";
        if (typeof (lastErrorMsg) == "undefined") lastErrorMsg = "";
        var formatErrB = "";
        var formatErrE = "";
        aa.print(dstr);
        if (dstr.indexOf("ERROR") >= 0) {
            formatErrB = formatErrorB;
            formatErrE = formatErrorE;
            // aa.print(dstr);
            dstr = formatErrB + dstr + formatErrE;
            lastErrorMsg += dstr + br;
        }
        vLevel = 1
        if (arguments.length > 1)
            vLevel = arguments[1];
        if ((showDebug & vLevel) == vLevel || vLevel == 1)
            debug += dstr + br;
        if ((showDebug & vLevel) == vLevel)
            aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"), dstr);
    }

    function getParcel() {
        var thisParcel = null;
        var capParcelResult = aa.parcel.getParcelandAttribute(itemCap, null);
        if (capParcelResult.getSuccess()) {
            var fcapParcelObj = capParcelResult.getOutput().toArray();
            for (i in fcapParcelObj) {
                thisParcel = fcapParcelObj[i];
                if (thisParcel.getPrimaryParcelFlag() == "Y") break;		// Primary found?
            }
        }
        // logDebug("Parcel: " + thisParcel + br + describe_TPS(thisParcel));
        logDebug("Parcel: " + thisParcel.getParcelNumber());
        return thisParcel;
    }

} // End Override Functions

/*------------------------------------------------------------------------------------------------------/
| 	BEGIN Override Standard Functions
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
|	BEGIN Master Script Code: Business Scripts					***** Do not touch this section *****
/------------------------------------------------------------------------------------------------------*/
if (preExecute.length) doStandardChoiceActions(preExecute, true, 0); 	// run Pre-execution code
logGlobals(AInfo);
if (runEvent && typeof (doStandardChoiceActions) == "function" && doStdChoices) try { doStandardChoiceActions(controlString, true, 0); } catch (err) { logDebug(err.message) }
if (runEvent && typeof (doScriptActions) == "function" && doScripts) doScriptActions();
if (runEvent && typeof (doConfigurableScriptActions) == "function" && doScripts) doConfigurableScriptActions();	// this controller replaces lookups for STANDARD_SOLUTIONS and CONFIGURABLE_RULESETS

/*------------------------------------------------------------------------------------------------------/
|	BEGIN Custom Code goes here								<<<< Update as necessary >>>>>
/------------------------------------------------------------------------------------------------------*/

// New Custom functions
function getInspections() {
    // function getLastInspection: returns the inspectionModel of the last inspection matching criteria (inspTypes, inspStatuses).
    var inspTypes = (arguments.length > 0 && arguments[0] ? arguments[0] : null);
    var inspStatuses = (arguments.length > 1 && arguments[1] ? arguments[1] : null);
    var inspStatusesExcluded = (arguments.length > 1 && arguments[1] ? null : ["Pending", "Scheduled"]);
    var inspLastOnly = (arguments.length > 2 && arguments[2] == true ? true : false);
    var itemCapId = (arguments.length > 3 && arguments[3] ? arguments[3] : capId);
    var floor = (arguments.length > 4 && arguments[4] ? arguments[4] : null);
    var floorUnit = (arguments.length > 5 && arguments[5] ? arguments[5] : null);

    if (inspTypes) var inspTypes = String(inspTypes).split(",")
    if (inspStatuses) var inspStatuses = String(inspStatuses).split(",")
    logDebug("getInspections(" + "inspTypes: " + inspTypes + (inspStatuses ? ", inspStatuses: " + inspStatuses : ", !inspStatuses: " + inspStatusesExcluded) + ", capId: " + itemCapId);
    var inspModels = [];

    var inspResultObj = aa.inspection.getInspections(itemCapId);
    if (inspResultObj.getSuccess()) {
        inspList = inspResultObj.getOutput();

        inspList.sort(compareInspDateDesc)
        for (xx in inspList) {
            var inspModel = inspList[xx].getInspection();
            var reasons = [];
            if (inspTypes && !exists(inspList[xx].getInspectionType(), inspTypes)) reasons.push("Type: " + inspList[xx].getInspectionType() + " != " + inspTypes.join(", "));
            if (inspStatuses && !exists(inspList[xx].getInspectionStatus(), inspStatuses)) reasons.push("Status: " + inspList[xx].getInspectionStatus());
            if (inspStatusesExcluded && exists(inspList[xx].getInspectionStatus(), inspStatusesExcluded)) reasons.push("!Status: " + inspList[xx].getInspectionStatus());
            if (floor && floor != inspModel.getActivity().floor) reasons.push("floor: " + inspModel.getActivity().floor);
            if (floorUnit && floorUnit != inspModel.getActivity().floorUnit) reasons.push("floorUnit: " + inspModel.getActivity().floorUnit);
            // logDebug("inspList[" + xx + "]: "
            //     + (inspModel.idNumber ? ", id: " + inspModel.idNumber : "")
            //     + (inspModel.inspectionGroup ? ", Group: " + inspModel.inspectionGroup : "")
            //     + (inspModel.inspectionType ? ", Type: " + inspModel.inspectionType : "")
            //     + (inspModel.inspectionStatus ? ", Status: " + inspModel.inspectionStatus : "")
            //     + (reasons.length > 0? ", reasons: " + reasons.join(";") : "")
            // );
            if (reasons.length > 0) continue;
            logDebug("Found inspList[" + xx + "]: "
                // + (inspList[xx].idNumber ? ", id: " + inspList[xx].idNumber : "")
                // + (inspList[xx].inspectionType ? ", Type: " + inspList[xx].inspectionType : "")
                // + (inspList[xx].inspectionStatus ? ", Status: " + inspList[xx].inspectionStatus : "")
                // + (inspList[xx].inspector ? ", inspector : " + inspList[xx].inspector : "")
                // + (inspList[xx].requestDate ? ", requestDate : " + jsDateToASIDate(convertDate(inspList[xx].requestDate)) : "")
                // + (inspList[xx].scheduledDate ? ", scheduledDate  : " + jsDateToASIDate(convertDate(inspList[xx].scheduledDate)) : "")
                // + (inspList[xx].inspectionDate ? ", inspectionDate   : " + jsDateToASIDate(convertDate(inspList[xx].inspectionDate)) : "")
                // + (inspList[xx].inspectionComments ? ", Comments  : " + inspList[xx].inspectionComments : "")
                // + (inspList[xx].documentDescription ? ", documentDescription   : " + convertDate(inspList[xx].documentDescription) : "")
                + (inspModel.idNumber ? "id: " + inspModel.idNumber : "")
                + (inspModel.inspSequenceNumber ? ", SeqNbr: " + inspModel.inspSequenceNumber : "")
                + (inspModel.parentInspNbr ? ", parentInspNbr: " + inspModel.parentInspNbr : "")
                + (inspModel.inspectionGroup ? ", Group: " + inspModel.inspectionGroup : "")
                + (inspModel.inspectionType ? ", Type: " + inspModel.inspectionType : "")
                + (inspModel.inspectionStatus ? ", Status: " + inspModel.inspectionStatus : "")
                + (inspModel.completed ? ", completed: " + inspModel.completed : "")
                + (inspModel.inspector ? ", inspector: " + inspModel.inspector : "")
                + (inspModel.calendarInspectionType ? ", calendarInspectionType: " + inspModel.calendarInspectionType : "")
                + (inspModel.documentDescription ? ", documentDescription: " + inspModel.documentDescription : "")
                + (inspModel.comment + "" != "" ? ", comment: " + inspModel.comment : "")
                + (inspModel.getActivity().requiredInspection ? ", Required: " + inspModel.getActivity().requiredInspection : "")
                // + (inspModel.requestDate ? ", requestDate: " + jsDateToASIDate(convertDate(inspModel.requestDate)) : "")
                + (inspModel.getActivity().requestor ? ", requestor: " + inspModel.getActivity().requestor : "")
                + (inspModel.getActivity().reqPhoneNum + "" != "" ? ", reqPhoneNum: " + inspModel.getActivity().reqPhoneNum : "")
                + (inspModel.requestComment + "" != "" ? ", requestComment: " + inspModel.requestComment : "")
                + (inspModel.scheduledDate ? ", scheduledDate: " + jsDateToASIDate(convertDate(inspModel.scheduledDate)) : "")
                // + (inspModel.inspectionStatusDate   ? ", inspectionStatusDate: " + jsDateToASIDate(convertDate(inspModel.inspectionStatusDate  )) : "")
                // + (inspList[xx].inspectionDate ? ", inspectionDate: " + jsDateToASIDate(convertDate(inspList[xx].inspectionDate)) : "")
                + (inspModel.guideSheetCount ? ", guideSheetCount: " + inspModel.guideSheetCount : "")
                + (inspModel.guideSheetTotalScore ? ", guideSheetTotalScore: " + inspModel.guideSheetTotalScore : "")
                + (inspModel.getActivity().grade ? ", grade: " + inspModel.getActivity().grade : "")
                + (inspModel.getActivity().district ? ", district: " + inspModel.getActivity().district : "")
                + (inspModel.getActivity().floor ? ", floor: " + inspModel.getActivity().floor : "")
                + (inspModel.getActivity().floorUnit ? ", floorUnit: " + inspModel.getActivity().floorUnit : "")
                + (inspModel.getActivity().latitude ? ", latitude: " + inspModel.getActivity().latitude : "")
                + (inspModel.getActivity().longitude ? ", longitude : " + inspModel.getActivity().longitude : "")
                + (inspModel.getActivity().contactName + "" != "" ? ", contactName: " + inspModel.getActivity().contactName : "")
                + (inspModel.getActivity().contactPhoneNum + "" != "" ? ", contactPhoneNum: " + inspModel.getActivity().contactPhoneNum : "")
                + (inspModel.getActivity().createdByACA ? ", createdByACA: " + inspModel.getActivity().createdByACA : "")
                + (inspModel.getActivity().displayInACA ? ", displayInACA: " + inspModel.getActivity().displayInACA : "")
                + (inspModel.getActivity().inspUnits ? ", inspUnits: " + inspModel.getActivity().inspUnits : "")
                + (inspModel.getActivity().inspBillable ? ", inspBillable: " + inspModel.getActivity().inspBillable : "")
                + (inspModel.getActivity().overtime ? ", overtime: " + inspModel.getActivity().overtime : "")
                // + ", inspection: " + br + documentObject_TPS(inspModel)
                // + ", inspection.Activity: " + br + documentObject_TPS(inspModel.getActivity())
            );
            if (inspLastOnly) return inspList[xx];
            inspModels.push(inspList[xx]);
        }
    }
    if (inspModels.length == 0) inspModels = null;
    return inspModels;
}

function getGuideSheetListByCapType(guideSheetModels, standardFieldName, capType) {
    var guideSheetList = aa.util.newArrayList();
    if (guideSheetModels) {
        for (var i = 0; i < guideSheetModels.size(); i++) {
            var guideSheetItemList = aa.util.newArrayList();
            var gGuideSheetModel = guideSheetModels.get(i);
            var gGuideSheetItemModels = gGuideSheetModel.getItems();
            if (gGuideSheetItemModels) {
                for (var j = 0; j < gGuideSheetItemModels.size(); j++) {
                    var findCaseType = false;
                    var gGuideSheetItemModel = gGuideSheetItemModels.get(j);
                    var gGSItemASISubGroupModels = gGuideSheetItemModel.getItemASISubgroupList();
                    if (gGSItemASISubGroupModels) {
                        for (var k = 0; k < gGSItemASISubGroupModels.size(); k++) {
                            var gGSItemASISubGroupModel = gGSItemASISubGroupModels.get(k);
                            var gGSItemASIModels = gGSItemASISubGroupModel.getAsiList();
                            if (gGSItemASIModels) {
                                for (var l = 0; l < gGSItemASIModels.size(); l++) {
                                    var gGSItemASIModel = gGSItemASIModels.get(l);
                                    var asiName = gGSItemASIModel.getAsiName();
                                    var attributeValue = gGSItemASIModel.getAttributeValue();
                                    if (String(standardFieldName) == asiName && String(capType) == attributeValue) {
                                        findCaseType = true;
                                        break;
                                    }
                                }
                            }
                            if (findCaseType) {
                                break;
                            }
                        }
                    }
                    if (findCaseType) {
                        guideSheetItemList.add(gGuideSheetItemModel);
                    }
                }
                if (guideSheetItemList.size() > 0) {
                    var gGuideSheet = gGuideSheetModel.clone();
                    gGuideSheet.setItems(guideSheetItemList);
                    guideSheetList.add(gGuideSheet);
                }
            }
        }
    }
    return guideSheetList;
}
function removeGuideSheet(inspectionId, guideSheetNames) {
    var guideSheetNames = String(guideSheetNames).split(",");
    if (typeof (servProvCode) == "undefined") servProvCode = aa.getServiceProviderCode();
    try {
        var gGuideSheetBusiness = aa.proxyInvoker.newInstance("com.accela.aa.inspection.guidesheet.GGuideSheetBusiness").getOutput();
        if (!gGuideSheetBusiness) {
            throw "Could not invoke GGuideSheetBusiness";
        }
        var itemsResult = aa.inspection.getInspections(capId);
        if (itemsResult.getSuccess()) {
            var inspectionScriptModels = itemsResult.getOutput();
            for (var k in inspectionScriptModels) {
                if (inspectionScriptModels[k].getIdNumber() == inspectionId) {
                    logDebug(": Found inspection: " + inspectionId);
                    var inspectionModel = inspectionScriptModels[k].getInspection();
                    var gGuideSheetModels = inspectionModel.getGuideSheets();
                    if (gGuideSheetModels) {
                        for (var i = 0; i < gGuideSheetModels.size(); i++) {
                            var gGuideSheetModel = gGuideSheetModels.get(i);
                            if (exists(gGuideSheetModel.getGuideType(), guideSheetNames)) {
                                logDebug(": Found checklist: " + gGuideSheetModel.getGuideType());
                                //exploreObject(gGuideSheetModel);
                                removeGuidesheetId = parseInt(gGuideSheetModel.getGuidesheetSeqNbr());
                                logDebug(": Found checklist to remove: " + removeGuidesheetId);
                                var result = gGuideSheetBusiness.removeGGuideSheet(servProvCode, removeGuidesheetId, "ADMIN");
                                logDebug(capIDString + "." + inspectionId + ": Removed checklist from inspection: " + guideSheetName);
                                break;
                            }
                        }
                    }
                }
            }
        }
    } catch (err) {
        logDebug("A JavaScript Error occurred: removeChecklist:  " + err.message);
        logDebug(err.stack);
    }
}

function loadStandardChoice(stdChoice) {
    var values = [];
    var bizDomScriptResult = aa.bizDomain.getBizDomain(stdChoice);
    if (bizDomScriptResult.getSuccess()) {
        var bizDomScriptArray = bizDomScriptResult.getOutput().toArray()
        for (var i in bizDomScriptArray) {
            if (bizDomScriptArray[i].getAuditStatus() == 'I') continue;
            values[bizDomScriptArray[i].getBizdomainValue()] = bizDomScriptArray[i].getDescription();
            // logDebug("loading " + stdChoice + "[" + bizDomScriptArray[i].getBizdomainValue() + "]: " + bizDomScriptArray[i].getDescription());
        }
    }
    return values;
}
function addGuideSheet_CERS(itemCapId, inspectionId) {
    cersInspGSMap = { // XML Tag : { Field Value : Field Description }
        "Business Plan": { guideSheetSuffixes: ["HMBP"] },
        "UST": { guideSheetSuffixes: ["UST DW", "UST FULL", "UST SW"] },
        "Tiered Permitting": {
            fieldName: "TP Tier", fieldMap: {
                "Conditionally Exempt - Small Quantity Treatment (CESQT)": "Tiered Permitting CESQT",
                "Conditionally Exempt - Specified Waste Streams (CESW)": "Tiered Permitting CESW",
                "Conditionally Authorized (CA)": "Tiered Permitting CA",
                "Permit By Rule (PBR)": "Tiered Permitting PBR",
                "Conditionally Exempt - Limited (CEL)": "Tiered Permitting CEL",
                "Conditionally Exempt - ??": "Tiered Permitting CECL",
                "Full": "Tiered Permitting Full"
            }
        },
        "Recyclable Materials": { guideSheetSuffixes: ["RCRA LQG"] },
        "Hazwaste Generator": { guideSheetSuffixes: ["HW SQG"] },
        "Hazwaste Consolidation": { guideSheetSuffixes: ["HW SQG"] },
        "APSA": { guideSheetSuffixes: ["AST Cond Exemp", "AST Non-Qualified", "AST Tier I", "AST Tier II"] },
        "CalARP": {
            fieldName: "CalARP Program", fieldMap: {
                "Program 1": "CalARP Level 1",
                "Program 2": "CalARP Level 2",
                "Program 3": "CalARP Level 3",
                "Program 4 - Refinery": "CalARP Level 4"
            }
        },
        "HHW": { guideSheetSuffixes: ["Tiered Permitting PHHWCF", "Tiered PermittingTHHWCF"] },
        "Large Quantity Generator": { guideSheetSuffixes: ["HW LQG"] },
    }
    var guidesheetPrefix = "CP23 - ";
    var guideSheetNames = [];
    var guideSheetTypes = [];


    iObjResult = aa.inspection.getInspection(itemCapId, inspectionId);
    if (!iObjResult.getSuccess()) {
        logDebug("**WARNING retrieving inspection " + inspectionId + " : " + iObjResult.getErrorMessage());
        return false;
    }
    var iObj = iObjResult.getOutput();
    var gsDesc = iObj.getInspection().getActivity().getUnitNBR()

    var gsObjects = getGuideSheetObjects(inspectionId);
    for (var gg in gsObjects) {
        if (exists(gsObjects[gg].gsType + "." + gsObjects[gg].gsDescription, guideSheetTypes)) continue;
        guideSheetTypes.push(gsObjects[gg].gsType + "." + gsObjects[gg].gsDescription)
        logDebug("Found Guidesheet[" + gg + "]: "
            + ", # " + gsObjects[gg].gsSequence
            + ", type: " + gsObjects[gg].gsType
            + ", desc: " + gsObjects[gg].gsDescription
        );
    }
    if (gsObjects.length == 0 && typeof (cersInspGSMap[appTypeArray[2]]) != "undefined") {
        if (cersInspGSMap[appTypeArray[2]] == null) {
        } else if (typeof (cersInspGSMap[appTypeArray[2]].fieldName) != "undefined") {
            var fieldName = cersInspGSMap[appTypeArray[2]].fieldName
            var fieldValue = getAppSpecific(fieldName, itemCapId);
            var fieldMap = cersInspGSMap[appTypeArray[2]].fieldMap
            if (typeof (fieldMap[fieldValue]) != "undefined") {
                var guideSheetSuffix = fieldMap[fieldValue];
                guideSheetNames.push(guidesheetPrefix + guideSheetSuffix);
            }
        } else if (typeof (cersInspGSMap[appTypeArray[2]].guideSheetSuffixes) != "undefined") {
            var guideSheetSuffixes = cersInspGSMap[appTypeArray[2]].guideSheetSuffixes
            for (var ii in guideSheetSuffixes) {
                guideSheetSuffix = guideSheetSuffixes[ii];
                guideSheetNames.push(guidesheetPrefix + guideSheetSuffix);
            }
        }
    }
    for (var ii in guideSheetNames) {
        var guideSheetName = guideSheetNames[ii];
        // addGuideSheet(itemCapId, inspectionId, guideSheetName);
        var rgsm = null;
        var RGuideSheetBusiness = aa.proxyInvoker.newInstance("com.accela.aa.inspection.guidesheet.RGuideSheetBusiness").getOutput();
        if (RGuideSheetBusiness) {
            try {
                rgsm = RGuideSheetBusiness.getRGuideSheet(aa.getServiceProviderCode(), guideSheetName);
            } catch (err) {
                logDebug("ERROR: Unable to find Reference GuideSheet: " + guideSheetName);
                var rgsm = null;
            }
        }

        var GGuideSheetBusiness = aa.proxyInvoker.newInstance("com.accela.aa.inspection.guidesheet.GGuideSheetBusiness").getOutput();
        if (rgsm) {
            if (gsDesc) rgsm.setGuideDesc(gsDesc);
            if (guideSheetNames.length == 1) rgsm.setIsRequired("Y");
            // logDebug("rgsm: " + rgsm + br + describe_TPS(rgsm, null, null, true));
            logDebug("Adding Guidesheet: " + guideSheetName
                + (rgsm.getGuideDesc() ? ", desc: " + rgsm.getGuideDesc() : "")
                + (rgsm.getIsRequired() == "Y" ? ", required" : "")
            );
            var gsSequence = GGuideSheetBusiness.createGGuideSheet(itemCapId, rgsm, inspectionId, "ADMIN");
            setGuideSheetFieldDefaults_CERS(itemCapId, inspectionId, guideSheetName);
            // return gsSequence;
        }
    }
    return guideSheetNames;
}
function setGuideSheetFieldDefaults_CERS(itemCapId, inspId, gName) {

    var GSNonComStatusLkp = lookup("EH_VIOL_TYPE_STATUSES", "NonCompliance");
    // Modified from updateGuidesheetASIField
    var r = aa.inspection.getInspections(itemCapId);
    if (!r.getSuccess() || r.getOutput() == null) {
        logDebug("No inspections on the record");
        return false;
    }

    var defaultValues = loadStandardChoice("GUIDESHEET_ASI_DEFAULT");

    var inspArray = r.getOutput();
    for (i in inspArray) {
        if (inspArray[i].getIdNumber() != inspId) continue;
        var inspObj = inspArray[i];
        var inspModel = inspArray[i].getInspection();
        if (inspObj.getInspectionStatusDate())
            inspResultDate = inspObj.getInspectionStatusDate().getMonth() + "/" + inspObj.getInspectionStatusDate().getDayOfMonth() + "/" + inspObj.getInspectionStatusDate().getYear();
        else
            inspResultDate = null;

        if (inspResultDate && GSNonComStatusLkp) {
            var fields2Update = ["Observation Date", "Degree of Violation", "Comply By"];
        } else {
            var fields2Update = ["Degree of Violation"];
        }
        logDebug("inspModel: " + inspArray[i].getIdNumber()
            + (inspModel.inspectionGroup ? ", Group: " + inspModel.inspectionGroup : "")
            + (inspModel.inspectionType ? ", Type: " + inspModel.inspectionType : "")
            + (inspModel.inspectionStatus ? ", Status: " + inspModel.inspectionStatus : "")
            + (inspResultDate ? ", Status Date: " + inspResultDate : "")
            // + br + describe_TPS(inspModel)
        );
        var gs = inspModel.getGuideSheets();
        if (!gs) {
            // if there are guidesheets
            logDebug("No guidesheets for this inspection");
            return false;
        }
        for (var i = 0; i < gs.size(); i++) {
            var guideSheetObj = gs.get(i);
            if (!guideSheetObj) continue;
            if (gName && gName.toUpperCase() != guideSheetObj.getGuideType().toUpperCase()) continue;
            var guideSheetType = guideSheetObj.getGuideType();

            var gsItems = guideSheetObj.getItems();
            for (var j = 0; j < gsItems.size(); j++) {
                var gsItem = gsItems.get(j);
                if (!gsItem) continue;
                var guideSheetSeqNo = gsItem.guideItemSeqNbr.toString();
                var guideSheetItemName = gsItem.getGuideItemText();
                var guideSheetItemStatus = gsItem.getGuideItemStatus();
                // logDebug("guideSheetItem # " + guideSheetSeqNo + ", Name: " + guideSheetItemName + ", Status: " + guideSheetItemStatus);
                if (inspResultDate && guideSheetItemStatus != GSNonComStatusLkp) continue; // Only update non compliance items if inspection resulted.

                var violationTypeNbr = guideSheetItemName.split(" - ")[0];
                if (!violationTypeNbr) continue;
                // logDebug("guideSheetItem # " + guideSheetSeqNo + ", Name: " + guideSheetItemName + ", Status: " + guideSheetItemStatus + ", violationTypeNbr: " + violationTypeNbr);

                //1. Filter Guide Sheet items by Guide sheet item name && ASI group code
                var ASISubGroups = gsItem.getItemASISubgroupList();
                if (ASISubGroups) {
                    //2. Filter ASI sub group by ASI Sub Group name
                    for (var k = 0; k < ASISubGroups.size(); k++) {
                        var ASISubGroup = ASISubGroups.get(k);
                        if (!ASISubGroup) continue;
                        var ASIModels = ASISubGroup.getAsiList();
                        if (!ASIModels) continue;
                        //3. Filter ASI by ASI name
                        var fields = [];
                        for (var m = 0; m < ASIModels.size(); m++) {
                            var ASIModel = ASIModels.get(m);
                            if (!ASIModel) continue;
                            // Get default value
                            var fieldName = ASIModel.getAsiName();
                            if (ASIModel.getAttributeValue()) continue; // skip if it already has a value.
                            if (!exists(fieldName, fields2Update)) continue;

                            var defaultValueKey = guideSheetType + ":" + guideSheetItemName + ":" + fieldName;
                            if (typeof (defaultValues[defaultValueKey]) == "undefined") var defaultValueKey = "*:" + guideSheetItemName + ":" + fieldName;
                            if (typeof (defaultValues[defaultValueKey]) == "undefined") var defaultValueKey = guideSheetType + ":" + violationTypeNbr + ":" + fieldName;
                            if (typeof (defaultValues[defaultValueKey]) == "undefined") var defaultValueKey = "*:" + violationTypeNbr + ":" + fieldName;
                            // Default special cases for Non Compliance items: Observation Date & Comply By
                            var defaultValue = null;
                            var reasons = [];
                            var fMsg = "";
                            if (exists(fieldName, ["Observation Date"])) {
                                defaultValue = jsDateToASIDate(new Date(inspResultDate));
                                var fMsg = ", inspResultDate: " + defaultValue;
                            } else if (exists(fieldName, ["Comply By"])) {
                                var defaultDays = 30;
                                if (typeof (defaultValues[defaultValueKey]) != "undefined") defaultDays = defaultValues[defaultValueKey];
                                if (typeof (fields["Observation Date"]) == "undefined") fields["Observation Date"] = inspResultDate;
                                defaultValue = jsDateToASIDate(new Date(dateAdd(dateAdd(fields["Observation Date"], defaultDays - 1), 1, true)));
                                var fMsg = " (" + fields["Observation Date"] + " + " + defaultDays + ")";
                            } else if (typeof (defaultValues[defaultValueKey]) != "undefined") {
                                var defaultValue = defaultValues[defaultValueKey];
                            }
                            // var defaultValue = lookup("GUIDESHEET_ASI_DEFAULT", guideSheetType + ":" + violationTypeNbr + ":" + ASIModel.getAsiName())
                            if (typeof (defaultValue) != "undefined" && defaultValue) {
                                logDebug("guideSheetItem # " + guideSheetSeqNo
                                    + ", violationTypeNbr: " + violationTypeNbr
                                    // + ", Name: " + guideSheetItemName 
                                    // + ", Status: " + guideSheetItemStatus 
                                    + ", Field: " + fieldName
                                    + ", Key: " + defaultValueKey
                                    + ", Changed "
                                    + (ASIModel.getAttributeValue() ? " from:" + ASIModel.getAttributeValue() : "")
                                    + " to " + defaultValue
                                    + fMsg
                                );
                                //4. Reset ASI value
                                ASIModel.setAttributeValue(defaultValue);
                            }
                            fields[fieldName] = ASIModel.getAttributeValue();
                        }
                    }
                }
            }

            //Update the guidesheet
            var updateResult = aa.guidesheet.updateGGuidesheet(guideSheetObj, guideSheetObj.getAuditID());
            if (updateResult.getSuccess()) {
                logDebug("Successfully updated " + gName + " on inspection " + inspId + ".");
                return true;
            } else {
                logDebug("Could not update guidesheet ID: " + updateResult.getErrorMessage());
                return false;
            }
        }
    }
    logDebug("No updates to the guidesheet made");
    return false;
}



// Custom Code
try {
    showDebug = true;
    now = new Date(aa.util.now());
    var customStartTime = now.getTime();
    logDebug("========== Start Custom Code @: " + now.toDateString() + " " + now.toTimeString().replace(" ", "," + now.getMilliseconds()) + "==========");
    logDebug("capId: " + capId + " " + capId.getCustomID());

    now = new Date(aa.util.now());
    logDebug("========== Finished Custom Code @: " + now.toDateString() + " " + now.toTimeString().replace(" ", "," + now.getMilliseconds()) + ", Elapsed: " + ((now.getTime() - customStartTime) / 1000) + "==========");
} catch (err) {
    logDebug("A JavaScript Error occurred: " + err.message + " at line " + err.lineNumber + " stack: " + err.stack);
}
/*------------------------------------------------------------------------------------------------------/
|	END User code goes here
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
|	BEGIN Master Script Code: Invoice Fees					***** Do not touch this section *****
/------------------------------------------------------------------------------------------------------*/
// Check for invoicing of fees
if (feeSeqList.length) {
    invoiceResult = aa.finance.createInvoice(capId, feeSeqList, paymentPeriodList);
    if (invoiceResult.getSuccess())
        logMessage("Invoicing assessed fee items is successful.");
    else
        logMessage("**ERROR: Invoicing the fee items assessed to app # " + capIDString + " was not successful.  Reason: " + invoiceResult.getErrorMessage());
}
/*------------------------------------------------------------------------------------------------------/
|	END Master Script Code: Invoice Fees
/------------------------------------------------------------------------------------------------------*/
// Print Debug
var z = debug.replace(/<BR>/g, "\r"); aa.print(">>> DEBUG: \r" + z);
/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/
// aa.env.setValue("ScriptReturnCode", "0"); 	aa.env.setValue("ScriptReturnMessage", debug);
if (debug.indexOf("**ERROR") > 0) {
    aa.env.setValue("ScriptReturnCode", "1");
    aa.env.setValue("ScriptReturnMessage", debug);
} else if (eventType == "Before" && cancel) { //Process Before Event with cancel check
    aa.env.setValue("ScriptReturnCode", "1");
    if (showMessage) aa.env.setValue("ScriptReturnMessage", "<font color=red><b>Action Cancelled</b></font><br><br>" + message);
    if (showDebug) aa.env.setValue("ScriptReturnMessage", "<font color=red><b>Action Cancelled</b></font><br><br>" + debug);
} else {
    aa.env.setValue("ScriptReturnCode", "0");
    if (showMessage) aa.env.setValue("ScriptReturnMessage", message);
    if (showDebug) aa.env.setValue("ScriptReturnMessage", debug);
}

/*------------------------------------------------------------------------------------------------------/
| <===========External Functions (used by Action entries)
/------------------------------------------------------------------------------------------------------*/
function _setEnvEventParameters(itemCap) { // TO DO: Add Key Environment Parameters for various events
    if (eventName.indexOf("ApplicationCondition") >= 0) {
        if (aa.env.getValue("ConditionId") == "") { // Set Environment Parameter ConditionId
            if (typeof (conditionId) == "undefined") conditionId = null;
            if (conditionId == null) {
                // set ConditionId environment parameter.
                var condResult = aa.capCondition.getCapConditions(itemCap);
                if (!condResult.getSuccess()) {
                    logDebug("**ERROR: getting cap conditions: " + condResult.getErrorMessage());
                    var capConditions = [];
                } else if (condResult.getOutput()) {
                    var capConditions = condResult.getOutput();
                } else {
                    var capConditions = [];
                }

                var capConditionIDs = [];
                for (var cc in capConditions) {
                    var conditionObj = capConditions[cc];
                    logDebug("capConditions[" + cc + "]: " + conditionObj.getConditionNumber()
                        + (conditionObj.getConditionGroup() ? ", Group: " + conditionObj.getConditionGroup() : "")
                        + (conditionObj.getConditionType() ? ", Type: " + conditionObj.getConditionType() : "")
                        + (conditionObj.getConditionDescription() ? ", Name: " + conditionObj.getConditionDescription() : "")
                    );
                    capConditionIDs.push(conditionObj.getConditionNumber());
                }
                conditionId = capConditionIDs.join("|");
            }
            aa.env.setValue("ConditionId", conditionId);
        }
    } else if (eventName.indexOf("InspectionSchedule") >= 0) { // Requires wfTask, wfStatus rest of info from Workflow
        inspObj = aa.inspection.getInspection(itemCap, inspId).getOutput(); // current inspection object
        inspGroup = null, inspType = null;
        if (inspObj) {
            inspGroup = inspObj.getInspection().getInspectionGroup();
            inspType = inspObj.getInspectionType();
        }
        inspInspector = null;
        InspectorFirstName = null;
        InspectorLastName = null;
        InspectorMiddleName = null;

        if (inspObj) {
            var inspInspectorObj = inspObj.getInspector();
            if (inspInspectorObj) {
                inspInspector = inspInspectorObj.getUserID();
                if (inspInspector) {
                    inspInspectorObj = aa.person.getUser(inspInspector).getOutput();
                    if (inspInspectorObj) {
                        InspectorFirstName = inspInspectorObj.getFirstName();
                        InspectorLastName = inspInspectorObj.getLastName();
                        InspectorMiddleName = inspInspectorObj.getMiddleName();
                    }
                }
            }
        }
    
        if (inspObj && inspObj.getScheduledDate())
            inspSchedDate = inspObj.getScheduledDate().getMonth() + "/" + inspObj.getScheduledDate().getDayOfMonth() + "/" + inspObj.getScheduledDate().getYear();
        else
            inspSchedDate = null;
    
        logDebug("inspId " + inspId);
        logDebug("inspInspector = " + inspInspector);
        logDebug("InspectorFirstName = " + InspectorFirstName);
        logDebug("InspectorMiddleName = " + InspectorMiddleName);
        logDebug("InspectorLastName = " + InspectorLastName);
        logDebug("inspGroup = " + inspGroup);
        logDebug("inspType = " + inspType);
        logDebug("inspSchedDate = " + inspSchedDate);
    } else if (eventName.indexOf("InspectionResultSubmit") >= 0) { // Requires wfTask, wfStatus rest of info from Workflow
        inspObj = aa.inspection.getInspection(itemCap, inspId).getOutput(); // current inspection object
        inspGroup = null, inspType = null, inspResult = null, inspResultComment = null, inspRequestDate = null, inspTotalTime = null;
        if (inspObj) {
            inspGroup = inspObj.getInspection().getInspectionGroup();
            inspType = inspObj.getInspectionType();
            inspResult = inspObj.getInspectionStatus();
            inspResultComment = inspObj.getInspection().getResultComment();
            inspResultDate = inspObj.getInspectionStatusDate().getMonth() + "/" + inspObj.getInspectionStatusDate().getDayOfMonth() + "/" + inspObj.getInspectionStatusDate().getYear();
            inspTotalTime = inspObj.getTimeTotal();
        }
        inspComment = inspResultComment; // consistency between events

        inspInspector = null;
        InspectorFirstName = null;
        InspectorLastName = null;
        InspectorMiddleName = null;

        if (inspObj) {
            var inspInspectorObj = inspObj.getInspector();
            if (inspInspectorObj) {
                inspInspector = inspInspectorObj.getUserID();
                if (inspInspector) {
                    inspInspectorObj = aa.person.getUser(inspInspector).getOutput();
                    if (inspInspectorObj) {
                        InspectorFirstName = inspInspectorObj.getFirstName();
                        InspectorLastName = inspInspectorObj.getLastName();
                        InspectorMiddleName = inspInspectorObj.getMiddleName();
                    }
                }
            }
        }
    
        if (inspObj && inspObj.getScheduledDate())
            inspSchedDate = inspObj.getScheduledDate().getMonth() + "/" + inspObj.getScheduledDate().getDayOfMonth() + "/" + inspObj.getScheduledDate().getYear();
        else
            inspSchedDate = null;
    
        logDebug("inspId " + inspId);
        logDebug("inspResult = " + inspResult);
        logDebug("inspResultComment = " + inspResultComment);
        logDebug("inspComment = " + inspComment);
        logDebug("inspResultDate = " + inspResultDate);
        logDebug("inspGroup = " + inspGroup);
        logDebug("inspType = " + inspType);
        logDebug("inspSchedDate = " + inspSchedDate);
        logDebug("inspTotalTime = " + inspTotalTime);
    } else if (eventName.indexOf("WorkflowTaskUpdate") >= 0) { // Requires wfTask, wfStatus rest of info from Workflow
        var now = new Date(aa.util.now());//	wfDate = 2020-07-09
        if (typeof (wfDate) == "undefined") wfDate = null;	// Process ID of workflow
        if (wfDate == null)
            wfDate = now.getFullYear() + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate();
        if (typeof (wfProcessID) == "undefined") wfProcessID = null;	// Process ID of workflow
        if (typeof (wfStep) == "undefined") wfStep = null;	// Initialize
        if (typeof (wfComment) == "undefined") wfComment = null;	// Initialize
        if (typeof (wfNote) == "undefined") wfNote = null;	// Initialize
        if (typeof (wfDue) == "undefined") wfDue = null;	// Initialize
        if (typeof (wfHours) == "undefined") wfHours = null;	// Initialize
        if (typeof (wfActionBy) == "undefined") wfActionBy = null;	// Initialize
        if (typeof (wfActionByObj) == "undefined") wfActionByObj = null;	// Initialize
        if (typeof (wfActionByUserID) == "undefined") wfActionByUserID = null;	// Initialize
        if (typeof (wfActionByDept) == "undefined") wfActionByDept = null;	// Initialize
        if (typeof (wfProcess) == "undefined") wfProcess = null;	// Initialize
        var wfTimeBillable = aa.env.getValue("Billable");
        var wfTimeOT = aa.env.getValue("Overtime");
        // Go get other task details
        var wfObj = aa.workflow.getTasks(itemCap).getOutput();
        for (i in wfObj) {
            fTask = wfObj[i];
            if (!fTask.getTaskDescription().equals(wfTask)) continue;
            if (wfProcessID && fTask.getProcessID() != wfProcessID) continue;
            wfStep = fTask.getStepNumber();
            wfProcessID = fTask.getProcessID();
            wfProcess = fTask.getProcessCode();
            wfActionBy = fTask.getTaskItem().getSysUser();
            wfActionByObj = aa.person.getUser(wfActionBy.getFirstName(), wfActionBy.getMiddleName(), wfActionBy.getLastName()).getOutput();
            wfComment = (wfComment ? wfComment : fTask.getDispositionComment());
            wfNote = fTask.getDispositionNote();
            wfDue = fTask.getDueDate();
            wfHours = fTask.getHoursSpent();
            wfTaskObj = fTask;
            wfStatusDate = new Date(fTask.getStatusDate() ? fTask.getStatusDate().getTime() : null);
            //wfDate = wfStatusDate.getFullYear()+"-"+((wfStatusDate.getMonth()+1)<10?"0":"")+(wfStatusDate.getMonth()+1)+"-"+(wfStatusDate.getDate()<10?"0":"")+wfStatusDate.getDate();
            wfTimeBillable = fTask.getBillable();
            wfTimeOT = fTask.getOverTime();
        }
        var wfDateMMDDYYYY = wfDate ? wfDate.substr(5, 2) + "/" + wfDate.substr(8, 2) + "/" + wfDate.substr(0, 4) : "";	// date of status of workflow that triggered event in format MM/DD/YYYY
        if (wfActionByObj) {
            var wfActionByUserID = wfActionByObj.getUserID();
            var wfActionByDept = wfActionByObj.getDeptOfUser();
        }

        logDebug("wfTask = " + wfTask);
        logDebug("wfTaskObj = " + (wfTask && wfTask.getClass ? wfTask.getClass() : null));
        logDebug("wfStatus = " + wfStatus);
        logDebug("wfDate = " + wfDate);
        logDebug("wfDateMMDDYYYY = " + wfDateMMDDYYYY);
        logDebug("wfStep = " + wfStep);
        logDebug("wfComment = " + wfComment);
        logDebug("wfProcess = " + wfProcess);
        logDebug("wfNote = " + wfNote);
        logDebug("wfActionByUserID = " + wfActionByUserID);
        logDebug("wfActionByDept = " + wfActionByDept);

        /* Added for version 1.7 */
        var wfStaffUserID = aa.env.getValue("StaffUserID");
        var timeAccountingArray = new Array()
        if (aa.env.getValue("TimeAccountingArray") != "")
            timeAccountingArray = aa.env.getValue("TimeAccountingArray");
        logDebug("wfStaffUserID = " + wfStaffUserID);
        logDebug("wfTimeBillable = " + wfTimeBillable);
        logDebug("wfTimeOT = " + wfTimeOT);
        logDebug("wfHours = " + wfHours);
    }
}

function describe_TPS(obj) {
    // Modified from describe to also include typeof & class of object; seperate Properties from Functions; Sort them; additional arguments.
    if (typeof (br) == "undefined") br = "<BR>";
    var newLine = "\n";
    var newLine = br;
    var ret = "";
    var oType = null;
    var oNameRegEx = /(^set.*$)/; // find set functions
    var oNameRegEx = /(^get.*$)/; // find get functions
    var oNameRegEx = null;
    var verbose = false;
    if (arguments.length > 1) oType = arguments[1];
    if (arguments.length > 2) oNameRegEx = arguments[2];
    if (arguments.length > 3) verbose = arguments[3];
    if (obj == null) {
        ret += ": null";
        return ret;
    }
    try {
        ret += "typeof(): " + typeof (obj) + (obj && obj.getClass ? ", class: " + obj.getClass() : "") + newLine;
        var oPropArray = new Array();
        var oFuncArray = new Array();
        if (oType == null) oType = "*";
        for (var i in obj) {
            if (oNameRegEx && !oNameRegEx.test(i)) { continue; }
            try {
                if ((oType == "*" || oType == "function") && typeof (obj[i]) == "function") {
                    oFuncArray.push(i);
                } else if ((oType == "*" || oType == "property") && typeof (obj[i]) != "function") {
                    oPropArray.push(i);
                }
            } catch (err) {
                ret += "unknown:" + i + " " + err + newLine;
            }
        }
        // List Properties
        oPropArray.sort();
        for (var i in oPropArray) {
            n = oPropArray[i];
            try {
                oValue = obj[n];
            } catch (err) {
                oValue = "ERROR: " + err;
            }
            if (oValue && oValue.getClass) {
                //				logDebug(n + " " + oValue.getClass());
                if (oValue.getClass().toString().equals("class com.accela.aa.emse.dom.ScriptDateTime")) oValue += " " + (new Date(oValue.getEpochMilliseconds()));
                if (oValue.getClass().toString().equals("class com.accela.aa.emse.util.ScriptDateTime")) oValue += " " + (new Date(oValue.getEpochMilliseconds()));
                // if (oValue.getClass().toString().equals("class java.util.Date")) oValue += " " + convertDate(oValue);
            }
            ret += "property:" + n + " = " + oValue + newLine;
        }
        // List Functions
        oFuncArray.sort();
        for (var i in oFuncArray) {
            n = oFuncArray[i];
            oDef = String(obj[n]).replace("\n", " ").replace("\r", " ").replace(String.fromCharCode(10), " ").replace(String.fromCharCode(10), " ")
            x = oDef.indexOf(n + "()", n.length + 15);
            if (x > 15) x = x + n.length + 1;
            oName = (verbose ? oDef : "function:" + n + "()");                              // Include full definition of function if verbose
            try {
                oValue = ((n.toString().indexOf("get") == 0 && x > 0) ? obj[n]() : "");  // Get function value if "Get" function and no parameters.
            } catch (err) {
                oValue = "ERROR: " + err;
            }
            if (oValue && oValue.getClass) {
                //				logDebug(n + " " + oValue.getClass());
                if (oValue.getClass().toString().equals("class com.accela.aa.emse.dom.ScriptDateTime")) oValue += " " + (new Date(oValue.getEpochMilliseconds()));
                if (oValue.getClass().toString().equals("class com.accela.aa.emse.util.ScriptDateTime")) oValue += " " + (new Date(oValue.getEpochMilliseconds()));
                // if (oValue.getClass().toString().equals("class java.util.Date")) oValue += " " + convertDate(oValue);
            }
            ret += oName + " = " + oValue + newLine;
        }
    } catch (err) {
        showDebug = 3;
        var context = "describe_TPS(" + obj + ")";
        logDebug("ERROR: An error occured in " + context + " Line " + err.lineNumber + " Error:  " + err.message);
        logDebug("Stack: " + err.stack);
    }
    return ret;
}

function logDebug(dstr) {
    if (typeof (showDebug) == "undefined") showDebug = true;
    if (typeof (debug) == "undefined") debug = "";
    if (typeof (br) == "undefined") br = "<BR>";
    if (typeof (formatErrorB) == "undefined") formatErrorB = "";
    if (typeof (formatErrorE) == "undefined") formatErrorE = "";
    if (typeof (lastErrorMsg) == "undefined") lastErrorMsg = "";
    var formatErrB = "";
    var formatErrE = "";
    if (dstr.indexOf("ERROR") >= 0) {
        formatErrB = formatErrorB;
        formatErrE = formatErrorE;
        aa.print(dstr);
        dstr = formatErrB + dstr + formatErrE;
        lastErrorMsg += dstr + br;
    }
    vLevel = 1
    if (arguments.length > 1)
        vLevel = arguments[1];
    if ((showDebug & vLevel) == vLevel || vLevel == 1)
        debug += dstr + br;
    if ((showDebug & vLevel) == vLevel)
        aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"), dstr);
}

function lookup(stdChoice, stdValue) {
    // Modified INCLUDES_ACCELA_FUNCTION to return null if not found.
    var strControl = null;
    var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice, stdValue);

    if (bizDomScriptResult.getSuccess()) {
        var bizDomScriptObj = bizDomScriptResult.getOutput();
        strControl = "" + bizDomScriptObj.getDescription(); // had to do this or it bombs.  who knows why?
        logDebug("lookup(" + stdChoice + "," + stdValue + ") = " + strControl);
    }
    else {
        logDebug("lookup(" + stdChoice + "," + stdValue + ") does not exist");
    }
    return strControl;
}

// ----------
//  Standard INCLUDES_ACCELA_FUNCTIONS version 9.2: These were added because some events are calling older master scripts
//  They can be removed once the events are updated to point to newer master scripts.
// ----------
function addParameter(pamaremeters, key, value) {
    // Standard INCLUDES_ACCELA_FUNCTION version 9.2
    if (key != null) {
        if (value == null) {
            value = "";
        }
        pamaremeters.put(key, value);
    }
}


function sendNotificationInspector(emailTemplate) {
    var inspID = arguments.length > 1 && arguments[1] ? arguments[1] : inspId;
    var itemCapId = arguments.length > 2 && arguments[2] ? arguments[2] : capId;
    var emailCC = arguments.length > 3 && arguments[3] ? arguments[3] : ""; // CC Email Address(es) typically Inspector Supervisor's email.

    var sent = false;
    var rFiles = [];
    var inspObj = aa.inspection.getInspection(itemCapId, inspID).getOutput(); // current inspection object
    var inspInspector = inspObj.getInspection().getInspector();
    var inspInspectorObj = aa.person.getUser(inspInspector).getOutput();
    var inspInspectorName = "", inspInspectorEmail = null;
    if (inspInspectorObj) {
        inspInspectorName = (inspInspectorObj.getFullName() == null ? "" : inspInspectorObj.getFullName());
        if (inspInspectorName == "") {
            inspInspectorName = (inspInspectorObj.getFirstName() == null ? "" : inspInspectorObj.getFirstName());
            inspInspectorName += (inspInspectorObj.getLastName() == null ? "" : inspInspectorObj.getLastName());
        }
        inspInspectorEmail = inspInspectorObj.getEmail();
    }
    if (isBlank(inspInspectorEmail)) inspInspectorEmail = "rschug@truepointsolutions.com";

    var emailParameters = aa.util.newHashtable();
    getRecordParams4Notification(emailParameters, itemCapId); // params: $$altID$$, $$capName$$, $$recordTypeAlias$$, $$capStatus$$, $$fileDate$$, $$balanceDue$$, $$workDesc$$
    getPrimaryAddressLineParam4Notification_TPS(emailParameters); // params: $$addressLine$$
    // getInspectionScheduleParams4Notification(emailParameters); // params: $$inspId$$, $$inspGroup$$, $$inspType$$, $$inspSchedDate$$, $$inspInspector$$, $$InspectorFirstName$$, $$InspectorMiddleName$$, $$InspectorLastName$$ 
    getInspectionParams4Notification_TPS(emailParameters, itemCapId, inspID);

    try {
        //Send Notification
        if (!isBlank(inspInspectorEmail)) {
            logDebug("Sending " + emailTemplate + " using sendNotificationStaff, to: " + inspInspectorEmail + ", parms: " + emailParameters);
            // var sent = sendNotification("", inspInspectorEmail, emailCC, emailTemplate, emailParameters, rFiles, itemCapId);
            var sent = sendNotificationStaff("", inspInspectorEmail, emailCC, emailTemplate, emailParameters); // Use this if you don't want the email saved to the record.
        }
    } catch (err) {
        showDebug = true;
        logDebug("ERROR: Occurred in sendNotificationInspector: " + err.message + " at line " + err.lineNumber + " stack: " + err.stack);
    }
    return sent;
}
function getPrimaryAddressLineParam4Notification_TPS(params) {
    // pass in a hashtable and it will add the additional parameters to the table
    // Modified from INCLUDES_ACCELA_FUNCTIONS v9.3.0
    // -- Allows for optional capId
    var itemCapId = arguments.length > 1 && arguments[1] ? arguments[1] : capId; // Optional CapId

    var addressLine = "";
    adResult = aa.address.getPrimaryAddressByCapID(itemCapId, "Y");
    if (adResult.getSuccess()) {
        ad = adResult.getOutput().getAddressModel();
        addressLine = ad.getDisplayAddress()
    }
    addParameter(params, "$$addressLine$$", addressLine);

    return params;
}

function getInspectionParams4Notification_TPS(params) {
    // 11/20/2023 RSchug: Modified to include additional parameters for inspectors.
    // pass in a hashtable and it will add the additional parameters to the table
    var itemCapId = (arguments.length > 1 && arguments[1] ? arguments[1] : capId); // Optional CapId
    var inspID = (arguments.length > 2 && arguments[2] ? arguments[2] : inspId); // Optional inspId
    if (typeof (inspID) == "undefined") return params;

    var inspObjResult = aa.inspection.getInspection(itemCapId, inspID);
    if (inspObjResult.getSuccess())
        var inspObj = inspObjResult.getOutput();
    else
        var inspObj = null;

    if (typeof (inspInspector) == "undefined") inspInspector = (inspObj ? inspObj.getInspector() : null);
    var inspInspectorName = (inspInspector ? inspInspector.toString() : "");
    var inspInspectorFirstName = "", inspInspectorLastName = inspInspectorName, inspInspectorTitle = "", inspInspectorEmail = "", inspInspectorPhone = "";
    var inspInspectorObj = ((inspInspector && inspInspector.getClass() == "class com.accela.aa.aamain.people.SysUserModel") ? inspInspector : (inspInspector ? aa.person.getUser(inspInspector).getOutput() : null));
    if (inspInspectorObj) {
        inspInspectorName = (inspInspectorObj.getDistinguishedName() == null ? "" : inspInspectorObj.getDistinguishedName());
        if (inspInspectorName == "") {
            inspInspectorName = (inspInspectorObj.getFirstName() == null ? "" : inspInspectorObj.getFirstName());
            inspInspectorName += (inspInspectorObj.getLastName() == null ? "" : " " + inspInspectorObj.getLastName());
        }
        inspInspectorFirstName = inspInspectorObj.getFirstName();
        inspInspectorLastName = inspInspectorObj.getLastName();
        inspInspectorTitle = inspInspectorObj.getTitle(); // This is usually null so get it from the User's personModel.
        var userObj = null;
        if (typeof (getUser) != "undefined") {
            userObj = getUser(inspInspectorObj.getUserID());
        }
        if (userObj) {
            inspInspectorTitle = userObj.getTitle();
        }
        inspInspectorEmail = inspInspectorObj.getEmail();
        inspInspectorPhone = inspInspectorObj.getPhoneNumber();
        inspInspector = inspInspectorObj.getUserID();
    }
    addParameter(params, "$$inspId$$", inspID);
    var inspModel = null, inspActivity = null;
    if (inspObj) {
        var inspRequestDate = null, inspSchedDate = null, inspResultDate = null;
        var inspModel = inspObj.getInspection();
        var inspActivity = inspModel.getActivity();
        var inspDates = [];
        var inspResultDate = inspObj.getInspectionStatusDate().getMonth() + "/" + inspObj.getInspectionStatusDate().getDayOfMonth() + "/" + inspObj.getInspectionStatusDate().getYear();

        logDebug("inspModel: {"
            + (inspModel.idNumber ? "id: " + inspModel.idNumber : "")
            + (inspModel.inspSequenceNumber ? ", SeqNbr: " + inspModel.inspSequenceNumber : "")
            + (inspModel.parentInspNbr ? ", parentInspNbr: " + inspModel.parentInspNbr : "")
            + (inspModel.inspectionGroup ? ", Group: " + inspModel.inspectionGroup : "")
            + (inspModel.inspectionType ? ", Type: " + inspModel.inspectionType : "")
            + (inspModel.inspectionStatus ? ", Status: " + inspModel.inspectionStatus : "")
            + (inspModel.completed ? ", completed: " + inspModel.completed : "")
            + (inspModel.inspector ? ", inspector: " + inspModel.inspector : "")
            + (inspModel.calendarInspectionType ? ", calendarInspectionType: " + inspModel.calendarInspectionType : "")
            + (inspModel.documentDescription ? ", documentDescription: " + inspModel.documentDescription : "")
            + (inspModel.comment + "" != "" ? ", comment: " + inspModel.comment : "")

            + (inspModel.requestDate ? ", requestDate: " + jsDateToASIDate(convertDate(inspModel.requestDate)) : "")
            + (inspModel.getActivity().requestor ? ", requestor: " + inspModel.getActivity().requestor : "")
            + (inspModel.getActivity().reqPhoneNum + "" != "" ? ", reqPhoneNum: " + inspModel.getActivity().reqPhoneNum : "")
            + (inspModel.requestComment + "" != "" ? ", requestComment: " + inspModel.requestComment : "")
            + (inspModel.getActivity().contactName + "" != "" ? ", contactName: " + inspModel.getActivity().contactName : "")
            + (inspModel.getActivity().contactPhoneNum + "" != "" ? ", contactPhoneNum: " + inspModel.getActivity().contactPhoneNum : "")

            + (inspModel.calendarInspectionType ? ", calendarInspectionType: " + inspModel.calendarInspectionType : "")
            + (inspModel.scheduledDate ? ", scheduledDate: " + jsDateToASIDate(convertDate(inspModel.scheduledDate)) : "")
            // + (inspModel.inspectionStatusDate   ? ", inspectionStatusDate: " + jsDateToASIDate(convertDate(inspModel.inspectionStatusDate  )) : "")
            // + (inspObj.inspectionDate ? ", inspectionDate: " + jsDateToASIDate(convertDate(inspObj.inspectionDate)) : "")
            + (inspModel.guideSheetCount ? ", guideSheetCount: " + inspModel.guideSheetCount : "")
            + (inspModel.guideSheetTotalScore ? ", guideSheetTotalScore: " + inspModel.guideSheetTotalScore : "")
            + (inspModel.getActivity().grade ? ", grade: " + inspModel.getActivity().grade : "")
            + (inspModel.getActivity().district ? ", district: " + inspModel.getActivity().district : "")

            + (inspModel.primaryAddress ? ", primaryAddress: " + inspModel.primaryAddress : "")
            + (inspModel.getActivity().unitNBR ? ", unitNBR: " + inspModel.getActivity().unitNBR : "")
            + (inspModel.getActivity().floor ? ", floor: " + inspModel.getActivity().floor : "")
            + (inspModel.getActivity().floorUnit ? ", floorUnit: " + inspModel.getActivity().floorUnit : "")
            + (inspModel.getActivity().latitude ? ", latitude: " + inspModel.getActivity().latitude : "")
            + (inspModel.getActivity().longitude ? ", longitude : " + inspModel.getActivity().longitude : "")

            + (inspModel.getActivity().createdByACA ? ", createdByACA: " + inspModel.getActivity().createdByACA : "")
            + (inspModel.getActivity().displayInACA ? ", displayInACA: " + inspModel.getActivity().displayInACA : "")
            + (inspModel.getActivity().inspUnits ? ", inspUnits: " + inspModel.getActivity().inspUnits : "")
            + (inspModel.getActivity().requiredInspection ? ", requiredInspection: " + inspModel.getActivity().requiredInspection : "")
            + (inspModel.getActivity().inspBillable ? ", inspBillable: " + inspModel.getActivity().inspBillable : "")
            + (inspModel.getActivity().overtime ? ", overtime: " + inspModel.getActivity().overtime : "")
        );

        addParameter(params, "$$inspGroup$$", inspModel.getInspectionGroup());
        addParameter(params, "$$inspType$$", inspModel.getInspectionType());
        // add Inspector parameters
        addParameter(params, "$$inspInspector$$", inspInspector);
        addParameter(params, "$$inspInspectorName$$", inspInspectorName);
        addParameter(params, "$$inspInspectorFirstName$$", inspInspectorFirstName);
        addParameter(params, "$$inspInspectorLastName$$", inspInspectorLastName);
        addParameter(params, "$$inspInspectorTitle$$", inspInspectorTitle);
        addParameter(params, "$$inspInspectorEmail$$", inspInspectorEmail);
        addParameter(params, "$$inspInspectorPhone$$", inspInspectorPhone);
        // add Inspection Scheduled date & times
        var inspSchedDate = (inspObj.getScheduledDate() ? inspObj.getScheduledDate().getMonth() + "/" + inspObj.getScheduledDate().getDayOfMonth() + "/" + inspObj.getScheduledDate().getYear() : null);
        addParameter(params, "$$inspSchedDate$$", inspSchedDate);
        addParameter(params, "$$inspSchedTime$$", inspModel.getScheduledTime());
        addParameter(params, "$$inspSchedTime2$$", inspModel.getScheduledTime2());

        //-- addParameter(params, "$$inspTime$$", (typeof (inspTime) == "undefined" ? "" : inspTime));
        //-- addParameter(params, "$$inspTimeF$$", aa.util.formatDate(inspTime, "hh:mm a"));

        // Add Inspection Result parameters
        addParameter(params, "$$inspResult$$", inspObj.getInspection().getInspectionStatus());
        var inspResultDate = (inspObj.getInspectionStatusDate() ? inspObj.getInspectionStatusDate().getMonth() + "/" + inspObj.getInspectionStatusDate().getDayOfMonth() + "/" + inspObj.getInspectionStatusDate().getYear() : null);
        addParameter(params, "$$inspResultDate$$", inspResultDate);
        addParameter(params, "$$inspResultComment$$", inspObj.getInspection().getResultComment());
        addParameter(params, "$$inspTotalTime$$", inspObj.getTimeTotal());
        addParameter(params, "$$inspResultType$$", inspObj.getInspection().getActivity().getInspResultType());
        // addParameter(params, "$$inspGrade$$", inspObj.getInspection().getActivity().getGrade());
        // addParameter(params, "$$inspTotalScore$$", inspObj.getInspection().getActivity().getTotalScore());
        // addParameter(params, "$$inspMaxPoints$$", inspObj.getInspection().getActivity().getMaxPoints());
        // addParameter(params, "$$inspMajorViolation$$", inspObj.getInspection().getActivity().getMajorViolation());
    }
    if (inspActivity) {
        addParameter(params, "$$inspTeamName$$", inspObj.getInspection().getActivity().getTeamName());
        // addParameter(params, "$$inspUnits$$", inspObj.getInspection().getActivity().getInspUnits());

        // Add Inspection Contact & Request parameters
        addParameter(params, "$$inspContactName$$", inspObj.getInspection().getActivity().getContactName());
        addParameter(params, "$$inspContactFName$$", inspObj.getInspection().getActivity().getContactFname());
        addParameter(params, "$$inspContactMName$$", inspObj.getInspection().getActivity().getContactMname());
        addParameter(params, "$$inspContactLName$$", inspObj.getInspection().getActivity().getContactLname());
        addParameter(params, "$$inspContactPhoneNum$$", inspObj.getInspection().getActivity().getContactPhoneNum());
        var inspRequestDate = (inspObj.getRequestDate() ? inspObj.getRequestDate().getMonth() + "/" + inspObj.getRequestDate().getDayOfMonth() + "/" + inspObj.getRequestDate().getYear() : null);
        addParameter(params, "$$inspRequestDate$$", inspRequestDate);
        addParameter(params, "$$inspRequestor$$", inspObj.getInspection().getActivity().getRequestor());
        addParameter(params, "$$inspRequestorFName$$", inspObj.getInspection().getActivity().getRequestorFname());
        addParameter(params, "$$inspRequestorMName$$", inspObj.getInspection().getActivity().getRequestorMname());
        addParameter(params, "$$inspRequestorLName$$", inspObj.getInspection().getActivity().getRequestorLname());
        addParameter(params, "$$inspReqPhoneNum$$", inspObj.getInspection().getActivity().getReqPhoneNum());
        addParameter(params, "$$inspRequestComment$$", inspObj.getInspection().getRequestComment());
        // Add Inspection Location parameters
        addParameter(params, "$$inspFloor$$", inspObj.getInspection().getActivity().getFloor());
        addParameter(params, "$$inspFloorUnit$$", inspObj.getInspection().getActivity().getFloorUnit());
        addParameter(params, "$$inspUnitNBR$$", inspObj.getInspection().getActivity().getUnitNBR());
        addParameter(params, "$$inspLatitude$$", inspObj.getInspection().getActivity().getLatitude());
        addParameter(params, "$$inspLongitude$$", inspObj.getInspection().getActivity().getLongitude());
        // Add Inspection Estimated Start Time parameters
        addParameter(params, "$$inspEstimatedStartTime$$", inspObj.getInspection().getActivity().getEstimatedStartTime());
        addParameter(params, "$$inspEstimatedEndTime$$", inspObj.getInspection().getActivity().getEstimatedEndTime());
        // Add Inspection Desired Date & Times parameters
        var inspDesiredDate = (inspObj.getInspection().getActivity().getDesiredDate() ? inspObj.getDesiredDate().getMonth() + "/" + inspObj.getDesiredDate().getDayOfMonth() + "/" + inspObj.getDesiredDate().getYear() : null);
        addParameter(params, "$$inspDesiredDate$$", inspDesiredDate);
        addParameter(params, "$$inspDesiredTime$$", inspObj.getInspection().getActivity().getDesiredTime());
        addParameter(params, "$$inspDesiredTime2$$", inspObj.getInspection().getActivity().getDesiredTime2());

        // addParameter(params, "$$inspRequired$$", (inspObj.getInspection().getActivity().requiredInspection == "Y" ? "Required" : ""));
        // addParameter(params, "$$inspBillable$$", (inspObj.getInspection().getActivity().inspBillable == "Y" ? "Billable" : ""));
        // addParameter(params, "$$inspOvertime$$", (inspObj.getInspection().getActivity().overtime == "Y" ? "Overtime" : ""));
    }

    return params;
}

// ******************** CERS ********************
function addGuideSheet_CERS(itemCapId, inspId, guideSheetType) {
    var rgsm = null;
    var RGuideSheetBusiness = aa.proxyInvoker.newInstance("com.accela.aa.inspection.guidesheet.RGuideSheetBusiness").getOutput();
    if (RGuideSheetBusiness) {
        rgsm = RGuideSheetBusiness.getRGuideSheet(aa.getServiceProviderCode(), guideSheetType);
    }

    var GGuideSheetBusiness = aa.proxyInvoker.newInstance("com.accela.aa.inspection.guidesheet.GGuideSheetBusiness").getOutput();
    if (rgsm) {
        var gsSequence = GGuideSheetBusiness.createGGuideSheet(itemCapId, rgsm, inspId, "ADMIN");
        if (gsSequence)
            logDebug("Added guideSheet: " + gsSequence + " " + rgsm.guideType + " on inspection: " + inspId);
        return gsSequence;
    }
}
function checkGuideSheet_CERS(inspId) {
    var itemCapId = (arguments.length > 1 && arguments[1] ? arguments[1] : capId);
    var guideSheetTypes = (arguments.length > 2 && arguments[2] ? arguments[2] : null);
    var guideSheetStatuses = (arguments.length > 3 && arguments[3] ? arguments[3] : null);

    var inspObj = aa.inspection.getInspection(itemCapId, inspId).getOutput(); // current inspection object
    if (inspObj.getInspectionStatusDate()) {
        var inspResultDate = new Date(inspObj.getInspectionStatusDate().getMonth() + "/" + inspObj.getInspectionStatusDate().getDayOfMonth() + "/" + inspObj.getInspectionStatusDate().getYear());
    } else {
        var inspResultDate = new Date(aa.util.now());
    }

    var guideSheetIssues = [];
    var reasons = [], extraGuideSheetTypes = [];
    var gsType = null;
    var guideSheetsAry = getGuideSheetObjects(inspId, itemCapId);
    if (!guideSheetsAry || guideSheetsAry.length == 0) {
        reasons.push("Missing checklist(s): " + guideSheetTypes);
        return reasons;  //If no guidesheets then skip
    }
    //Add Failed guidesheet Items to Violation list from current inspection
    for (g in guideSheetsAry) {
        var guideSheetItem = guideSheetsAry[g];
        if (gsType != guideSheetItem.gsType) {
            logDebug("Now looking at inspection: " + inspId + "checklist: " + guideSheetItem.gsType);
        }
        var gsType = guideSheetItem.gsType;
        if (guideSheetTypes && !exists(gsType, guideSheetTypes)) {
            if (!exists(guideSheetItem.gsType, extraGuideSheetTypes)) extraGuideSheetTypes.push(guideSheetItem.gsType);
            guideSheetIssues.push({ "Checklist Type": gsType, "Item Name": null, "Item Status": null, "Note": "Extra checklist?" });
        };
        logDebug("Now looking at inspection: " + inspId + "checklist: " + guideSheetItem.gsType + ", checklistItem: " + guideSheetItem.text + ", status: " + guideSheetItem.status);
        if (!exists(guideSheetItemStatus, guideSheetStatuses)) continue;

        var ggsheetitem = guideSheetItem.item;
        var guideSheetItemType = guideSheetItem.gsType;
        var guideSheetItemName = guideSheetItem.text;
        var guideSheetItemStatus = guideSheetItem.status;
        var guideSheetSeqNo = ggsheetitem.guideItemSeqNbr.toString();
        var guideSheetItemComment = ggsheetitem.getGuideItemComment() + "";
        if (!guideSheetItemComment) guideSheetItemComment = ""
        if (guideSheetItemComment && guideSheetItemComment.equals("null")) guideSheetItemComment = "";

        guideSheetItem.loadInfo(); // load ASI fields.
        var gsiInfo = guideSheetItem.info;
        if (gsiInfo.length < 1) continue; // No ASI fields.
        gsiInfo["Comment"] = guideSheetItemComment;
        var gsiNames2Check = [], gsiNamesMissing = [], gsiNamesExtra = [];
        if (!exists(guideSheetItemStatus, guideSheetStatuses)) var gsiNames2Check = ["Comment", "Observed Date", "Degree of Violation", "Comply By"];
        if (isBlank(gsiInfo["Complied On"])) gsiNames2Check.push("RTC Qualifier");
        for (var gsiName in gsiInfo) {
            if (isBlank(gsiInfo[gsiName])) {
                if (exists(gsiName, gsiNames2Check)) gsiNamesMissing.push(gsiName);
            } else if (gsiName != "Comment" && !exists(gsiName, gsiNames2Check)) {
                gsiNamesExtra.push(gsiName);
            } else {
                var gsComplyBy = (isBlank(gsiInfo["Comply By"]) ? null : new Date(gsiInfo["Comply By"]));
                var gsCompliedOn = (isBlank(gsiInfo["Complied On"]) ? null : new Date(gsiInfo["Complied On"]));
                if (gsComplyBy && gsComplyBy.getTime() < inspResultDate.getTime()) reasons.push(guideSheetItemType + ". " + guideSheetItemName + " Comply By: " + gsiInfo["Comply By"] + " is before Inspection date: " + jsDateToASIDate(inspResultDate));
                if (gsCompliedOn && gsCompliedOn.getTime() < inspResultDate.getTime()) reasons.push(guideSheetItemType + ". " + guideSheetItemName + " Complied On: " + gsiInfo["Complied On"] + " is before Inspection date: " + jsDateToASIDate(inspResultDate));
            }
        }
        if (gsiNamesMissing.length) {
            reasons.push(guideSheetItemType + ". " + guideSheetItemName + " is missing: " + gsiNamesMissing);
            guideSheetIssues.push({ "Checklist Type": gsType, "Item Name": guideSheetItemName, "Item Status": guideSheetItemStatus, "Note": "Missing required fields: " + gsiNamesMissing.join(", ") });
        }
        if (gsiNamesExtra.length) {
            reasons.push(guideSheetItemType + ". " + guideSheetItemName + " has: " + gsiNamesExtra);
            guideSheetIssues.push({ "Checklist Type": gsType, "Item Name": guideSheetItemName, "Item Status": guideSheetItemStatus, "Note": "Extra populated fields: " + gsiNamesExtra.join(", ") });
        }

    }
    if (extraGuideSheetTypes.length > 0) {
        reasons.push("Extra checklist(s): " + extraGuideSheetTypes.join(", "));
    }

    logDebug("Checked " + reasons.length + " checklist items, " + reasons.join("; "));
    return guideSheetIssues;
}
function copyGuideSheetItemsByStatus_CERS(itemCapId, inspIdFrom, inspIdTo) {
    var itemCapId = arguments.length > 0 && arguments[0] ? arguments[0] : capId;
    var statusArray = arguments.length > 3 && arguments[3] ? arguments[3] : null;
    var statusTypesArray = arguments.length > 4 && arguments[4] ? arguments[4] : null;
    var score = arguments.length > 5 && arguments[5] ? arguments[5] : null;
    var gsSeqNbr = arguments.length > 6 && arguments[6] ? arguments[6] : null;
    var gsType = arguments.length > 7 && arguments[7] ? arguments[7] : null;
    if (statusArray && statusArray.length == 0) statusArray = null;
    if (statusTypesArray && statusTypesArray.length == 0) statusTypesArray = null;
    try {
        //previous inspection and current inspection
        var pInsp, cInsp;

        //Get inspections
        var insps = aa.inspection.getInspections(itemCapId).getOutput();
        if (!insps || insps.length == 0) return false;

        for (var i in insps) {
            if (insps[i].getIdNumber() == inspIdFrom) {
                pInsp = insps[i].getInspection();
            } else if (insps[i].getIdNumber() == inspIdTo) {
                cInsp = insps[i].getInspection();
            }
        }

        //If cannot find inspections then return false
        if (!pInsp || !cInsp) return false;

        //Clear the guidesheet items on current inspection before copying
        var GGuideSheetBusiness = aa.proxyInvoker.newInstance("com.accela.aa.inspection.guidesheet.GGuideSheetBusiness").getOutput();
        if (!GGuideSheetBusiness) {
            logDebug("Could not invoke GGuideSheetBusiness");
            return null;
        }
        GGuideSheetBusiness.removeGGuideSheetByCap(itemCapId, inspIdTo, aa.getAuditID());

        //if previous inspection has no guidesheet then theres nothing to copy
        if (!pInsp.getGuideSheets() || pInsp.getGuideSheets().size() == 0) return false;

        // Copy prev guidesheets
        var gsArray = [];
        var gs = pInsp.getGuideSheets()
        if (gs) {
            gsArray = gs.toArray();
        }
        var guideSheetList = aa.util.newArrayList();
        for (gsIdx in gsArray) {
            var gGuideSheetModel = gsArray[gsIdx]; // class com.accela.aa.inspection.guidesheet.GGuideSheetModel
            var guideSheetType = gGuideSheetModel.getGuideType();
            var guideSheetSeqNbr = gGuideSheetModel.getGuidesheetSeqNbr();
            var guideSheetDesc = gGuideSheetModel.getGuideDesc();
            var guideSheetIdentifier = gGuideSheetModel.getIdentifier();
            logDebug("Checking inspection " + inspId
                + ", GuideSheet seqNbr: " + gGuideSheetModel.guidesheetSeqNbr
                + (gGuideSheetModel.identifier ? ", id: " + gGuideSheetModel.identifier : "")
                + (gGuideSheetModel.guideGroup ? ", Group: " + gGuideSheetModel.guideGroup : "")
                + (gGuideSheetModel.guideType ? ", Type: " + gGuideSheetModel.guideType : "")
                + (gGuideSheetModel.floor ? ", floor: " + gGuideSheetModel.floor : "")
                + (gGuideSheetModel.floorUnit ? ", floorUnit: " + gGuideSheetModel.floorUnit : "")
                + (gGuideSheetModel.guideStatus ? ", guideStatus: " + gGuideSheetModel.guideStatus : "")
                + (gGuideSheetModel.isRequired ? ", Required" : "")
                // + (gsIdx == 0 && gGuideSheetModel.items ? ", items: " + gGuideSheetModel.items : "")
                // + (gsIdx == 0 ? br + describe_TPS(gGuideSheetModel, null, null, true) : "")
            );
            var guideSheetItemList = aa.util.newArrayList();
            var gGuideSheetItemModels = (gGuideSheetModel.getItems() ? gGuideSheetModel.getItems().toArray() : []);
            // var gGuideSheetItemModels = gGuideSheetModel.getItems().toArray();
            for (var gsiIdx in gGuideSheetItemModels) {
                var gGuideSheetItemModel = gGuideSheetItemModels[gsiIdx]; // class com.accela.aa.inspection.guidesheet.GGuideSheetItemModel
                var gGuideItemStatus = gGuideSheetItemModel.getGuideItemStatus();
                if (statusArray && !(exists(gGuideItemStatus, statusArray))) continue;

                // var gso = new guideSheetObject(gGuideSheetModel, gGuideSheetItemModel);
                // gso.loadInfo();

                var gGuideItemInfo = [], gGuideItemInfos = [];
                var itemASISubGroupList = gGuideSheetItemModel.getItemASISubgroupList();
                //If there is no ASI subgroup, it will throw warning message.
                if (itemASISubGroupList != null) {
                    var asiSubGroupIt = itemASISubGroupList.iterator();
                    while (asiSubGroupIt.hasNext()) {
                        var asiSubGroup = asiSubGroupIt.next();
                        var asiItemList = asiSubGroup.getAsiList();
                        if (asiItemList != null) {
                            var asiItemListIt = asiItemList.iterator();
                            while (asiItemListIt.hasNext()) {
                                var asiItemModel = asiItemListIt.next();
                                gGuideItemInfo[asiItemModel.getAsiName()] = asiItemModel.getAttributeValue();
                                if (asiItemModel.getAttributeValue()) {
                                    gGuideItemInfos.push(asiItemModel.getAsiName() + ": " + asiItemModel.getAttributeValue());
                                }
                            }
                        }
                    }
                }

                logDebug("Checking GuideSheet seqNbr: " + gGuideSheetModel.guidesheetSeqNbr
                    + (gGuideSheetModel.identifier ? ", id: " + gGuideSheetModel.identifier : "")
                    // + (guideSheetModel.guideGroup ? ", Group: " + gGuideSheetModel.guideGroup : "")
                    + (gGuideSheetModel.guideType ? ", Type: " + gGuideSheetModel.guideType : "")
                    + (gGuideSheetItemModel.guideItemSeqNbr ? ", SeqNbr: " + gGuideSheetItemModel.guideItemSeqNbr : "")
                    + (gGuideSheetItemModel.guideItemText ? ", Item: " + gGuideSheetItemModel.guideItemText : "")
                    + (gGuideSheetItemModel.guideItemStatus ? ", Status: " + gGuideSheetItemModel.guideItemStatus : "")
                    + (gGuideSheetItemModel.guideItemScore ? ", Score: " + gGuideSheetItemModel.guideItemScore : "")
                    + (gGuideSheetItemModel.majorViolation ? ", majorViolation: " + gGuideSheetItemModel.majorViolation : "")
                    // + (gGuideSheetItemModel.itemASISubgroupList  ? ", itemASISubgroupList: " + gGuideSheetItemModel.itemASISubgroupList  : "")
                    + ", " + gGuideItemInfos.join(", ")
                    // + (gsiIdx == 0 ? br + describe_TPS(gGuideSheetItemModel, null, null, true) : "")
                );
                var guideSheetItemComment = gGuideSheetItemModel.getGuideItemComment() + "";
                if (!guideSheetItemComment) guideSheetItemComment = ""
                if (guideSheetItemComment && guideSheetItemComment.equals("null")) guideSheetItemComment = "";

                var gGuideSheetStatusGroupName = gGuideSheetItemModel.getGuideItemStatusGroupName();
                var guideSheetResultTypeObj;
                var guideSheetResultType;
                if (gGuideSheetStatusGroupName && statusTypesArray) {
                    guideSheetResultTypeObj = aa.guidesheet.getStatusResultType(aa.getServiceProviderCode(), gGuideSheetStatusGroupName, gGuideItemStatus);
                    guideSheetResultType = guideSheetResultTypeObj.getOutput();
                    logDebug("gGuideSheet StatusGroupName: " + gGuideSheetStatusGroupName
                        + ", Status: " + gGuideItemStatus
                        + ", ResultType: " + guideSheetResultType);
                    if (statusTypesArray && !(exists(guideSheetResultType, statusTypesArray))) continue;
                }
                guideSheetItemList.add(gGuideSheetItemModel);
            }

            if (guideSheetItemList.size() > 0) {
                var gGuideSheet = gGuideSheetModel.clone();
                gGuideSheet.setItems(guideSheetItemList);
                guideSheetList.add(gGuideSheet);
            }
        }
        if (guideSheetList.size() > 0) {
            var copyResult = aa.guidesheet.copyGGuideSheetItems(guideSheetList, itemCapId, parseInt(inspIdTo), aa.getAuditID());
            if (copyResult.getSuccess()) {
                logDebug("Successfully copy guideSheet items");
                return true;
            } else {
                logDebug("Failed copy guideSheet items. Error: " + copyResult.getErrorMessage());
                return false;
            }
        }
    } catch (err) {
        showDebug = true;
        logDebug("ERROR occurred in copyGuideSheetItemsByStatus_CERS:  " + err.message);
        logDebug(err.stack);
    }
}
function getComplyByDate_CERS(inspId) {
    var itemCapId = (arguments.length > 1 && arguments[1] ? arguments[1] : capId);
    var guideSheetType = (arguments.length > 2 && arguments[2] ? arguments[2] : null);
    var complyByDays = (arguments.length > 3 && arguments[3] ? arguments[3] : 30); // Default: Working day after x days

    var complyBy = null;
    var isOutOfCompliance = false;
    var complyByDefault = new Date(dateAdd(dateAdd(null, complyByDays - 1), 1, true)); // Working day after 30 days.
    if (!inspId) { // no inspection so use default;
        return complyByDefault;
    }

    var guideSheetsAry = getGuideSheetObjects(inspId, itemCapId);
    if (!guideSheetsAry || guideSheetsAry.length == 0) { // if no guidesheets then us default;
        return complyByDefault;
    }
    //Add Failed guidesheet Items to Violation list from current inspection
    for (g in guideSheetsAry) {
        var guideSheetItem = guideSheetsAry[g];
        var guideSheetItemType = guideSheetItem.gsType;
        if (!exists(guideSheetItemType, [guideSheetType])) continue;
        var guideSheetItemName = guideSheetItem.text;
        var guideSheetItemStatus = guideSheetItem.status;
        if (!exists(guideSheetItemStatus, ["OUT"])) continue;
        var isOutOfCompliance = true;
        var ggsheetitem = guideSheetItem.item;
        var guideSheetSeqNo = ggsheetitem.guideItemSeqNbr.toString();

        guideSheetItem.loadInfo(); // load ASI fields.
        var gsiInfo = guideSheetItem.info;
        if (gsiInfo.length < 1) continue; // No ASI fields.
        var gsComplyBy = (isBlank(gsiInfo["Comply By"]) ? null : new Date(gsiInfo["Comply By"]));
        if (gsComplyBy == null) continue;
        var gsCompliedOn = (isBlank(gsiInfo["Complied On"]) ? null : new Date(gsiInfo["Complied On"]));
        if (gsCompliedOn == null) continue;
        if (!complyBy || complyBy.getTime() < gsComplyBy.getTime()) complyBy = gsComplyBy;
        logDebug("Record: " + itemCapId.getCustomID() + ", inspId: " + inspId + ", checklist: " + guideSheetItemType + ", item: " + guideSheetItemName + ", Comply By: " + complyBy);
    }
    if (isOutOfCompliance && !complyBy) complyBy = complyByDefault;
    logDebug("Record: " + itemCapId.getCustomID() + ", inspId: " + inspId + ", ComplyBy: " + complyBy + ", isOutOfCompliance? " + isOutOfCompliance);

    return complyBy;
}
function getGuideSheets(itemCapId, inspId) {
    var guideSheetTypes = (arguments.length > 2 && arguments[2] ? arguments[2] : null);
    var guideSheetSeqNbr = (arguments.length > 3 && arguments[3] ? arguments[3] : null);
    if (guideSheetTypes && !Array.isArray(guideSheetTypes)) { // If not array assume string is an array.
        guideSheetTypes = guideSheetTypes.split(",");
        logDebug("guideSheetTypes: " + guideSheetTypes.join(",") + ", isArray? " + Array.isArray(guideSheetTypes));
    }

    var gsModels = null;
    var inspObj = null;
    // var inspObj = aa.inspection.getInspection(itemCapId, inspId).getOutput(); // current inspection object (Doesn't work for GuideSheets)
    var r = aa.inspection.getInspections(itemCapId);  // have to use this method to get guidesheet data
    if (r.getSuccess()) {
        var inspArray = r.getOutput();
        for (i in inspArray) {
            if (inspArray[i].getIdNumber() == inspId) {
                var inspObj = inspArray[i];
                break;
            }
        }
    }
    logDebug("Looking for GuideSheets with "
        + (itemCapId ? " capId: " + itemCapId.getCustomID() : "")
        + (inspId ? " inspId: " + inspId : "")
        + (guideSheetTypes ? " Names: [" + guideSheetTypes.join(",") + "]" : "")
        + (guideSheetSeqNbr ? " SeqNbr: " + guideSheetSeqNbr : "")
    );

    if (inspObj) {
        var inspModel = inspObj.getInspection();
        logDebug("inspModel: {"
            + (inspModel.idNumber ? " id: " + inspModel.idNumber : "")
            + (inspModel.inspectionGroup ? ", Group: " + inspModel.inspectionGroup : "")
            + (inspModel.inspectionType ? ", Type: " + inspModel.inspectionType : "")
            + (inspModel.inspectionStatus ? ", Status: " + inspModel.inspectionStatus : "")
            + (inspModel.guideSheetCount ? ", guideSheetCount: " + inspModel.guideSheetCount : "")
            // + (inspModel.getGuideSheets() ? ", GuideSheets: " + inspModel.getGuideSheets() : "")
            + "}"
            // + ", inspObj: " + br + describe_TPS(inspObj)
            // + ", inspection: " + br + describe_TPS(inspModel)
        );
        var guideSheetModelList = inspModel.getGuideSheets();
        if (guideSheetModelList) {
            var guideSheetModels = guideSheetModelList.toArray();
            if (guideSheetTypes) {
                var gsModels = [];
                for (var gg in guideSheetModels) {
                    var guideSheetModel = guideSheetModels[gg];
                    logDebug("guideSheets[" + gg + "]: {"
                        + (guideSheetModel.guidesheetSeqNbr ? (guideSheetSeqNbr && guideSheetModel.getGuidesheetSeqNbr() != guideSheetSeqNbr ? "<font color=red>" : "<font>") + " SeqNbr: " + guideSheetModel.guidesheetSeqNbr + "</font>" : "")
                        // + (guideSheetModel.guideGroup ? ", group: " + guideSheetModel.guideGroup : "")
                        + (guideSheetModel.guideType ? (guideSheetTypes && !exists(guideSheetModel.getGuideType(), guideSheetTypes) ? "<font color=red>" : "<font>") + ", type: " + guideSheetModel.guideType + "</font>" : "")
                        + (guideSheetModel.identifier ? ", identifier: " + guideSheetModel.identifier : "")
                        + (guideSheetModel.floor ? ", floor: " + guideSheetModel.floor : "")
                        + (guideSheetModel.floorUnit ? ", floorUnit: " + guideSheetModel.floorUnit : "")
                        + (guideSheetModel.auditStatus != "A" ? "<font color=red>, auditStatus: " + guideSheetModel.auditStatus + "</font>" : "")
                        + "}"
                        // + br + describe_TPS(guideSheetModel)
                    );
                    if (guideSheetModel.getAuditStatus() != "A") continue;
                    if (guideSheetSeqNbr && guideSheetModel.getGuidesheetSeqNbr() != guideSheetSeqNbr) continue;
                    if (guideSheetTypes && !exists(guideSheetModel.getGuideType(), guideSheetTypes)) continue;
                    logDebug("Found guideSheets[" + gg + "]: {"
                        + (guideSheetModel.guidesheetSeqNbr ? " SeqNbr: " + guideSheetModel.guidesheetSeqNbr : "")
                        // + (guideSheetModel.guideGroup ? ", group: " + guideSheetModel.guideGroup : "")
                        + (guideSheetModel.guideType ? ", type: " + guideSheetModel.guideType : "")
                        + (guideSheetModel.identifier ? ", identifier: " + guideSheetModel.identifier : "")
                        + (guideSheetModel.floor ? ", floor: " + guideSheetModel.floor : "")
                        + (guideSheetModel.floorUnit ? ", floorUnit: " + guideSheetModel.floorUnit : "")
                        + "}"
                        // + br + describe_TPS(guideSheetModel)
                    );
                    gsModels.push(guideSheetModel);
                    if (guideSheetSeqNbr) break;
                }
            } else {
                var gsModels = guideSheetModels;
            }
        } else {
            logDebug("No guidesheets for this inspection");
        }
    }
    return gsModels;
}
function getGuideSheetTypes_CERS(inspModel) { // Also sets 2 global variables: rGuideSheets.
    var itemCapId = (arguments.length > 1 && arguments[1] ? arguments[1] : capId);
    var inspId = inspModel.idNumber
    var inspGroup = inspModel.inspectionGroup
    var inspType = inspModel.inspectionType
    var guideSheetNames = [];
    var guideSheetGroup = null;
    if (appMatch("EnvHealth/Hazmat/Business Plan/Permit", itemCapId)) { // (Field: 4, Program Element: a) Hazardous Materials Business Plan (HMBP) & Hazardous Materials Release Response Plan (HMRRP)
        var recordIDSuffix = "HMBP";
        var guideSheetGroup = "CUPA - HMBP";
        // rGuideSheets[8]: , guideType: CP22 - HMBP, groupNames: [CUPA - HMBP, CUPA CHECKLISTS]
    } else if (appMatch("EnvHealth/Hazmat/CalARP/Permit", itemCapId)) { // (Field: 4a, Program Element: b) California Accidential Release Prevention (CalARP)
        var recordIDSuffix = "CalARP";
        var guideSheetGroup = "CUPA - CalARP";
        // rGuideSheets[4]: , guideType: CP22 - CalARP Level 1, groupNames: [CUPA - CalARP, CUPA CHECKLISTS]
        // rGuideSheets[5]: , guideType: CP22 - CalARP Level 2, groupNames: [CUPA - CalARP, CUPA CHECKLISTS]
        // rGuideSheets[6]: , guideType: CP22 - CalARP Level 3, groupNames: [CUPA - CalARP, CUPA CHECKLISTS]
        // rGuideSheets[7]: , guideType: CP22 - CalARP Level 4, groupNames: [CUPA - CalARP, CUPA CHECKLISTS]
    } else if (appMatch("EnvHealth/Hazmat/UST/Permit", itemCapId)) { // (Field: 5, Program Element: c) Underground Storage Tanks (UST)
        var recordIDSuffix = "UST";
        var guideSheetGroup = "CUPA - UST";
        // rGuideSheets[21]: , guideType: CP22 - UST DW, groupNames: [CUPA - UST, CUPA CHECKLISTS]
        // rGuideSheets[22]: , guideType: CP22 - UST FULL, groupNames: [CUPA - UST, CUPA CHECKLISTS]
        // rGuideSheets[23]: , guideType: CP22 - UST SW, groupNames: [CUPA - UST, CUPA CHECKLISTS]
    } else if (appMatch("EnvHealth/Hazmat/APSA/Permit", itemCapId)) { // (Field: 8, Program Element: d) Aboveground Petroleum Storage Act (ASPA)
        var recordIDSuffix = "ASPA";
        var guideSheetGroup = "CUPA - ASPA";
        // rGuideSheets[0]: , guideType: CP22 - AST Cond Exemp, groupNames: [CUPA - ASPA, CUPA CHECKLISTS]
        // rGuideSheets[1]: , guideType: CP22 - AST Non-Qualified, groupNames: [CUPA - ASPA, CUPA CHECKLISTS]
        // rGuideSheets[2]: , guideType: CP22 - AST Tier I, groupNames: [CUPA - ASPA, CUPA CHECKLISTS]
        // rGuideSheets[3]: , guideType: CP22 - AST Tier II, groupNames: [CUPA - ASPA, CUPA CHECKLISTS]
    } else if (appMatch("EnvHealth/Hazmat/Hazwaste Generator/Permit", itemCapId)) { // (Field: 9, Program Elements: e, f [RCRA LQG])
        var recordIDSuffix = "HWG";
        var guideSheetGroup = "CUPA - HW";
        // rGuideSheets[9]: , guideType: CP22 - HW LQG, groupNames: [CUPA - HW LQG, CUPA CHECKLISTS]
        // rGuideSheets[10]: , guideType: CP22 - HW SQG, groupNames: [CUPA - HW SQG, CUPA CHECKLISTS]
    } else if (appMatch("EnvHealth/Hazmat/Hazwaste Consolidation/Permit", itemCapId)) { // (Field: 13, Program Element: e)
        var recordIDSuffix = "RWC";
        var guideSheetGroup = "CUPA - HW";
    } else if (appMatch("EnvHealth/Hazmat/Large Quantity Generator/Permit", itemCapId)) { // (Field: 14a, Program Element: f) Hazardous Waste RCRA Large Quantity Generator (RCRA LQG)
        var recordIDSuffix = "LQG";
        var guideSheetGroup = "CUPA - LQG";
        // rGuideSheets[11]: , guideType: CP22 - RCRA LQG, groupNames: [CUPA - RCRA LQG, CUPA CHECKLISTS] (14a) Resource Conservation and Recovery Act
    } else if (appMatch("EnvHealth/Hazmat/Recyclable Materials/Permit", itemCapId)) { // (Field: 10, Program Element: g)
        var recordIDSuffix = "TP";
        var guideSheetGroup = "CUPA - HW";
    } else if (appMatch("EnvHealth/Hazmat/Tiered Permitting/Permit", itemCapId)) { // (Field: 11, Program Element: j use Highest Tier)
        var recordIDSuffix = "TP";
        var guideSheetGroup = "CUPA - Tiered Permitting";
        // rGuideSheets[12]: , guideType: CP22 - Tiered Permitting CA, groupNames: [CUPA - Tiered Permitting, CUPA CHECKLISTS]
        // rGuideSheets[13]: , guideType: CP22 - Tiered Permitting CECL, groupNames: [CUPA - Tiered Permitting, CUPA CHECKLISTS]
        // rGuideSheets[14]: , guideType: CP22 - Tiered Permitting CEL, groupNames: [CUPA - Tiered Permitting, CUPA CHECKLISTS]
        // rGuideSheets[15]: , guideType: CP22 - Tiered Permitting CESQT, groupNames: [CUPA - Tiered Permitting, CUPA CHECKLISTS]
        // rGuideSheets[16]: , guideType: CP22 - Tiered Permitting CESW, groupNames: [CUPA - Tiered Permitting, CUPA CHECKLISTS]
        // rGuideSheets[17]: , guideType: CP22 - Tiered Permitting Full, groupNames: [CUPA - Tiered Permitting, CUPA CHECKLISTS]
        // rGuideSheets[18]: , guideType: CP22 - Tiered Permitting PBR, groupNames: [CUPA - Tiered Permitting, CUPA CHECKLISTS]
    } else if (appMatch("EnvHealth/Hazmat/HHW/Permit", itemCapId)) { // (Field: 14b, Program Element:k) Household Hazardous Waste (HHW)
        var recordIDSuffix = "HHW";
        var guideSheetGroup = "CUPA - HHW";
        // rGuideSheets[19]: , guideType: CP22 - Tiered PermittingPHHWCF, groupNames: [CUPA - Tiered Permitting, CUPA CHECKLISTS]
        // rGuideSheets[20]: , guideType: CP22 - Tiered PermittingTHHWCF, groupNames: [CUPA - Tiered Permitting, CUPA CHECKLISTS]
    }
    // Program Elements: h = Permit by Rule (PBR); i = Conditionally Authorized (CA) [Only if PBR is not used]; j = Conditionally Exempt (CE)  [Only if PBR & CA are not used]
    logDebug("Looking for Group: " + inspGroup + ", Type: " + inspType
        + (guideSheetGroup ? " guideSheetGroup: " + guideSheetGroup : "")
    );
    if (!guideSheetGroup) guideSheetGroup = getGuideSheetGroup(inspGroup, inspType);
    var guideSheets = getRGuideSheets(inspGroup, inspType, guideSheetGroup);
    // Get Ref GuideSheets & GuideSheet Types
    rGuideSheets = [], rGuideSheetGroups = []; // Global with Ref GuideSheets
    var rGuideSheetTypes = [];
    for (var rr in guideSheets) {
        var rGuideSheet = guideSheets[rr];
        logDebug("rGuideSheet: " + rGuideSheet.guideType + ", groups: " + rGuideSheet.groupNames + " " + typeof (rGuideSheet.groupNames)); //  + br + describe_TPS(rGuideSheet));
        var rGuideSheetGroups = rGuideSheet.getGroups().toArray();
        for (var rrG in rGuideSheetGroups) {
            var rGuideSheetGroup = rGuideSheetGroups[rrG];
            var rGuideSheetGroupName = rGuideSheetGroup.guideGroup;
            if (guideSheetGroup && !exists(rGuideSheetGroupName, rGuideSheet.groupNames)) continue;
            rGuideSheetGroups[rGuideSheetGroupName] = rGuideSheetGroup;
            rGuideSheets[rGuideSheetGroupName] = rGuideSheet;
            logDebug("rGuideSheetGroup[" + rrG + "]: " + rGuideSheetGroup.guideGroup + ", autoCreate: " + rGuideSheetGroup.adhoc + ", adhoc: " + rGuideSheetGroup.adhoc + br + describe_TPS(rGuideSheetGroup));
        }
        // if (exists(guideSheetGroup, rGuideSheet.groupNames)) rGuideSheet = guideSheetGroup

        // var rGuideSheetGroup = rGuideSheet.guideType 
        rGuideSheetTypes.push(guideSheets[rr].guideType);
    }
    logDebug("rGuideSheetTypes: " + rGuideSheetTypes + (guideSheetGroup ? ", guideSheetGroup: " + guideSheetGroup : ""));
    return rGuideSheetTypes;
}
function getInspections() {
    // function getLastInspection: returns the inspectionModel of the last inspection matching criteria (inspTypes, inspStatuses).
    // TODO: exclude canceled inspections
    var inspTypes = (arguments.length > 0 && arguments[0] ? arguments[0] : null);
    var inspStatuses = (arguments.length > 1 && arguments[1] ? arguments[1] : null);
    var inspStatusesExcluded = (arguments.length > 1 && arguments[1] ? null : ["Pending", "Scheduled"]); // T
    var inspLastOnly = (arguments.length > 2 && arguments[2] == true ? true : false);
    var itemCapId = (arguments.length > 3 && arguments[3] ? arguments[3] : capId);
    var floor = (arguments.length > 4 && arguments[4] ? arguments[4] : null);
    var floorUnit = (arguments.length > 5 && arguments[5] ? arguments[5] : null);

    if (inspTypes) var inspTypes = String(inspTypes).split(",")
    if (inspStatuses) var inspStatuses = String(inspStatuses).split(",")
    logDebug("getInspections(" + "inspTypes: " + inspTypes + (inspStatuses ? ", inspStatuses: " + inspStatuses : ", !inspStatuses: " + inspStatusesExcluded) + ", capId: " + itemCapId);
    var inspModels = [];

    var inspResultObj = aa.inspection.getInspections(itemCapId);
    if (inspResultObj.getSuccess()) {
        inspList = inspResultObj.getOutput();

        inspList.sort(compareInspDateDesc)
        for (xx in inspList) {
            var inspModel = inspList[xx].getInspection();
            var reasons = [];
            if (inspTypes && !exists(inspList[xx].getInspectionType(), inspTypes)) reasons.push("Type: " + inspList[xx].getInspectionType() + " != " + inspTypes.join(", "));
            if (inspStatuses && !exists(inspList[xx].getInspectionStatus(), inspStatuses)) reasons.push("Status: " + inspList[xx].getInspectionStatus());
            if (inspStatusesExcluded && exists(inspList[xx].getInspectionStatus(), inspStatusesExcluded)) reasons.push("!Status: " + inspList[xx].getInspectionStatus());
            if (floor && floor != inspModel.getActivity().floor) reasons.push("floor: " + inspModel.getActivity().floor);
            if (floorUnit && floorUnit != inspModel.getActivity().floorUnit) reasons.push("floorUnit: " + inspModel.getActivity().floorUnit);
            // logDebug("inspList[" + xx + "]: "
            //     + (inspModel.idNumber ? ", id: " + inspModel.idNumber : "")
            //     + (inspModel.inspectionGroup ? ", Group: " + inspModel.inspectionGroup : "")
            //     + (inspModel.inspectionType ? ", Type: " + inspModel.inspectionType : "")
            //     + (inspModel.inspectionStatus ? ", Status: " + inspModel.inspectionStatus : "")
            //     + (reasons.length > 0? ", reasons: " + reasons.join(";") : "")
            // );
            if (reasons.length > 0) continue;
            logDebug("Found inspList[" + xx + "]: "
                // + (inspList[xx].idNumber ? ", id: " + inspList[xx].idNumber : "")
                // + (inspList[xx].inspectionType ? ", Type: " + inspList[xx].inspectionType : "")
                // + (inspList[xx].inspectionStatus ? ", Status: " + inspList[xx].inspectionStatus : "")
                // + (inspList[xx].inspector ? ", inspector : " + inspList[xx].inspector : "")
                // + (inspList[xx].requestDate ? ", requestDate : " + jsDateToASIDate(convertDate(inspList[xx].requestDate)) : "")
                // + (inspList[xx].scheduledDate ? ", scheduledDate  : " + jsDateToASIDate(convertDate(inspList[xx].scheduledDate)) : "")
                // + (inspList[xx].inspectionDate ? ", inspectionDate   : " + jsDateToASIDate(convertDate(inspList[xx].inspectionDate)) : "")
                // + (inspList[xx].inspectionComments ? ", Comments  : " + inspList[xx].inspectionComments : "")
                // + (inspList[xx].documentDescription ? ", documentDescription   : " + convertDate(inspList[xx].documentDescription) : "")
                + (inspModel.idNumber ? "id: " + inspModel.idNumber : "")
                + (inspModel.inspSequenceNumber ? ", SeqNbr: " + inspModel.inspSequenceNumber : "")
                + (inspModel.parentInspNbr ? ", parentInspNbr: " + inspModel.parentInspNbr : "")
                + (inspModel.inspectionGroup ? ", Group: " + inspModel.inspectionGroup : "")
                + (inspModel.inspectionType ? ", Type: " + inspModel.inspectionType : "")
                + (inspModel.inspectionStatus ? ", Status: " + inspModel.inspectionStatus : "")
                + (inspModel.completed ? ", completed: " + inspModel.completed : "")
                + (inspModel.inspector ? ", inspector: " + inspModel.inspector : "")
                + (inspModel.calendarInspectionType ? ", calendarInspectionType: " + inspModel.calendarInspectionType : "")
                + (inspModel.documentDescription ? ", documentDescription: " + inspModel.documentDescription : "")
                + (inspModel.comment + "" != "" ? ", comment: " + inspModel.comment : "")
                + (inspModel.getActivity().requiredInspection ? ", Required: " + inspModel.getActivity().requiredInspection : "")
                // + (inspModel.requestDate ? ", requestDate: " + jsDateToASIDate(convertDate(inspModel.requestDate)) : "")
                + (inspModel.getActivity().requestor ? ", requestor: " + inspModel.getActivity().requestor : "")
                + (inspModel.getActivity().reqPhoneNum + "" != "" ? ", reqPhoneNum: " + inspModel.getActivity().reqPhoneNum : "")
                + (inspModel.requestComment + "" != "" ? ", requestComment: " + inspModel.requestComment : "")
                + (inspModel.scheduledDate ? ", scheduledDate: " + jsDateToASIDate(convertDate(inspModel.scheduledDate)) : "")
                // + (inspModel.inspectionStatusDate   ? ", inspectionStatusDate: " + jsDateToASIDate(convertDate(inspModel.inspectionStatusDate  )) : "")
                // + (inspList[xx].inspectionDate ? ", inspectionDate: " + jsDateToASIDate(convertDate(inspList[xx].inspectionDate)) : "")
                + (inspModel.guideSheetCount ? ", guideSheetCount: " + inspModel.guideSheetCount : "")
                + (inspModel.guideSheetTotalScore ? ", guideSheetTotalScore: " + inspModel.guideSheetTotalScore : "")
                + (inspModel.getActivity().grade ? ", grade: " + inspModel.getActivity().grade : "")
                + (inspModel.getActivity().district ? ", district: " + inspModel.getActivity().district : "")
                + (inspModel.getActivity().floor ? ", floor: " + inspModel.getActivity().floor : "")
                + (inspModel.getActivity().floorUnit ? ", floorUnit: " + inspModel.getActivity().floorUnit : "")
                + (inspModel.getActivity().latitude ? ", latitude: " + inspModel.getActivity().latitude : "")
                + (inspModel.getActivity().longitude ? ", longitude : " + inspModel.getActivity().longitude : "")
                + (inspModel.getActivity().contactName + "" != "" ? ", contactName: " + inspModel.getActivity().contactName : "")
                + (inspModel.getActivity().contactPhoneNum + "" != "" ? ", contactPhoneNum: " + inspModel.getActivity().contactPhoneNum : "")
                + (inspModel.getActivity().createdByACA ? ", createdByACA: " + inspModel.getActivity().createdByACA : "")
                + (inspModel.getActivity().displayInACA ? ", displayInACA: " + inspModel.getActivity().displayInACA : "")
                + (inspModel.getActivity().inspUnits ? ", inspUnits: " + inspModel.getActivity().inspUnits : "")
                + (inspModel.getActivity().inspBillable ? ", inspBillable: " + inspModel.getActivity().inspBillable : "")
                + (inspModel.getActivity().overtime ? ", overtime: " + inspModel.getActivity().overtime : "")
                // + ", inspection: " + br + describe_TPS(inspModel)
                // + ", inspection.Activity: " + br + describe_TPS(inspModel.getActivity())
            );
            inspModels.push(inspList[xx]);
            if (inspLastOnly) break;
        }
    }
    if (inspModels.length == 0) inspModels = null;
    return inspModels;
}
function getAllRGuideSheets(guideSheetGroup) { // 
    var isShowItems = (arguments.length > 1 && arguments[1] == false ? false : true);
    if (typeof (servProvCode) == "undefined") servProvCode = aa.getServiceProviderCode();
    var qf = aa.util.newQueryFormat();

    var rGuideSheets = null;
    var RGuideSheetBusiness = aa.proxyInvoker.newInstance("com.accela.aa.inspection.guidesheet.RGuideSheetBusiness").getOutput();
    if (RGuideSheetBusiness && guideSheetGroup) {
        var rGuideSheets = [];
        logDebug("Looking for rGuideSheetGroup: " + guideSheetGroup);
        logDebug("Looking for guideSheets in guideSheetGroup: " + guideSheetGroup);
        // List<RGuideSheetModel> = RGuideSheetBusiness.getAllRGuideSheets(String servProCode, String group, boolean isShowItems, QueryFormat queryFormat)
        var rGuideSheetsList = RGuideSheetBusiness.getAllRGuideSheets(servProvCode, guideSheetGroup, isShowItems, qf);
        if (rGuideSheetsList && rGuideSheetsList.toArray) {
            var rGuideSheetsArray = rGuideSheetsList.toArray();
            for (var rr in rGuideSheetsArray) {
                var rGuideSheetModel = rGuideSheetsArray[rr]; // class com.accela.aa.inspection.guidesheet.RGuideSheetModel
                if (rGuideSheetModel.getAuditStatus() != "A") continue;
                logDebug("rGuideSheets[" + rr + "]: " // + rGuideSheet
                    + ", guideType: " + rGuideSheetModel.guideType
                    + (rGuideSheetModel.groupNames ? ", groupNames: " + rGuideSheetModel.groupNames : "") // java.util.List
                    // + (rGuideSheetModel.groups ? ", groups: " + rGuideSheetModel.groups : "")
                    + (rGuideSheetModel.class ? ", class: " + rGuideSheetModel.class : "")
                    // + br + describe_TPS(rGuideSheet, null, null, true)
                );
                rGuideSheets.push(rGuideSheet);
            }
        }
    }

    // rGuideSheet = getRGuideSheetGroup(guideSheetGroup);
    return rGuideSheets;
}
function getGroupRGuideSheets(guideSheetGroup) { // 
    if (typeof (servProvCode) == "undefined") servProvCode = aa.getServiceProviderCode();
    var qf = aa.util.newQueryFormat();

    var rGuideSheets = null;
    var RGuideSheetGroupBusiness = aa.proxyInvoker.newInstance("com.accela.aa.inspection.guidesheet.RGuideSheetGroupBusiness").getOutput();
    if (RGuideSheetGroupBusiness && guideSheetGroup) {
        var rGuideSheets = [];
        logDebug("Looking for rGuideSheetGroup: " + guideSheetGroup);
        // RGuideSheetGroupModel = RGuideSheetGroupBusiness.getRGuideSheetGroup(String spc, String groupName);
        rGuideSheetGroupModel = RGuideSheetGroupBusiness.getRGuideSheetGroup(servProvCode, guideSheetGroup); // class com.accela.aa.inspection.guidesheet.RGuideSheetGroupModel
        logDebug("rGuideSheetGroupModel: " // class com.accela.aa.inspection.guidesheet.RGuideSheetGroupModel
            + (rGuideSheetGroupModel.guideGroup ? ", guideGroup: " + rGuideSheetGroupModel.guideGroup : "")
            + (rGuideSheetGroupModel.autoCreate ? ", autoCreate: " + rGuideSheetGroupModel.autoCreate : "")
            + (rGuideSheetGroupModel.adhoc ? ", adhoc : " + rGuideSheetGroupModel.adhoc : "")
            + (rGuideSheetGroupModel.guideTypes ? ", guideTypes: " + rGuideSheetGroupModel.guideTypes : "") // java.util.List
            + (rGuideSheetGroupModel.class ? ", class : " + rGuideSheetGroupModel.class : "")
            // + br + describe_TPS(rGuideSheetGroupModel, null, null, true)
        );
        // java.util.Collection getGroupRGuideSheets(String spc, String groupName, QueryFormat queryFormat)
        var rGuideSheetsList = RGuideSheetGroupBusiness.getGroupRGuideSheets(servProvCode, guideSheetGroup, qf);
        if (!rGuideSheetGroupModel.getGuideSheets() && rGuideSheetsList) {
            rGuideSheetGroupModel.setGuideSheets(rGuideSheetsList);
            var rGuideSheetGroupModels = rGuideSheetsList.toArray();
            for (var rr in rGuideSheetGroupModels) {
                var rGuideSheetGroupModel = rGuideSheetGroupModels[rr]; // class com.accela.aa.inspection.guidesheet.RGuideSheetGroupModel
                if (rGuideSheetGroupModel.getAuditStatus() != "A") continue;
                logDebug("rGuideSheetGroupModels[" + rr + "] (1): " // + rGuideSheetGroupModel
                    + (rGuideSheetGroupModel.guideGroup ? ", guideGroup: " + rGuideSheetGroupModel.guideGroup : "")
                    + (rGuideSheetGroupModel.guideType ? ", guideType: " + rGuideSheetGroupModel.guideType : "")
                    + (rGuideSheetGroupModel.autoCreate ? ", autoCreate: " + rGuideSheetGroupModel.autoCreate : "")
                    + (rGuideSheetGroupModel.adhoc ? ", adhoc : " + rGuideSheetGroupModel.adhoc : "")
                    + (rGuideSheetGroupModel.class ? ", class : " + rGuideSheetGroupModel.class : "")
                    // + br + describe_TPS(rGuideSheetGroupModel, null, null, true)
                );
                rGuideSheets.push(rGuideSheet);
            }
        }

    }
    return rGuideSheets;
}
function getGuideSheetGroup(inspGroup, inspType) {
    // Get GuideSheet Group associated with inspection type.
    var guideSheetGroup = null;
    var inspTypeModels = null;
    var inspTypeResult = aa.inspection.getInspectionType(inspGroup, inspType);
    if (inspTypeResult.getSuccess()) {
        inspTypeModels = inspTypeResult.getOutput();
    }
    if (inspTypeModels) {
        for (var ii in inspTypeModels) {
            var inspTypeModel = inspTypeModels[ii];
            var guideSheetGroupModel = inspTypeModel.getGuideGroup();
            // logDebug("guideSheetGroupModel: " + br + describe_TPS(guideSheetGroupModel));
            var guideSheetGroup = guideSheetGroupModel.getGuideGroup();
            logDebug("Found for inspection" + (inspGroup ? " group: " + inspGroup + "," : "") + " type: " + inspType + ", guideSheetGroup: " + guideSheetGroup);
            break;
        }
    }
    return guideSheetGroup;
}
function getRGuideSheet(guideSheetType) {
    if (typeof (servProvCode) == "undefined") servProvCode = aa.getServiceProviderCode();

    var rGuideSheetModel = null;
    var RGuideSheetBusiness = aa.proxyInvoker.newInstance("com.accela.aa.inspection.guidesheet.RGuideSheetBusiness").getOutput();
    if (RGuideSheetBusiness && guideSheetType) {
        logDebug("Looking for rGuideSheet: " + guideSheetType);
        //  RGuideSheetModel =  RGuideSheetBusiness.getRGuideSheet(String spc, String gsName);
        rGuideSheetModel = RGuideSheetBusiness.getRGuideSheet(servProvCode, guideSheetType);
        logDebug("rGuideSheetModel: " // class com.accela.aa.inspection.guidesheet.RGuideSheetGroupModel
            + ", guideType: " + rGuideSheetModel.guideType
            + (rGuideSheetModel.groupNames ? ", groupNames: " + rGuideSheetModel.groupNames : "") // java.util.List
            // + (rGuideSheetModel.groups ? ", groups: " + rGuideSheetModel.groups : "")
            + ", class: " + rGuideSheetModel.class
            // + br + describe_TPS(rGuideSheetModel, null, null, true)
        );
    }
    return rGuideSheetModel;
}
function getRGuideSheetByGuideSheetGroup(guideSheetGroup) { // 
    var autoCreate = (arguments.length > 1 && arguments[1] ? arguments[1] : "");
    var recStatus = (arguments.length > 2 && arguments[2] ? arguments[2] : "A");
    var callerID = (arguments.length > 3 && arguments[3] ? arguments[3] : "");

    if (typeof (servProvCode) == "undefined") servProvCode = aa.getServiceProviderCode();
    var rGuideSheets = null;
    var RGuideSheetBusiness = aa.proxyInvoker.newInstance("com.accela.aa.inspection.guidesheet.RGuideSheetBusiness").getOutput();
    if (RGuideSheetBusiness && guideSheetGroup) {
        var rGuideSheets = [];
        logDebug("Looking for rGuideSheetGroup: " + guideSheetGroup);
        logDebug("Looking for guideSheets in guideSheetGroup: " + guideSheetGroup
            + (autoCreate ? ", autoCreate: " + autoCreate : "")
            + (recStatus ? ", recStatus: " + recStatus : "")
            + (callerID ? ", callerID: " + callerID : "")
        );
        // java.util.Collection getRGuideSheetByGuideSheetGroup(java.lang.String servProvCode,java.lang.String groupName,java.lang.String autoCreate,java.lang.String recStatus,java.lang.String callerID)
        var rGuideSheetsList = RGuideSheetBusiness.getRGuideSheetByGuideSheetGroup(servProvCode, guideSheetGroup, autoCreate, recStatus, callerID);
        // logDebug("rGuideSheetList: " + br + describe_TPS(rGuideSheetList, null, null, true));
        if (rGuideSheetsList && rGuideSheetsList.toArray) {
            var rGuideSheetsArray = rGuideSheetsList.toArray();
            for (var rr in rGuideSheetsArray) {
                var rGuideSheetModel = rGuideSheetsArray[rr]; // class com.accela.aa.inspection.guidesheet.RGuideSheetModel
                if (rGuideSheetModel.getAuditStatus() != "A") continue;
                logDebug("rGuideSheets[" + rr + "]: " // + rGuideSheet
                    + ", guideType: " + rGuideSheetModel.guideType
                    + (rGuideSheetModel.groupNames ? ", groupNames: " + rGuideSheetModel.groupNames : "") // java.util.List
                    // + (rGuideSheet.groups ? ", groups: " + rGuideSheet.groups : "")
                    + ", class: " + rGuideSheetModel.class
                    // + br + describe_TPS(rGuideSheet, null, null, true)
                );
                rGuideSheets.push(rGuideSheetModel);
            }
        }
    }
    return rGuideSheets;
}
function getRGuideSheetGroup(guideSheetGroup) { // Get RGuideSheetGroupModel and associated RGuideSheetGroupModels
    if (typeof (servProvCode) == "undefined") servProvCode = aa.getServiceProviderCode();

    var rGuideSheets = null;
    var RGuideSheetGroupBusiness = aa.proxyInvoker.newInstance("com.accela.aa.inspection.guidesheet.RGuideSheetGroupBusiness").getOutput();
    if (RGuideSheetGroupBusiness && guideSheetGroup) {
        var rGuideSheets = [];
        logDebug("Looking for rGuideSheetGroup: " + guideSheetGroup);
        // RGuideSheetGroupModel = RGuideSheetGroupBusiness.getRGuideSheetGroup(String spc, String groupName);
        rGuideSheetGroupModel = RGuideSheetGroupBusiness.getRGuideSheetGroup(servProvCode, guideSheetGroup); // class com.accela.aa.inspection.guidesheet.RGuideSheetGroupModel
        if (!rGuideSheetGroupModel.getGuideSheets()) {
            var qf = aa.util.newQueryFormat();
            // java.util.Collection getGroupRGuideSheets(String spc, String groupName, QueryFormat queryFormat)
            // var rGuideSheetGroupModels = getGroupRGuideSheets(guideSheetGroup)
            var rGuideSheetsList = RGuideSheetGroupBusiness.getGroupRGuideSheets(servProvCode, guideSheetGroup, qf);
            if (rGuideSheetsList) {
                rGuideSheetGroupModel.setGuideSheets(rGuideSheetsList);
                var rGuideTypes = [];
                var rGuideSheetGroupModels = rGuideSheetsList.toArray();
                for (var rr in rGuideSheetGroupModels) {
                    var rGuideSheetGroupModelD = rGuideSheetGroupModels[rr]; // class com.accela.aa.inspection.guidesheet.RGuideSheetGroupModel
                    rGuideTypes.push(rGuideSheetGroupModelD.guideType);
                    if (rGuideSheetGroupModelD.getAuditStatus() != "A") continue;
                    // logDebug("rGuideSheetGroupModels[" + rr + "] (1): " // + rGuideSheetGroupModel
                    //     + (rGuideSheetGroupModelD.guideGroup ? ", guideGroup: " + rGuideSheetGroupModelD.guideGroup : "")
                    //     + (rGuideSheetGroupModelD.guideType ? ", guideType: " + rGuideSheetGroupModelD.guideType : "")
                    //     + (rGuideSheetGroupModelD.autoCreate ? ", autoCreate: " + rGuideSheetGroupModelD.autoCreate : "")
                    //     + (rGuideSheetGroupModelD.adhoc ? ", adhoc : " + rGuideSheetGroupModelD.adhoc : "")
                    //     + (rGuideSheetGroupModelD.class ? ", class : " + rGuideSheetGroupModelD.class : "")
                    //     // + br + describe_TPS(rGuideSheetGroupModelD, null, null, true)
                    // );
                }
                if (rGuideTypes.length == 0) rGuideTypes = null;
                rGuideSheetGroupModel.setGuideTypes(rGuideTypes);

            }
        }
        logDebug("rGuideSheetGroupModel: " // class com.accela.aa.inspection.guidesheet.RGuideSheetGroupModel
            + (rGuideSheetGroupModel.guideGroup ? ", guideGroup: " + rGuideSheetGroupModel.guideGroup : "")
            + (rGuideSheetGroupModel.autoCreate ? ", autoCreate: " + rGuideSheetGroupModel.autoCreate : "")
            + (rGuideSheetGroupModel.adhoc ? ", adhoc: " + rGuideSheetGroupModel.adhoc : "")
            + (rGuideSheetGroupModel.guideTypes ? ", guideTypes: " + rGuideSheetGroupModel.guideTypes : "") // java.util.List
            // + (rGuideSheetGroupModel.guideSheets  ? ", guideSheets: " + rGuideSheetGroupModel.guideSheets : "") // java.util.List
            + (rGuideSheetGroupModel.class ? ", class: " + rGuideSheetGroupModel.class : "")
            // + br + describe_TPS(rGuideSheetGroupModel, null, null, true)
        );
    }
    return rGuideSheetGroupModel;
}
function getRGuideSheets(inspGroup, inspType) { // 
    var guideSheetGroup = (arguments.length > 2 && arguments[2] ? arguments[2] : null);

    if (typeof (servProvCode) == "undefined") servProvCode = aa.getServiceProviderCode();
    if (guideSheetGroup == null) {
        guideSheetGroup = getGuideSheetGroup(inspGroup, inspType);
    }
    var qf = aa.util.newQueryFormat();
    if (guideSheetGroup) {
        rGuideSheets = getGroupRGuideSheets(guideSheetGroup);
    }

    var rGuideSheets = null;
    var RGuideSheetGroupBusiness = aa.proxyInvoker.newInstance("com.accela.aa.inspection.guidesheet.RGuideSheetGroupBusiness").getOutput();
    if (RGuideSheetGroupBusiness && guideSheetGroup) {
        var rGuideSheets = [];
        logDebug("Looking for rGuideSheetGroup: " + guideSheetGroup);
        // RGuideSheetGroupModel = RGuideSheetGroupBusiness.getRGuideSheetGroup(String spc, String groupName);
        rGuideSheetGroupModel = RGuideSheetGroupBusiness.getRGuideSheetGroup(servProvCode, guideSheetGroup);
        logDebug("rGuideSheetGroupModel: " // class com.accela.aa.inspection.guidesheet.RGuideSheetGroupModel
            + (rGuideSheetGroupModel.guideGroup ? ", guideGroup: " + rGuideSheetGroupModel.guideGroup : "")
            + (rGuideSheetGroupModel.autoCreate ? ", autoCreate: " + rGuideSheetGroupModel.autoCreate : "")
            + (rGuideSheetGroupModel.adhoc ? ", adhoc : " + rGuideSheetGroupModel.adhoc : "")
            + (rGuideSheetGroupModel.guideTypes ? ", guideTypes: " + rGuideSheetGroupModel.guideTypes : "") // java.util.List
            + (rGuideSheetGroupModel.class ? ", class : " + rGuideSheetGroupModel.class : "")
            // + br + describe_TPS(rGuideSheetGroupModel, null, null, true)
        );
    }

    return rGuideSheets;
}
function removeGuideSheet(inspectionId, guideSheetTypes) {
    var guideSheetTypes = String(guideSheetTypes).split(",");
    if (typeof (servProvCode) == "undefined") servProvCode = aa.getServiceProviderCode();
    try {
        var gGuideSheetBusiness = aa.proxyInvoker.newInstance("com.accela.aa.inspection.guidesheet.GGuideSheetBusiness").getOutput();
        if (!gGuideSheetBusiness) {
            throw "Could not invoke GGuideSheetBusiness";
        }
        var itemsResult = aa.inspection.getInspections(capId);
        if (itemsResult.getSuccess()) {
            var inspectionScriptModels = itemsResult.getOutput();
            for (var k in inspectionScriptModels) {
                if (inspectionScriptModels[k].getIdNumber() == inspectionId) {
                    logDebug(": Found inspection: " + inspectionId);
                    var inspectionModel = inspectionScriptModels[k].getInspection();
                    var gGuideSheetModels = inspectionModel.getGuideSheets();
                    if (gGuideSheetModels) {
                        for (var i = 0; i < gGuideSheetModels.size(); i++) {
                            var gGuideSheetModel = gGuideSheetModels.get(i);
                            if (exists(gGuideSheetModel.getGuideType(), guideSheetTypes)) {
                                logDebug(": Found checklist: " + gGuideSheetModel.getGuideType());
                                //exploreObject(gGuideSheetModel);
                                removeGuidesheetId = parseInt(gGuideSheetModel.getGuidesheetSeqNbr());
                                logDebug(": Found checklist to remove: " + removeGuidesheetId);
                                var result = gGuideSheetBusiness.removeGGuideSheet(servProvCode, removeGuidesheetId, "ADMIN");
                                logDebug(capIDString + "." + inspectionId + ": Removed checklist from inspection: " + guideSheetType);
                                break;
                            }
                        }
                    }
                }
            }
        }
    } catch (err) {
        logDebug("A JavaScript Error occurred: removeChecklist:  " + err.message);
        logDebug(err.stack);
    }
}
function scheduleReinspection_CERS(itemCapId, inspModelFrom) {
    var inspTypeNew = (arguments.length > 2 && arguments[2] ? arguments[2] : "Other"); // Default to "Other"
    var complyBy = (arguments.length > 3 && arguments[3] ? arguments[3] : ["add", "remove", "copyGuideSheets"]); // Default to "Other"
    var guideSheetActions = (arguments.length > 4 && arguments[4] ? arguments[4] : ["add", "remove", "copyGuideSheets"]); // Default to "Other"
    var inspGroupNew = null;
    var inspIdNew = null;

    var inspIdFrom = inspModelFrom.idNumber;
    var inspGroupFrom = inspModelFrom.getInspection().getInspectionGroup();
    var inspTypeFrom = inspModelFrom.getInspectionType();
    var inspectorObj = inspModelFrom.getInspector();
    var inspectorId = null;
    if (inspectorObj) {
        var inspectorId = inspectorObj.getUserID();
    }

    if (inspIdFrom && inspType) {
        logDebug("Scheduling inspection group: " + inspGroupFrom + ", type: " + inspType + " on " + jsDateToASIDate(complyBy) + (inspectorId ? ", inspectorId: " + inspectorId : ""));
        scheduleInspectDate(inspTypeNew, jsDateToASIDate(complyBy), inspectorId, null, "Required Reinspection for inspection: " + inspIdFrom);
        var inspModelNew = null;
        var inspModels = getInspections(inspTypeNew, ["Scheduled"], true);
        if (inspModels) {
            for (var ii in inspModels) {
                inspModelNew = inspModels[ii];
                break;
            }
        }
        if (inspModelNew) {
            var inspIdNew = inspModelNew.idNumber;
            var inspGroupNew = inspModelNew.getInspection().getInspectionGroup();
            var inspStatusNew = inspModelNew.getInspection().getInspectionStatus();
            if (inspIdNew) {
                logDebug("Found Inspection ID: " + inspIdNew
                    + (inspGroupNew ? ", Group: " + inspGroupNew : "")
                    + (inspTypeNew ? ", Type: " + inspTypeNew : "")
                    + (inspStatusNew ? ", Status: " + inspStatusNew : "")
                );
            }
        }
    }
    if (inspIdNew) {
        if (!inspType) inspType = inspObj.getInspectionType();
        logDebug("Updating Checklists for inspection ID: " + inspIdNew
            + (inspGroupNew ? ", Group: " + inspGroupNew : "")
            + (inspTypeNew ? ", Type: " + inspTypeNew : "")
            + (inspStatusNew ? ", Status: " + inspStatusNew : "")
            + ", guideSheetActions: [" + guideSheetActions + "]");
        updateGuideSheets_CERS(itemCapId, inspModelFrom, inspModelNew, guideSheetActions);
    }

    return inspIdNew;
}
function updateGuideSheetModel(itemCapId, inspId) {
    var guideSheetType = (arguments.length > 2 && arguments[2] ? arguments[2] : null);
    var guideSheetSeqNbr = (arguments.length > 3 && arguments[3] ? arguments[3] : null);
    var identifier = (arguments.length > 4 && arguments[4] ? arguments[4] : null);
    var floor = (arguments.length > 5 && arguments[5] ? arguments[5] : null);
    var floorUnit = (arguments.length > 6 && arguments[6] ? arguments[6] : null);

    var guideSheets = getGuideSheets(itemCapId, inspId, guideSheetType, guideSheetSeqNbr);
    for (var gg in guideSheets) {
        var guideSheetModel = guideSheets[gg];
        if (!guideSheetType) guideSheetType = guideSheetModel.guideType;
        if (identifier) guideSheetModel.setIdentifier(identifier);
        if (floor) guideSheetModel.setFloor(floor);
        if (floorUnit) guideSheetModel.setFloorUnit(floorUnit);
        var updateResult = aa.guidesheet.updateGGuidesheet(guideSheetModel, guideSheetModel.getAuditID());
        if (updateResult.getSuccess()) {
            logDebug("Successfully updated guidesheet: " + guideSheetType + " on inspection: " + inspId + " to"
                + (identifier ? " ID: " + identifier : "")
                + (floor ? " floor: " + floor : "")
                + (floorUnit ? " ID: " + floorUnit : "")
            );
            return true;
        } else {
            logDebug("Could not update guidesheet: " + guideSheetType + " on inspection: " + inspId + ": " + updateResult.getErrorMessage());
            return false;
        }
    }
}
function updateGuideSheets_CERS(itemCapId, inspModelFrom) {
    var inspModel = (arguments.length > 2 && arguments[2] ? arguments[2] : []);
    var guideSheetActions = (arguments.length > 3 && arguments[3] ? arguments[3] : []);
    var statusArray = arguments.length > 4 && arguments[4] ? arguments[4] : null;
    var statusTypesArray = arguments.length > 5 && arguments[5] ? arguments[5] : null;
    var inspId = inspModel.idNumber
    if (inspModelFrom) {
        var inspIdFrom = inspModelFrom.idNumber
        if (exists("copyGuideSheets", guideSheetActions)) {
            copyGuideSheetItemsByStatus_CERS(itemCapId, inspIdFrom, inspId, statusArray, statusTypesArray); // Removes existing guidesheets before copy.
        } else if (exists("copyFailedGuideSheetItems", guideSheetActions)) {
            if (statusArray == null && statusTypesArray == null) statusArray = ["OUT"];
            copyGuideSheetItemsByStatus_CERS(itemCapId, inspIdFrom, inspId, statusArray, statusTypesArray); // Removes existing guidesheets before copy.
        }
    } else if (inspId) {
        var guideSheets = getGuideSheets(itemCapId, inspId);
        var guideSheetLists = [];
        guideSheetLists["found"] = [];
        guideSheetLists["add"] = [];
        guideSheetLists["remove"] = [];
        var guideSheetGroup = null;
        // Program Element: <905>
        var rGuideSheetTypes = getGuideSheetTypes_CERS(inspModel, capId); // Also sets rGuideSheets;

        // Check for existing guide sheets.
        for (var gg in guideSheets) {
            var guideSheetModel = guideSheets[gg];
            logDebug("guideSheets[" + gg + "]: seqNbr: " + guideSheetModel.guidesheetSeqNbr
                + (guideSheetModel.displayOrder ? ", displayOrder: " + guideSheetModel.displayOrder : "")
                + (guideSheetModel.identifier ? ", identifier: " + guideSheetModel.identifier : "")
                + (guideSheetModel.group ? ", Group: " + guideSheetModel.group : "")
                + (guideSheetModel.type ? ", Type: " + guideSheetModel.type : "")
                + (guideSheetModel.floor ? ", floor: " + guideSheetModel.floor : "")
                + (guideSheetModel.floorUnit ? ", floorUnit: " + guideSheetModel.floorUnit : "")
                + (guideSheetModel.guideStatus ? ", guideStatus: " + guideSheetModel.guideStatus : "")
            );
            guideSheetLists["found"].push(guideSheetModel.type);
            if (!exists(guideSheetModel.type, rGuideSheetTypes)) {
                guideSheetLists["remove"].push(guideSheetModel.type);
            }
        }
        for (var ii in rGuideSheetTypes) {
            rGuideSheetType = rGuideSheetTypes[ii];
            if (exists(rGuideSheetType, guideSheetLists["found"])) {
                logDebug("Found at least one required checklist: " + rGuideSheetType)
                guideSheetLists["add"] = []; // empty list if at least one is found.
                break;
            } else if (!exists(rGuideSheetType, guideSheetLists["add"])) {
                guideSheetLists["add"].push(rGuideSheetType);
            }
        }
        logDebug("guideSheetActions: " + guideSheetActions);
        for (var listType in guideSheetLists) {
            if (guideSheetLists[listType].length) {
                logDebug("guideSheetList[" + listType + "]: " + guideSheetLists[listType]);
            }
        }

        // Remove extra guidesheets
        if (exists("remove", guideSheetActions) && guideSheetLists["remove"].length) { // remove extra guideSheets
            removeGuideSheet(capId, inspId, guideSheetLists["remove"]);
        }
        // Add Missing Guide Sheets
        if (rGuideSheetTypes && exists("add", guideSheetActions)) {
            for (var rr in rGuideSheetTypes) {
                var rGuideSheetType = rGuideSheetTypes[rr];
                if (!exists(rGuideSheetType, guideSheetsFound)) {
                    var gsSeqNbr = addGuideSheet_CERS(capId, inspId, rGuideSheetType);
                    var inspModel = inspObj.getInspection();
                    if (inspId == inspObj.idNumber && (inspModel.getActivity().floor || inspModel.getActivity().floorUnit)) {
                        updateGuideSheetModel(itemCapId, inspId, rGuideSheetType, gsSeqNbr, null, guideSheetModel.floor, guideSheetModel.floorUnit);
                    }
                }
            }
        }
    }
}

function sendNotificationStaff(emailFrom, emailTo, emailCC, emailTemplateName, emailParameters) {
    // Use if you don't want email to show up in communication.
    var emailTos = [],
        emailCCs = [];
    var emailTemplateModel = null;
    if (emailTemplateName) {
        if (!isBlank(emailTo)) emailTos = emailTo.split(",");
        if (!isBlank(emailCC)) emailCCs = emailCC.split(",");
        // Default to Template Mail From, To & CC if found.
        var tmplResult = aa.communication.getNotificationTemplate(emailTemplateName);
        if (!tmplResult.getSuccess()) {
            logDebug("ERROR: Retrieving Email Template " + emailTemplateName + ". Reason: " + templResult.getErrorMessage());
            emailTemplate = null;
            return false;
        } else if (!tmplResult.getOutput()) {
            logDebug("ERROR: Retrieving Email Template " + emailTemplateName + ". Reason: Template not found " + tmplResult.getOutput());
            emailTemplate = null;
            return false;
        } else {
            emailTemplateModel = tmplResult.getOutput().getEmailTemplateModel();
        }
    }
    if (emailTemplateModel) {
        emailTemplateName = emailTemplateModel.getTemplateName();
        if (!isBlank(emailTemplateModel.getFrom())) emailFrom = emailTemplateModel.getFrom();
        if (!isBlank(emailTemplateModel.getTo())) { emailTos.push(emailTemplateModel.getTo()) };
        if (!isBlank(emailTemplateModel.getFrom())) { emailCCs.push(emailTemplateModel.getCc()) };
        emailTitle = emailTemplateModel.getTitle();
        emailContent = emailTemplateModel.getContentText();

        var keys = emailParameters.keys();
        while (keys.hasMoreElements()) {
            var key = keys.nextElement();
            var keyValue = emailParameters.get(key);
            if (emailTitle.indexOf(key) >= 0) {
                emailTitle = emailTitle.split(key).join(keyValue); // Replace key with keyValue
                logDebug("emailTitle substituted:  [" + key + "] = " + keyValue + " (Title)");
            }
            if (emailContent.indexOf(key) >= 0) {
                emailContent = emailContent.split(key).join(keyValue); // Replace key with keyValue
                logDebug("emailContent substituted:  [" + key + "] = " + keyValue + " (Content)");
            }
        }
        logDebug("Sending template: " + emailTemplateName + ", from: " + emailFrom + ", to: " + emailTos.join(",") + (emailCCs.join(",") != "" ? + ", to: " + emailCCs.join(",") : "")
            + ", Title: " + emailTitle + ", content: " + emailContent);

        var result = aa.sendMail(emailFrom, emailTos.join(","), emailCCs.join(","), emailTitle, emailContent);
        if (result.getSuccess()) {
            logDebug("Successfully sent email: " + emailTemplateName
                + (!isBlank(emailTos.join(",")) ? ", to: " + emailTos.join(",") : "")
                + (!isBlank(emailCCs.join(",")) ? ", cc: " + emailCCs.join(",") : ""));
            return true;
        } else {
            logDebug("Failed to sent email: " + emailTemplateName
                + (!isBlank(emailTos.join(",")) ? ", to: " + emailTos.join(",") : "")
                + (!isBlank(emailCCs.join(",")) ? ", cc: " + emailCCs.join(",") : "")
                + ", reason: " + result.getErrorType + ": " + result.getErrorMessage()
            );
            return false;
        }

    }
}
function sendNotificationTemplate_CERS(contactTypes, templateName) {
    // 11/1/18 RS: Modified to automatically add TURNED_OFF to end of email addresses in Non Production environments. Required envName global variable from INCLUDES_CUSTOM_GLOBALS.
    // 11/16/2018 RS: Added Owner type to contactTypes.
    templateParams = null, reportName = null, reportParams = aa.util.newHashMap(), reportModule = null;
    if (arguments.length > 2) templateParams = arguments[2];
    if (arguments.length > 3) reportName = arguments[3];
    if (arguments.length > 4) reportParams = arguments[4];
    if (arguments.length > 5) reportModule = arguments[5];
    try {
        var emailToArray = [], emailCCArray = [];
        var capContacts = [];
        // Set templateParams if not set.
        if (templateParams == null) {
            templateParams = aa.util.newHashtable();
            // getParams4Notification(templateParams, []); // Add Standard Notification Parameters
            var eParams = aa.util.newHashtable();
            if (typeof (envName) == "undefined") envName = "";
            addParameter(templateParams, "$$envName$$", envName);
            getRecordParams4Notification(templateParams);
            getPrimaryAddressLineParam4Notification(templateParams);
            getInspectionResultParams4Notification(templateParams);
            // addParameter(templateParams, "$$CERSID$$", AInfo["CERS ID"]);
            addParameter(templateParams, "$$complyBy$$", complyBy);
            addParameter(templateParams, "$$checkListIssuesTable$$", tableHTML);
            var rFiles = [];
            var emailTo = [], emailCC = [];
        }

        // Add License Professional to email
        if (contactTypes && contactTypes.indexOf("Licensed Professional")) {
            var lpName = "", lpPhone = "", lpEmail = "";
            lpa = getLicenseProfessional(capId);
            for (x in lpa) {
                if (lpa[x].getLicenseType().substring(0, 10) == "Contractor") {
                    lpName = lpa[x].getBusinessName();
                    if (lpName == null) lpName = (lpa[x].getContactFirstName() ? lpa[x].getContactFirstName() + " " : "") + (lpa[x].getContactLastName() ? lpa[x].getContactLastName() : "");
                    lpPhone = lpa[x].getPhone1();
                    lpEmail = lpa[x].getEmail();
                    if (lpa[x].getPrintFlag() == "Y") break; // Use Primary if found.
                }
            }
            if (lpEmail != "") emailToArray.push(lpEmail);
        }

        // Get array of Contact Email Addresses based on contact type(s)
        var capContacts = [];
        var capContacts = getContactObjs(capId, contactTypes);
        // if (contactTypes) var capContacts = getContactByTypes_TPS(contactTypes, capId);
        if (!capContacts) { logDebug(contactTypes + " was not found."); return false; }
        for (c in capContacts) {
            var capContact = capContacts[c];
            var contactType = capContact.type;
            var contactEmail = capContact.people.getEmail();
            var vContactType = String(contactType).replace(/\s+/g, "");
            logDebug("capContact: "
                + (vContactType ? ", vContactType: " + vContactType : "")
                + (capContact.people.contactType ? ", contactType: " + capContact.people.contactType : "")
                + (capContact.people.fullName ? ", fullName: " + capContact.people.fullName : "")
                + (capContact.people.businessName ? ", businessName: " + capContact.people.businessName : "")
                + (capContact.people.email ? ", email: " + capContact.people.email : "")
            );
            capContact.getEmailTemplateParams(templateParams, vContactType);
            if (contactEmail == null || contactEmail == "") { logDebug(contactType + " email was not found."); continue; }
            if (!exists(contactEmail, emailToArray)) emailToArray.push(contactEmail);
        }

        var emailTo = "", emailCC = "", emailFrom = sysFromEmail;
        if (templateName) {
            var emailTemplateTo = null, emailTemplateCC = null, emailTemplateFrom = null;
            // Default to Template Mail From, To & CC if found.
            tmplResult = aa.communication.getNotificationTemplate(templateName);
            if (!tmplResult.getSuccess()) {
                logDebug("ERROR: Retrieving Email Template " + templateName + ". Reason: " + templResult.getErrorMessage());
                emailTemplate = null;
            } else if (!tmplResult.getOutput()) {
                logDebug("ERROR: Retrieving Email Template " + templateName + ". Reason: Template not found " + tmplResult.getOutput());
                emailTemplate = null;
            } else {
                emailTemplateModel = tmplResult.getOutput().getEmailTemplateModel();
                emailTemplateName = emailTemplateModel.getTemplateName();
                emailTemplateFrom = emailTemplateModel.getFrom();
                emailTemplateTo = emailTemplateModel.getTo();
                emailTemplateCC = emailTemplateModel.getCc();
                emailTemplateTitle = emailTemplateModel.getTitle();
                emailTemplateContentText = emailTemplateModel.getContentText();

                if (emailTemplateTo && emailTemplateTo != "") { // Add any missing Email TO Addresses
                    var emailAddresses = emailTemplateTo;
                    logDebug("emailTo: " + emailAddresses);
                    if (emailAddresses.indexOf("$$") >= 0) { // Replace Parameters with values in text
                        var keys = templateParams.keys();
                        while (keys.hasMoreElements()) {
                            key = keys.nextElement();
                            keyValue = templateParams.get(key);
                            if (emailAddresses.indexOf(key) >= 0) {
                                emailAddresses = emailAddresses.split(key).join(keyValue); // Replace key with keyValue
                                logDebug("emailTO substituted (1):  [" + key + "] = " + keyValue + " " + emailAddresses);
                            }
                        }
                    }
                    logDebug("emailTo: " + emailAddresses);
                    emailAddresses = emailAddresses.split(";");
                    for (ee in emailAddresses) {
                        var emailAddress = emailAddresses[ee];
                        if (emailAddress && emailAddress != "") {
                            if (!exists(emailAddress.toLowerCase(), emailToArray)) // Do not add duplicate email addresses
                                emailToArray.push(emailAddress);
                            //emailToArray.push(emailAddress.toLowerCase())
                        }
                    }
                }
                if (emailTemplateCC && emailTemplateCC != "") { // Add any missing Email CC Addresses
                    var emailAddresses = emailTemplateCC;
                    logDebug("emailCC: " + emailAddresses);
                    if (emailAddresses.indexOf("$$") >= 0) { // Replace Parameters with values in text
                        var keys = templateParams.keys();
                        while (keys.hasMoreElements()) {
                            key = keys.nextElement();
                            keyValue = templateParams.get(key);
                            if (emailAddresses.indexOf(key) >= 0) {
                                emailAddresses = emailAddresses.split(key).join(keyValue); // Replace key with keyValue
                                logDebug("emailCC substituted (1):  [" + key + "] = " + keyValue + " " + emailAddresses);
                            }
                        }
                    }
                    logDebug("emailCC: " + emailAddresses);
                    emailAddresses = emailAddresses.split(";");
                    for (ee in emailAddresses) {
                        var emailAddress = emailAddresses[ee];
                        if (emailAddress && emailAddress != "") {
                            if (!exists(emailAddress.toLowerCase(), emailToArray) && !exists(emailAddress.toLowerCase(), emailCCArray)) // Do not add duplicate email addresses
                                emailCCArray.push(emailAddress.toLowerCase())
                        }
                    }
                }
                if (emailTemplateFrom && emailTemplateFrom != "") emailFrom = emailTemplateFrom;
            }
        }

        var reportFile = [];
        /*
        // Check for Report
        if (reportName) {
            var reportResult = aa.reportManager.getReportInfoModelByName(reportName);
            if (!reportResult.getSuccess()) {
                logDebug("Problem generating Report " + reportName + " Reason: " + (reportResult.getErrorMessage() ? reportResult.getErrorMessage() : "Unknown" + (reportResult.getOutput() ? " Output:" + reportResult.getOutput() : "")));
                reportName = null;
            } else if (!reportResult.getOutput()) {
                logDebug("Problem generating Report " + reportName + " Reason: " + "Unknown " + (reportResult.getOutput() ? " Output:" + reportResult.getOutput() : ""));
                reportName = null;
            }
            // Generate Report
            var report = generateReport(itemCap, reportName, reportModule, reportParams);
            if (report) reportFile.push(report);
        }
        */

        if (templateName && (emailToArray.join(";") != "" || emailCCArray.join(";") != "")) {
            logDebug("Sending Notification Template: " + templateName
                + ", From: " + emailFrom
                + (emailToArray.join(";") != "" ? ", To: " + emailToArray.join(";") : "")
                + (emailCCArray.join(";") != "" ? ", CC: " + emailCCArray.join(";") : "")
                + (templateParams ? ", params: " + templateParams : "")
            );
            sentEmail = sendNotification(emailFrom, emailToArray.join(";"), emailCCArray.join(";"), templateName, templateParams, reportFile);
            return sentEmail
        } else {
            logDebug("ERROR: Unable to send Notification Template: " + templateName + ", to: " + emailToArray.join(";") + ", cc: " + emailCCArray.join(";"))
            return false;
        }
    } catch (err) {
        var context = "sendNotificationTemplate" + (typeof (scriptName) == "undefined" ? "" : " of Script: " + scriptName);
        logDebug("ERROR: An error occurred in " + context + " Line " + err.lineNumber + " Error:  " + err.message);
        logDebug("Stack: " + err.stack);
    }

    return false;
}
function getTableHTML(tableDetails) {
    var tableCounts = (arguments.length > 1 && arguments[1] ? arguments[1] : null);
    var tableStyle = (arguments.length > 2 && arguments[2] ? arguments[2] : null);
    var tableCaption = (arguments.length > 3 && arguments[3] ? arguments[3] : null);
    var tableID = (arguments.length > 4 && arguments[4] ? arguments[4] : null);
    var errorsOnly = (arguments.length > 5 && arguments[5] ? arguments[5] : null);
    var tableHTML = "", tableHTMLHead = "", tableHTMLBody = "", tableHTMLFoot = "";
    for (var dd in tableDetails) {
        var tableDetail = tableDetails[dd];
        if (errorsOnly && typeof (tableDetails["_success"]) != "undefined" && !tableDetails["_success"]) continue;
        if (tableHTMLHead == "") {
            tableHTMLHead += "<tr>";
            for (var ff in tableDetail) {
                tableHTMLHead += "<th>" + ff + "</th>";
            }
            tableHTMLHead += "</tr>";
        }
        tableHTMLBody += "<tr>";
        for (var ff in tableDetail) {
            tableHTMLBody += "<td>" + tableDetail[ff] + "</td>";
        }
        tableHTMLBody += "</tr>";
    }
    if (tableCounts) {
        var tableCountsMsg = [];
        tableHTMLFoot += "<tfoot>";
        for (var cc in tableCounts) {
            tableCountsMsg.push(cc + ": " + tableCounts[cc]);
            tableHTMLFoot += "<tr><td>" + cc + "</td><td>" + tableCounts[cc] + "</td></tr>";
        }
        tableHTMLFoot += "</tfoot>";
        logDebug(tableCountsMsg.join(br));
    }
    if (tableHTMLBody != "") {
        if (typeof (tableStyle) == "undefined") tableStyle = "";
        tableHTML = tableStyle
            + '<table' + (tableID ? ' id="' + tableID + '"' : '') + '>'
            + (tableCaption ? '<caption>' + tableCaption + '</caption>' : '')
            + '<thead>' + tableHTMLHead + '</thead>'
            + '<tbody>' + tableHTMLBody + '</tbody>'
            + '' + tableHTMLFoot + ''
            + '</table>';
    }
    return tableHTML;
}
