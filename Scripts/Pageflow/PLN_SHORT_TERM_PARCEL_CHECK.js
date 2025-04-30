/*------------------------------------------------------------------------------------------------------/
| Program		: PLN_SHORT_TERM_PARCEL_CHECK.js

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

    var blockSubmitStr = "Short Term Rental Properties are only allowed in R-1 and R-3 Coastal Zones";
	var blockSub = false;
  
    var parcelObj = new Object();
    loadParcelAttributes4ACA(parcelObj);

    var zoningDesig = String(parcelObj["ParcelAttribute.ZONING DESIGNATION"]);
    var coastal = String(parcelObj["ParcelAttribute.COASTAL ZONE"]);

    if (coastal == "Yes" || coastal == "YES") {
        if (zoningDesig.indexOf("R-1") == 0 || zoningDesig.indexOf("R-3") == 0) 
            logDebug("Short term rentals allowed")
        else
            blockSub = true;
    }
    else {
        blockSub = true;
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

function loadParcelAttributes4ACA(parcelAttrObj) {
    var capParcelModel = cap.parcelModel;
    var parcelModel = capParcelModel.parcelModel;

    //parcelArea += parcelModel.parcelArea;

    var allParcelAttrs = parcelModel.parcelAttribute.toArray();
    for (var i in allParcelAttrs) {
        var parcelAttr = allParcelAttrs[i];

        var attrName = String(parcelAttr.getB1AttributeName());
        var attrValue = parcelAttr.getB1AttributeValue();
        // Avo_LogDebug(attrName + "(" + attrValue + ")", 2);  //debug

        parcelAttrObj["ParcelAttribute." + attrName] = attrValue;
    }

    parcelAttrObj["ParcelAttribute.Block"] = parcelModel.getBlock();
    parcelAttrObj["ParcelAttribute.Book"] = parcelModel.getBook();
    parcelAttrObj["ParcelAttribute.CensusTract"] = parcelModel.getCensusTract();
    parcelAttrObj["ParcelAttribute.CouncilDistrict"] = parcelModel.getCouncilDistrict();
    parcelAttrObj["ParcelAttribute.ExemptValue"] = parcelModel.getExemptValue();
    parcelAttrObj["ParcelAttribute.ImprovedValue"] = parcelModel.getImprovedValue();
    parcelAttrObj["ParcelAttribute.InspectionDistrict"] = parcelModel.getInspectionDistrict();
    parcelAttrObj["ParcelAttribute.LandValue"] = parcelModel.getLandValue();
    parcelAttrObj["ParcelAttribute.LegalDesc"] = parcelModel.getLegalDesc();
    parcelAttrObj["ParcelAttribute.Lot"] = parcelModel.getLot();
    parcelAttrObj["ParcelAttribute.MapNo"] = parcelModel.getMapNo();
    parcelAttrObj["ParcelAttribute.MapRef"] = parcelModel.getMapRef();
    parcelAttrObj["ParcelAttribute.ParcelStatus"] = parcelModel.getParcelStatus();
    parcelAttrObj["ParcelAttribute.SupervisorDistrict"] = parcelModel.getSupervisorDistrict();
    parcelAttrObj["ParcelAttribute.Tract"] = parcelModel.getTract();
    parcelAttrObj["ParcelAttribute.PlanArea"] = parcelModel.getPlanArea();
}


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