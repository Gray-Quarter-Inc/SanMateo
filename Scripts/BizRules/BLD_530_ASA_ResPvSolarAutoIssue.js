/*******************************************************
| Script/Function: ResPvSolarAutoIssue() - (ID530)
| Created by: Hamidreza Alaei
| Created on: 28Oct24
| Usage: On ASA if parent record type is "Building/Auto Issue/NA/NA" and ASI "Additional Panel" is greater than 1
|        Invoice and assess BLD_061 with value of $191 + (29$ for each additional panel)
| Modified by: (GQ 12/27/2024 11008)
*********************************************************/
(function () {
  // Get parent Auto Issue Permit
  var allParents = new Array();

  var additionalPanelsASI = getAppSpecific("Additional Panels");
  if (matches(additionalPanelsASI, null, "null", "", undefined, "undefined") == true || additionalPanelsASI <= 1) {
    Avo_LogDebug("ID530 - Inapplicable number of additional panels", 1);
    return;
  }

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

  eval(getScriptText("BLD_FeeCalculationFunctions"));

  if (matches(parentAutoIssCapId, null, "null", "", undefined, "undefined") != true) {
    var invoiceFee = "Y";
    var feeSched = "BLD_GEN";
    var feeCode = "BLD_061";
    var quantity = 29 * additionalPanelsASI + 191;

    assessAndInvoiceFee(feeCode, feeSched, quantity, invoiceFee);
  } else {
    Avo_LogDebug("ID530 - Inapplicable parent record", 1);
  }
})();
