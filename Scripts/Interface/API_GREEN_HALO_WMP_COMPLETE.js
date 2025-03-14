/*******************************************************
| Script/Function: Green_Halo_WMP_Approved
| Created by: Tom Grzegorczyk
| Created on: Aug 10 2022
| Usage: Run on Green Halo Plan or Project status change. Called by Green Halo via Construct API call 
| Modified by: ()
*********************************************************/
var SCRIPT_VERSION = 3.0;
var useCustomScriptFile = true;  // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
var useSA = false;
var useLogDebug = true;
var SA = null;
var SAScript = null;
var showDebug = false;
var debug = "";
var br = "<br/>";
var debugLevel = 2;
var uselog = true;
var message = "";

eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", "SMCGOV", useCustomScriptFile));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS", "SMCGOV", useCustomScriptFile));
eval(getScriptText("INCLUDES_CUSTOM", "SMCGOV", useCustomScriptFile));

br = "\r\n";
debugLevel = 2;
useLogDebug = true;
showDebug = true;//Set to true to send debug emails
uselog = true;
useAppSpecificGroupName = false;

capId = null;
sysDate = aa.date.getCurrentDate();
var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear(), "");

currentUserID = "AVOCETTE";
// Print debug using aa.print instead of aa.Debug
debugLevel = 2;

//Message to be returned to Green Halo
var message = "";

// Test Objects - use for debugging in AA Classic 'Script Tester'
//aa.env.setValue("wmp_number", "GH221-849-1639");
//aa.env.setValue("status", "approved");
//aa.env.setValue("note", "Testing 'Green_Halo_WMP_Approved' script execution");
//aa.env.setValue("completed_by", 'Admin');
//useLogDebug = false;    //testing


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

function outgoingMessage(msg) {
    message += msg + br;
    Avo_LogDebug(msg);
}

function matches(eVal, argList) {
    for (var i = 1; i < arguments.length; i++) {
        if (arguments[i] == eVal) {
            return true;
        }
    }
    return false;
}

var systemUserObj = aa.person.getUser(currentUserID).getOutput();
(function Green_Halo_WMP_Approved() {
    var success;
    var error = false;
    try {
        var wmpId = aa.env.getValue("wmp_number");
        var status = aa.env.getValue("status");
        var note = aa.env.getValue("note");
        var completedBy = aa.env.getValue("completed_by");
        if (completedBy == 'See ClickFix') {
            completedBy = "Green Halo";
        }
        outgoingMessage('Received "wmp_number": "' + wmpId + '"');
        outgoingMessage('Received "status": "' + status + '"');
        outgoingMessage('Received "note": "' + note + '"');
        outgoingMessage('Received "completed_by": "' + completedBy + '"');

        success = wmpCompleteProcess(wmpId, status, note, completedBy);
        //helperObjectInfo(aa.env);
    } catch (ex) {
        success = false;
        error = true;
        outgoingMessage('ERROR: ' + (ex.message === undefined ? ex : ex.message));
    }

    if (showDebug == true) {
        if (message.length > 0) {
            aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SUPP: Debug from API_GREEN_HALO_WMP_COMPLETE", message);
        }
    }

    if (error == true) {
        aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SUPP: Error in API_GREEN_HALO_WMP_COMPLETE", message);
    }
    aa.print(debug);
    aa.env.setValue("success", success);
    aa.env.setValue("message", message);
})();


function wmpCompleteProcess(wmpId, status, note, completedBy) {

    //Input validations
    if (matches(wmpId, undefined, null, "")) {
        outgoingMessage("wmp_number is required.");
        return false;
    }

    var inspType = lookup("GREEN_HALO_CONFIG", "INSPECTION_TYPE");
    var inspResult = lookup("GREEN_HALO_CONFIG", "INSPECTION_RESULT");
    var inspResultComment = lookup("GREEN_HALO_CONFIG", "INSPECTION_RESULT_COMMENT");

    if (matches(inspType, "null", null, "Not found") || matches(inspResult, "null", null, "Not found") || matches(inspResultComment, "null", null, "Not found")) {
        outgoingMessage("Invalid configuration in GREEN_HALO_CONFIG standard choice");
        return false;
    }

    var capCount = 0;
    var appList = [];
    var failedInspArray = [];

    var capListResult = aa.cap.getCapIDsByAppSpecificInfoField("GreenHaloID", wmpId);

    if (capListResult.getSuccess()) {
        appList = capListResult.getOutput();
    } else {
        outgoingMessage("Error retreiving permits: " + capListResult.getErrorMessage());
        return false;
    }

    if (appList.length == 0) {
        outgoingMessage("No building permits found for wmp_number " + wmpId);
        return false;
    }

    for (al in appList) {

        capObj = appList[al];
        capId = aa.cap.getCapID(capObj.ID1, capObj.ID2, capObj.ID3).getOutput();
        altId = capId.getCustomID();
        outgoingMessage("capId: " + capId);
        outgoingMessage("Record ID: " + altId);
        if (status == "completed") {
            var comment = completedBy + ": " + note;
            outgoingMessage("Resulting inspection with comment: " + comment);  //debug
            //process permits
            resultInspection(inspType, inspResult, sysDateMMDDYYYY, comment, capId);
        }
        if (status == "approved") {
            outgoingMessage("Updating waste management task... ");  //debug
            //Update Waste Management task
            var taskName = "Waste Management Review";
            var taskStatus = "Passed";
            var taskComment = "Closed by Green Halo";
            var success = closeTask(taskName, taskStatus, taskComment, taskComment);
            if (success === false) {
                outgoingMessage('Failed to close task "' + taskName + '" with status of "' + taskStatus + '"');
            }
            outgoingMessage("Updating Green Halo ASI... ");  //debug
            editAppSpecific("Green Halo", "Completed", capId);
            
            var feeCode = "BLD_049";
            var feeSched = "BLD_GEN";
            var found = feeExists(feeCode);
            if (found != true) {
                var feeResult = updateFee(feeCode, feeSched, "FINAL", 1, "Y");
                if (feeResult) {
                    Avo_LogDebug("Fee " + feeCode + " has been added with quantity of 1", 1);
                }
                else if (feeResult == null) {
                    Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of 1", 1);
                } else {
                    Avo_LogDebug("Failed to add fee " + feeCode, 1);
                }
            } else {
                Avo_LogDebug("Fee '" + feeCode + "' already exists.", 1);
            }
            
            outgoingMessage("Scheduling inspection... ");  //debug
            scheduleInspection(inspType, 0, null, null, "Scheduled by Integration");
        }
    }

    if (failedInspArray.length > 0) {
        outgoingMessage("There was an error processing the following permits: " + failedInspArray.join());
        return false;
    }

    outgoingMessage("Permits updated successfully from wmp_number " + wmpId);
    return true;

}

function helperObjectInfo(theObj) {
    logDebug("Object info is - " + theObj.getClass());

    logDebug("The methods are - " + theObj.getClass());
    for (x in theObj) {
        if (typeof (theObj[x]) == "function") {
            logDebug("  " + x);
        }
    }
    logDebug("The properties are - " + theObj.getClass());
    for (x in theObj) {
        if (typeof (theObj[x]) != "function") {
            logDebug("  " + x + " = " + theObj[x]);
        }
    }
}