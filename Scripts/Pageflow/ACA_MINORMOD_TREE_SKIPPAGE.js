/*------------------------------------------------------------------------------------------------------/
| Program		: ACA_MINORMOD_TREE_SKIPPAGE.js
| Event			: ACA_OnLoad
|
| Usage			: Skip certain pageflow page based on ASI selection
|
/------------------------------------------------------------------------------------------------------*/
showDebug = false;
var SCRIPT_VERSION = 9.0;

var message = "";
var debug = "";
var err = "";
var useAppSpecificGroupName = false;

try {
    eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, true));

    overRide = "function logDebug(dstr) { debug += dstr; }";
    eval(overRide);


    var cancel = false;
    var capModel = aa.env.getValue('CapModel');
    var capId = capModel.getCapID();
    cap = capModel;


    var appSpecificInfo = new Array();
    loadAppSpecific4ACA(appSpecificInfo);

    var tree = appSpecificInfo["Additional Tree Removal"];

    if (tree && (tree == "Yes" || tree == "YES")) {
        aa.env.setValue("ReturnData", "{'PageFlow':{'HidePage':'Y', 'StepNumber': '4', 'PageNumber':'1'}}");
    } 
    else {
        aa.env.setValue("ReturnData", "{'PageFlow':{'HidePage':'N'}}"); 
    }

}
catch (err) {
    cancel = true;
    message += "A system error has occured: " + err.message;
    debug = debug + " Additional Information Required: " + err.message;
}

if (cancel) {
    cancel = true;
    showMessage = true;
    aa.env.setValue("ErrorCode", -1);
    aa.env.setValue('ErrorMessage', '<br><font color=#D57C55><b>' + message + '</b></font>');
}

function getAddress4ACA() {
    var fcapAddressObj = cap.getAddressModel();
    if (!fcapAddressObj) {
        logDebug("No address");
        return false;
    }
    return fcapAddressObj;
}


function getScriptText(vScriptName, servProvCode, useProductScripts) {
    if (!servProvCode) {
        servProvCode = aa.getServiceProviderCode();
    }

    vScriptName = vScriptName.toUpperCase();

    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();

    try {
        if (useProductScripts) {
            var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
        }
        else {
            var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
        }

        return emseScript.getScriptText() + "";
    }
    catch (err) {
        return "";
    }
}

//***********************************************************************
//------------------------HELPER FUNCTIONS-------------------------------
//***********************************************************************
function getASITable4ACA(tableName) {
    var gm = null;

    if (String(cap.getClass()).indexOf("CapScriptModel") != -1) {
        gm = cap.getCapModel().getAppSpecificTableGroupModel();
    }
    else {
        gm = cap.getAppSpecificTableGroupModel();
    }

    if (gm == null) {
        return false;
    }

    var ta = gm.getTablesMap();
    var tai = ta.values().iterator();

    while (tai.hasNext()) {
        var tsm = tai.next();

        if (tsm.rowIndex.isEmpty()) {
            continue;
        }

        var asitRow = new Array;
        var asitTables = new Array;
        var tn = tsm.getTableName();

        if (tn != tableName) {
            continue;
        }

        var tsmfldi = tsm.getTableField().iterator();
        var tsmcoli = tsm.getColumns().iterator();

        while (tsmfldi.hasNext()) {

            var tcol = tsmcoli.next();
            var tval = tsmfldi.next();

            asitRow[tcol.getColumnName()] = tval;

            if (!tsmcoli.hasNext()) {
                tsmcoli = tsm.getColumns().iterator();
                asitTables.push(asitRow);
                asitRow = new Array;
            }
        }
        return asitTables;
    }
    return false;
}

function loadAppSpecific4ACA(thisArr) {
    // Returns an associative array of App Specific Info
    // Optional second parameter, cap ID to load from
    //
    // uses capModel in this event

    var itemCap = capId;

    if (arguments.length >= 2) {
        itemCap = arguments[1]; // use cap ID specified in args

        var fAppSpecInfoObj = aa.appSpecificInfo.getByCapID(itemCap).getOutput();

        for (loopk in fAppSpecInfoObj) {
            if (useAppSpecificGroupName) {
                thisArr[fAppSpecInfoObj[loopk].getCheckboxType() + "." + fAppSpecInfoObj[loopk].checkboxDesc] = fAppSpecInfoObj[loopk].checklistComment;
            } else {
                thisArr[fAppSpecInfoObj[loopk].checkboxDesc] = fAppSpecInfoObj[loopk].checklistComment;
            }
        }
    } else {
        var capASI = capModel.getAppSpecificInfoGroups();

        if (!capASI) {
            logDebug("No ASI for the CapModel");
        } else {
            var i = capModel.getAppSpecificInfoGroups().iterator();

            while (i.hasNext()) {
                var group = i.next();
                var fields = group.getFields();

                if (fields != null) {
                    var iteFields = fields.iterator();

                    while (iteFields.hasNext()) {
                        var field = iteFields.next();

                        if (useAppSpecificGroupName) {
                            thisArr[field.getCheckboxType() + "." + field.getCheckboxDesc()] = field.getChecklistComment();
                        } else {
                            thisArr[field.getCheckboxDesc()] = field.getChecklistComment();
                        }
                    }
                }
            }
        }
    }
}
