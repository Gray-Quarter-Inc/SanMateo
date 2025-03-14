/*******************************************************
| Script Title: Batch_AddFireOccAnnualFees (Batch Script)
| Created by: Nicolaj Bunting
| Created on: 14Aug18
| Usage: For all records of type "MenloParkFire/Occupancy/NA/NA" If app status is not "Closed" Then If ASI "Hazardous Materials" is yes Then add and invoice fee "MP_HAZ_PERM" from schedule 
| "MP_ANNUAL_HAZMAT" And If total rows in ASIT "HAZMAT TYPES" > 4 Then add and invoice fee "MP_HAZ_ADD" from schedule "MP_ANNUAL_HAZMAT" with quantity of total rows - 4 
| And If ASI "Generator" is yes Then add and invoice fee "MP_HAZ_GEN" from schedule "MP_ANNUAL_HAZMAT", 
| For each row in ASIT "ANNUAL BILLING INFO" add and invoice the fee matching the field "Type" from schedule "MP_ANNUAL_HAZMAT" with quantity of total matching rows
| "Apartment, Hotel, Motel (includes 30 rooms)"                             MP_ANN_AHM
| "Apartment, Hotel, Motel (each additional 50 rooms)"                      MP_ANN_AHM50
| "Covered Mall Buildings"                                                  MP_ANN_CM
| "High Piled Storage"                                                      MP_ANN_HPS
| "High Rise Occupancy"                                                     MP_ANN_HR
| "Residential Care Occupancies 26 Plus People"                             MP_ANN_RC26
| "Residential Care Occupancies 7 - 25 People"                              MP_ANN_RC
| "Day Care Annual"                                                         MP_ANN_DC
| "Institutional/Residential/Day Care Occupancy Pre-Licensing Inspection"   MP_ANN_PRE
| "Institutional Care Occupancies 26 Plus People"                           MP_ANN_IC26
| "Institutional Care Occupancies 7 - 25 People"                            MP_ANN_IC25
| "Institutional Care Occupancies 0 - 6 People"                             MP_ANN_IC6
| "Lumber Yards and Wood Products"                                          MP_ANN_LY
| "Miscellaneous Combustible Storage and Tire Storage"                      MP_ANN_MCS
| "Places of Assembly"                                                      MP_ANN_ASM
| "Rooftop Heliports"                                                       MP_ANN_RH
| "Mobile Fuel Vendor"                                                      MP_ANN_MFV
| "Mobile Fuel Site"                                                        MP_ANN_MFS
| Modified by: ()
*********************************************************/
/* ***************************************************************************************************************************
 IMPORTANT NOTE: IF USING COMMIT() - To test the script, it must be executed by setting the Script Transaction drop down to "Use User Transaction"
****************************************************************************************************************************/

/*------------------------------------------------------------------------------------------------------/
| START: USER CONFIGURABLE PARAMETERS
/------------------------------------------------------------------------------------------------------*/
var SCRIPT_VERSION = 3.0;

var showDebug = true;
//var showMessage = false;
//var message = "";
var debug;
var emailText;
//var maxSeconds = 4.5 * 60;
var br = "<br/>";
var startDate = new Date();
var startTime = startDate.getTime(); // Start timer
//Validate workflow parameters
var paramsOK = true;
var timeExpired = false;
var useAppSpecificGroupName = false;
// Set time out to 60 minutes
var timeOutInSeconds = 60 * 60;
/*------------------------------------------------------------------------------------------------------/
| END: USER CONFIGURABLE PARAMETERS
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: TEST DATA
/------------------------------------------------------------------------------------------------------*/
//aa.env.setValue("param1","Yes");
//aa.env.setValue("param1","No");
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
batchJobResult = aa.batchJob.getJobID()
batchJobName = String(aa.env.getValue("BatchJobName"));
currentUserID = "ADMIN";
useProductScript = true;
var useCustomScriptFile = true;  // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
var useSA = false;
var SA = null;
var SAScript = null;

if (SA) {
    eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA, useCustomScriptFile));
    eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA, useCustomScriptFile));
    //eval(getScriptText("INCLUDES_CUSTOM", SA, useCustomScriptFile));
} else {
    eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useCustomScriptFile));
    eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, useCustomScriptFile));
    //eval(getScriptText("INCLUDES_CUSTOM", null, useCustomScriptFile));
}
//eval(getScriptText("INCLUDES_BATCH"));

// Print debug using aa.print instead of aa.debug
// 0: no debug
// 1: minimal debugging
// 2: full debugging
debugLevel = 2;
useLogDebug = false;

