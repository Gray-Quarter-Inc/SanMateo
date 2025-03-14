/*******************************************************
| Script/Function: sendPermitAppSubEmail() - (ID31)
| Created by: Nicolaj Bunting
| Created on: 27Oct20
| Usage: On submit send notification "BLD_PERMITAPP_SUBMITTED" to all contacts and licensed professionals
| Modified by: ()
*********************************************************/
(function () {
    var template = "BLD_PERMITAPP_SUBMITTED";
    var params = aa.util.newHashtable();

    var result = aa.cap.getCap(capId);
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get cap. " + result.errorType + ': ' + result.errorMessage, 1);
        return;
    }

    var cap = result.getOutput();
    var capModel = cap.capModel;

    var altId = capModel.altID;
    addParameter(params, "$$altID$$", altId);

    var result = aa.address.getAddressByCapId(capId);
    if (result.getSuccess() != true) {
        Avo_LogDebug('Failed to get addresses. ' + result.errorType + ": " + result.errorMessage, 1);
        return;
    }

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

    var result = aa.parcel.getParcelByCapId(capId, aa.util.newQueryFormat());
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

    var alias = capModel.appTypeAlias;
    Avo_LogDebug("Alias(" + alias + ")", 2);    //debug
    addParameter(params, "$$appType$$", alias);

    // Send notification to contacts
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