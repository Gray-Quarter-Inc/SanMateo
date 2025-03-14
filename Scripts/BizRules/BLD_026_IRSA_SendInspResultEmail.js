/*******************************************************
| Script/Function: sendInspResultEmail() - (ID26)
| Created by: Nicolaj Bunting
| Created on: 23Oct20
| Usage: When inspection is resulted send notification "BLD_INSEPCTIONRESULTED" to "Applicant" contact, record Owner, and all Licensed Professionals
| Modified by: ()
*********************************************************/
(function () {
    var result = aa.cap.getCap(capId);
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get cap. " + result.errorType + ': ' + result.errorMessage, 1);
        return;
    }

    var capModel = result.getOutput().getCapModel();

    var altId = capModel.altID;

    var alias = capModel.appTypeAlias;
    Avo_LogDebug("Alias(" + alias + ")", 2);    //debug

    // Get address
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

    // Get parcel
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

    var allApplicantEmails = new Object();
    var allLicProfEmails = new Object();
    var allOwnerEmails = new Object();

    // Get contacts
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

        if (contactType != "Applicant" && contactType != "Owner" && contactType != "Licensed Professional") {
            continue;
        }

        allApplicantEmails[name] = email;
    }

    // Get LPs
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

        allLicProfEmails[name] = email;
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

        allOwnerEmails[name] = email;
    }

    // Send notifications
    var template = "BLD_INSEPCTIONRESULTED";
    //for (var i in inspIdArr) {
    //    var inspId = inspIdArr[i];
    Avo_LogDebug("Insp ID(" + inspId + ")", 2); //debug

    //// Get inspection details
    //var result = aa.inspection.getInspection(capId, inspId);
    //if (result.getSuccess() != true) {
    //    Avo_LogDebug("Failed to get Inspection " + inspId + ". " + result.errorType + ": " + result.errorMessage, 1);
    //    //continue;
    //    return;
    //}

    //var inspection = result.getOutput();
    //var inspModel = inspection.inspection;

    var params = aa.util.newHashtable();
    addParameter(params, "$$altID$$", altId);
    addParameter(params, "$$address$$", addr);
    addParameter(params, "$$parcelNumber$$", parcelNum);
    addParameter(params, "$$appType$$", alias);

    //var inspType = inspTypeArr[i];
    Avo_LogDebug("Insp Type(" + inspType + ")", 2);   //debug
    addParameter(params, "$$insp$$", String(inspType));

    //var inspSchedDate = aa.util.formatDate(new Date(inspection.scheduledDate.epochMilliseconds), "MM/dd/yyyy");
    //Avo_LogDebug("Insp Scheduled Date(" + inspSchedDate + ")", 2);   //debug
    //addParameter(params, "$$inspDate$$", String(inspSchedDate));

    Avo_LogDebug("Insp Result Date(" + inspResultDate + ")", 2);    //debug
    addParameter(params, "$$inspDate$$", String(inspResultDate));

    //var inspResult = inspResultArr[i];
    Avo_LogDebug("Insp Result(" + inspResult + ")", 2);   //debug
    addParameter(params, "$$inspResult$$", inspResult);

    //var inspComment = inspModel.resultComment;
    //Avo_LogDebug("Insp Comment(" + inspComment + ")", 2);   //debug
    //addParameter(params, "$$inspComment$$", inspComment);

    Avo_LogDebug("Insp Comment(" + inspComment + ")", 2); //debug
    addParameter(params, "$$inspComment$$", inspComment);

    // Send notification to Applicants
    for (var name in allApplicantEmails) {
        var email = allApplicantEmails[name];

        var success = sendNotification(null, email, "", template, params, new Array(), capId);
        if (success == true) {
            Avo_LogDebug('Notification "' + template + '" sent to "Applicant" ' + name + ' at ' + email, 1);
        } else {
            Avo_LogDebug('Failed to send notification "' + template + '" to "Applicant" ' + name + ' at ' + email, 1);
        }
    }

    // Send notification to Lic Prof
    for (var name in allLicProfEmails) {
        var email = allLicProfEmails[name];

        var success = sendNotification(null, email, "", template, params, new Array(), capId);
        if (success == true) {
            Avo_LogDebug('Notification "' + template + '" sent to licensed professional ' + name + ' at ' + email, 1);
        } else {
            Avo_LogDebug('Failed to send notification "' + template + '" to licensed professional ' + name + ' at ' + email, 1);
        }
    }

    // Send notification to Owner
    for (var name in allOwnerEmails) {
        var email = allOwnerEmails[name];

        var success = sendNotification(null, email, "", template, params, new Array(), capId);
        if (success == true) {
            Avo_LogDebug('Notification "' + template + '" sent to owner ' + name + ' at ' + email, 1);
        } else {
            Avo_LogDebug('Failed to send notification "' + template + '" to owner ' + name + ' at ' + email, 1);
        }
    }
    //}
})();