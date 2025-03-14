/*----------------------------------------------------------------------------------------------------/
| GIS Related Functions
/----------------------------------------------------------------------------------------------------*/
/*******************************************************
| Script/Function: addAppConditionCustom()
| Created by: Mike Buell
| Created on: 02June17
| Usage: add app condition
| Modified by: 
| Modified on: 
*********************************************************/
function addAppConditionCustom(cType, cStatus, cDesc, cComment, cImpact, conditionOfApproval) {
    var addCapCondResult;
    if (arguments.length > 5) {
        addCapCondResult = aa.capCondition.addCapCondition(capId, cType, cDesc, cComment, sysDate, null, sysDate, null, null, cImpact, systemUserObj, systemUserObj, cStatus, currentUserID, "A", conditionOfApproval);
    } else {
        addCapCondResult = aa.capCondition.addCapCondition(capId, cType, cDesc, cComment, sysDate, null, sysDate, null, null, cImpact, systemUserObj, systemUserObj, cStatus, currentUserID, "A");
    }

    if (addCapCondResult.getSuccess()) {
        logDebug("Successfully added condition (" + cImpact + ") " + cDesc);
    } else {
        logDebug("**ERROR: adding condition (" + cImpact + "): " + addCapCondResult.getErrorMessage());
    }
}
/*----------------------------------------------------------------------------------------------------/
| Green Halo Notification Functions
| Functions used to create new or attach records to Waste Management Plans
| Created by Accela 06/12/2015
/----------------------------------------------------------------------------------------------------*/
function addPermitToWasteManagementPlan() {

    var wmPlan = new WasteManagementPlan();

    //var tsi = [];
    //loadTaskSpecific(tsi,capId);    

    wmPlan.permit = capIDString;
    wmPlan.wmpNumber = getAppSpecific("Green Halo Existing WMP Id");
    var wDesc = workDescGet(capId);
    if (wDesc)
        wmPlan.description = wDesc;
    wmPlan.projectType = getAppSpecific("Green Halo Project Type");
    if (estValue == 0) wmPlan.value = 1; else wmPlan.value = estValue;
    wmPlan.squareFootage = getAppSpecific("Green Halo Square Footage");

    var requestSendResult = wmPlan.addPermit();
    aa.print(JSON.stringify(JSON.parse(requestSendResult)));
    var ghResponse = JSON.parse(requestSendResult);
    if (ghResponse.status == "success") {
        editAppSpecific("Green Halo WMP Id", getAppSpecific("Green Halo Existing WMP Id"));
    } else {
        //handle errors
    }

    return ghResponse.status;
}
/*******************************************************
| Script/Function: addRoofingSysReqCondition(capId)
| Created by: Nicolaj Bunting
| Created on: 26Feb19
| Usage: On submit if record type is "Building/OTC/Reroof/NA" or "Building/Full Review/NA/NA" and parcel FIRE_SEVERITY_ZONE is "LRA Very High" 
| then add condition "Minimum Class A Roofing System Required" of type "Hazard"
| Modified by: ()
*********************************************************/
function addRoofingSysReqCondition(capId) {
    var altId = aa.cap.getCap(capId).getOutput().capModel.altID;
    Avo_LogDebug("addRoofingSysReqCondition(" + altId + ")", 1);

    // check record type
    var cap = aa.cap.getCap(capId).getOutput();
    var recordType = String(cap.capType);
    Avo_LogDebug("Record Type(" + recordType + ")", 2); //debug

    if (recordType != "Building/OTC/Reroof/NA" && recordType != "Building/Full Review/NA/NA") {
        return false;
    }

    // Check if condition has already been added
    var condition = "Minimum Class A Roofing System Required";
    var conType = "Hazard";
    var conSeverity = "Notice";

    var hasCondition = appHasCondition(conType, null, condition, conSeverity);
    if (hasCondition === true) {
        return true;
    }

    // check fire severity
    var result = aa.parcel.getParcelandAttribute(capId, aa.util.newQueryFormat());
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get parcel on record " + altId + ". " + result.errorType + ": " + result.errorMessage, 1);
        return false;
    }

    var allParcels = result.getOutput().toArray();
    for (var i in allParcels) {
        var parcelModel = allParcels[i];
        // printLine(serialize(parcelModel));

        var allAttrs = parcelModel.parcelAttribute.toArray();
        for (var j in allAttrs) {
            var attr = allAttrs[j];
            // printLine(serialize(parcelAttr));

            var attrName = String(attr.b1AttributeName);
            Avo_LogDebug("Attribute(" + attrName + ")", 2);	//debug

            if (attrName != "FIRE_SEVERITY_ZONE") {
                continue;
            }

            var attrValue = String(attr.b1AttributeValue);
            Avo_LogDebug("Value(" + attrValue + ")", 2);	//debug

            if (attrValue != "LRA Very High") {
                continue;
            }

            // add condition
            addStdCondition(conType, condition, capId);
            return true;
        }
    }

    return false;
}
/*----------------------------------------------------------------------------------------------------/
| GIS Related Functions
/----------------------------------------------------------------------------------------------------*/
function addStdConditionCustom(cType, cDesc, cComment) // optional cap ID
{
    var itemCap = capId;
    if (arguments.length == 4) {
        itemCap = arguments[3]; // use cap ID specified in args
    }
    if (!aa.capCondition.getStandardConditions) {
        logDebug("addStdCondition function is not available in this version of Accela Automation.");
    } else {
        standardConditions = aa.capCondition.getStandardConditions(cType, cDesc).getOutput();
        for (i = 0; i < standardConditions.length; i++)
        // deactivate strict match for indy
        //if (standardConditions[i].getConditionType().toUpperCase() == cType.toUpperCase() && standardConditions[i].getConditionDesc().toUpperCase() == cDesc.toUpperCase()) //EMSE Dom function does like search, needed for exact match
        {
            standardCondition = standardConditions[i];

            var addCapCondResult = aa.capCondition.addCapCondition(itemCap, standardCondition.getConditionType(), standardCondition.getConditionDesc(), cComment, sysDate, null, sysDate, null, null, standardCondition.getImpactCode(), systemUserObj, systemUserObj, "Applied", currentUserID, "A", null, standardCondition.getDisplayConditionNotice(), standardCondition.getIncludeInConditionName(), standardCondition.getIncludeInShortDescription(), standardCondition.getInheritable(), standardCondition.getLongDescripton(), standardCondition.getPublicDisplayMessage(), standardCondition.getResolutionAction(), null, null, standardCondition.getConditionNbr(), standardCondition.getConditionGroup(), standardCondition.getDisplayNoticeOnACA(), standardCondition.getDisplayNoticeOnACAFee(), standardCondition.getPriority(), standardCondition.getConditionOfApproval());

            if (addCapCondResult.getSuccess()) {
                logDebug("Successfully added condition (" + standardCondition.getConditionDesc() + ")");
            } else {
                logDebug("**ERROR: adding condition (" + standardCondition.getConditionDesc() + "): " + addCapCondResult.getErrorMessage());
            }
        }
    }
}
/*******************************************************
| Script/Function: Avo_BranchTaskAsUser(taskName, taskStatus, taskComment, taskNote, username, [processName], [recordId])
| Created by: Nicolaj Bunting
| Created on: 20Nov20
| Usage: update task taskName with status taskStatus as username, include taskComment, taskNote, promote to the next task
| Modified by: ()
*********************************************************/
function Avo_BranchTaskAsUser(taskName, taskStatus, taskComment, taskNote, username) // optional process name
{
    if (!taskStatus || String(taskStatus).length == 0) {
        taskStatus = "NA";
    }

    var result = aa.people.getPublicUserByUserName(username);
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get user " + username + ". " + result.errorType + ": " + result.errorMessage, 1);
        return false;
    }

    var userModel = result.getOutput();

    var useProcess = false;
    var processName = "";
    if (arguments.length > 5 && arguments[5] && String(arguments[5]).length > 0) {
        processName = arguments[5]; // subprocess
        useProcess = true;
    }

    var recordId = capId;
    if (arguments.length > 6 && arguments[6]) {
        recordId = arguments[6]; // use cap ID specified in args
    }

    var altId = aa.cap.getCap(recordId).getOutput().capModel.altID;

    var workflowResult = aa.workflow.getTaskItems(recordId, taskName, processName, null, null, null);
    if (workflowResult.getSuccess() != true) {
        Avo_LogDebug("Failed to get workflow items on record " + altId + ". " + workflowResult.errorType + ': ' + workflowResult.errorMessage, 1);
        return false;
    }

    var tasksUpdated = 0;

    var allTaskItems = workflowResult.getOutput();
    for (var i in allTaskItems) {
        var taskItem = allTaskItems[i];
        if (!taskItem.getTaskDescription().toUpperCase().equals(taskName.toUpperCase()) || (useProcess && !taskItem.getProcessCode().equals(processName))) {
            continue;
        }

        var dispositionDate = aa.date.getCurrentDate();
        var stepnumber = taskItem.getStepNumber();
        var processId = taskItem.getProcessID();

        var result;
        if (useProcess) {
            result = aa.workflow.handleDisposition(recordId, stepnumber, processId, taskStatus, dispositionDate, taskNote, taskComment, userModel, "B");
        } else {
            result = aa.workflow.handleDisposition(recordId, stepnumber, taskStatus, dispositionDate, taskNote, taskComment, userModel, "B");
        }

        if (result.getSuccess() != true) {
            Avo_LogDebug('Failed to branch task "' + taskName + '" with status "' + taskStatus + '" on record ' + altId + '. '
                + result.errorType + ': ' + result.errorMessage, 1);
            continue;
        }

        tasksUpdated++;
        Avo_LogDebug('Branched task "' + taskName + '" with status "' + taskStatus + '" as user "' + username + '" on record ' + altId, 1);
    }

    return tasksUpdated;
}
/*******************************************************
| Script/Function: Avo_CheckRevisionFeePaid()
| Created by: Jei Yang
| Created on: 10Dec21
| Usage: Check if Revision Fee (BLD_083) has been invoiced and paid.
         When the function returns true, revision fee is paid which means this new Revision record has been successfully created and converted to CAP record.
         This is an alternative to CTRCA event which is currently having a timing issue. 
| Modified by: ()
*********************************************************/
function Avo_CheckRevisionFeePaid() {
    // For PRA, check if BLD_083 has been invoiced for the capId.
    var revisionFeeInvoiced = false;
    var revisionFeeId = 0;
    var revisionFeeOwed = 0;
    var feeItems = aa.fee.getFeeItems(capId).getOutput();
    for (var i in feeItems) {
        var feeCode = String(feeItems[i].feeCod);
        var feeSched = feeItems[i].f4FeeItemModel.feeSchudle;
        var feeId = feeItems[i].feeSeqNbr;
        var feeAmount = feeItems[i].fee;

        Avo_LogDebug(feeId + " " + feeCode + "($" + feeAmount + ")", 2);    //debug
        if (feeCode == "BLD_083" && feeSched == "BLD_GEN") {
            revisionFeeId = feeId;
            revisionFeeOwed = feeAmount;
            revisionFeeInvoiced = true;
            break;
        }
    }

    if (!revisionFeeInvoiced) {
        return false;
    }

    //Check if BLD_083 has been paid.
    var paymentItems = aa.finance.getPaymentFeeItems(capId, null).getOutput();
    for (var i in paymentItems) {
        var feeIdToCheck = paymentItems[i].feeSeqNbr;
        var feePaid = paymentItems[i].feeAllocation;
        Avo_LogDebug("Payment Fee ID(" + feeIdToCheck + ")", 2);    //debug

        if (revisionFeeId != feeIdToCheck) {
            continue;
        }

        revisionFeeOwed = revisionFeeOwed - feePaid;
        break;
    }

    if (revisionFeeOwed > 0)
        return false;

    return true;
};
/*******************************************************
| Script/Function: Avo_CloseTaskAsUser(taskName, taskStatus, taskComment, taskNote, username, promoteTask, [processName], [recordId])
| Created by: Nicolaj Bunting
| Created on: 20Nov20
| Usage: close task taskName with status taskStatus as username, include taskComment, taskNote, If promoteTask is true Then promote to the next task
| Modified by: ()
*********************************************************/
function Avo_CloseTaskAsUser(taskName, taskStatus, taskComment, taskNote, username, promoteTask) {
    if (!taskStatus || String(taskStatus).length == 0) {
        taskStatus = "NA";
    }

    var result = aa.people.getPublicUserByUserName(username);
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get user " + username + ". " + result.errorType + ": " + result.errorMessage, 1);
        return false;
    }

    var userModel = result.getOutput();

    var useProcess = false;
    var processName = "";
    if (arguments.length > 6 && arguments[6] && String(arguments[6]).length > 0) {
        processName = arguments[5]; // subprocess
        useProcess = true;
    }

    var recordId = capId;
    if (arguments.length > 7 && arguments[7]) {
        recordId = arguments[7]; // use cap ID specified in args
    }

    var altId = aa.cap.getCap(recordId).getOutput().capModel.altID;

    var workflowResult = aa.workflow.getTaskItems(recordId, taskName, processName, null, null, null);
    if (workflowResult.getSuccess() != true) {
        Avo_LogDebug("Failed to get workflow items on record " + altId + ". " + workflowResult.errorType + ': ' + workflowResult.errorMessage, 1);
        return false;
    }

    var tasksUpdated = 0;

    var allTaskItems = workflowResult.getOutput();
    for (var i in allTaskItems) {
        var taskItem = allTaskItems[i];
        if (!taskItem.getTaskDescription().toUpperCase().equals(taskName.toUpperCase()) || (useProcess && !taskItem.getProcessCode().equals(processName))) {
            continue;
        }

        var taskStatusDate = aa.date.getCurrentDate();
        var stepnumber = taskItem.getStepNumber();
        var processId = taskItem.getProcessID();

        var result;
        if (promoteTask !== true) {
            if (useProcess) {
                result = aa.workflow.handleDisposition(recordId, stepnumber, processId, taskStatus, taskStatusDate, taskNote, taskComment, userModel, "U");
            } else {
                result = aa.workflow.handleDisposition(recordId, stepnumber, taskStatus, taskStatusDate, taskNote, taskComment, userModel, "U");
            }

            var result = aa.workflow.getTask(recordId, taskName);
            if (result.getSuccess() != true) {
                Avo_LogDebug('Failed to get updated workflow item "' + taskName + '". ' + result.errorType + ": " + result.errorMessage, 1);
            } else {
                var updatedTaskItem = result.getOutput();

                updatedTaskItem.activeFlag = "N";
                updatedTaskItem.completeFlag = "Y";

                var editResult = aa.workflow.editTask(updatedTaskItem);
                if (editResult.getSuccess() != true) {
                    Avo_LogDebug('Failed to complete task "' + taskName + '" on record ' + altId + '. ' + result.errorType + ': ' + result.errorMessage, 1);
                } else {
                    Avo_LogDebug('Completed task "' + taskName + '" as user "' + username + '" on record ' + altId, 1);
                }
            }
        } else {
            if (useProcess) {
                result = aa.workflow.handleDisposition(recordId, stepnumber, processId, taskStatus, taskStatusDate, taskNote, taskComment, userModel, "Y");
            } else {
                result = aa.workflow.handleDisposition(recordId, stepnumber, taskStatus, taskStatusDate, taskNote, taskComment, userModel, "Y");
            }
        }

        if (result.getSuccess() != true) {
            Avo_LogDebug('Failed to close task "' + taskName + '" with status "' + taskStatus + '" on record ' + altId + '. '
                + result.errorType + ': ' + result.errorMessage, 1);
            continue;
        }

        tasksUpdated++;
        Avo_LogDebug('Closed task "' + taskName + '" with status "' + taskStatus + '" as user "' + username + '" on record ' + altId, 1);
    }

    return tasksUpdated;
}
/*******************************************************
| Script/Function: Avo_GenerateReportAndAttachToRecord(itemCap, reportName, module, parameters)
| Usage: Generates the report reportName using parameters and attaches it to record itemCap if "save to EDMS" is enabled and "EDMS Object" is "Record" in report manager
| Modified by: ()
*********************************************************/
function Avo_GenerateReportAndAttachToRecord(itemCap, reportName, module, parameters) {
    var altId = aa.cap.getCap(itemCap).getOutput().getCapModel().altID;
    Avo_LogDebug("Avo_GenerateReportAndAttachToRecord(" + altId + ", " + reportName + ", " + module + ", " + parameters.toString() + ")", 1);
    //returns the report file which can be attached to an email.
    var user = currentUserID;   // Setting the User Name
    var result = aa.reportManager.getReportInfoModelByName(reportName);
    if (result.getSuccess() != true) {
        Avo_LogDebug('Failed to get report "' + reportName + '". ' + result.errorType + ":" + result.errorMessage, 1);
        return false;
    }

    var report = result.getOutput();

    report.setModule(module);
    // Note: Changed this to use the capId instead of the altId because the adhoc report will not attach to the record otherwise. 
    // Question: Will SSRS reports use the capId or the altId?
    report.setCapId(itemCap.getID1() + "-" + itemCap.getID2() + "-" + itemCap.getID3());
    report.getEDMSEntityIdModel().setAltId(itemCap.getCustomID());
    report.setReportParameters(parameters);

    var permit = aa.reportManager.hasPermission(reportName, user);
    if (!permit.getOutput().booleanValue()) {
        Avo_LogDebug("You have no permission.", 1);
        return false;
    }

    var reportResult = aa.reportManager.getReportResult(report);
    if (!reportResult || reportResult.getSuccess() != true) {
        Avo_LogDebug("System failed get report: " + reportResult.errorType + ": " + reportResult.errorMessage, 1);
        return false;
    }

    reportOutput = reportResult.getOutput();
    if (!reportOutput) {
        return false;
    }

    Avo_LogDebug("Filename(" + reportOutput.name + ")", 2);	//debug
    return reportOutput.name;
}

