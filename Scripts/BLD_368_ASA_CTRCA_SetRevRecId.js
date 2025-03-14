/*******************************************************
| Script/Function: setRevRecId(ID368)
| Created by: Nicolaj Bunting
| Created on: 24Agu21
| Usage: On submit If parent has same record type Then set record ID to parent's record ID replacing "BLD" with "REV" and adding "-001" 
|        
|        (Note: Currently there's a timing issue in CTRCA - The record ID is reverted back to 'REV2021-000#' format when payment has been made in ACA, 
            and parentCap is NULL at the event of CTRCA.
            As a workaround, the script is linked to PRA event(for ACA) as well as and ASA (for backoffice).)
| to the end
| ie. BLD2021-00400 -> REV2021-00400-001
| Modified by: ()
*********************************************************/
(function () {
    // For PRA, check BLD_083 has been invoiced for the capId.
    /* ---------- Replaced by Avo_CheckRevisionFeePaid which is called directly in PRA -----------
    if (publicUser) {
        var revisionFeeIsPaid = false;
        var feeItems = aa.fee.getFeeItems(capId).getOutput();
        for (var i in feeItems) {
            var feeCode = String(feeItems[i].feeCod);
            var feeAmount = feeItems[i].fee;
            var feeId = feeItems[i].feeSeqNbr;
            var feeSched = feeItems[i].f4FeeItemModel.feeSchudle;

            Avo_LogDebug(feeId + " " + feeCode + "($" + feeAmount + ")", 2);    //debug
            if (feeCode == "BLD_083" && feeSched == "BLD_GEN") {
                revisionFeeIsPaid = true;
                break;
            }
        }
        if (!revisionFeeIsPaid)
            return;
    }
    */
    if (controlString = "PaymentReceiveAfter") {
        var updatedRevisionID = String(AInfo["Updated Revision ID"]);
        Avo_LogDebug("Updated Revision ID(" + updatedRevisionID + ")", 2); //debug

        if (updatedRevisionID && updatedRevisionID.indexOf("REV") == 0) {
            // The Revision ID has already been defined and updated. Use the pre-defined ID.
            var result = aa.cap.updateCapAltID(capId, updatedRevisionID);
            Avo_LogDebug("Record ID has been re-updated to " + updatedRevisionID, 1);
            return;
        }
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
    }
    var parentCap = result.getOutput();
    if (!parentCap) {
        parentCap = aa.cap.getCap(parentCapId).getOutput();
    }
    var parentAltId = String(parentCap.capModel.altID); //parentCap.getCapID().getCustomID();
    Avo_LogDebug("Parent(" + parentAltId + ")", 2);  //debug

    var capTypeModel = parentCap.capType;
    var recordType = String(capTypeModel);
    Avo_LogDebug("Parent Record Type(" + recordType + ")", 2); //debug


    var children = getChildren("Building/Revision/*/*", parentCapId)
    logDebug("Number of revision records: " + children.length);

    var index = 1;

    // Debugging
    for (var x in children) {
        var childCapId = children[x];
        var capToCheck = aa.cap.getCap(childCapId).getOutput();
        var childAltId = capToCheck.capModel.altID;
        var status = String(capToCheck.capStatus);
        var isTemp = String(capToCheck.capClass) == "INCOMPLETE TMP" || String(capToCheck.capClass == "INCOMPLETE CAP") || String(capToCheck.capClass == "INCOMPLETE EST");
        Avo_LogDebug("Child Record '"+ childAltId + "' - Status(" + status + "), Temp(" + isTemp.toString() + ")", 2);  //debug
    }

    var updatedAltId = parentAltId.replace("BLD", "REV") + "-" + ZeroPadNumber(index);
    while (checkIfAltIDExists(updatedAltId, children)) {
        index++;
        updatedAltId = parentAltId.replace("BLD", "REV") + "-" + ZeroPadNumber(index);
    }

    var result = aa.cap.updateCapAltID(capId, updatedAltId);
    Avo_LogDebug("Record ID has been updated to " + updatedAltId, 1);
    editAppSpecific("Updated Revision ID", updatedAltId, capId);
})();

function ZeroPadNumber(nValue) {
    if (nValue < 10) {
        return '00' + nValue.toString();
    } else if (nValue < 100) {
        return '0' + nValue.toString();
    } else {
        return nValue;
    }
}

// Check if the alt ID is already taken by one of the child records
function checkIfAltIDExists (updatedAltId, children) {
    logDebug("Check if altID " + updatedAltId + " is already taken");
    for (var x in children) {
        var childCapId = children[x];
        var capToCheck = aa.cap.getCap(childCapId).getOutput();
        var childAltId = capToCheck.capModel.altID;
        if (childAltId == updatedAltId) {
            return true; //already taken
        }
    }
    return false;
}