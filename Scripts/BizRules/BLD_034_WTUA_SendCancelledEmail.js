/*******************************************************
| Script/Function: sendCancelledEmail() - (ID34)
| Created by: Jei Yang
| Created on: 02Nov20
| Usage: When any task is set to status of "Canceled - Abandoned", or 'Canceled - Applicant Request"
|        send email template: "BLD_PERMITCANCELLED" to all contacts.
| Modified by: ()
*********************************************************/
(function () {
    var template = "BLD_PERMITCANCELLED";
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
    //address
    result = aa.address.getAddressByCapId(capId);
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
})();