/*******************************************************
| Script/Function: Avo_GetAllParentsOfType([recordType], [recordId])
| Created by: Nicolaj Bunting
| Created on: 18Apr18
| Usage: Convert an Accela formatted date string into a js date object
| Modified by: ()
*********************************************************/
function Avo_GetAllParentsOfType(recordType, recordId) {
    if (recordType) {
        recordType = String(recordType);
    }

    if (!recordId) {
        recordId = capId;
    }

    var altId = aa.cap.getCap(recordId).getOutput().getCapModel().altID;
    logDebug("Avo_GetAllParentsOfType(" + recordType + ", " + altId + ")");

    var parents = new Array();

    var allParents = aa.cap.getProjectByChildCapID(recordId, null, null).getOutput();
    if (!allParents || allParents.length == 0) {
        return parents;
    }

    for (var i in allParents) {
        var parentCapId = allParents[i].projectID;

        if (recordType) {
            if (appMatch(recordType, parentCapId) == false) {
                continue;
            }
        }

        parents.push(parentCapId);
    }

    return parents;
}

/*******************************************************
| Script/Function: Avo_GetDateFromAccelaDateString()
| Usage: Convert an Accela formatted date string into a js date object
| Modified by: ()
*********************************************************/
function Avo_GetDateFromAccelaDateString(dateStr) {
    dateStr = String(dateStr).trim();
    logDebug("Avo_GetDateFromAccelaDateString(" + dateStr + ")");

    if (!dateStr) {
        Avo_LogDebug("Date string is empty or null", 1);
        return null;
    }

    var dateStr = String(dateStr).trim();
    var dateStr = dateStr.split(" ")[0];

    var year, month, day;

    if (dateStr.indexOf("/") != -1) {
        var dateArr = dateStr.split("/");
        year = dateArr[2];
        month = dateArr[0];
        day = dateArr[1];
    } else if (dateStr.indexOf("-") != -1) {
        var dateArr = dateStr.split("-");
        year = dateArr[0];
        month = dateArr[1];
        day = dateArr[2];
    } else {
        year = dateStr.substring(4, dateStr.length);
        month = dateStr.substring(0, 2);
        day = dateStr.substring(2, 4);
    }

    if (!year) {
        return;
    }
    if (!month) {
        return;
    }
    if (!day) {
        return;
    }

    //Avo_LogDebug("Year(" + year + ")", 2); //debug
    //Avo_LogDebug("Month(" + month + ")", 2);   //debug
    //Avo_LogDebug("Day(" + day + ")", 2);   //debug

    var date = new Date(year, month - 1, day);
    return date;
}
/*******************************************************
| Script/Function: Avo_GetToday()
| Created by: Nicolaj Bunting
| Usage: get a javascript date object for today's date with time set to midnight
| Modified by: ()
*********************************************************/
function Avo_GetToday() {
    Avo_LogDebug("Avo_GetToday()", 1);

    var today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    return today;
}
/*******************************************************
| Script/Function: Avo_GetTotalFees([feeCodeIgnoreList], [recordId])
| Created by: Mike Buell
| Created on: 20Oct20
| Usage: Get the total fee amount on record, ignoring those fee codes in feeCodeIngoreList separated by commas
| Modified by: ()
*********************************************************/
function Avo_GetTotalFees() {
    var ignoreList = new Object();
    if (arguments.length > 0 && arguments[0] && String(arguments[0]).length > 0) {
        var allFeeCodesToIngore = String(arguments[0]).split(',');
        for (var i in allFeeCodesToIngore) {
            var feeCodeToIgnore = allFeeCodesToIngore[i];
            Avo_LogDebug("Fee code to ignore(" + feeCodeToIgnore + ")", 2); //debug

            ignoreList[feeCodeToIgnore] = true;
        }
    }

    var recordId = capId;
    if (arguments.length > 1 && arguments[1]) {
        recordId = arguments[1];
    }

    var altId = aa.cap.getCap(capId).getOutput().capModel.altID;
    Avo_LogDebug("Avo_GetTotalFees(" + altId + ")", 1);

    // Get fee balance and fees paid balance
    // #balance, #balanceDue, #fee, #payment
    var feeTotal = 0;
    //var paidTotal = 0;
    //var allFeeIds = new Object();

    var feeItems = aa.fee.getFeeItems(recordId).getOutput();
    for (var i in feeItems) {
        var feeCode = String(feeItems[i].feeCod);

        var feeAmount = feeItems[i].fee;
        var feeId = feeItems[i].feeSeqNbr;
        Avo_LogDebug(feeId + " " + feeCode + "($" + feeAmount + ")", 2);    //debug

        if (feeCode in ignoreList) {
            continue;
        }

        feeTotal += feeAmount;
        //allFeeIds[feeId] = feeAmount;
    }

    return feeTotal;
}

/*******************************************************
| Script/Function: Avo_GetTotalFeesOfSelected([feeCodeIncludeList], [recordId])
| Created by: Jei Yang
| Created on: 24Mar21
| Usage: Get the total fee amount on record, ignoring those fee codes in feeCodeIngoreList separated by commas
| Modified by: ()
*********************************************************/
function Avo_GetTotalFeesOfSelected() {
    var includeList = new Object();
    if (arguments.length > 0 && arguments[0] && String(arguments[0]).length > 0) {
        var allFeeCodesToInclude = String(arguments[0]).split(',');
        for (var i in allFeeCodesToInclude) {
            var feeCodeToInclude = allFeeCodesToInclude[i];
            Avo_LogDebug("Fee code to include(" + feeCodeToInclude + ")", 2); //debug

            includeList[feeCodeToInclude] = true;
        }
    }

    var recordId = capId;
    if (arguments.length > 1 && arguments[1]) {
        recordId = arguments[1];
    }

    var altId = aa.cap.getCap(capId).getOutput().capModel.altID;
    Avo_LogDebug("Avo_GetTotalFees(" + altId + ")", 1);

    // Get fee balance
    // #balance, #balanceDue, #fee, #payment
    var feeTotal = 0;
    //var paidTotal = 0;
    //var allFeeIds = new Object();

    var feeItems = aa.fee.getFeeItems(recordId).getOutput();
    for (var i in feeItems) {
        var feeCode = String(feeItems[i].feeCod);

        var feeAmount = feeItems[i].fee;
        var feeId = feeItems[i].feeSeqNbr;

        if (!(feeCode in includeList)) {
            continue;
        }

        feeTotal += feeAmount;
        Avo_LogDebug(feeId + " " + feeCode + "($" + feeAmount + ")", 2);    //debug
        //allFeeIds[feeId] = feeAmount;
    }

    return feeTotal;
}

/*******************************************************
| Script/Function: Avo_GetTotalNumberOfHeadsQuantity(recordId)
| Created by: Nicolaj Bunting
| Created on: 26Jun17
| Usage: For each row in ASIT "FLOOR_INFO" get the "Number of Heads" value Then for each additional 200 heads or fraction thereof add 1 to the sum
| Modified by: ()
*********************************************************/
function Avo_GetTotalNumberOfHeadsQuantity(recordId) {
    logDebug("Avo_GetTotalNumberOfHeadsQuantity(recordId)");

    var sum = 0;

    var table = loadASITable("FLOOR_INFO");
    if (!table) {
        return sum;
    }
    if (table.length == 0) {
        logDebug("FLOOR_INFO table is empty");
        return sum;
    }

    var floors = 0;
    var totalHeads = 0;

    for (a in table) {
        var floor = table[a]["Floor Number"];
        var field = table[a]["Number of Heads"];
        var heads = parseInt(field.fieldValue, 10);

        if (isNaN(heads) == true) {
            continue;
        }

        if (heads < 200) {
            continue;
        }

        var quantity = Math.ceil(heads / 200) - 1;
        logDebug("Floor(" + floor + "), Heads(" + heads + "), Quantity(" + quantity + ")");   //debug

        if (quantity <= 0) {
            continue;
        }

        sum += quantity;
    }

    return sum;
}
/*******************************************************
| Script/Function: Avo_GetTotalSquareFootageQuantity(recordId)
| Created by: Nicolaj Bunting
| Created on: 26Jun17
| Usage: For each row in ASIT "FLOOR_INFO" get the "Square Footage" value Then for each additional 25000 sq ft or fraction thereof add 1 to the sum
| Modified by: ()
*********************************************************/
function Avo_GetTotalSquareFootageQuantity(recordId) {
    logDebug("Avo_GetTotalSquareFootageQuantity(recordId)");

    var sum = 0;

    var table = loadASITable("FLOOR_INFO");
    if (!table) {
        return sum;
    }
    if (table.length == 0) {
        logDebug("FLOOR_INFO table is empty");
        return sum;
    }

    for (a in table) {
        var floor = table[a]["Floor Number"];
        var field = table[a]["Square Footage"];
        var area = parseFloat(field.fieldValue);

        if (isNaN(area) == true) {
            continue;
        }

        if (area < 25000) {
            continue;
        }

        var quantity = Math.ceil(area / 25000) - 1;
        logDebug("Floor(" + floor + "), Area(" + area + "), Quantity(" + quantity + ")");   //debug

        if (quantity <= 0) {
            continue;
        }

        sum += quantity;
    }

    return sum;
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

    var br = "<br>";

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
/*******************************************************
| Script/Function: Avo_NewRevisionCheck()
| Created by: Jei Yang
| Created on: 10Dec21
| Usage: Check if ASI 'Updated Revision ID' is null.
         When the function returns true, this new Revision record has been successfully created and converted to CAP record.
         This is an alternative to CTRCA event which is currently having a timing issue. 
| Modified by: ()
*********************************************************/
function Avo_NewRevisionCheck() {
    var updatedRevisionID = String(AInfo["Updated Revision ID"]);
    Avo_LogDebug("Updated Revision ID(" + updatedRevisionID + ")", 2); //debug

    if (!updatedRevisionID || updatedRevisionID.length == 0 || updatedRevisionID.toLowerCase() == "null") {
        return true;
    } else if (updatedRevisionID.toLowerCase() == "undefined") {
        return false; //ASI does not exist. The permit is not Revision.
    }

    return false;
}
/*******************************************************
| Script/Function: Avo_UpdateTaskAsUser(taskName, taskStatus, taskComment, taskNote, username, [processName], [recordId])
| Created by: Nicolaj Bunting
| Created on: 20Nov20
| Usage: update task taskName with status taskStatus as username, include taskComment, taskNote
| Modified by: ()
*********************************************************/
function Avo_UpdateTaskAsUser(taskName, taskStatus, taskComment, taskNote, username) // optional process name, cap id
{
    if (!taskStatus || String(taskStatus).length == 0) {
        taskStatus = "NA";
    }

    var result = aa.people.getPublicUserByUserName(username);
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get user " + username + ". " + result.errorType + ": " + result.errorMessage, 1);
        return false;
    }

    var userModel = result.getOutput();

    var useProcess = false;
    var processName = "";
    if (arguments.length > 5 && arguments[5] && String(arguments[5]).length > 0) {
        processName = arguments[5]; // subprocess
        useProcess = true;
    }

    var recordId = capId;
    if (arguments.length > 6 && arguments[6]) {
        recordId = arguments[6]; // use cap ID specified in args
    }

    var altId = aa.cap.getCap(recordId).getOutput().capModel.altID;

    var workflowResult = aa.workflow.getTaskItems(recordId, taskName, processName, null, null, null);
    if (workflowResult.getSuccess() != true) {
        Avo_LogDebug("Failed to get workflow items on record " + altId + ". " + workflowResult.errorType + ': ' + workflowResult.errorMessage, 1);
        return false;
    }

    var tasksUpdated = 0;

    var allTaskItems = workflowResult.getOutput();
    for (var i in allTaskItems) {
        var taskItem = allTaskItems[i];
        if (!taskItem.getTaskDescription().toUpperCase().equals(taskName.toUpperCase()) || (useProcess && !taskItem.getProcessCode().equals(processName))) {
            continue;
        }

        var dispositionDate = aa.date.getCurrentDate();
        var stepnumber = taskItem.getStepNumber();
        var processId = taskItem.getProcessID();

        var result;
        if (useProcess) {
            result = aa.workflow.handleDisposition(recordId, stepnumber, processId, taskStatus, dispositionDate, taskNote, taskComment, userModel, "U");
        } else {
            result = aa.workflow.handleDisposition(recordId, stepnumber, taskStatus, dispositionDate, taskNote, taskComment, userModel, "U");
        }

        if (result.getSuccess() != true) {
            Avo_LogDebug('Failed to update task "' + taskName + '" with status "' + taskStatus + '" on record ' + altId + '. '
                + result.errorType + ': ' + result.errorMessage, 1);
            continue;
        }

        tasksUpdated++;
        Avo_LogDebug('Updated task "' + taskName + '" with status "' + taskStatus + '" as user "' + username + '" on record ' + altId, 1);
    }

    return tasksUpdated;
}
//Function will copy all owners from source CAP (sCapID) to target CAP (tCapId) and return the total number of successes
function copyOwner(sCapID, tCapID) {
    var ownrReq = aa.owner.getOwnerByCapId(sCapID);
    if (ownrReq.getSuccess() != true) {
        Avo_LogDebug("Failed to get Owners. " + ownrReq.getErrorType() + ": " + ownrReq.getErrorMessage(), 1);
        return false;
    }

    var count = 0;

    var allOwners = ownrReq.getOutput();
    for (var i in allOwners) {
        allOwners[i].setCapID(tCapID);

        var addReq = aa.owner.createCapOwnerWithAPOAttribute(allOwners[i]);
        if (addReq.getSuccess() != true) {
            Avo_LogDebug("Failed to copy owner " + allOwners[i].getOwnerFullName(), 1);
            continue;
        }

        count++;
        Avo_LogDebug("Copied Owner " + allOwners[i].getOwnerFullName(), 1);
    }

    return count;
}
/*******************************************************
| Script/Function: createChildTempRecord(cTypeArray, asiFieldArray, asiTableMapping, [itemCap])
| Created by: Mark Wells
| Usage: create associated form of type cTypeArray, copy ASI fields in asiFieldArray from parent, copy ASI tables in asiTableMapping 
| from parent, copy addresses and parcels from parent
| Modified by: ()
*********************************************************/
function createChildTempRecord(cTypeArray, asiFieldArray, asiTableMapping) {
    var childCapId = null;
    var itemCap = capId;
    if (arguments.length > 3) {
        itemCap = arguments[3];
    }

    var parentAltId = aa.cap.getCap(itemCap).getOutput().capModel.altID;
    Avo_LogDebug("Parent(" + parentAltId + ")", 2);  //debug

    var groupsIgnoreArray;
    var capClass = "INCOMPLETE TMP";

    if (cTypeArray[0] == "ICMSLicensing" && cTypeArray[1] == "General" && cTypeArray[2] == "Associated Form" && cTypeArray[3] == "NA") {
        capClass = "INCOMPLETE EST";
    }

    //Avo_LogDebug("Class(" + capClass + ")", 2); //debug

    var cRecordArray = getChildren(cTypeArray[0] + "/" + cTypeArray[1] + "/" + cTypeArray[2] + "/" + cTypeArray[3], capId);
    if (isEmpty(cRecordArray)) {
        try {
            ctm = aa.proxyInvoker.newInstance("com.accela.aa.aamain.cap.CapTypeModel").getOutput();
            ctm.setGroup(cTypeArray[0]);
            ctm.setType(cTypeArray[1]);
            ctm.setSubType(cTypeArray[2]);
            ctm.setCategory(cTypeArray[3]);

            if (publicUser) {
                childCapId = aa.cap.createSimplePartialRecord(ctm, null, capClass).getOutput();
            }
            else {
                childCapId = aa.cap.createApp(cTypeArray[0], cTypeArray[1], cTypeArray[2], cTypeArray[3], "Associated form").getOutput();
            }

            var childAltId = aa.cap.getCap(childCapId).getOutput().capModel.altID;
            Avo_LogDebug("Child(" + childAltId + ")", 2);  //debug

            Avo_LogDebug("Record Type(" + cTypeArray[0] + "/" + cTypeArray[1] + "/" + cTypeArray[2] + "/" + cTypeArray[3]
                + ")", 2);    //debug

            aa.cap.createAssociatedFormsHierarchy(itemCap, childCapId);

            //copyAdditionalInfo(itemCap, childId);
            copyAddresses(itemCap, childCapId);
            copyParcels(itemCap, childCapId);

            if (asiTableMapping) {
                copySpecifiedASITable(childCapId, asiTableMapping)
            }

            if (asiFieldArray) {
                copySpecifiedASI(childCapId, asiFieldArray);
            }
        }
        catch (err) {
            logDebug("CreateChildTempRecord Error occured: " + err.message);
        }
    }

    aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC Supp: createChildTempRecord", debug);    //debug
    return childCapId;
}

function copyAdditionalInfo(srcCapId, targetCapId) {
    //1. Get Additional Information with source CAPID.  (BValuatnScriptModel)
    var additionalInfo = getAdditionalInfo(srcCapId);
    if (additionalInfo == null) {
        return;
    }
    //2. Get CAP detail with source CAPID.
    var capDetail = getCapDetailByID(srcCapId);
    //3. Set target CAP ID to additional info.
    additionalInfo.setCapID(targetCapId);
    if (capDetail != null) {
        capDetail.setCapID(targetCapId);
    }
    //4. Edit or create additional infor for target CAP.
    aa.cap.editAddtInfo(capDetail, additionalInfo);
}

