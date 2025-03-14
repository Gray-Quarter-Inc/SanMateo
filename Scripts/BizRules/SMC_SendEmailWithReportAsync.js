/*******************************************************
| Script Title: sendEmailWithReportAsync
| Created by: Nic Bunting
| Created on: 2Nov20
| Usage: Send EmailTemplate with report ReportName attached to all emails in RecipientList
| Modified by: ()
*********************************************************/
// ********************************************************************************************************************************
//	Env Paramters Below
// ********************************************************************************************************************************
var servProvCode = aa.getServiceProviderCode();
capId = aa.env.getValue("CapID");						// Record ID
var cap = aa.cap.getCap(capId).getOutput();
appType = String(cap.getCapType());
appTypeArray = appType.split("/");

currentUserID = "ADMIN";
var user = String(aa.env.getValue("User")); 			// AA User
if (user && user != "null" && user.length > 0) {
    currentUserID = user;
}

var debug = "";
var message = "";
var showDebug = true;
var error = "";
var br = "<BR/>";
var useAppSpecificGroupName = false;
var AInfo = null;

var SCRIPT_VERSION = 3.0;

useProductScript = true;
var useCustomScriptFile = true;  // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
var useSA = false;
var SA = null;
var SAScript = null;

// Print debug using aa.print instead of aa.debug
useLogDebug = true;
var debugLevel = 2;

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

// ********************************************************************
//printEnv();
// ***********************************************************************

try {
    // Set the system user
    var result = aa.person.getUser(currentUserID);
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get sys user ADMIN. " + result.errorMessage, 1);
    } else {
        systemUserObj = result.getOutput();
    }

    eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA, useCustomScriptFile));
    // eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA, useCustomScriptFile));
    eval(getScriptText("INCLUDES_CUSTOM", SA, useCustomScriptFile));

    // Main function
    (function () {
        var altId = aa.cap.getCap(capId).getOutput().capModel.altID;
        Avo_LogDebug("Record(" + altId + ")", 2);  //debug

        var template = String(aa.env.getValue("EmailTemplate"));
        var params = aa.env.getValue("EmailParams");

        // Generate report to attach
        var reportName = String(aa.env.getValue("ReportName"));
        var reportParams = aa.env.getValue("ReportParams");

        var capTypeModel = cap.getCapType();
        var module = String(capTypeModel.getGroup());
        Avo_LogDebug("Module(" + module + ")", 2); //debug

        Avo_LogDebug("Report Params(" + reportParams + ")", 2); //debug

        var reportSuccess = Avo_GenerateReportAndAttachToRecord(capId, reportName, module, reportParams);
        if (reportSuccess) {
            Avo_LogDebug('Added report "' + reportName + '" to record ' + altId, 1);
        } else {
            Avo_LogDebug('Failed to add report "' + reportName + '" to record ' + altId, 1);
        }

        //var report = generateReport(capId, reportName, module, reportParams);
        //Avo_LogDebug('Generated report "' + reportName + '"', 1);

        //var reportArr = new Array();
        //reportArr.push(report);

        var allRecipients = String(aa.env.getValue("RecipientList")).split(',');
        for (var i in allRecipients) {
            var emailToSendTo = allRecipients[i];

            var success = sendNotification(null, emailToSendTo, "", template, params, new Array(), capId);
            //var success = sendNotification(null, emailToSendTo, "", template, params, reportArr, capId);
            if (success == true) {
                Avo_LogDebug('Notification "' + template + '" sent to ' + emailToSendTo, 1);
            } else {
                Avo_LogDebug('Failed to send notification "' + template + '" to ' + emailToSendTo, 1);
            }
        }
    })();

} catch (err) {
    debug += "Error in process " + err.message;
    error += br + err.message;
}

aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC Prod: SMC_SendEmailWithReportAsync", debug); //debug