// Set the system user
var result = aa.person.getUser("ADMIN");
if (result.getSuccess() != true) {
    Avo_LogDebug("Failed to get sys user ADMIN. " + result.errorMessage, 1);
}

systemUserObj = result.getOutput();

function getScriptText(vScriptName) {
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
    return emseScript.getScriptText() + "";
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

    if (!timeExpired) {
        try {
            method();
        }
        catch (e) {
            Avo_LogDebug("Error in process " + e.message, 1);
        }
    }
    else {
        Avo_LogDebug("End of Job: Elapsed Time : " + elapsed() + " Seconds", 1);
    }
}

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

function method() {
    Avo_LogDebug("Batch_AddFireOccAnnualFees()", 1);

    // Get all Fire Occupancy records
    var allRecords = aa.cap.getByAppType("MenloParkFire", "Occupancy", "NA", "NA").getOutput();
    if (allRecords.length == 0) {
        Avo_LogDebug("No Fire Occupancy records found", 1);
        return;
    }

    var feeSched = "MP_ANNUAL_HAZMAT";
    var feePeriod = "FINAL";

    var hazmatTypes = "HAZMAT TYPES";

    var billingInfo = "ANNUAL BILLING INFO";
    var typeField = "Type";

    var billingInfoFees = new Object();
    billingInfoFees["Apartment, Hotel, Motel (includes 30 rooms)"] = "MP_ANN_AHM";
    billingInfoFees["Apartment, Hotel, Motel (each additional 50 rooms)"] = "MP_ANN_AHM50";
    billingInfoFees["Covered Mall Buildings"] = "MP_ANN_CM";
    billingInfoFees["High Piled Storage"] = "MP_ANN_HPS";
    billingInfoFees["High Rise Occupancy"] = "MP_ANN_HR";
    billingInfoFees["Residential Care Occupancies 26 Plus People"] = "MP_ANN_RC26";
    billingInfoFees["Residential Care Occupancies 7 - 25 People"] = "MP_ANN_RC";
    billingInfoFees["Day Care Annual"] = "MP_ANN_DC";
    billingInfoFees["Institutional/Residential/Day Care Occupancy Pre-Licensing Inspection"] = "MP_ANN_PRE";
    billingInfoFees["Institutional Care Occupancies 26 Plus People"] = "MP_ANN_IC26";
    billingInfoFees["Institutional Care Occupancies 7 - 25 People"] = "MP_ANN_IC25";
    billingInfoFees["Institutional Care Occupancies 0 - 6 People"] = "MP_ANN_IC6";
    billingInfoFees["Lumber Yards and Wood Products"] = "MP_ANN_LY";
    billingInfoFees["Miscellaneous Combustible Storage and Tire Storage"] = "MP_ANN_MCS";
    billingInfoFees["Places of Assembly"] = "MP_ANN_ASM";
    billingInfoFees["Rooftop Heliports"] = "MP_ANN_RH";
    billingInfoFees["Mobile Fuel Vendor"] = "MP_ANN_MFV";
    billingInfoFees["Mobile Fuel Site"] = "MP_ANN_MFS";

    for (i in allRecords) {
        capId = allRecords[i].capID;
        var altId = aa.cap.getCap(capId).getOutput().getCapModel().altID;
        Avo_LogDebug("MFO(" + altId + ")", 2);  //debug

        var capToCheck = aa.cap.getCap(capId).getOutput();
        var status = String(capToCheck.getCapStatus());
        Avo_LogDebug("Status(" + status + ")", 2);  //debug

        if (status == "Closed") {
            continue;
        }

        var hazMat = getAppSpecific("Hazardous Materials", capId);
        Avo_LogDebug("HazMat(" + hazMat + ")", 2);  //debug

        // Add HazMat fees
        if (hazMat == "Yes") {
            // Add permit fee
            addFee("MP_HAZ_PERM", feeSched, feePeriod, 1, "Y", capId);
            Avo_LogDebug("Added fee MP_HAZ_PERM to MFO " + altId, 1);

            // Count rows in Hazmat Types
            var table = loadASITable(hazmatTypes);
            if (!table) {
                Avo_LogDebug(hazmatTypes + " ASIT is empty", 1);
            } else {
                var totalRows = table.length;
                Avo_LogDebug("Total Rows(" + totalRows + ")", 2);   //debug

                if (totalRows > 4) {
                    var qty = totalRows - 4;
                    addFee("MP_HAZ_ADD", feeSched, feePeriod, qty, "Y", capId);
                    Avo_LogDebug("Added fee MP_HAZ_ADD to MFO " + altId + " with quantity of " + String(qty), 1);
                }
            }

            var generator = getAppSpecific("Generator", capId);
            if (generator == "Yes") {
                addFee("MP_HAZ_GEN", feeSched, feePeriod, 1, "Y", capId);
                Avo_LogDebug("Added fee MP_HAZ_GEN to MFO " + altId, 1);
            }
        }

        // Add annual billing fees
        table = loadASITable(billingInfo);
        if (!table) {
            Avo_LogDebug(billingInfo + " table is empty", 1);
            continue;
        }
        if (table.length == 0) {
            Avo_LogDebug(billingInfo + " table is empty", 1);
            continue;
        }

        var allBillingFees = new Object();

        for (j in table) {
            var field = table[j][typeField];
            var type = field.fieldValue;
            Avo_LogDebug("Type(" + type + ")", 2);  //debug

            if (!(type in billingInfoFees)) {
                continue;
            }

            if (!(type in allBillingFees)) {
                allBillingFees[type] = 1;
                continue;
            }

            allBillingFees[type] += 1;
        }

        for (type in allBillingFees) {
            var qty = allBillingFees[type];
            var feeCode = billingInfoFees[type];

            addFee(feeCode, feeSched, feePeriod, qty, "Y", capId);
            Avo_LogDebug("Added fee " + feeCode + " to MFO " + altId + " with quantity of " + String(qty), 1);
        }
    }
}

