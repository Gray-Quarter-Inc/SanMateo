/*------------------------------------------------------------------------------------------------------/
| Program		: PLN_SHORT_TERM_REQ_DOCS.js
| Event			: ACA_OnLoad
|
| Usage			: Skip certain pageflow page based on ASI selection
|
/------------------------------------------------------------------------------------------------------*/
var useAppSpecificGroupName = false;
var debug = "";
var showDebug = true;
var message = "";
var showMessage = false;
var br = "<BR>";
var disableTokens = false;		// turn off tokenizing of std choices (enables use of "{} and []")
var useTaskSpecificGroupName = false;	// Use Group name when populating Task Specific Info Values
var enableVariableBranching = true;	// Allows use of variable names in branching.  Branches are not followed in Doc Only
var maxEntries = 99;			// Maximum number of std choice entries.  Entries must be Left Zero Padded
var GLOBAL_VERSION = 3.0;
var cancel = false;
var vScriptName = aa.env.getValue("ScriptCode");
var vEventName = aa.env.getValue("EventName");

var sysDate = aa.date.getCurrentDate();
var servProvCode = aa.getServiceProviderCode();

eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",null,true));
var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(),sysDate.getDayOfMonth(),sysDate.getYear(),"");

try {
	var cap = aa.env.getValue("CapModel");
    var capModel = cap;
	var capId = cap.getCapID();
    var appSpecificInfo = new Array();
    loadAppSpecific4ACA(appSpecificInfo);


    var blockSubmitStr = "The application type requires: ";
	var blockSub = false;
    var requiredDocTypes = ["Proof of Ownership" ,"Copy of Transient Occupancy Tax Certificate", "Certificate of Liability Insurance",
        "Site Plan", "Floor Plan of Residence", "Photo Verification of House Address Signage", "Photo Verification of Installed Smoke and Carbon Monoxide Alarm", "Photo Verification of InstalledFire Extinguishers",
        "Copy of Lease Agreement" 
    ];

    if (appSpecificInfo["Property OWner"] == "Yes" || appSpecificInfo["Property OWner"] == "YES")
        requiredDocTypes.push("Owner's Concurrence");
          
    var submittedDocArray = aa.document.getDocumentListByEntity(capId, "TMP_CAP");
    if (submittedDocArray != null && submittedDocArray.getSuccess()) {
        submittedDocArray = submittedDocArray.getOutput();
        if (submittedDocArray != null) {
            submittedDocArray = submittedDocArray.toArray();
        }
    }
    if (!submittedDocArray || submittedDocArray == null || submittedDocArray.length == 0) {
        blockSubmitStr = "The application type requires: " + requiredDocTypes.join(",");
        blockSub = true;
    } 
    else {
        for (var tIndex in requiredDocTypes) {
            var thisReqType = requiredDocTypes[tIndex];    
            var thisTypeFound = 0;
            for ( var i in submittedDocArray) {
                if (submittedDocArray[i].getDocCategory() == thisReqType) {
                    thisTypeFound++;
                }
            }
            if (thisTypeFound < 1) {
                blockSub = true;
                blockSubmitStr += thisReqType + ", ";
            }                
        }
    }


	if (blockSub && blockSubmitStr != "") {
        blockSubmitStr = blockSubmitStr.replace(/,\s*$/, "");
	    aa.env.setValue("ErrorCode", "0");
	    aa.env.setValue("ErrorMessage", blockSubmitStr);
	}

} catch (ex) {
    logDebug(ex);
	aa.env.setValue("ErrorCode", "1");
	aa.env.setValue("ErrorMessage", "Error: In document validation" + ex);

}
aa.env.setValue("ScriptReturnDebug", debug);
aa.env.setValue("ScriptReturnMessage", debug);

function IsStrInArry(eVal,argArr) {
	for (x in argArr){
	  if (eVal == argArr[x]){
		return true;
	  }
	}	
  return false;
  } 

  function logDebug(s) {
    debug += s + "\r\n";
}

function getScriptText(vScriptName, servProvCode, useProductScripts) {
	if (!servProvCode)  servProvCode = aa.getServiceProviderCode();
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

function loadASITables4ACALOCAL(iCap) {
	var gm = iCap.getAppSpecificTableGroupModel();
	for (var ta = gm.getTablesMap(), tai = ta.values().iterator(); tai.hasNext(); ) {
		var tsm = tai.next();
		if (!tsm.rowIndex.isEmpty()) {
			var tempObject = new Array,
			tempArray = new Array,
			tn = tsm.getTableName();
			tn = String(tn).replace(/[^a-zA-Z0-9]+/g, ""),
			isNaN(tn.substring(0, 1)) || (tn = "TBL" + tn);
			for (var tsmfldi = tsm.getTableField().iterator(), tsmcoli = tsm.getColumns().iterator(), numrows = 1; tsmfldi.hasNext(); ) {
				if (!tsmcoli.hasNext()) {
					var tsmcoli = tsm.getColumns().iterator();
					tempArray.push(tempObject);
					var tempObject = new Array;
					numrows++
				}
				var tcol = tsmcoli.next();
				var tobj = tsmfldi.next();
				var tval = "";
				try {
					tval = tobj.getInputValue();
				} catch (ex) {
					tval = tobj;
				}
				tempObject[tcol.getColumnName()] = tval;
			}
			tempArray.push(tempObject);
			var copyStr = "" + tn + " = tempArray";
			logDebug("ASI Table Array : " + tn + " (" + numrows + " Rows)"),
			eval(copyStr)
		}
	}
}