/*******************************************************
| Script/Function: add90DayExt() - (ID159)
| Created by: Nicolaj Bunting
| Created on: 14Dec20
| Usage: When task "Inspections" has status set to "90 Day Extension" set ASI "Date of Extension" to today's date, set ASI
| "Expiration Date" to 90 days from today, set ASI "90 day Extension" to checked, send notification "BLD_PERMITEXTENDED" to "Applicant" 
| contacts, record owner, all licensed professionals
| Modified by: ()
*********************************************************/
(function () {
    var template = "BLD_PERMITEXTENDED";
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
                    + " " + addressModel.unitStart : "") + ", " + addressModel.city + ", " + addressModel.state + ", "
                + addressModel.zip;
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

    addParameter(params, "$$numDays$$", '90');

    // Add extensions
    var fieldName = "Date of Expiration";
    var expDateStr = getAppSpecific(fieldName, capId);
    Avo_LogDebug("Exp Date(" + expDateStr + ")", 2);	//debug

    var expDate = Avo_GetToday();
    expDate.setDate(expDate.getDate() + 90);

    var updatedExpDateStr = aa.util.formatDate(expDate, "MM/dd/yyyy");
    Avo_LogDebug("Updated Exp Date(" + updatedExpDateStr + ")", 2);	//debug

    editAppSpecific(fieldName, updatedExpDateStr, capId);
    Avo_LogDebug('Set "' + fieldName + '" to ' + updatedExpDateStr, 1);

    var todayStr = aa.util.formatDate(new Date(), "MM/dd/yyyy");
    editAppSpecific("Date of Extension", todayStr, capId);

    editAppSpecific("90 day Extension", "CHECKED", capId);

    // Send notification to Applicants
    var allContacts = getContactArray(capId);
    for (var i in allContacts) {
        var peopleModel = allContacts[i].peopleModel;
        var contactTypeFlag = peopleModel.contactTypeFlag;
        Avo_LogDebug("Contact type flag(" + contactTypeFlag + ")", 2);  //debug

        var name = "";
        //if (contactTypeFlag == "organization") {
        name = String(allContacts[i].businessName);
        //}
        //if (contactTypeFlag == "individual") {
        if (name.length == 0 || name.toLowerCase() == 'null') {
            name = String(allContacts[i].firstName + " " + allContacts[i].lastName);
        }

        Avo_LogDebug("Name(" + name + ")", 2);  //debug

        var email = allContacts[i].email;
        if (!email || String(email).length == 0 || String(email).indexOf("@") == -1 || String(email).indexOf(".") == -1) {
            Avo_LogDebug("Invalid email " + email, 1);
            continue;
        }

        var contactType = String(allContacts[i].contactType);
        Avo_LogDebug("Contact type(" + contactType + ")", 2);	//debug

        if (contactType != "Applicant") {
            continue;
        }

        var success = sendNotification(null, email, "", template, params, new Array(), capId);
        if (success == true) {
            Avo_LogDebug('Notification "' + template + '" sent to "' + contactType + '" ' + name + ' at ' + email, 1);
        } else {
            Avo_LogDebug('Failed to send notification "' + template + '" to "' + contactType + '" ' + name + ' at ' + email, 1);
        }
    }

    // Get Owmers
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
})();