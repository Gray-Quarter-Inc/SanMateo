/*******************************************************
| Script/Function: revisionPermitIssuedEmail() - (ID397)
| Created by: Jei Yang
| Created on: 23Dec21
| Usage: When workflow task ‘Ready to Issue Permit’ is set to “Permit Issued”, 
| Send email template BLD_REISSUED to all contacts, Owner (APO owner) , and all Licensed Professionals.
| add a row to parent permit’s ASIT “Valuation History”
| Amount = ASI “Updated Valuation Amount” on the revision ASI
| Date = “today’s date”
| Revision Record ID = “Revision Record ID of the revision record”
| Modified by: ()
*********************************************************/
(function () {
    var template = "BLD_REISSUED";
    var params = aa.util.newHashtable();

    var result = aa.cap.getCap(capId);
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get cap. " + result.errorType + ': ' + result.errorMessage, 1);
        return;
    }

    var cap = result.getOutput();
    var capModel = cap.capModel;


    //altID
    var altId = capModel.altID;
    addParameter(params, "$$altID$$", altId);

    result = aa.address.getAddressByCapId(capId);
    if (result.getSuccess() != true) {
        Avo_LogDebug('Failed to get addresses. ' + result.errorType + ": " + result.errorMessage, 1);
        return;
    }

    //address
    var addr = "";
    var allAddressModels = result.getOutput();
    Avo_LogDebug("Total Addrs(" + allAddressModels.length + ")", 2);    //debug

    for (var i in allAddressModels) {
        var addressModel = allAddressModels[i];
        if (allAddressModels.length > 1 && addressModel.primaryFlag != "Y") {
            continue;
        }

        addr = String(addressModel.displayAddress);
        if (!addr || addr.length == 0 || addr.toLowerCase() == "null") {
            addr = addressModel.houseNumberStart + " " + (addressModel.streetDirection ? addressModel.streetDirection + " " : "")
                + addressModel.streetName + " " + addressModel.streetSuffix + (addressModel.unitStart ? " " + addressModel.unitType
                    + " " + addressModel.unitStart : "") + ", " + addressModel.city + ", " + addressModel.state + ", " + addressModel.zip;

        }

        Avo_LogDebug("Address(" + addr + ")", 2);   //debug

        break;
    }
    addParameter(params, "$$address$$", addr);

    //parcelNumber
    result = aa.parcel.getParcelByCapId(capId, aa.util.newQueryFormat());
    if (result.getSuccess() != true) {
        Avo_LogDebug('Failed to get parcels. ' + result.errorType + ": " + result.errorMessage, 1);
        return;
    }

    var parcelNum = 'None';
    var allParcelModels = result.getOutput().toArray();
    for (var i in allParcelModels) {
        var parcelModel = allParcelModels[i];
        if (allParcelModels.length > 1 && parcelModel.primaryParcelFlag != "Y") {
            continue;
        }

        parcelNum = parcelModel.parcelNumber;
        Avo_LogDebug("Parcel #(" + parcelNum + ")", 2);	//debug
        break;
    }
    addParameter(params, "$$parcelNumber$$", parcelNum);

    //appType
    var alias = capModel.appTypeAlias;
    Avo_LogDebug("Alias(" + alias + ")", 2);    //debug
    addParameter(params, "$$appType$$", alias);


    // Send notification to Applicants
    var allContacts = getContactArray(capId);
    for (var i in allContacts) {
        var peopleModel = allContacts[i].peopleModel;
        var contactTypeFlag = peopleModel.contactTypeFlag;
        Avo_LogDebug("Contact type flag(" + contactTypeFlag + ")", 2);  //debug

        var name = "";
        if (contactTypeFlag == "individual") {
            name = String(allContacts[i].firstName + " " + allContacts[i].lastName);
        }
        if (contactTypeFlag == "organization") {
            name = String(allContacts[i].businessName);
        }

        Avo_LogDebug("Name(" + name + ")", 2);  //debug

        var email = allContacts[i].email;
        if (!email || String(email).length == 0 || String(email).indexOf("@") == -1 || String(email).indexOf(".") == -1) {
            Avo_LogDebug("Invalid email " + email, 1);
            continue;
        }

        var contactType = String(allContacts[i].contactType);
        Avo_LogDebug("Contact type(" + contactType + ")", 2);	//debug

        var success = sendNotification(null, email, "", template, params, new Array(), capId);
        if (success == true) {
            Avo_LogDebug('Notification "' + template + '" sent to "' + contactType + '" ' + name + ' at ' + email, 1);
        } else {
            Avo_LogDebug('Failed to send notification "' + template + '" to "' + contactType + '" ' + name + ' at ' + email, 1);
        }
    }

    // Get Owners
    
    var allOwners = new Array();
    var result = aa.owner.getOwnerByCapId(capId);
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get record owners. " + result.errorType + ": " + result.errorMessage, 1);
    } else {
        allOwners = result.getOutput();
    }

    for (var i in allOwners) {
        var owner = allOwners[i];

        var name = owner.ownerFullName;
        Avo_LogDebug("Name(" + name + ")", 2);  //debug

        var email = owner.email;
        if (!email || String(email).length == 0 || String(email).indexOf("@") == -1 || String(email).indexOf(".") == -1) {
            Avo_LogDebug("Invalid email " + email, 1);
            continue;
        }

        if (allOwners.length > 1 && owner.primaryOwner != "Y") {
            continue;
        }

        var success = sendNotification(null, email, "", template, params, new Array(), capId);
        if (success == true) {
            Avo_LogDebug('Notification "' + template + '" sent to Owner ' + name + ' at ' + email, 1);
        } else {
            Avo_LogDebug('Failed to send notification "' + template + '" to Owner ' + name + ' at ' + email, 1);
        }
    }
    

    // Send notification to Lic Prof
    var allLicProfs = getLicenseProfessional(capId);
    for (var i in allLicProfs) {
        var licNum = allLicProfs[i].licenseNbr;
        Avo_LogDebug("Lic #(" + licNum + ")", 2);   //debug

        var name = String(allLicProfs[i].contactFirstName + " " + allLicProfs[i].contactLastName);
        //var name = String(allLicProfs[i].businessName);

        Avo_LogDebug("Name(" + name + ")", 2);  //debug

        var email = allLicProfs[i].email;
        if (!email || String(email).length == 0 || String(email).indexOf("@") == -1 || String(email).indexOf(".") == -1) {
            Avo_LogDebug("Invalid email " + email, 1);
            continue;
        }

        var licType = allLicProfs[i].licenseType;
        Avo_LogDebug("Lic Type(" + licType + ")", 2);   //debug

        var success = sendNotification(null, email, "", template, params, new Array(), capId);
        if (success == true) {
            Avo_LogDebug('Notification "' + template + '" sent to "' + licType + '" ' + name + ' at ' + email, 1);
        } else {
            Avo_LogDebug('Failed to send notification "' + template + '" to "' + licType + '" ' + name + ' at ' + email, 1);
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

    // Generate report
    var reportName = "Building Permit";
    var reportParams = aa.util.newHashMap();

    var altId = cap.capModel.altID;
    reportParams.put("capid", altId);

    var module = appTypeArray[0];

    var reportSuccess = Avo_GenerateReportAndAttachToRecord(capId, reportName, module, reportParams);
    if (reportSuccess) {
        Avo_LogDebug('Added report "' + reportName + '" to record', 1);
    } else {
        Avo_LogDebug('Failed to add report "' + reportName + '" to record', 1);
        return;
    }

    //var parentAltId = aa.cap.getCap(parentCapId).getOutput().capModel.altID;
    //Get ASI 'Updated Valuation Amount' from the revision record
    var updatedValuation = String(getAppSpecific("Updated Valuation Amount", capId));
    Avo_LogDebug("Updated Valuation Amount(" + updatedValuation + ")", 2);    //debug

    var tableName = "VALUATION HISTORY";

    // Add a new row to the parent record's ASIT
    var rowToAdd = new Object();
    rowToAdd["Valuation Amount"] = updatedValuation;
    rowToAdd["Valuation Update Date"] = aa.util.formatDate(new Date(), "MM/dd/yyyy");
    rowToAdd["Revision Record ID"] = altId;

    var success = addToASITable(tableName.toUpperCase(), rowToAdd, parentCapId);
    if (success === false) {
        Avo_LogDebug('Failed to add new row to "' + tableName + '" table', 1);
        return;
    }

    Avo_LogDebug('Added new row to "' + tableName + '" table', 1);

})();

aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC Test: BLD_397_WTUA_RevisionPermitIssuedEmail", debug); //debug