//Return BValuatnScriptModel for additional info.
function getAdditionalInfo(capId) {
    bvaluatnScriptModel = null;
    var s_result = aa.cap.getBValuatn4AddtInfo(capId);
    if (s_result.getSuccess()) {
        bvaluatnScriptModel = s_result.getOutput();
        if (bvaluatnScriptModel == null) {
            logDebug("WARNING: no additional info on this CAP:" + capId);
            bvaluatnScriptModel = null;
        }
    }
    else {
        logDebug("ERROR: Failed to get additional info: " + s_result.getErrorMessage());
        bvaluatnScriptModel = null;
    }
    // Return bvaluatnScriptModel
    return bvaluatnScriptModel;
}

function getCapDetailByID(capId) {
    capDetailScriptModel = null;
    var s_result = aa.cap.getCapDetail(capId);
    if (s_result.getSuccess()) {
        capDetailScriptModel = s_result.getOutput();
        if (capDetailScriptModel == null) {
            logDebug("WARNING: no cap detail on this CAP:" + capId);
            capDetailScriptModel = null;
        }
    }
    else {
        logDebug("ERROR: Failed to get cap detail: " + s_result.getErrorMessage());
        capDetailScriptModel = null;
    }
    // Return capDetailScriptModel
    return capDetailScriptModel;
}
/*----------------------------------------------------------------------------------------------------/
| Green Halo Notification Functions
| Functions used to create new or attach records to Waste Management Plans
| Created by Accela 06/12/2015
/----------------------------------------------------------------------------------------------------*/
function createWasteManagementPlan() {

    //TODO: Make this field read only
    var greenHaloID = getAppSpecific("GreenHaloID");
    if (!matches(greenHaloID, null, undefined, "")) {

        logDebug("Already in Green Halo");
        return;
    }

    var projectType = getAppSpecific("Project Type");
    if (matches(projectType, null, undefined, "")) {
        var message = "'Project Type' is not selected";
        logDebug(message);
        return message;
    }
    var typeOfUse = getAppSpecific("Type of Use");
    if (matches(typeOfUse, null, undefined, "")) {
        var message = "'Type of Use' is not selected <br>";
        logDebug(message);
        return message;
    }

    var wmPlan = new WasteManagementPlan();

    var contacts = getContactArray();
    //company_name
    var companyName = "";

    for (x in contacts) {

        if (contacts[x].contactType == "Applicant") {


            if (contacts[x].businessName) {

                companyName = contacts[x].businessName;
            }
            else {

                companyName = contacts[x].firstName + " " + contacts[x].lastName;
            }
            wmPlan.companyName = companyName;

            //phone 
            //TODO: if null check phone 2. One should be required
            if (contacts[x].phone1) {

                wmPlan.phone = contacts[x].phone1;
            }
            else if (contacts[x].phone2) {

                wmPlan.phone = contacts[x].phone2;
            }
            else {

                wmPlan.phone = "NA";
            }


            //email

            wmPlan.email = contacts[x].email;


        }
    }

    //Get address data, primary
    //TODO: If no primary need to get first address
    var addr = getPrimaryCapAddress(capId);

    if (!matches(addr, null, undefined)) {
        //Need to clean up the formatting of concatenating these values
        var fullStreet = "";
        if (!matches(addr.houseNumberStart, null, undefined, ""))
            fullStreet += addr.houseNumberStart;
        if (!matches(addr.streetDirection, null, undefined, ""))
            fullStreet += " " + addr.streetDirection;
        if (!matches(addr.streetName, null, undefined, ""))
            fullStreet += " " + addr.streetName;
        if (!matches(addr.streetSuffix, null, undefined, ""))
            fullStreet += " " + addr.streetSuffix;

        if (fullStreet == "") {

            fullStreet = "NA";
        }
        wmPlan.street = fullStreet;
        wmPlan.apt_suite = addr.unitStart;
        wmPlan.city = "";
        wmPlan.state = addr.state;
        wmPlan.zipcode = addr.zip;
    }
    else {

        wmPlan.street = "NA";
        wmPlan.apt_suite = "NA";
        wmPlan.city = "NA";
        wmPlan.state = "NA";
        wmPlan.zipcode = "NA";
    }

    wmPlan.projectStartDate = sysDateMMDDYYYY;
    //TODO: They said to use built in end date but I cannot find it. Using 1 year for now
    wmPlan.projectEndDate = dateAdd(wmPlan.projectStartDate, "365");
    // default 0 to 1 as required on Green Halo website
    if (estValue == 0) {
        wmPlan.value = 1;
        wmPlan.permitValue = 1;
    }
    else {
        wmPlan.value = estValue;
        wmPlan.permitValue = estValue;
    }
    //TODO: Clarify which sq ft to use
    wmPlan.squareFootage = getAppSpecific("Building Sq Ft");
    wmPlan.PermitSqFootage = getAppSpecific("Building Sq Ft");
    var wDesc = workDescGet(capId);
    //TODO: Can we send empty string is this is empty?
    if (wDesc) {
        wmPlan.description = wDesc;
        wmPlan.permitNote = wDesc;
    }
    else {

        wmPlan.description = "NA";
        wmPlan.permitNote = "NA";
    }

    // project name
    wmPlan.projectName = projectType;

    wmPlan.projectType = projectType;
    wmPlan.permitProjectType = projectType;
    wmPlan.buildingType = typeOfUse;

    //wmPlan.password = " ";
    wmPlan.permit = capIDString;

    var requestSendResult = wmPlan.createProject();
    comment(requestSendResult);
    //aa.print(JSON.stringify(JSON.parse(requestSendResult)));

    var ghResponse = JSON.parse(requestSendResult);
    aa.print(ghResponse);
    //helperObjectInfo(ghResponse);
    logDebug(JSON.stringify(ghResponse));
    if (ghResponse.status == "success") {
        logDebug("Green Halo WMP Id: " + ghResponse.wmp_number)
        editAppSpecific("GreenHaloID", ghResponse.wmp_number);
        //editTaskSpecific("Permit Issuance", "WMP ID", ghResponse.wmp_number);
    } else {
        //handle errors
        logDebug("Error");
    }

    return ghResponse.status;
}