/*******************************************************
| Script/Function: Avo_LogDebug(debug, [importance])
| Created by: Nicolaj Bunting
| Created on: 05Feb18
| Usage: Display debug output based on importance and current debug level
| Modified by: Nic Bunting (2May18)
*********************************************************/
function Avo_LogDebug(debug, importance) {
    //logDebug("Avo_LogDebug(" + debug + ", " + importance.toString() + ")");

    var br = "<br/>";

    if (arguments.length < 2 || !importance) {
        importance = 2; // default value
    }

    if (isNaN(importance) == true) {
        var message = "Importance must be an integer";
        if (useLogDebug == true) {
            logDebug(message);
        } else {
            aa.print(message + br);
        }
        return;
    }

    if (importance < 0) {
        var message = "Importance can't be negative";
        if (useLogDebug == true) {
            logDebug(message);
        } else {
            aa.print(message + br);
        }
    }

    if (importance > debugLevel) {
        return;
    }

    if (useLogDebug == true) {
        logDebug(debug);
    } else {
        aa.print(debug + br);
    }
}

function getAppSpecificCustom(itemName)  // optional: itemCap
{
    var updated = false;
    var i = 0;

    if (arguments.length == 2) {
        var itemCap = arguments[1]; // use cap ID specified in args
    } else {
        var itemCap = capId;
    }

    if (useAppSpecificGroupName) {
        if (itemName.indexOf(".") < 0) {
            aa.print("**WARNING: editAppSpecific requires group name prefix when useAppSpecificGroupName is true");
            return false;
            //return;
        }

        var itemGroup = itemName.substr(0, itemName.indexOf("."));
        var itemName = itemName.substr(itemName.indexOf(".") + 1);
    }
    var appSpecInfoResult = aa.appSpecificInfo.getByCapID(itemCap);
    if (appSpecInfoResult.getSuccess()) {
        var appspecObj = appSpecInfoResult.getOutput();

        if (itemName != "") {
            for (i in appspecObj)
                if (appspecObj[i].getCheckboxDesc() == itemName && (!useAppSpecificGroupName || appspecObj[i].getCheckboxType() == itemGroup)) {
                    //aa.print(appspecObj[i].getCheckboxDesc());
                    return appspecObj[i].getChecklistComment();
                    break;
                }
        } // item name blank
    }
    else { aa.print("**ERROR: getting app specific info for Cap : " + appSpecInfoResult.getErrorMessage()) }
}

/** ************************************************************************************** 
*  
*/
function startTransaction(timeOutInSec) {
    aa.batchJob.beginTransaction(timeOutInSec);
    logDebug(" *** A new transaction has been initiated");
}

/** ************************************************************************************** 
*  
*/
function commit() {
    aa.batchJob.commitTransaction();
    logDebug(" *** The transaction has been committed (script changes saved)");
    // aa.batchJob.rollbackTransaction();
    // logDebug(" *** The transaction has been rolled back (for testing)");
}

/** ************************************************************************************** 
*  
*/
function rollback() {
    aa.batchJob.rollbackTransaction();
    logDebug(" *** The transaction has been rolled back (script changes are not saved)");
}