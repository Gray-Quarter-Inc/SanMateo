/*******************************************************
| Script/Function: ElectricalServAutoIssue() - (ID529)
| Created by: Hamidreza Alaei
| Created on: 28Oct24
| Usage: If parent record type is "Building/Auto Issuance/NA/NA", assess and invoice fee BLD_014 from BLD_GEN schedule with quantity set as 165 if ASI "ESU Included" is "Yes" or "Y";
|        Otherwise, set the quantity as 400 if the ASI "ESU Included" is "No" or "N"
| Modified by: ()
*********************************************************/
(function () {
  // Get parent Auto Issue Permit
  var allParents = new Array();

  if (matches(parentCapId, null, "null", "", undefined, "undefined") != true) {
    allParents.push(parentCapId);
  }

  if (allParents.length == 0) {
    allParents = Avo_GetAllParentsOfType("Building/Auto Issue/NA/NA", capId);
  }

  if (!allParents || allParents.length == 0) {
    allParents = new Array();

    Avo_LogDebug("No parent Auto Issue Permit records found", 1);
  }

  var parentAutoIssCapId = null;
  for (var i in allParents) {
    var lcl_parentCapId = allParents[i];

    if ("projectID" in lcl_parentCapId) {
      lcl_parentCapId = allParents[i].projectID;
    }

    var lcl_result = aa.cap.getCap(lcl_parentCapId);
    if (lcl_result.getSuccess() != true) {
      Avo_LogDebug("Failed to get parent cap. " + lcl_result.errorType + ": " + lcl_result.errorMessage, 1);
      continue;
    }

    var lcl_parentCap = lcl_result.getOutput();
    if (matches(lcl_parentCap, null, "null", "", undefined) == true) {
      continue;
    }

    var lcl_parentAltId = lcl_parentCap.capModel.altID;
    Avo_LogDebug("Parent(" + lcl_parentAltId + ")", 2); //debug

    var lcl_completeCap = lcl_parentCap.isCompleteCap();
    Avo_LogDebug("Complete(" + String(lcl_completeCap) + ")", 2); //debug

    if (lcl_completeCap != true) {
      Avo_LogDebug("Parent " + lcl_parentAltId + " is only a temporary record. Ignoring", 1);
      continue;
    }

    // Check record type
    var lcl_capTypeModel = lcl_parentCap.capType;
    var lcl_recordType = String(lcl_capTypeModel);
    Avo_LogDebug("Record Type(" + lcl_recordType + ")", 2); //debug

    if (lcl_recordType != "Building/Auto Issue/NA/NA") {
      continue;
    }

    parentAutoIssCapId = lcl_parentCap.capID;
    break;
  }

  if (matches(parentAutoIssCapId, null, "null", "", undefined, "undefined") != true) {
    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeCode = "BLD_014";
    var quantity = 0;
    eval(getScriptText("BLD_FeeCalculationFunctions"));

    var esuIncludedASI = getAppSpecific("ESU Included");
    if (matches(esuIncludedASI, null, "null", "", undefined, "undefined") != true) {
      if (["Yes", "Y"].indexOf(esuIncludedASI) != -1) {
        quantity = 191;
      } else {
        quantity = 462;
      }
      assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);
    } else {
      Avo_LogDebug("Invalid value for ESU Included ASI", 1);
    }
  } else {
    Avo_LogDebug("Failed to add the fee BLD_014 due to inapplicable parent record", 1);
  }
})();