function getWMProjectAndBuildingType() {
    //Return object params
    var projectType, buildingType;
    //App type matching
    var cap = aa.cap.getCap(capId).getOutput();
    var appType = String(cap.getCapType());
    //ASIs
    var majorDemolitionASI = getAppSpecific("Major demolition");
    var minorDemolitionASI = getAppSpecific("Minor demolition");
    var typeOfMajorDemo = getAppSpecific("Is this a residential, mixed use, or commercial project?");
    var typeOfMinorDemo = getAppSpecific("What type of minor demolition is being performed?");
    var typeOfResStruct = getAppSpecific("What type of residential structure is being constructed?");
    var projectTypeASI = getAppSpecific("Project Type");
    var proposedOccType = getAppSpecific("Proposed Occupancy type?");
    var typeOfResBuilding = getAppSpecific("What type of residential building is this structure?");
    var resAddition = getAppSpecific("Addition");
    var resAlteration = getAppSpecific("Alteration");


    logDebug("appType(" + appType + ")");
    switch (appType) {
        case "Building/Residential/Demolition/NA":
            projectType = "Demolition/Deconstruction";
            if (majorDemolitionASI == "CHECKED") {
                if (typeOfMajorDemo == "Commercial / Agricultural") {
                    buildingType = "Commercial";
                } else if (typeOfMajorDemo == "Residential (Multi Family)") {
                    buildingType = "Multi-Family";
                } else if (typeOfMajorDemo == "Mixed Use") {
                    buildingType = "Mixed Use Commercial - Residential";
                } else if (typeOfMajorDemo == "Residential (Single Family)") {
                    buildingType = "Single Family";
                }
            } else if (minorDemolitionASI == "CHECKED") {
                if (typeOfMinorDemo == "Accessory structures 120 sq ft - 250 sq ft") {
                    buildingType = "Accessory Structure";
                }
            }
            break;

        case "Building/Residential/New/NA":
            projectType = "New Construction";
            if (typeOfResStruct == "ADU (Detached)"
                || typeOfResStruct == "Apartment (With attached ADU)"
                || typeOfResStruct == "Condominium (With attached ADU)"
                || typeOfResStruct == "Apartment"
                || typeOfResStruct == "Condominium"
                || typeOfResStruct == "Townhome"
                || typeOfResStruct == "Townhome (With attached ADU)") {
                buildingType = "Residential";
            } else if (typeOfResStruct == "Duplex"
                || typeOfResStruct == "Duplex (With Attached ADU) "
                || typeOfResStruct == "Four-Plex"
                || typeOfResStruct == "Four-Plex (With attached ADU)"
                || typeOfResStruct == "Tri-Plex"
                || typeOfResStruct == "Tri-Plex (With attached ADU)") {
                buildingType = "Multi-Family";
            } else if (typeOfResStruct == "Single Family Dwelling (With Attached ADU)"
                || typeOfResStruct == "Single Family Dwelling (With JADU and attached ADU)"
                || typeOfResStruct == "Single Family Dwelling (With JADU)"
                || typeOfResStruct == "Single Family Dwelling") {
                buildingType = "Single Family";
            }
            break;
        case "Building/Residential/Detached Structure/Full Utilities":
            if (typeOfResStruct && typeOfResStruct != null && typeOfResStruct != "") {
                projectType = "New Construction";
                buildingType = "Accessory Structure";
            }
            break;
        case "Building/Residential/Addition/NA":
            var newArea = Number(getAppSpecific("New square footage of conditioned space being added to residence (sq ft)"));
            var proposedArea = Number(getAppSpecific("Proposed cumulative square footage of conditioned space"));
            var remodeledArea = Number(getAppSpecific("What is the cumulative square footage of the areas being remodeled?"));
            if (resAddition == "CHECKED") {
                projectType = "Addition";
                if (newArea > 120) {
                    if (typeOfResBuilding == "ADU"
                        || typeOfResBuilding == "Apartment"
                        || typeOfResBuilding == "Condominium"
                        || typeOfResBuilding == "Townhome") {
                        buildingType = "Residential";
                    } else if (typeOfResBuilding == "Duplex"
                        || typeOfResBuilding == "Triplex") {
                        buildingType = "Multi-Family";
                    } else if (typeOfResBuilding == "Single family") {
                        buildingType = "Single Family";
                    }
                }
            } else if (resAlteration == "CHECKED") {
                projectType = "Alteration";
                if (remodeledArea > 500) {
                    if (typeOfResBuilding == "Single family") {
                        buildingType = "Single Family";
                    } else if (typeOfResBuilding == "ADU") {
                        buildingType = "Residential";
                    } else {
                        buildingType = "Multi-Family";
                    }
                }
            }
            break;
        case "Building/Residential/Bath Kitchen Remodel/NA":
            projectType = "Alteration";
            var bathRemodel = getAppSpecific("Bath remodel");
            var kitchenRemodel = getAppSpecific("Kitchen Remodel");
            var remodeledArea = Number(getAppSpecific("What is the cumulative square footage of the areas being remodeled?"));
            if (kitchenRemodel == "CHECKED" || (bathRemodel == "CHECKED" && remodeledArea > 500)) {
                if (typeOfResBuilding == "Single family (detached)") {
                    buildingType = "Single Family";
                } else if (typeOfResBuilding == "ADU") {
                    buildingType = "Residential";
                } else {
                    buildingType = "Multi-Family";
                }
            }

            break;
        case "Building/Commercial/Demolition/NA"://Prospective: Commercial Demolition
            projectType = "Demolition/Deconstruction";
            if (majorDemolitionASI == "CHECKED") {
                if (typeOfMajorDemo == "Hotel & Motel") {
                    buildingType = "Hotel & Motel";
                } else if (typeOfMajorDemo == "Industrial") {
                    buildingType = "Industrial";
                } else {
                    if (projectTypeASI == "Office") {
                        buildingType = "Industrial";
                    } else if (projectTypeASI == "Retail") {
                        buildingType = "Retail";
                    } else if (projectTypeASI == "Shopping Center") {
                        buildingType = "Shopping Center";
                    } else if (projectTypeASI == "Warehouse") {
                        buildingType = "Warehouse";
                    }
                }
            }

            break;
        case "Building/Commercial/New/NA"://Prospective: Commercial New Structure
             //st/ct updated
            projectType = "New Construction";
            buildingType = "Commercial";
            /*if (projectTypeASI == "Hotel / Motel / Boarding House / Transient") {
                buildingType = "Hotel & Motel";
            } else if (projectTypeASI == "Factory / Industrial") {
                buildingType = "Industrial";
            } else if (projectTypeASI == "Duplex"
                || projectTypeASI == "Duplex (With Attached ADU) "
                || projectTypeASI == "Four-Plex"
                || projectTypeASI == "Four-Plex (With attached ADU)"
                || projectTypeASI == "Tri-Plex"
                || projectTypeASI == "Tri-Plex (With attached ADU)") {
                buildingType = "Multi-Family";
            } else if (projectTypeASI == "Business / Office Building") {
                buildingType = "Office";
            } else if (projectTypeASI == "Mercantile / Retail / Motor Vehicle Repair & Refueling Stations") {
                buildingType = "Retail";
            } else if (projectTypeASI == "Storage / Warehouse / Parking Structure") {
                buildingType = "Warehouse";
            } else if (projectTypeASI == "Commercial Accessory Buildings") {
                buildingType = "Accessory Structure";
            } else {
                if (x == x) {

                } else {
                    buildingType = "Commercial";
                }
            }*/
            break;
        case "Building/Commercial/Add Alt Imp/NA"://Prospective: Commercial Additions / Alterations / Tenant Improvements
            //st/ct updated
            /*var remodeledArea = Number(getAppSpecific("What is the cumulative square footage of the areas being remodeled?"));
            var proposedArea = Number(getAppSpecific("Proposed Square Footage of the Addition to the Existing Building:"));
            if (flProposedArea > 1) {
                projectType = "Addition";
            } else if (remodeledArea > 0 && proposedArea < 1) {
                projectType = "Tenant Improvement";
            }*/
            var comAddition = getAppSpecific("Addition");
            var comAlteration = getAppSpecific("Alteration");

            if (comAddition == "CHECKED") {
                projectType = "Addition";
            } else if (resAlteration == "CHECKED") {
                projectType = "Alteration";
            }

            /*if (projectTypeASI == "Hotel / Motel / Boarding House / Transient") {
                buildingType = "Hotel & Motel";
            } else if (projectTypeASI == "Factory / Industrial") {
                buildingType = "Industrial";
            } else if (projectTypeASI == "Business / Office Building") {
                buildingType = "Office";
            } else if (projectTypeASI == "Mercantile / Retail / Motor Vehicle Repair & Refueling Stations") {
                buildingType = "Retail";
            } else if (projectTypeASI == "Storage / Warehouse / Parking Structure") {
                buildingType = "Warehouse";
            } else if (projectTypeASI == "Commercial Accessory Buildings") {
                buildingType = "Accessory Structure";
            } else {
                buildingType = "Commercial";
            }*/
            buildingType = "Commercial";
            break;
        default:
            logDebug("Record type not found!");
            break;
    }

    logDebug("projectType('" + projectType + "')");
    logDebug("buildingType('" + buildingType + "')");

    return { projectType: projectType, buildingType: buildingType };
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
/*----------------------------------------------------------------------------------------------------/
| doConfigurableScriptActions
| A dummy function to prevent errors
| Created by Jei Yang 02/07/2022
/----------------------------------------------------------------------------------------------------*/
function doConfigurableScriptActions() {

    Avo_LogDebug("doConfigurableScriptActions()", 2);
    
}
function emailContact2(mSubj, mText)   // optional: Contact Type, default Applicant
{
    var replyTo = "noreply@smcgov.org";
    var contactType = "Applicant"
    var emailAddress = "";

    if (arguments.length == 3) contactType = arguments[2]; // use contact type specified

    var capContactResult = aa.people.getCapContactByCapID(capId);
    if (capContactResult.getSuccess()) {
        var Contacts = capContactResult.getOutput();
        for (yy in Contacts)
            if (contactType.equals(Contacts[yy].getCapContactModel().getPeople().getContactType()))
                if (Contacts[yy].getEmail() != null)
                    emailAddress = "" + Contacts[yy].getEmail();
    }

    if (emailAddress.indexOf("@") > 0) {
        aa.sendMail(replyTo, emailAddress, "", mSubj, mText);
        logDebug("Successfully sent email to " + contactType);
    }
    else
        logDebug("Couldn't send email to " + contactType + ", no valid email address");
}
/*******
This would be called from InspectionMultipleScheduleAfter and/or InspectionScheduleAfter
Assumes you have a standard choice called DEPARTMENT_INFORMATION that stores department spcific information for the email. ex:
Standard Choice Value: Building Department
Value Desc: $$DepartmentName$$:Building Department|$$DepartmentAddress$$:123 S Overhere St.|$$DepartmentCity$$:Salt Lake City|$$DepartmentState$$:UT|$$DepartmentContactPhone$$:999-999-9999|$$DepartmentContactEmail$$:buildingdept@ut.com
*************************/
function emailNotificationNoAttachmentRemoteInspection(contactTypesList, notificationTemplateOnsite, notificationTemplateRemote, vCapId) {
    //contact types separated by commas
    contactTypes = new Array;
    contactTypes = contactTypesList.split(",")
    var capId = vCapId
    var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
    if (!matches(acaURLDefault, null, undefined, ""))
        acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
    else
        acaURLDefault = null;

    var acaURL = acaURLDefault;
    report = null;
    contactArray = new Array;
    contactArray = getContactArray(capId);
    for (iCon in contactArray) {
        if (exists(contactArray[iCon]["contactType"], contactTypes)) {
            params = aa.util.newHashtable();
            tContact = contactArray[iCon];
            getRecordParams4Notification(params);
            getACARecordParam4Notification(params, acaURL, capId);
            getInspectionScheduleParams4Notification(params)
            addParameter(params, "$$ContactName$$", tContact["firstName"] + " " + tContact["lastName"]);
            getPrimaryAddressLineParam4Notification(params);
            getDepartmentParams4Notification(params, "Building Department");
            if (inspSchedDate) {
                addParameter(params, "$$inspSchedDate$$", inspSchedDate);
            }

            var hasRemoteInspectorURL = false;

            if (!matches(params.get("$$inspectorURL$$"), "NOT APPLICABLE - WILL BE ONSITE", "")) {
                hasRemoteInspectorURL = true;
            }


            if (!matches(tContact["email"], null, "", undefined)) {
                if (hasRemoteInspectorURL) {
                    sendNotification("civic.solutions@accela.com", tContact["email"], "", notificationTemplateRemote, params, null);
                }
                else {
                    sendNotification("civic.solutions@accela.com", tContact["email"], "", notificationTemplateOnsite, params, null);
                }
            }
        }
    }
}
/*----------------------------------------------------------------------------------------------------/
| GIS Related Functions
/----------------------------------------------------------------------------------------------------*/
/*******************************************************
| Script/Function: evaluateResult()
| Created by: Mike Buell
| Created on: 02June17
| Usage: put together string of value
| Modified by: 
| Modified on: 
*********************************************************/
function evaluateResult(valueToSet, attributeName) {
    strValueToDisplay = "NA";

    if (valueToSet.length == 1) {
        strValueToDisplay = valueToSet[0][attributeName];
    }
    else if (valueToSet.length > 1) {
        strValueToDisplay = "";

        if (attributeName == "Shape_Area") {
            strValueToDisplay = Math.round(valueToSet[0][attributeName]);
        } else {
            for (var x in valueToSet) {
                //if (strValueToDisplay.indexOf(valueToSet[x][attributeName]) == -1) {
                strValueToDisplay = strValueToDisplay + valueToSet[x][attributeName] + " | ";
                //}
            }

            strValueToDisplay = strValueToDisplay.substring(0, strValueToDisplay.length - 3)
        }
    }

    return strValueToDisplay;
}
function externalLP_CA_SMCGOV(licNum, rlpType, doPopulateRef, doPopulateTrx, itemCap) {

    /*
	Version: 3.2

	Usage:

		licNum			:  Valid CA license number.   Non-alpha, max 8 characters.  If null, function will use the LPs on the supplied CAP ID
		rlpType			:  License professional type to use when validating and creating new LPs
		doPopulateRef 	:  If true, will create/refresh a reference LP of this number/type
		doPopulateTrx 	:  If true, will copy create/refreshed reference LPs to the supplied Cap ID.   doPopulateRef must be true for this to work
		itemCap			:  If supplied, licenses on the CAP will be validated.  Also will be refreshed if doPopulateRef and doPopulateTrx are true

	returns: non-null string of status codes for invalid licenses

	examples:

	appsubmitbefore   (will validate the LP entered, if any, and cancel the event if the LP is inactive, cancelled, expired, etc.)
	===============
	true ^ cslbMessage = "";
	CAELienseNumber ^ cslbMessage = externalLP_CA(CAELienseNumber,false,false,CAELienseType,null);
	cslbMessage.length > 0 ^ cancel = true ; showMessage = true ; comment(cslbMessage)

	appsubmitafter  (update all CONTRACTOR LPs on the CAP and REFERENCE with data from CSLB.  Link the CAP LPs to REFERENCE.   Pop up a message if any are inactive...)
	==============
	true ^ 	cslbMessage = externalLP_CA(null,true,true,"CONTRACTOR",capId)
	cslbMessage.length > 0 ^ showMessage = true ; comment(cslbMessage);

	Note;  Custom LP Template Field Mappings can be edited in the script below
	*/

    var returnMessage = "";

    var workArray = new Array();
    if (licNum)
        workArray.push(String(licNum));

    if (itemCap) {
        var capLicenseResult = aa.licenseScript.getLicenseProf(itemCap);
        if (capLicenseResult.getSuccess()) {
            var capLicenseArr = capLicenseResult.getOutput();
        }
        else { logDebug("**ERROR: getting lic prof: " + capLicenseResult.getErrorMessage()); return false; }

        if (capLicenseArr == null || !capLicenseArr.length) { logDebug("**WARNING: no licensed professionals on this CAP"); }
        else {
            for (var thisLic in capLicenseArr)
                if (capLicenseArr[thisLic].getLicenseType() == rlpType)
                    workArray.push(capLicenseArr[thisLic]);
        }
    }
    else
        doPopulateTrx = false; // can't do this without a CAP;

    for (var thisLic = 0; thisLic < workArray.length; thisLic++) {
        var licNum = workArray[thisLic];
        var licObj = null;
        var isObject = false;

        if (typeof (licNum) == "object")  // is this one an object or string?
        {
            licObj = licNum;
            licNum = licObj.getLicenseNbr();
            isObject = true;
        }

        // Make the call to the California State License Board

        // var saxBuilder = aa.proxyInvoker.newInstance("org.jdom.input.SAXBuilder").getOutput();
        // var aURLArgList = new Array()
        //aURLArgList[0] = "https://www2.cslb.ca.gov/IVR/License+Detail.aspx?LicNum=" + licNum;
        // var oURL = aa.proxyInvoker.newInstance("java.net.URL",aURLArgList).getOutput();
        // var document = saxBuilder.build(oURL); //("https://www2.cslb.ca.gov/IVR/License+Detail.aspx?LicNum=" + licNum);
        // var root = document.getRootElement();
        //11-27 aded this section for CSLB update
        var document;
        var root;
        var aURLArgList = "https://www2.cslb.ca.gov/IVR/License+Detail.aspx?LicNum=" + licNum;
        var vOutObj = aa.httpClient.get(aURLArgList);
        if (vOutObj.getSuccess()) {
            var vOut = vOutObj.getOutput();
            var sr = aa.proxyInvoker.newInstance("java.io.StringBufferInputStream", new Array(vOut)).getOutput();
            var saxBuilder = aa.proxyInvoker.newInstance("org.jdom.input.SAXBuilder").getOutput();
            document = saxBuilder.build(sr);
            root = document.getRootElement();
        }
        else {
            return;
        }



        var errorNode = root.getChild("Error");
        if (errorNode) {
            //logDebug("Error for license " + licNum + " : " + errorNode.getText().replace(/\+/g, " "));
            returnMessage += "License " + licNum + " : " + errorNode.getText(); //.replace(/\+/g, " ") + " ";
            continue;
        }

        var lpBiz = root.getChild("BusinessInfo");
        var lpStatus = root.getChild("PrimaryStatus");
        var lpClass = root.getChild("Classifications");
        var lpBonds = root.getChild("ContractorBond");
        var lpWC = root.getChild("WorkersComp");

        // Primary Status
        // 3 = expired, 10 = good, 11 = inactive, 1 = canceled.   We will ignore all but 10 and return text.
        var stas = lpStatus.getChildren();
        for (var i = 0; i < stas.size(); i++) {
            var sta = stas.get(i);

            if (sta.getAttribute("Code").getValue() != "10")
                returnMessage += "License:" + licNum + ", " + sta.getAttribute("Desc").getValue() + " ";
        }

        if (doPopulateRef)  // refresh or create a reference LP
        {
            var updating = false;

            // check to see if the licnese already exists...if not, create.

            var newLic = getRefLicenseProf(licNum)

            if (newLic) {
                updating = true;
                logDebug("Updating existing Ref Lic Prof : " + licNum);
            }
            else {
                var newLic = aa.licenseScript.createLicenseScriptModel();
            }

            if (isObject)  // update the reference LP with data from the transactional, if we have some.
            {
                if (licObj.getAddress1()) newLic.setAddress1(licObj.getAddress1());
                if (licObj.getAddress2()) newLic.setAddress2(licObj.getAddress2());
                if (licObj.getAddress3()) newLic.setAddress3(licObj.getAddress3());
                if (licObj.getAgencyCode()) newLic.setAgencyCode(licObj.getAgencyCode());
                if (licObj.getBusinessLicense()) newLic.setBusinessLicense(licObj.getBusinessLicense());
                if (licObj.getBusinessName()) newLic.setBusinessName(licObj.getBusinessName());
                if (licObj.getBusName2()) newLic.setBusinessName2(licObj.getBusName2());
                if (licObj.getCity()) newLic.setCity(licObj.getCity());
                if (licObj.getCityCode()) newLic.setCityCode(licObj.getCityCode());
                if (licObj.getContactFirstName()) newLic.setContactFirstName(licObj.getContactFirstName());
                if (licObj.getContactLastName()) newLic.setContactLastName(licObj.getContactLastName());
                if (licObj.getContactMiddleName()) newLic.setContactMiddleName(licObj.getContactMiddleName());
                if (licObj.getCountryCode()) newLic.setContryCode(licObj.getCountryCode());
                if (licObj.getEmail()) newLic.setEMailAddress(licObj.getEmail());
                if (licObj.getCountry()) newLic.setCountry(licObj.getCountry());
                if (licObj.getEinSs()) newLic.setEinSs(licObj.getEinSs());
                if (licObj.getFax()) newLic.setFax(licObj.getFax());
                if (licObj.getFaxCountryCode()) newLic.setFaxCountryCode(licObj.getFaxCountryCode());
                if (licObj.getHoldCode()) newLic.setHoldCode(licObj.getHoldCode());
                if (licObj.getHoldDesc()) newLic.setHoldDesc(licObj.getHoldDesc());
                if (licObj.getLicenseExpirDate()) newLic.setLicenseExpirationDate(licObj.getLicenseExpirDate());
                if (licObj.getLastRenewalDate()) newLic.setLicenseLastRenewalDate(licObj.getLastRenewalDate());
                if (licObj.getLicesnseOrigIssueDate()) newLic.setLicOrigIssDate(licObj.getLicesnseOrigIssueDate());
                if (licObj.getPhone1()) newLic.setPhone1(licObj.getPhone1());
                if (licObj.getPhone1CountryCode()) newLic.setPhone1CountryCode(licObj.getPhone1CountryCode());
                if (licObj.getPhone2()) newLic.setPhone2(licObj.getPhone2());
                if (licObj.getPhone2CountryCode()) newLic.setPhone2CountryCode(licObj.getPhone2CountryCode());
                if (licObj.getSelfIns()) newLic.setSelfIns(licObj.getSelfIns());
                if (licObj.getState()) newLic.setState(licObj.getState());
                if (licObj.getSuffixName()) newLic.setSuffixName(licObj.getSuffixName());
                if (licObj.getZip()) newLic.setZip(licObj.getZip());
            }

            // Now set data from the CSLB

            if (lpBiz.getChild("Name").getText() != "") newLic.setBusinessName(unescape(lpBiz.getChild("Name").getText()).replace(/\+/g, " "));
            if (lpBiz.getChild("Addr1").getText() != "") newLic.setAddress1(unescape(lpBiz.getChild("Addr1").getText()).replace(/\+/g, " "));
            if (lpBiz.getChild("Addr2").getText() != "") newLic.setAddress2(unescape(lpBiz.getChild("Addr2").getText()).replace(/\+/g, " "));
            if (lpBiz.getChild("City").getText() != "") newLic.setCity(unescape(lpBiz.getChild("City").getText()).replace(/\+/g, " "));
            if (lpBiz.getChild("State").getText() != "") newLic.setState(unescape(lpBiz.getChild("State").getText()).replace(/\+/g, " "));
            if (lpBiz.getChild("Zip").getText() != "") newLic.setZip(unescape(lpBiz.getChild("Zip").getText()).replace(/\+/g, " "));
            if (lpBiz.getChild("BusinessPhoneNum").getText() != "") newLic.setPhone1(unescape(stripNN(lpBiz.getChild("BusinessPhoneNum").getText()).replace(/\+/g, " ")));
            newLic.setAgencyCode(aa.getServiceProviderCode());
            newLic.setAuditDate(sysDate);
            newLic.setAuditID(currentUserID);
            newLic.setAuditStatus("A");
            newLic.setLicenseType(rlpType);
            newLic.setLicState("CA");  // hardcode CA
            newLic.setStateLicense(licNum);

            if (lpBiz.getChild("IssueDt").getText()) newLic.setLicenseIssueDate(aa.date.parseDate(lpBiz.getChild("IssueDt").getText()));
            if (lpBiz.getChild("ExpireDt").getText()) newLic.setLicenseExpirationDate(aa.date.parseDate(lpBiz.getChild("ExpireDt").getText()));
            if (lpBiz.getChild("ReissueDt").getText()) newLic.setLicenseLastRenewalDate(aa.date.parseDate(lpBiz.getChild("ReissueDt").getText()));

            var wcs = root.getChild("WorkersComp").getChildren();

            for (var j = 0; j < wcs.size(); j++) {
                wc = wcs.get(j);

                if (wc.getAttribute("PolicyNo").getValue()) newLic.setWcPolicyNo(wc.getAttribute("PolicyNo").getValue());
                if (wc.getAttribute("InsCoCde").getValue()) newLic.setWcInsCoCode(unescape(wc.getAttribute("InsCoCde").getValue()));
                if (wc.getAttribute("WCEffDt").getValue()) newLic.setWcEffDate(aa.date.parseDate(wc.getAttribute("WCEffDt").getValue()))
                if (wc.getAttribute("WCExpDt").getValue()) newLic.setWcExpDate(aa.date.parseDate(wc.getAttribute("WCExpDt").getValue()))
                if (wc.getAttribute("WCCancDt").getValue()) newLic.setWcCancDate(aa.date.parseDate(wc.getAttribute("WCCancDt").getValue()))
                if (wc.getAttribute("Exempt").getValue() == "E") newLic.setWcExempt("Y"); else newLic.setWcExempt("N");

                break; // only use first
            }

            //
            // Do the refresh/create and get the sequence number
            //
            if (updating) {
                var myResult = aa.licenseScript.editRefLicenseProf(newLic);
                var licSeqNbr = newLic.getLicSeqNbr();
            }
            else {
                var myResult = aa.licenseScript.createRefLicenseProf(newLic);

                if (!myResult.getSuccess()) {
                    logDebug("**WARNING: can't create ref lic prof: " + myResult.getErrorMessage());
                    continue;
                }

                var licSeqNbr = myResult.getOutput()
            }

            logDebug("Successfully added/updated License No. " + licNum + ", Type: " + rlpType + " Sequence Number " + licSeqNbr);


            /////
            /////  Attribute Data -- first copy from the transactional LP if it exists
            /////


            if (isObject)  // update the reference LP with attributes from the transactional, if we have some.
            {
                var attrArray = licObj.getAttributes();

                if (attrArray) {
                    for (var k in attrArray) {
                        var attr = attrArray[k];
                        editRefLicProfAttribute(licNum, attr.getAttributeName(), attr.getAttributeValue());
                    }
                }
            }

            /////
            /////  Attribute Data
            /////
            /////  NOTE!  Agencies may have to configure template data below based on their configuration.  Please note all edits
            /////

            var cbs = root.getChild("Classifications").getChildren();
            for (var m = 0; m < cbs.size(); m++) {
                cb = cbs.get(m);

                if (m == 0) {
                    editRefLicProfAttribute(licNum, "CLASS CODE 1", cb.getAttribute("Code").getValue());
                    editRefLicProfAttribute(licNum, "CLASS DESC 1", unescape(cb.getAttribute("Desc").getValue()).replace(/\+/g, " "));
                }

                if (m == 1) {
                    editRefLicProfAttribute(licNum, "CLASS CODE 2", cb.getAttribute("Code").getValue());
                    editRefLicProfAttribute(licNum, "CLASS DESC 2", unescape(cb.getAttribute("Desc").getValue()).replace(/\+/g, " "));
                }
                if (m == 2) {
                    editRefLicProfAttribute(licNum, "CLASS CODE 3", cb.getAttribute("Code").getValue());
                    editRefLicProfAttribute(licNum, "CLASS DESC 3", unescape(cb.getAttribute("Desc").getValue()).replace(/\+/g, " "));
                }

                if (m == 3) {
                    editRefLicProfAttribute(licNum, "CLASS CODE 4", cb.getAttribute("Code").getValue());
                    editRefLicProfAttribute(licNum, "CLASS DESC 4", unescape(cb.getAttribute("Desc").getValue()).replace(/\+/g, " "));
                }
                if (m == 4) {
                    editRefLicProfAttribute(licNum, "CLASS CODE 5", cb.getAttribute("Code").getValue());
                    editRefLicProfAttribute(licNum, "CLASS DESC 5", unescape(cb.getAttribute("Desc").getValue()).replace(/\+/g, " "));
                }
            }

            var bos = root.getChild("ContractorBond").getChildren();

            for (var n = 0; n < bos.size(); n++) {
                var bo = bos.get(n);
                if (bo.getAttribute("BondAmt").getValue()) editRefLicProfAttribute(licNum, "BOND AMOUNT", unescape(bo.getAttribute("BondAmt").getValue()));
                if (bo.getAttribute("BondCancDt").getValue()) editRefLicProfAttribute(licNum, "BOND EXPIRATION", unescape(bo.getAttribute("BondCancDt").getValue()));

                if (bo.getAttribute("SuretyTp").getValue()) editRefLicProfAttribute(licNum, "BOND SURETY TYPE", unescape(bo.getAttribute("SuretyTp").getValue()));
                if (bo.getAttribute("InsCoCde").getValue()) editRefLicProfAttribute(licNum, "BOND CODE", unescape(bo.getAttribute("InsCoCde").getValue()));
                if (bo.getAttribute("InsCoName").getValue()) editRefLicProfAttribute(licNum, "BOND INSURANCE COMPANY", unescape(bo.getAttribute("InsCoName").getValue()).replace(/\+/g, " "));
                if (bo.getAttribute("BondNo").getValue()) editRefLicProfAttribute(licNum, "BOND NUMBER", unescape(bo.getAttribute("BondNo").getValue()));
                if (bo.getAttribute("BondEffDt").getValue()) editRefLicProfAttribute(licNum, "BOND EFFECTIVE DATE", unescape(bo.getAttribute("BondEffDt").getValue()));



                // Currently unused but could be loaded into custom attributes.
                /*
                                aa.print("Bond Surety Type       : " + unescape(bo.getAttribute("SuretyTp").getValue()))
                                aa.print("Bond Code              : " + unescape(bo.getAttribute("InsCoCde").getValue()))
                                aa.print("Bond Insurance Company : " + unescape(bo.getAttribute("InsCoName").getValue()).replace(/\+/g," "))
                                aa.print("Bond Number            : " + unescape(bo.getAttribute("BondNo").getValue()))
                                aa.print("Bond Amount            : " + unescape(bo.getAttribute("BondAmt").getValue()))
                                aa.print("Bond Effective Date    : " + unescape(bo.getAttribute("BondEffDt").getValue()))
                                aa.print("Bond Cancel Date       : " + unescape(bo.getAttribute("BondCancDt").getValue()))
                */
                break; // only use first bond
            }

            if (doPopulateTrx) {
                var lpsmResult = aa.licenseScript.getRefLicenseProfBySeqNbr(servProvCode, licSeqNbr)
                if (!lpsmResult.getSuccess()) { logDebug("**WARNING error retrieving the LP just created " + lpsmResult.getErrorMessage()); }

                var lpsm = lpsmResult.getOutput();

                // Remove from CAP

                var isPrimary = false;

                for (var currLic in capLicenseArr) {
                    var thisLP = capLicenseArr[currLic];
                    if (thisLP.getLicenseType() == rlpType && thisLP.getLicenseNbr() == licNum) {
                        logDebug("Removing license: " + thisLP.getLicenseNbr() + " from CAP.  We will link the new reference LP");
                        if (thisLP.getPrintFlag() == "Y") {
                            logDebug("...remove primary status...");
                            isPrimary = true;
                            thisLP.setPrintFlag("N");
                            aa.licenseProfessional.editLicensedProfessional(thisLP);
                        }
                        var remCapResult = aa.licenseProfessional.removeLicensedProfessional(thisLP);
                        if (capLicenseResult.getSuccess()) {
                            logDebug("...Success.");
                        }
                        else { logDebug("**WARNING removing lic prof: " + remCapResult.getErrorMessage()); }
                    }
                }

                // add the LP to the CAP
                var asCapResult = aa.licenseScript.associateLpWithCap(itemCap, lpsm)
                if (!asCapResult.getSuccess()) { logDebug("**WARNING error associating CAP to LP: " + asCapResult.getErrorMessage()) }
                else { logDebug("Associated the CAP to the new LP") }

                // Now make the LP primary again
                if (isPrimary) {
                    var capLps = getLicenseProfessional(itemCap);

                    for (var thisCapLpNum in capLps) {
                        if (capLps[thisCapLpNum].getLicenseNbr().equals(licNum)) {
                            var thisCapLp = capLps[thisCapLpNum];
                            thisCapLp.setPrintFlag("Y");
                            aa.licenseProfessional.editLicensedProfessional(thisCapLp);
                            logDebug("Updated primary flag on Cap LP : " + licNum);

                            // adding this return will cause the test script to work without error, even though this is the last statement executed
                            //if (returnMessage.length > 0) return returnMessage;
                            //else return null;

                        }
                    }
                }
            } // do populate on the CAP
        } // do populate on the REF
    } // for each license

    if (returnMessage.length > 0) return returnMessage;
    else return null;

} // end function
/*----------------------------------------------------------------------------------------------------/
| GIS Related Functions
/----------------------------------------------------------------------------------------------------*/
/*******************************************************
| Script/Function: femaFloodZoneCheck()
| Created by: Mike Buell
| Created on: 03Sept17
| Usage: update FEMA code and add condition if FEMA zone encountered
| Modified by: 
| Modified on: 
*********************************************************/
function femaFloodZoneCheck() {
    //get the Accela parcel # 
    var parcelNumber = getParcel();
    logDebug("The parcel number is - " + parcelNumber);
    var gisService = "AGIS_SMCGOV";
    var valueToSet = new Array();
    var strMessage = "";
    var strValueToDisplay = "NA";

    if (parcelNumber) {
        //now check to ensure Accela parcel exists in ESRI
        var gisParcel = findParcelInGIS(parcelNumber);

        //if we found parcel - add the parcel as a GIS Object
        if (gisParcel) {
            var gisObjectResult = aa.gis.addCapGISObject(capId, gisService, "Active Parcels", parcelNumber);
            if (gisObjectResult.getSuccess()) {
                //logDebug("Added GIS object - Active Parcels");
                //since add now get the gis objects
                var gisObjs = aa.gis.getCapGISObjects(capId);
                if (gisObjs.getSuccess()) {
                    var fGisObjs = gisObjs.getOutput();
                }

                //look for the Active Parcels GIS object
                for (var a1 in fGisObjs) {
                    //logDebug("The GIS object is - " + fGisObjs[a1].getGisTypeId());
                    if (fGisObjs[a1].getGisTypeId() == "Active Parcels") {
                        //logDebug("Found the Active Parcels GIS object");
                        fldZoneValueToSet = getGISBufferInfoCustom(gisService, "FEMA Flood Zones", -1, "FLD_ZONE");
                        spcZoneValueToSet = getGISBufferInfoCustom(gisService, "FEMA Flood Zones", -1, "SFHA_TF");
                        strValueToDisplay = evaluateResult(fldZoneValueToSet, "FLD_ZONE");

                        //possible update only if we received something from the buffer
                        if (strValueToDisplay != "NA" && fldZoneValueToSet.length >= 1) {
                            var bolFoundFEMA = false;
                            //check the flood zones values returned
                            //if special zone then set found FEMA to true
                            for (var x in spcZoneValueToSet) {
                                if (spcZoneValueToSet[x]["SFHA_TF"] == "T") {
                                    bolFoundFEMA = true;
                                }
                            }

                            if (!bolFoundFEMA) {
                                //check for code = D
                                for (var x in fldZoneValueToSet) {
                                    if (fldZoneValueToSet[x]["FLD_ZONE"] == "D") {
                                        bolFoundFEMA = true;
                                    }
                                }
                            }
                        }

                        //add a condition - FEMA zone check
                        if (bolFoundFEMA) {
                            //logDebug("The value is - " + strValueToDisplay);

                            updateParcelAttr("FEMA", "FEMA Zone Check Required");

                            var cType = "FEMA";
                            var cStatus = "Applied";
                            var cDesc = "FEMA Zone Check Required";
                            var cComment = "FEMA zone check required. The zone(s) are the following - " + strValueToDisplay + ". Please review the condition and set the Severity to Notice before processing the record.";

                            var cImpact = "Lock";
                            //addAppConditionCustom(cType, cStatus, cDesc, cComment, cImpact);
                            addStdConditionCustom(cType, cDesc, cComment);
                        }
                    }
                }
            }
        }
    }
}
/*----------------------------------------------------------------------------------------------------/
| GIS Related Functions
/----------------------------------------------------------------------------------------------------*/
/*******************************************************
| Script/Function: findParcelInGIS(parcelId)
| Created by: Mike Buell
| Created on: 02June17
| Usage: find parcel from REST service
| Modified by: 
| Modified on: 
*********************************************************/
function findParcelInGIS(parcelId) {
    //var url = "http://maps.smcgov.org/arcgis/rest/services/PLN/PLN_LAYERS_DMZ/MapServer/0/query";
    //var url = "http://maps.smcgov.org/arcgis/rest/services/COMMON/PLN_BASE/MapServer/1/query";
    //var url = "http://maps.smcgov.org/arcgis/rest/services/PLN/PLN_ACELLA/MapServer/0/query";
    var url = "https://gis.smcgov.org/maps/rest/services/PLANNING/PLN_LAYERS_DMZ/MapServer";

    var requestParameters = "?text=&geometry=&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&objectIds=&time=&returnCountOnly=false&returnIdsOnly=false&returnGeometry=true&maxAllowableOffset=&outSR=&outFields=*&f=pjson";
    requestParameters += "&where=APN%3D%27" + parcelId + "%27"

    // send http request
    var rootNode = aa.util.httpPost(url, requestParameters).getOutput();
    //show the ESRI string
    var esriString = (url + requestParameters);
    logDebug("The ESRI search string is - " + esriString);

    // get response in JSON format and parse
    var obj = JSON.parse(rootNode);

    if (obj) {
        return obj;
    }
    else {
        return null;
    }
}
/*******************************************************
| Script/Function: formatAddressAndOwnerZips(recordId)
| Created by: Nicolaj Bunting
| Created on: 31May17
| Usage: When the record is created adjust the Zip code for the Address and Owner to use the 9 digit "#####-####" format
| Modified by: Nic Bunting (12Oct17)
*********************************************************/
function formatAddressAndOwnerZips(recordId) {
    var altId = aa.cap.getCap(recordId).getOutput().getCapModel().altID;
    logDebug("formatAddressAndOwnerZips(" + altId + ")");

    if (!recordId) {
        logDebug("Invalid capId provided");
        return;
    }

    capId = recordId;

    var allAddressModels = aa.address.getAddressByCapId(capId).getOutput();

    for (var i = 0; i < allAddressModels.length; i++) {
        var addressModel = allAddressModels[i];
        var zip = addressModel.zip;

        zip = formatZip(zip);

        addressModel.zip = zip;
        var result = aa.address.editAddress(addressModel);
        if (result.getSuccess() == true) {
            var number = i + 1;
            logDebug("Address " + number + " Zip code updated");
        }
    }

    var allCapOwnerModels = aa.owner.getOwnerByCapId(capId).getOutput();

    for (i = 0; i < allCapOwnerModels.length; i++) {
        var capOwnerModel = allCapOwnerModels[i];
        var zip = capOwnerModel.mailZip;

        zip = formatZip(zip);

        capOwnerModel.mailZip = zip;
        var result = aa.owner.updateDailyOwnerWithAPOAttribute(capOwnerModel);
        if (result.getSuccess() == true) {
            var number = i + 1;
            logDebug("Owner " + number + " Zip code updated");
        }
    }
}
/*******************************************************
| Script/Function: formatZip(zip)
| Created by: Nicolaj Bunting
| Created on: 31May17
| Usage: Formats a provided Zip code to use the 9 digit "#####-####" format
| Modified by: ()
*********************************************************/
function formatZip(zip) {
    zip = String(zip);

    if (zip.length == 5) {
        zip += "-0000";
    }
    if (zip.length == 9) {
        var prefix = zip.substring(0, 5);
        var suffix = zip.substring(5);

        zip = prefix + "-" + suffix;
    }

    logDebug("Zip(" + zip + ")");	//debug
    return zip;
}
function getAddressForEmail() {
    // get first address for emails 
    var capAddress = "";
    var capAddressResult1 = aa.address.getAddressByCapId(capId);
    if (capAddressResult1.getSuccess()) {
        var allAddrs = capAddressResult1.getOutput();
        for (var yy in allAddrs) {
            capAddress = allAddrs[yy].getHouseNumberStart();

            if (allAddrs[yy].getStreetDirection()) {
                capAddress += " " + allAddrs[yy].getStreetDirection();
            }

            capAddress += " " + allAddrs[yy].getStreetName();

            if (allAddrs[yy].getStreetSuffix()) {
                capAddress += " " + allAddrs[yy].getStreetSuffix();
            }

            if (allAddrs[yy].getUnitStart()) {
                capAddress += " " + allAddrs[yy].getUnitStart();
            }

            capAddress += ", " + allAddrs[yy].getCity();

            capAddress += " " + allAddrs[yy].getZip();
        }
    }

    return capAddress;
}
function getCapAddress(recCapId) {
    var CapAddress = "";
    var itemCap = recCapId;

    capAddressResult1 = aa.address.getAddressByCapId(itemCap);
    if (capAddressResult1.getSuccess()) {
        Address = capAddressResult1.getOutput();
        for (yy in Address) {
            CapAddress = Address[yy].getHouseNumberStart();

            if (Address[yy].getStreetDirection())
                CapAddress += " " + Address[yy].getStreetDirection();

            CapAddress += " " + Address[yy].getStreetName();

            if (Address[yy].getStreetSuffix())
                CapAddress += " " + Address[yy].getStreetSuffix();

            if (Address[yy].getUnitStart())
                CapAddress += " " + Address[yy].getUnitStart();

            CapAddress += ", " + Address[yy].getCity();
            CapAddress += " " + Address[yy].getZip();
        }
        return CapAddress;
    }
    else { logDebug("No record address available for capId: " + capId); return null; }
}
function getDepartmentParams4Notification(eParamsHash, deptName) {
    if (deptName == null) {
        return eParamsHash;
    }
    var rptInfoStdArray = getStandardChoiceArray("DEPARTMENT_INFORMATION");
    var foundDept = false;

    var valDesc = null;
    var defaultDeptValDesc = null;
    for (s in rptInfoStdArray) {
        if (rptInfoStdArray[s]["active"] == "A" && String(rptInfoStdArray[s]["value"]).toUpperCase() == String(deptName).toUpperCase()) {
            valDesc = rptInfoStdArray[s]["valueDesc"];
            if (isEmptyOrNull(valDesc)) {
                return eParamsHash;
            }
            valDesc = String(valDesc).split("|");
            foundDept = true;
            break;
        }//active and name match
        if (rptInfoStdArray[s]["active"] == "A" && String(rptInfoStdArray[s]["value"]).toUpperCase() == "DEFAULT") {
            defaultDeptValDesc = rptInfoStdArray[s]["valueDesc"];
            if (isEmptyOrNull(valDesc)) {
                return eParamsHash;
            }
            defaultDeptValDesc = String(defaultDeptValDesc).split("|");
        }
    }//all std-choice rows

    if (!foundDept) {
        // No department found, use default values
        valDesc = defaultDeptValDesc;
    }

    if (!isEmptyOrNull(valDesc)) {
        for (e in valDesc) {
            var parameterName = "";
            var tmpParam = valDesc[e].split(":");
            if (tmpParam[0].indexOf("$$") < 0)
                parameterName = "$$" + tmpParam[0].replace(/\s+/g, '') + "$$";
            else
                parameterName = tmpParam[0];

            addParameter(eParamsHash, parameterName, tmpParam[1]);
        }//for all parameters in each row
    }//has email parameters

    return eParamsHash;
}
/*----------------------------------------------------------------------------------------------------/
| GIS Related Functions
/----------------------------------------------------------------------------------------------------*/
/*******************************************************
| Script/Function: getGISBufferInfoCustom()
| Created by: Mike Buell
| Created on: 02June17
| Usage: get values from buffer
| Modified by: 
| Modified on: 
*********************************************************/
function getGISBufferInfoCustom(svc, layer, numDistance) {
    // returns an array of associative arrays
    // each additional parameter will return another value in the array
    //x = getGISBufferInfo("flagstaff","Parcels","50","PARCEL_ID1","MAP","BOOK","PARCEL","LOT_AREA");
    //
    //for (x1 in x)
    //   {
    //   aa.print("Object " + x1)
    //   for (x2 in x[x1])
    //      aa.print("  " + x2 + " = " + x[x1][x2])
    //   }

    var distanceType = "feet";
    var retArray = new Array();

    var bufferTargetResult = aa.gis.getGISType(svc, layer); // get the buffer target
    if (bufferTargetResult.getSuccess()) {
        var buf = bufferTargetResult.getOutput();
        for (argnum = 3; argnum < arguments.length; argnum++)
            buf.addAttributeName(arguments[argnum]);
    }
    else { aa.print("**WARNING: Getting GIS Type for Buffer Target.  Reason is: " + bufferTargetResult.getErrorType() + ":" + bufferTargetResult.getErrorMessage()); return false }

    var gisObjResult = aa.gis.getCapGISObjects(capId); // get gis objects on the cap
    if (gisObjResult.getSuccess())
        var fGisObj = gisObjResult.getOutput();
    else { aa.print("**WARNING: Getting GIS objects for Cap.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()); return false }

    for (var a1 in fGisObj) // for each GIS object on the Cap
    {

        if (fGisObj[a1].getGisTypeId() == "Active Parcels") {
            var bufchk = aa.gis.getBufferByRadius(fGisObj[a1], numDistance, distanceType, buf);

            if (bufchk.getSuccess())
                var proxArr = bufchk.getOutput();
            else { aa.print("**WARNING: Retrieving Buffer Check Results.  Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage()); return false }

            logDebug("We got something from the buffer");
            //helperObjectInfo(proxArr);
            for (var a2 in proxArr) {
                var proxObj = proxArr[a2].getGISObjects();  // if there are GIS Objects here, we're done

                for (var z1 in proxObj) {

                    var n = proxObj[z1].getAttributeNames();
                    var v = proxObj[z1].getAttributeValues();

                    var valArray = new Array();

                    //
                    // 09/18/08 JHS Explicitly adding the key field of the object, since getBufferByRadius will not pull down the key field
                    // hardcoded this to GIS_ID
                    //

                    valArray["GIS_ID"] = proxObj[z1].getGisId()
                    for (n1 in n) {
                        valArray[n[n1]] = v[n1];
                    }
                    retArray.push(valArray);
                }

            }
        }
    }

    return retArray;
}
/*******************************************************
| Script/Function: getGISFeatureByIntersect(sUrl, sField, sValue, eUrl) 
| Created by: Mike Buell
| Created on: 207Jun21
| Usage: Intersect a dataset using the REST service URLs
| Modified by: ()
*********************************************************/
// This function is used to retrieve intersecting GIS features
// where sUrl is the REST endpoint of the starting feature
//      sField is the field used to find the starting feature
//      sValue is the value used to identify the starting feature
//      eUrl is the REST endpoint of the intersecting feature layer
function getGISFeatureByIntersect(sUrl, sField, sValue, eUrl) {
    var sRequestParameters = "text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&having=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentOnly=false&datumTransformation=¶meterValues=&rangeValues=&quantizationParameters=&f=pjson";

    sRequestParameters = sRequestParameters + "&where=" + sField + "%3D" + sValue;

    // send http request
    var rootNode = aa.util.httpPost(sUrl, sRequestParameters).getOutput();
    // get response in JSON format and parse
    var obj = JSON.parse(rootNode);

    if (obj) {
        if (obj.features.length == 1) {
            var eRequestParameters = "where=&text=&objectIds=&time=&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&having=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentOnly=false&datumTransformation=¶meterValues=&rangeValues=&quantizationParameters=&f=pjson";
            eRequestParameters = eRequestParameters + "&geometry=" + JSON.stringify(obj.features[0].geometry) + "&geometryType=" + obj.geometryType;

            // send http request
            rootNode = aa.util.httpPost(eUrl, eRequestParameters).getOutput();
            // get response in JSON format and parse
            var obj2 = JSON.parse(rootNode);

            if (obj2) {
                return obj2;
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }
    else {
        return null;
    }
}

/*----------------------------------------------------------------------------------------------------/
| GIS Related Functions
/----------------------------------------------------------------------------------------------------*/
/*******************************************************
| Script/Function: getGISInfoCustom()
| Created by: Mike Buell
| Created on: 02June17
| Usage: get drill-down data for specific parcel number
| Modified by: 
| Modified on: 
*********************************************************/
function getGISInfoCustom(svc, parcelNumber, layer, attributename) {

    var distanceType = "feet";
    var strMessage = "";
    var retArray = new Array();
    //if (!esriParcelObject) {
    //    return retString;
    //}
    //get parcel object
    var fGisObjs = aa.gis.getParcelGISObjects(parcelNumber);
    //var fGisObj = esriParcelObject;
    //helperObjectInfo(fGisObj);
    if (fGisObjs.getSuccess()) {
        fGisObj = fGisObjs.getOutput()[0];
    }
    //set buffer object
    var bufferTargetResult = aa.gis.getGISType(svc, layer); // get the buffer target
    if (bufferTargetResult.getSuccess()) {
        var buf = bufferTargetResult.getOutput();
        buf.addAttributeName(attributename);
    }

    var bufchk = aa.gis.getBufferByRadius(fGisObj, "-1", distanceType, buf);

    if (bufchk.getSuccess()) {
        var proxArr = bufchk.getOutput();
        logDebug("Proximity result object - " + proxArr);
        helperObjectInfo(proxArr);
    } else {
        strMessage = strMessage + "**WARNING: Retrieving Buffer Check Results. Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage();
        logDebug(strMessage);
        return retArray;
    }

    for (a2 in proxArr) {
        var proxObj = proxArr[a2].getGISObjects(); // if there are GIS Objects here, we're done
        logDebug("GOT SOME OBJECTS");
        logDebug(proxObj[0]);
        for (z1 in proxObj) {
            var n = proxObj[z1].getAttributeNames();
            var v = proxObj[z1].getAttributeValues();

            logDebug("Here is the info - " + proxObj[z1].getAttributeNames() + " - " + proxObj[z1].getAttributeValues());

            var valArray = new Array();

            //
            // 09/18/08 JHS Explicitly adding the key field of the object, since getBufferByRadius will not pull down the key field
            // hardcoded this to GIS_ID
            //

            valArray["GIS_ID"] = proxObj[z1].getGisId()
            for (n1 in n) {
                valArray[n[n1]] = v[n1];
                //aa.print("Attribute: " + n[n1] + " Value: " + v[n1])
            }
            retArray.push(valArray);
        }

    }

    return retArray
}
/**
* Add Inspection Schedule After Parameters for use in Notification Templates. 
* This should be called from InspectionScheduleAfter Event
*
* @param params {HashMap}
* @return {HashMap}
*/

function getInspectionScheduleParams4Notification(params) {

    if (inspId) addParameter(params, "$$inspId$$", inspId);

    if (inspInspector) addParameter(params, "$$inspInspector$$", inspInspector);

    if (InspectorFirstName) addParameter(params, "$$InspectorFirstName$$", InspectorFirstName);

    if (InspectorMiddleName) addParameter(params, "$$InspectorMiddleName$$", InspectorMiddleName);

    if (InspectorLastName) addParameter(params, "$$InspectorLastName$$", InspectorLastName);

    if (InspectorFirstName && InspectorLastName) addParameter(params, "$$InspectorName$$", InspectorFirstName + " " + InspectorLastName);

    if (inspGroup) addParameter(params, "$$inspGroup$$", inspGroup);

    if (inspType) addParameter(params, "$$inspType$$", inspType);

    if (inspSchedDate) addParameter(params, "$$inspSchedDate$$", inspSchedDate);

    if (exists(vEventName, ['InspectionMultipleScheduleAfter', 'InspectionScheduleAfter'])) {
        var adHocRemoteInspection = false;
        var adHocURL = null;
        var pim = inspObj.getInspection();
        var pact = pim.getActivity();
        var iUnits = null;
        if (pact.getUnitNBR() != null && pact.getUnitNBR() != "") {
            var inspUnitNumberUpper = pact.getUnitNBR().toString().toUpperCase();
            if (inspUnitNumberUpper == "REMOTE") {
                adHocRemoteInspection = true;
            }
            if (inspUnitNumberUpper == "REMOTE") {
                adHocRemoteInspection = true;
            }
            else if (inspUnitNumberUpper == "ONSITE") {
                adHocRemoteInspection = false;
                adHocURL = "NOT APPLICABLE - WILL BE ONSITE";
            }
            else if (inspUnitNumberUpper.indexOf("HTTP") > -1) {
                adHocURL = pact.getUnitNBR();
            }
        }
        addParameter(params, "$$inspectorURL$$", getInspectorWebConferenceURL(inspInspector, inspGroup, inspType, adHocURL, adHocRemoteInspection));
    }

    return params;
}
function getInspectorWebConferenceURL(inspInspector, inspGroup, inspType, overrideURL, adhocRemoteInspection) {
    if (overrideURL && overrideURL != "") {
        return overrideURL;
    }

    var URL = lookup("REMOTE_INSPECTIONS_URLS", inspInspector);
    if (URL && URL != "") {
        if (adhocRemoteInspection) {
            return URL;
        }

        var inspGroupSetting = lookup("REMOTE_INSPECTIONS_ALLOWED_INSPECTION_TYPES", inspGroup);
        if (inspGroupSetting && inspGroupSetting != "") {
            var inspGroupSettingArray = inspGroupSetting.split(',');
            for (var i in inspGroupSettingArray) {
                var scInspType = inspGroupSettingArray[i];
                if (scInspType.toString().trim() == inspType) {
                    return URL;
                }
            }
        }
    }

    return "";
}
/*----------------------------------------------------------------------------------------------------/
| GIS Related Functions
/----------------------------------------------------------------------------------------------------*/
/*******************************************************
| Script/Function: getParcel()
| Created by: Mike Buell
| Created on: 02June17
| Usage: get parcel number from capmodel
| Modified by: 
| Modified on: 
*********************************************************/
function getParcel() {
    var parcelNumber = null;
    try {
        var parcelResult = aa.parcel.getParcelandAttribute(capId, null);
        //var parcelResult = aa.proxyInvoker.newInstance("com.accela.aa.aamain.parcel.ParcelModel");

        if (parcelResult.getSuccess()) {

            var parcels = parcelResult.getOutput().toArray();
            //will return the primary parcel
            for (var zz in parcels) {
                if (parcels[zz].getPrimaryParcelFlag() == "Y") {
                    parcelNumber = parcels[zz].getParcelNumber();
                }
            }

        } else {
            logDebug("**ERROR: Failed to get Parcel List " + parcelResult.getErrorMessage());
            return parcelNumber;
        }

    } catch (err) {
        return parcelNumber;
    }
    return parcelNumber;
}
function getPrimaryAddressLineParam4Notification(params) {
    // pass in a hashtable and it will add the additional parameters to the table
    var addressLine = "";
    adResult = aa.address.getPrimaryAddressByCapID(capId, "Y");
    if (adResult.getSuccess()) {
        ad = adResult.getOutput().getAddressModel();
        addParameter(params, "$$addressLine$$", ad.getDisplayAddress());
    }

    return params;
}
/*----------------------------------------------------------------------------------------------------/
| Green Halo Notification Functions
| Functions used to create new or attach records to Waste Management Plans
| Created by Accela 06/12/2015
/----------------------------------------------------------------------------------------------------*/
function getPrimaryCapAddress(itemCap) {
    var capAddressResult = aa.address.getAddressByCapId(itemCap);
    var capAddr;

    if (capAddressResult.getSuccess()) {
        var addressModelArray = capAddressResult.getOutput();
        for (k in addressModelArray) {
            if ("Y" == addressModelArray[k].getPrimaryFlag()) {
                capAddr = addressModelArray[k];
                break;
            }

        }
        if (addressModelArray.length > 0)
            capAddr = addressModelArray[0];
    }

    return capAddr;
}
function getRecordParams4Notification(params) {
    itemCapId = (arguments.length == 2) ? arguments[1] : capId;
    // pass in a hashtable and it will add the additional parameters to the table

    var itemCapIDString = itemCapId.getCustomID();
    var itemCap = aa.cap.getCap(itemCapId).getOutput();
    var itemCapName = itemCap.getSpecialText();
    var itemCapStatus = itemCap.getCapStatus();
    var itemFileDate = itemCap.getFileDate();
    var itemCapTypeAlias = itemCap.getCapType().getAlias();
    var itemHouseCount;
    var itemFeesInvoicedTotal;
    var itemBalanceDue;

    var itemCapDetailObjResult = aa.cap.getCapDetail(itemCapId);
    if (itemCapDetailObjResult.getSuccess()) {
        itemCapDetail = itemCapDetailObjResult.getOutput();
        itemHouseCount = itemCapDetail.getHouseCount();
        itemFeesInvoicedTotal = itemCapDetail.getTotalFee();
        itemBalanceDue = itemCapDetail.getBalance();
    }

    var workDesc = workDescGet(itemCapId);

    addParameter(params, "$$altID$$", itemCapIDString);

    addParameter(params, "$$capName$$", itemCapName);

    addParameter(params, "$$recordTypeAlias$$", itemCapTypeAlias);

    addParameter(params, "$$capStatus$$", itemCapStatus);

    addParameter(params, "$$fileDate$$", itemFileDate);

    addParameter(params, "$$balanceDue$$", "$" + parseFloat(itemBalanceDue).toFixed(2));

    addParameter(params, "$$workDesc$$", (workDesc) ? workDesc : "");

    return params;
}
function getStandardChoiceArray(stdChoice) {
    var cntItems = 0;
    var stdChoiceArray = new Array();
    var bizDomScriptResult = aa.bizDomain.getBizDomain(stdChoice);
    if (bizDomScriptResult.getSuccess()) {
        var bizDomScriptObj = bizDomScriptResult.getOutput();
        if (bizDomScriptObj != null) {
            cntItems = bizDomScriptObj.size();
            logDebug("getStdChoiceArray: " + stdChoice + " size = " + cntItems);
            if (cntItems > 0) {
                var bizDomScriptItr = bizDomScriptObj.iterator();
                while (bizDomScriptItr.hasNext()) {
                    var bizBomScriptItem = bizDomScriptItr.next();
                    var stdChoiceArrayItem = new Array();
                    stdChoiceArrayItem["value"] = bizBomScriptItem.getBizdomainValue();
                    stdChoiceArrayItem["valueDesc"] = bizBomScriptItem.getDescription();
                    stdChoiceArrayItem["active"] = bizBomScriptItem.getAuditStatus();
                    stdChoiceArray.push(stdChoiceArrayItem);
                }
            }
        }
        else {
            logDebug("getStdChoiceArray: WARNING stdChoice not found - " + stdChoice);
        }
    }

    return stdChoiceArray;
}
/**
 * getUserInspectorObjs
 * Description: Returns an array of userObj objects for all users in the system that are inspectors
 * 
 * @return array {userObj}
 */
function getUserInspectorObjs() {
    var userObjArray = new Array();
    var sysUserList
    var sysUserResult = aa.people.getSysUserList(aa.util.newQueryFormat());

    if (sysUserResult.getSuccess()) {
        sysUserList = sysUserResult.getOutput();
    } else {
        logDebug("**ERROR: getUserObjs: " + sysUserResult.getErrorMessage());
        return userObjArray;
    }

    for (var iUser in sysUserList) {
        var userId = sysUserList[iUser].getUserID();
        var isInspector = sysUserList[iUser].getIsInspector();
        if (isInspector && userId) {
            logDebug("userId = " + userId + " - isInspector = " + isInspector);
            userObjArray.push(new userObj(userId));
        }
    }

    return userObjArray;
}
/**
 * getUserObjs
 * Description: Returns an array of userObj objects for all users in the system
 * 
 * @return array {userObj}
 */
function getUserObjs() {
    var userObjArray = new Array();
    var sysUserList
    var sysUserResult = aa.people.getSysUserList(aa.util.newQueryFormat());

    if (sysUserResult.getSuccess()) {
        sysUserList = sysUserResult.getOutput();
    } else {
        logDebug("**ERROR: getUserObjs: " + sysUserResult.getErrorMessage());
        return userObjArray;
    }

    for (var iUser in sysUserList) {
        var userId = sysUserList[iUser].getUserID();
        if (userId) {
            userObjArray.push(new userObj(userId));
        }
    }

    return userObjArray;
}
/**
 * getUserObjsByDistrict
 * Description: Returns an array of userObj objects for all users in the system that match districtName
 * 
 * @param districtName {string}
 * @return array {userObj}
 */
function getUserObjsByDistrict(districtName) {
    var userObjArray = new Array();
    var sysUserList
    var sysUserResult = aa.people.getSysUserList(aa.util.newQueryFormat());

    if (sysUserResult.getSuccess()) {
        sysUserList = sysUserResult.getOutput()
    } else {
        logDebug("**ERROR: getUserObjsByDistrict: " + sysUserResult.getErrorMessage());
        return userObjArray;
    }

    for (var iUser in sysUserList) {
        var userId = sysUserList[iUser].getUserID();
        if (userId) {
            var vUserObj = new userObj(userId);
            var vUserDistArray = vUserObj.getUserDistricts();

            if (!districtName || exists(districtName, vUserDistArray)) {
                userObjArray.push(vUserObj);
            }
        }
    }

    return userObjArray;
}
function isEmptyOrNull(value) {
    return value == null || value === undefined || String(value) == "";
}
/*----------------------------------------------------------------------------------------------------/
| GIS Related Functions
/----------------------------------------------------------------------------------------------------*/
/*******************************************************
| Script/Function: lcpMidCoast()
| Created by: Mike Buell
| Created on: 28July17
| Usage: update LCP code - dependant on multipleFEMAZones() running first - need to put Active Parcels object on record
| Modified by: 
| Modified on: 
*********************************************************/
function lcpMidCoast() {
    //get the Accela parcel # 
    var parcelNumber = getParcel();
    logDebug("The parcel number is - " + parcelNumber);
    var gisService = "AGIS_SMCGOV";
    var valueToSet = new Array();
    var strMessage = "";
    var strValueToDisplay = "NA";
    var activeParcels = false;

    if (parcelNumber) {
        //now check to ensure Accela parcel exists in ESRI
        var gisParcel = findParcelInGIS(parcelNumber);

        //if we found parcel - add the parcel as a GIS Object
        if (gisParcel) {

            for (var a1 in fGisObjs) {
                if (fGisObjs[a1].getGisTypeId() == "Active Parcels") {
                    activeParcels = true;
                }
            }

            if (!activeParcels) {
                var gisObjectResult = aa.gis.addCapGISObject(capId, gisService, "Active Parcels", parcelNumber);
            }

            if (gisObjectResult.getSuccess()) {

                var gisObjs = aa.gis.getCapGISObjects(capId);
                if (gisObjs.getSuccess()) {
                    var fGisObjs = gisObjs.getOutput();
                }
                //look for the Active Parcels GIS object
                for (var a1 in fGisObjs) {
                    if (fGisObjs[a1].getGisTypeId() == "Active Parcels") {
                        logDebug("Found the Active Parcels GIS object");

                        valueToSet = getGISBufferInfoCustom(gisService, "LCP_MIDCOAST_PROJECT_AREA", -1, "OBJECTID_1");
                        strValueToDisplay = evaluateResult(valueToSet, "OBJECTID_1");
                        logDebug("Did we get some information - " + strValueToDisplay);

                        //update only if we did the buffer
                        if (strValueToDisplay != "NA") {
                            updateParcelAttr("LPC MIDCOAST PROJECT AREA", "Yes");
                            logDebug("Updated the LCP value");
                        }
                    }
                }
            }
        }
    }
}
function loadParcelAttributesTPS(thisArr) {
    // Modified version of the loadParcelAttributes()
    // Returns an associative array of Parcel Attributes
    // Optional second parameter, parcel number to load from
    // If no parcel is passed, function is using the ParcelValidatedNumber variable defined in the "BEGIN Event Specific Variables" list in ApplicationSubmitBefore

    var parcelNum = ParcelValidatedNumber;
    if (arguments.length == 2) parcelNum = arguments[1]; // use parcel number specified in args

    if (parcelNum.length != 0 && parcelNum != "" && parcelNum != null) {
        var fParcelObj = null;
        var parcelResult = aa.parcel.getParceListForAdmin(parcelNum, null, null, null, null, null, null, null, null, null);
        if (!parcelResult.getSuccess())
            logDebug("**ERROR: Failed to get Parcel object: " + parcelResult.getErrorType() + ":" + parcelResult.getErrorMessage());
        else
            var fParcelObj = parcelResult.getOutput()[0];
        var fParcelModel = fParcelObj.parcelModel;

        var parcelAttrObj = fParcelModel.getParcelAttribute().toArray();
        for (z in parcelAttrObj)
            thisArr["ParcelAttribute." + parcelAttrObj[z].getAttributeName()] = parcelAttrObj[z].getAttributeValue();

        // Explicitly load some standard values
        thisArr["ParcelAttribute.Block"] = fParcelModel.getBlock();
        thisArr["ParcelAttribute.Book"] = fParcelModel.getBook();
        thisArr["ParcelAttribute.CensusTract"] = fParcelModel.getCensusTract();
        thisArr["ParcelAttribute.CouncilDistrict"] = fParcelModel.getCouncilDistrict();
        thisArr["ParcelAttribute.ExemptValue"] = fParcelModel.getExemptValue();
        thisArr["ParcelAttribute.ImprovedValue"] = fParcelModel.getImprovedValue();
        thisArr["ParcelAttribute.InspectionDistrict"] = fParcelModel.getInspectionDistrict();
        thisArr["ParcelAttribute.LandValue"] = fParcelModel.getLandValue();
        thisArr["ParcelAttribute.LegalDesc"] = fParcelModel.getLegalDesc();
        thisArr["ParcelAttribute.Lot"] = fParcelModel.getLot();
        thisArr["ParcelAttribute.MapNo"] = fParcelModel.getMapNo();
        thisArr["ParcelAttribute.MapRef"] = fParcelModel.getMapRef();
        thisArr["ParcelAttribute.ParcelArea"] = fParcelModel.getParcelArea();
        thisArr["ParcelAttribute.ParcelStatus"] = fParcelModel.getParcelStatus();
        thisArr["ParcelAttribute.SupervisorDistrict"] = fParcelModel.getSupervisorDistrict();
        thisArr["ParcelAttribute.Tract"] = fParcelModel.getTract();
        thisArr["ParcelAttribute.PlanArea"] = fParcelModel.getPlanArea();
    }
}
/*----------------------------------------------------------------------------------------------------/
| GIS Related Functions
/----------------------------------------------------------------------------------------------------*/
/*******************************************************
| Script/Function: multipleFEMAZones()
| Created by: Mike Buell
| Created on: 02June17
| Usage: update FEMA code and add condition if multiple FEMA zones
| Modified by: 
| Modified on: 
*********************************************************/
function multipleFEMAZones() {
    //get the Accela parcel # 
    var parcelNumber = getParcel();
    logDebug("The parcel number is - " + parcelNumber);
    var gisService = "AGIS_SMCGOV";
    var valueToSet = new Array();
    var strMessage = "";
    var strValueToDisplay = "NA";

    if (parcelNumber) {
        //now check to ensure Accela parcel exists in ESRI
        var gisParcel = findParcelInGIS(parcelNumber);

        //if we found parcel - add the parcel as a GIS Object
        if (gisParcel) {
            var gisObjectResult = aa.gis.addCapGISObject(capId, gisService, "Active Parcels", parcelNumber);
            if (gisObjectResult.getSuccess()) {
                logDebug("Added GIS object - Active Parcels");

                //since add now get the gis objects
                var gisObjs = aa.gis.getCapGISObjects(capId);
                if (gisObjs.getSuccess()) {
                    var fGisObjs = gisObjs.getOutput();
                }

                //look for the Active Parcels GIS object
                for (var a1 in fGisObjs) {
                    logDebug("The GIS object is - " + fGisObjs[a1].getGisTypeId());

                    if (fGisObjs[a1].getGisTypeId() == "Active Parcels") {
                        logDebug("Found the Active Parcels GIS object");
                        valueToSet = getGISBufferInfoCustom(gisService, "FEMA Flood Zones", -1, "FLD_ZONE");
                        strValueToDisplay = evaluateResult(valueToSet, "FLD_ZONE");
                        logDebug("Did we get some information - " + strValueToDisplay);

                        //update only if we did the buffer
                        if (strValueToDisplay != "NA" && valueToSet.length > 1) {
                            updateParcelAttr("FEMA", "Multiple FEMA Zones");
                        }

                        //add a condition - multiple FEMA zones
                        if (valueToSet.length > 1) {

                            logDebug("Let's add a condition");
                            var cType = "Parcel";
                            var cStatus = "Applied";
                            var cDesc = "Multiple FEMA Zones";
                            var cComment = "Multiple FEMA zones have been found for the Parcel attached to this record. The zones are the following - " + strValueToDisplay + ". Please review the condition and set the Severity to Notice before processing the record.";

                            var cImpact = "Lock";
                            //addAppConditionCustom(cType, cStatus, cDesc, cComment, cImpact);
                            addStdConditionCustom(cType, cDesc, cComment);

                        }

                        //logDebug("Did we get some information - " + valueToSet[0]["FLD_ZONE"]);

                        //logDebug("The FEMA values are - " + valueToSet);
                    }
                }
            }
        }
    }
}
function sendAmnestyEmailNotification(templateName) {
    try {
        var applicantEmail = null;
        var applicantFirstName = "";
        var applicantLastName = "";

        var contacts = getContactArray();
        for (var x in contacts) {
            if (contacts[x].contactType == "Applicant") {
                applicantEmail = contacts[x].email;
                applicantFirstName = contacts[x].firstName;
                applicantLastName = contacts[x].lastName;
            }
        }

        var capDetail = aa.cap.getCapDetail(capId).getOutput()
        var user = aa.person.getUser(capDetail.getAsgnStaff()).getOutput()
        aa.print(user.getFullName())

        if (applicantEmail) {
            params.put("$$APPLICANT$$", applicantEmail);
            params.put("$$RECORDID$$", capIDString);
            params.put("$$FIRSTNAME$$", applicantFirstName);
            params.put("$$LASTNAME$$", applicantLastName);

            if (user.getFullName()) {
                params.put("$$PLANNERNAME$$", user.getFullName());
            }
            else {
                params.put("$$PLANNERNAME$$", "Planner Name not available");
            }

            if (user.getPhoneNumber()) {
                params.put("$$PLANNERPHONE$$", user.getPhoneNumber());
            }
            else {
                params.put("$$PLANNERPHONE$$", "Phone number not available");
            }

            if (user.getEmail()) {
                params.put("$$PLANNEREMAIL$$", user.getEmail());
            }
            else {
                params.put("$$PLANNEREMAIL$$", "Email not available");
            }

            fileNames = new Array();
            sendNotification("noreply@smcgov.org", applicantEmail, user.getEmail(), templateName, params, fileNames)
        }
        else {
            showMessage = true;
            comment("The applicant does not have an associated email address so we cound not send the notification: " + templateName);
        }
    } catch (ex) {
        logDebug("A JavaScript Error occurred in FUNCTION sendAmnestyEmailNotification" + ex.message);
    }
}
function sendAppToACA4Edit(isEditable) {
    var vCapID = capId;
    if (arguments.length == 2)
        vCapID = arguments[1];

    var vCap = aa.cap.getCap(vCapID).getOutput().getCapModel();

    var editable = "EDITABLE";
    if (!isEditable) {
        editable = "COMPLETE";
    }

    vCap.setCapClass(editable);
    aa.cap.editCapByPK(vCap);
}
//email with attachment
function sendEmailwAttchmnt(fromAddress, toAddress, ccAddress, reportSubject, reportContent, aaReportName, aaReportParamName, aaReportParamValue) {

    var reportName = aaReportName;

    report = aa.reportManager.getReportInfoModelByName(reportName);

    report = report.getOutput();

    report.setModule(appTypeArray[0]);

    report.setCapId(capId);

    var parameters = aa.util.newHashMap();   //Make sure the parameters includes some key parameters.  

    parameters.put(aaReportParamName, aaReportParamValue);

    report.setReportParameters(parameters);

    var permit = aa.reportManager.hasPermission(reportName, currentUserID);

    if (permit.getOutput().booleanValue()) {

        var reportResult = aa.reportManager.getReportResult(report);

        if (reportResult) {

            reportResult = reportResult.getOutput();

            var reportFile = aa.reportManager.storeReportToDisk(reportResult);

            reportFile = reportFile.getOutput();

            var sendResult = aa.sendEmail(fromAddress, toAddress, ccAddress, reportSubject, reportContent, reportFile);
        }

        if (sendResult.getSuccess())

            logDebug("A copy of this report has been sent to the valid email addresses.");

        else logDebug("System failed send report to selected email addresses because mail server is broken or report file size is great than 5M.");
    }

    else logDebug("No permission to report: " + reportName + " for Admin" + systemUserObj);
}
/*******************************************************
| Script/Function: setBldExpDateOnInspPass(capId)
| Created by: Nicolaj Bunting
| Created on: 21Feb19
| Usage: If the inspection result is "Pass" Then set ASI "Expiration Date" to 6 months from result date
| Modified by: ()
*********************************************************/
function setBldExpDateOnInspPass(capId, inspResultArr, inspIdArr) {
    var altId = aa.cap.getCap(capId).getOutput().capModel.altID;
    Avo_LogDebug("setBldExpDateOnInspPass(" + altId + ", " + inspResultArr + ", " + inspIdArr + ")", 1);

    for (var i = 0; i < inspResultArr.length; i++) {
        var inspResult = inspResultArr[i];
        Avo_LogDebug("Result(" + inspResult + ")", 2);  //debug

        if (inspResult != "Pass") {
            continue;
        }

        var inspId = inspIdArr[i];
        Avo_LogDebug("Insp ID(" + inspId + ")", 2); //debug

        var result = aa.inspection.getInspection(capId, inspId);
        if (result.getSuccess() != true) {
            Avo_LogDebug("Failed to get Inspection " + inspId + ". " + result.errorType + ": " + result.errorMessage, 1);
            continue;
        }

        var inspection = result.getOutput();
        var inspStatusDate = new Date(inspection.inspectionStatusDate.epochMilliseconds);	// Date inspection resulted
        Avo_LogDebug("Insp Status Date(" + aa.util.formatDate(inspStatusDate, "MM/dd/yyyy") + ")");    //debug

        var expDate = new Date(inspStatusDate.getTime());
        expDate.setMonth(expDate.getMonth() + 6);

        var expDateStr = aa.util.formatDate(expDate, "MM/dd/yyyy");
        Avo_LogDebug("Exp Date(" + expDateStr + ")", 2);   //debug

        editAppSpecific("Expiration Date", expDateStr, capId);
        Avo_LogDebug("Set Expiration Date to " + expDateStr, 1);
    }
}
/*******************************************************
| Script/Function: setBldExpDateOnStatus(capId, wfProcess, wfTask, wfStatus, wfDateMMDDYYYY)
| Created by: Nicolaj Bunting
| Created on: 21Feb19
| Usage: If record status is set to "Issued" for the first time Then set ASI "Expiration Date" to 1 year from status date
| Else set expiration date to 6 months from status date
| Modified by: ()
*********************************************************/
function setBldExpDateOnStatus(capId, wfProcess, wfTask, wfStatus, wfDateMMDDYYYY) {
    var altId = aa.cap.getCap(capId).getOutput().capModel.altID;
    Avo_LogDebug("setBldExpDateOnStatus(" + altId + ", " + wfProcess + ", " + wfTask + ", " + wfStatus + ", " + wfDateMMDDYYYY + ")", 1);

    if (wfStatus != "Issued") {
        Avo_LogDebug('Status is invalid', 1);
        return;
    }

    wfProcess = String(wfProcess);

    switch (wfProcess) {
        case "B_OTC":
            if (wfTask != "Application Submittal") {
                Avo_LogDebug('"Application Submittal" task is invalid', 1);
                return;
            }

            break;

        case "B_PERMIT":
        case "B_PHOTO":
            if (wfTask != "Ready to Issue") {
                //if (wfTask != "Ready to Issue" && wfTask != "Ready To Issue") {
                Avo_LogDebug('"Ready to Issue" task is invalid', 1);
                return;
            }

            break;

        default:
            Avo_LogDebug("Invalid workflow", 1);
            return;
    }

    var dateArr = String(wfDateMMDDYYYY).split("/");
    var statusDate = new Date(dateArr[2], parseInt(dateArr[0], 10) - 1, dateArr[1]);
    Avo_LogDebug("Status Date(" + aa.util.formatDate(statusDate, "MM/dd/yyyy") + ")", 2);   //debug

    var expDate = new Date(statusDate.getTime());
    expDate.setFullYear(expDate.getFullYear() + 1);

    // Check status history
    var initialStatus = true;

    var result = aa.cap.getStatusHistoryByCap(capId, "APPLICATION", aa.util.newQueryFormat());
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get status history. " + result.errorType + ': ' + result.errorMessage, 1);
    } else {
        var statusHistory = result.getOutput();
        for (var i in statusHistory) {
            var statusModel = statusHistory[i];

            var status = statusModel.status;
            Avo_LogDebug("Status(" + status + ")", 2);

            if (status != "Issued") {
                continue;
            }

            if (initialStatus == true) {
                initialStatus = false;
                continue;
            }

            expDate = new Date(statusDate.getTime());
            expDate.setMonth(expDate.getMonth() + 6);
            break;
        }
    }

    expDate = aa.util.formatDate(expDate, "MM/dd/yyyy");
    Avo_LogDebug("Exp Date(" + expDate + ")", 2);   //debug

    editAppSpecific("Expiration Date", expDate, capId);
    Avo_LogDebug("Set Expiration Date to " + expDate, 1);
}
function setRevisionRecord() {
    // For PRA, check BLD_083 has been invoiced for the capId.
    if (controlString = "PaymentReceiveAfter") {
        var revisionFeeInvoiced = false;
        var revisionFeeId = 0;
        var revisionFeeOwed = 0;
        var feeItems = aa.fee.getFeeItems(capId).getOutput();
        for (var i in feeItems) {
            var feeCode = String(feeItems[i].feeCod);
            var feeSched = feeItems[i].f4FeeItemModel.feeSchudle;
            var feeId = feeItems[i].feeSeqNbr;
            var feeAmount = feeItems[i].fee;

            Avo_LogDebug(feeId + " " + feeCode + "($" + feeAmount + ")", 2);    //debug
            if (feeCode == "BLD_083" && feeSched == "BLD_GEN") {
                revisionFeeId = feeId;
                revisionFeeOwed = feeAmount;
                revisionFeeInvoiced = true;
                break;
            }
        }

        if (!revisionFeeInvoiced) {
            return;
        }

        var paymentItems = aa.finance.getPaymentFeeItems(capId, null).getOutput();
        for (var i in paymentItems) {
            var feeIdToCheck = paymentItems[i].feeSeqNbr;
            var feePaid = paymentItems[i].feeAllocation;
            Avo_LogDebug("Payment Fee ID(" + feeIdToCheck + ")", 2);    //debug

            if (revisionFeeId != feeIdToCheck) {
                continue;
            }

            revisionFeeOwed = revisionFeeOwed - feePaid;
            break;
        }

        if (revisionFeeOwed > 0)
            return;
    }

    // Get parent
    if (!parentCapId) {
        parentCapId = getParent();
        Avo_LogDebug("1. Parent(" + parentCapId + ")", 2);  //debug
    }
    if (!parentCapId) {
        var result = aa.cap.getProjectByChildCapID(capId, null, null);
        if (result.getSuccess() != true) {
            Avo_LogDebug("Failed to get parent record. " + result.errorType + ': ' + result.errorMessage, 1);
            return;
        }
        
        var allParentRecords = result.getOutput();
        for (var i in allParentRecords) {
            parentCapId = allParentRecords[i].projectID;
            Avo_LogDebug("2. Parent(" + parentCapId + ")", 2);  //debug
        }
    }

    var capIdStrArr = String(parentCapId).split("-");
    var result = aa.cap.getCap(capIdStrArr[0], capIdStrArr[1], capIdStrArr[2]);

    //var result = aa.cap.getCap(parentCapId);

    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get cap " + parentCapId + ". " + result.errorType + ": " + result.errorMessage, 1);
        return;
    }
    var parentCap = result.getOutput();

    var parentAltId = String(parentCap.capModel.altID); //parentCap.getCapID().getCustomID();
    Avo_LogDebug("Parent(" + parentAltId + ")", 2);  //debug

    var capTypeModel = parentCap.capType;
    var recordType = String(capTypeModel);
    Avo_LogDebug("Parent Record Type(" + recordType + ")", 2); //debug


    var children = getChildren("Building/Revision/*/*", parentCapId)
    logDebug("Number of revision records: " + children.length);

    var index = children.length;
    var updatedAltId = parentAltId.replace("BLD", "REV") + "-" + ZeroPadNumber(index);
    logDebug("Replacing altID to " + updatedAltId);

    var result = aa.cap.updateCapAltID(capId, updatedAltId);

    Avo_LogDebug("Record ID has been updated to " + updatedAltId, 1);
}

function ZeroPadNumber (nValue) {
    if (nValue < 10) {
        return '00' + nValue.toString();
    } else if (nValue < 100) {
        return '0' + nValue.toString();
    } else {
        return nValue;
    }
}
function updateChildAltID4Digits(pcapId, ccapId, suffix) {
    /*---------------------------------------------------------------------------------------------------------/
    | Function Intent: 
    | This function is designed to update the AltId (b1permit.b1_alt_id) of an child record (ccapId).
    | The new AltId will be created using the AltId of its parent record (pcapId) plus the suffix variable
    | provided. Finally the end of the new id will be the number of child records of that record type.
    |
    | Example:
    | Parent AltId: 499-12-67872
    | Child AltId: 499-12-67872-ELEC-01
    |   499-12-67872-ELEC-02
    |   499-12-67872-ELEC-03
    |
    | Returns:
    | Outcome  Description   Return Type
    | Success: New AltID of Childrecord AltID String
    | Failure: Error    null null
    |
    | Call Example:
    | updateChildAltID(pcapId, ccapId, "-ELEC-"); 
    |
    | 11/01/2012 - Keith H
    | Version 1 Created
    |
    | Required paramaters in order:
    | pcapId - capId model of the parent record
    | ccapId - capId model of the child record
    | suffix - string that will be appended to the end of the parent AltId (ie. "-ELEC-")
    |
    /----------------------------------------------------------------------------------------------------------*/
    var p_AltId = pcapId.getCustomID();
    var c_AltId = ccapId.getCustomID();
    var c_cap = aa.cap.getCap(ccapId).getOutput();
    var c_appTypeResult = c_cap.getCapType();
    var c_appTypeString = c_appTypeResult.toString();
    var c_appTypeArray = c_appTypeString.split("/");

    //Get the number of child records by type provided
    var totChildren = getChildren(c_appTypeArray[0] + "/" + c_appTypeArray[1] + "/*/*", pcapId);
    if (totChildren === null || totChildren.length === 0) { logDebug("**ERROR: getChildren function found no children"); return null; }

    //Set the numeric suffic of the new AltId number to the actual number of child records that exists for the type.
    var totalFound = totChildren.length;
    var i = 0;

    //When using the clone feature multiple records can be created at the same time. When this happens the AltIds of the
    //children records are not set. To correctly set the AltIds we need to start with the last number and work backwards.
    //This ensures all the new child records recieves a unique AltId.

    for (i = 0; i <= totChildren.length; i++) {
        //Add leading 0's if single digit
        if (totalFound < 10) { totalFound = '000' + totalFound; }
        if (totalFound > 9 && totalFound < 100) { totalFound = '00' + totalFound; }
        if (totalFound > 100 && totalFound < 999) { totalFound = '0' + totalFound; }

        var newAltId = p_AltId + suffix + totalFound + "";
        var updateResult = aa.cap.updateCapAltID(ccapId, newAltId);
        if (updateResult.getSuccess()) {
            logDebug("Updated child record AltId to " + newAltId + ".");
            break;
        }
        else {
            if (i == totalFound) {
                logDebug("** ERROR: Failed to update the AltID for " + c_AltId + ". " + updateResult.getErrorType() + " : " + updateResult.getErrorMessage());
                return null;
            }
            //Might be duplicate because of multiple clones, try the next lower number
            totalFound = totChildren.length - (1 + i);
            //Check for negitive. 
            if (totalFound < 0) {
                logDebug("**ERROR: Number used for AltID would be less than 0. Failed to update the AltID for " + c_AltId + ". ");
                return null;
            }
            logDebug("** Attempting the next number: " + totalFound + ".");
        }
    }

    return newAltId;
}
/*----------------------------------------------------------------------------------------------------/
| GIS Related Functions
/----------------------------------------------------------------------------------------------------*/
/*******************************************************
| Script/Function: updateParcelAttr()
| Created by: Mike Buell
| Created on: 02June17
| Usage: update the parcel attribute value
| Modified by: 
| Modified on: 
*********************************************************/
function updateParcelAttr(attField, theValue) {

    //var apoAtts = aa.B3APOAttributeScriptModel.getB3APOAttributeModel();
    //var parcelAtts = aa.parcel.getParcelandAttribute(capId,null).getOutput();
    var parcelAtts = aa.parcel.getParcelByCapId(capId, null).getOutput();
    //var parcelModel = aa.parcel.getCapParcelModel().getOutput();


    //helperObjectInfo(parcelModel);
    //logDebug("THE PARCEL IS - " + parcelModel.getParcelNumber());

    var parcelArray = parcelAtts.toArray();

    //get the parcel objects attached
    for (y in parcelArray) {
        //logDebug("What is this " + parcelArray[x]);
        //helperObjectInfo(parcelArray[x]);
        //get the primary parcel flag
        var primaryParcel = parcelArray[y].getPrimaryParcelFlag();
        if (primaryParcel == "Y") {
            //this will get the parcel attributes - array of b3apoobjects 
            var apoAtts = parcelArray[y].getParcelAttribute().toArray();
            //logDebug("These are the apo atts - " + apoAtts);
            //helperObjectInfo(apoAtts[0]);
            for (x in apoAtts) {
                //logDebug(apoAtts[x].getB1AttributeName() + " - " + apoAtts[x].getB1AttributeValue());
                if (apoAtts[x].getB1AttributeName() == attField) {
                    logDebug("Initial value - " + apoAtts[x].getB1AttributeName() + " - " + apoAtts[x].getB1AttributeValue());
                    apoAtts[x].setB1AttributeValue(theValue);
                    //apoAtts[x].setB1AttributeValue("X");					
                    //aa.parcel.updateDailyParcelWithAPOAttribute(parcelArray[y]);
                    var testing1 = aa.parcel.warpCapIdParcelModel2CapParcelModel(capId, parcelArray[y]).getOutput();
                    logDebug("What did I get - " + testing1);
                    var testing2 = aa.parcel.updateDailyParcelWithAPOAttribute(testing1);
                    logDebug("Did this work - " + testing2.getSuccess());
                    logDebug("Updated value - " + apoAtts[x].getB1AttributeName() + " - " + apoAtts[x].getB1AttributeValue());
                }
            }
        }
    }
}
/**
 * User Object
 * Constructor:
 * @param vUserId {string} User ID
 * @return {boolean}
 *
 * Methods:
 * getEmailTemplateParams
 * @param params {HashTable}
 * @param [userType] {string} Used to create email paramerters
 * @return params {HashTable}
 *
 * getUserDisciplines()
 * @return disciplineArray {array}
 *
 * getUserDistricts()
 * @return districtArray {array}
 */
function userObj(vUserId) {
    this.userID = null;
    this.userFirstName = null;
    this.userLastName = null;
    this.userMiddleName = null;
    this.userInitial = null;
    this.userEmail = null;
    this.userTitle = null;
    this.phoneNumber = null;
    this.dailyInspUnits = null;
    this.isInspector = null;
    this.userStatus = null;
    this.billingRate = null;
    this.cashierID = null;
    this.userObject = null;
    this.userFullName = null;

    var iNameResult = null;

    if (vUserId)
        iNameResult = aa.person.getUser(vUserId.toUpperCase());

    if (iNameResult.getSuccess()) {
        var iUserObj = null;
        iUserObj = iNameResult.getOutput();
        this.userObject = iUserObj;
        this.userID = iUserObj.getUserID();
        this.userFirstName = iUserObj.getFirstName();
        this.userLastName = iUserObj.getLastName();
        this.userMiddleName = iUserObj.getMiddleName();
        this.userFullName = iUserObj.getFullName();
        this.userInitial = iUserObj.getInitial();
        this.userEmail = iUserObj.getEmail();
        this.userTitle = iUserObj.getTitle();
        this.phoneNumber = iUserObj.getPhoneNumber();
        this.dailyInspUnits = iUserObj.getDailyInspUnits();
        this.isInspector = iUserObj.getIsInspector();
        this.userStatus = iUserObj.getUserStatus();
        this.billingRate = iUserObj.getRate1();
        this.cashierID = iUserObj.getCashierID();
    }
    else { logDebug("**ERROR retrieving user model for" + vUserId + " : " + iNameResult.getErrorMessage()); return false; }

    this.getEmailTemplateParams = function (params, userType) {
        if (matches(userType, null, undefined, "")) userType = "user";

        addParameter(params, "$$" + userType + "LastName$$", this.userLastName);
        addParameter(params, "$$" + userType + "FirstName$$", this.userFirstName);
        addParameter(params, "$$" + userType + "MiddleName$$", this.userMiddleName);
        addParameter(params, "$$" + userType + "Initials$$", this.userInitial);
        addParameter(params, "$$" + userType + "PhoneNumber$$", this.phoneNumber);
        addParameter(params, "$$" + userType + "Email$$", this.userEmail);
        addParameter(params, "$$" + userType + "Title$$", this.userTitle);
        addParameter(params, "$$" + userType + "DailyInspUnits$$", this.dailyInspUnits);
        addParameter(params, "$$" + userType + "BillingRate$$", this.billingRate);
        addParameter(params, "$$" + userType + "CashierID$$", this.cashierID);
        addParameter(params, "$$" + userType + "FullName$$", this.userFullName);
        return params;
    }

    this.getUserDistricts = function () {
        var result = aa.people.getUserDistricts(this.userID);
        var userDistrictModelArray = result.getOutput();
        var districtArray = new Array();

        for (iD in userDistrictModelArray) {
            var userDistrictModel = userDistrictModelArray[iD];
            if (userDistrictModel.getRecStatus() == 'A') {
                districtArray.push(userDistrictModel.getDistrict());
            }
        }

        return districtArray;
    }

    this.getUserDisciplines = function () {
        var result = aa.people.getUserDisciplines(this.userID);
        var userDisciplineModelArray = result.getOutput();
        var disciplineArray = new Array();

        for (iD in userDisciplineModelArray) {
            var userDisciplineModel = userDisciplineModelArray[iD];
            if (userDisciplineModel.getRecStatus() == 'A') {
                disciplineArray.push(userDisciplineModel.getDiscipline());
            }
        }

        return disciplineArray;
    }
}
/*----------------------------------------------------------------------------------------------------/
| Green Halo Notification Functions
| Functions used to create new or attach records to Waste Management Plans
| Created by Accela 06/12/2015
/----------------------------------------------------------------------------------------------------*/
function validateGreenHalo() {
    var greenHaloID = getAppSpecific("GreenHaloID");
    var projectType = getAppSpecific("Project Type");
    var typeOfUse = getAppSpecific("Type of Use");
    if (matches(greenHaloID, null, undefined, "")) {

        var messageToUser = "";

        if (matches(projectType, null, undefined, "")) {
            messageToUser += "'Project Type' is not selected <br>";
        }
        if (matches(typeOfUse, null, undefined, "")) {
            messageToUser += "'Type of Use' is not selected <br>";
        }

        var hasApplicant = false;
        var isValidApplicant = true;
        var contacts = getContactArray();

        for (var x in contacts) {

            logDebug("contacts[x].email " + contacts[x].email)
            if (contacts[x].contactType == "Applicant") {

                hasApplicant = true;

                if (!contacts[x].email) {
                    isValidApplicant = false;
                    break;
                }

            }
        }

        var hasAddress = true;
        var isValidAddress = true;
        var addr = getPrimaryCapAddress(capId);
        logDebug("addr " + addr)
        if (matches(addr, null, undefined)) {

            hasAddress = false;
        }
        else {

            if (!addr.zip) {

                isValidAddress = false;
            }
        }

        if (!hasApplicant) {

            messageToUser += "There is no Applicant contact <br>"
        }

        if (!isValidApplicant) {

            messageToUser += "The contact does not have an email <br>"
        }
        if (!hasAddress) {

            messageToUser += "There is no primary address associated with this record <br>"
        }

        if (!isValidAddress) {

            messageToUser += "The primary address does not have a zip code <br>"
        }

        if (messageToUser.length > 0) {

            showMessage = true;
            //cancel = true;
            comment("Cannot create a Green Halo project because: <br>" + messageToUser);
            comment("Please add the missing data and resave the Details");
            return false;
        }
        else {

            return true;
        }
    }
}
/*----------------------------------------------------------------------------------------------------/
| Green Halo Notification Functions
| Functions used to create new or attach records to Waste Management Plans
| Created by Accela 06/12/2015
/----------------------------------------------------------------------------------------------------*/
function WasteManagementPlan() {
    this.apiURL = lookup("GREEN_HALO_CONFIG", "URL");

    this.recordID = null;
    this.id = null;
    this.companyName = null;
    this.phone = null;
    this.projectName = null;
    this.email = null;
    this.password = null;
    this.street = null;
    this.apt_suite = null;
    this.city = null;
    this.state = null;
    this.zipcode = null;
    this.projectStartDate = null;
    this.projectEndDate = null;
    this.value = null;
    this.squareFootage = null;
    this.description = null;
    this.projectType = null;
    this.buildingType = null;
    this.permit = null;
    this.wmpNumber = null;
    this.apiKey = lookup("GREEN_HALO_CONFIG", "API_KEY");
    this.permitSqFootage = null;
    this.permitNote = null;
    this.permitValue = null;
    this.permitProjectType = null;


    this.buildHeaders = function () {
        var headers = aa.util.newHashMap();
        //headers.put("Content-Type","application/json");
        //headers.put("Authorization",this.authorization);
        return headers;
    }

    this.buildCreateRequest = function () {
        //var body = {};
        var body = aa.util.newHashMap()

        if (this.recordID != null) body.put("record_id", new String(this.recordID));
        if (this.id != null) body.put("id", new String(this.id));
        if (this.companyName != null) body.put("company_name", new String(this.companyName));
        if (this.phone != null) body.put("phone", new String(this.phone));
        if (this.projectName != null) body.put("project_name", new String(this.projectName));
        if (this.email != null) body.put("email", new String(this.email));
        if (this.password != null) body.put("password", new String(this.password));
        if (this.street != null) body.put("street", new String(this.street));
        if (this.apt_suite != null) body.put("apt_suite", new String(this.apt_suite));
        if (this.city != null) body.put("city", new String(this.city));
        if (this.zipcode != null) body.put("zipcode", this.zipcode);
        if (this.projectStartDate != null) body.put("project_start_date", this.projectStartDate);
        if (this.projectEndDate != null) body.put("project_end_date", this.projectEndDate);
        if (this.value != null) body.put("value", this.value);
        if (this.squareFootage != null) body.put("square_footage", this.squareFootage); else body.put("square_footage", " ");
        if (this.description != null) body.put("description", this.description);
        if (this.projectType != null) body.put("project_type", this.projectType);
        if (this.buildingType != null) body.put("building_type", this.buildingType);
        if (this.permit != null) body.put("permit", this.permit);
        if (this.apiKey != null) body.put("api_key", this.apiKey);
        if (this.permitSqFootage != null) body.put("permit_sq_footage", this.permitSqFootage); else body.put("permit_sq_footage", " ");
        if (this.permitNote != null) body.put("permit_note", this.permitNote);
        if (this.permitValue != null) body.put("permit_value", this.permitValue);
        if (this.permitProjectType != null) body.put("permit_project_type", this.permitProjectType);
        comment(body);


        return body;
    }

    this.buildAddRequest = function () {
        //var body = {};
        var body = aa.util.newHashMap()

        if (this.wmpNumber != null) body.put("wmp_number", this.wmpNumber);
        if (this.permit != null) body.put("permit", this.permit);
        if (this.apiKey != null) body.put("api_key", this.apiKey);
        if (this.squareFootage != null) body.put("square_footage", this.squareFootage); else body.put("square_footage", " ");
        if (this.description != null) body.put("description", this.description);
        if (this.value != null) body.put("value", this.value);
        if (this.projectType != null) body.put("project_type", this.projectType);


        return body;
    }

    this.createProject = function () {
        var method = lookup("GREEN_HALO_CONFIG", "CREATE");
        aa.print(this.buildCreateRequest())
        aa.print(this.apiURL + method)
        return this.sendRequest(this.apiURL + method, this.buildCreateRequest());

    }

    this.addPermit = function () {
        var method = lookup("GREEN_HALO_CONFIG", "ADD");
        return this.sendRequest(this.apiURL + method, this.buildAddRequest());
    }

    this.sendRequest = function (url, body) {
        var result = aa.httpClient.post(url, this.buildHeaders(), body);
        aa.print(body);
        var response = result.getOutput();
        return response;
    }
}
