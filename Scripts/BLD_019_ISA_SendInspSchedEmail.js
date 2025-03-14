/*******************************************************
| Script/Function: sendInspSchedEmail() - (ID19)
| Created by: Nicolaj Bunting
| Created on: 20Oct20
| Usage: When inspection is scheduled If inspection name does not have "Final" in name Then send notification "BLD_INSPECTIONSCHEDULED" 
| to "Applicant" contact, record Owner, and all Licensed Professionals
| Modified by: Sheryll Tabamo - Feb 3 2021 - fixing the scheduledate parameter being passed to email notification
|              Jei Yang - Oct 6 2021 - fixing the invalid date issue (Exp Date shown as Sep 31, 2021 instead of Oct 1, 2021.)
*********************************************************/
(function () {
    //showDebug = true; //debug

    Avo_LogDebug("Insp Type(" + inspType + ")", 2);   //debug

    if (String(inspType).toUpperCase().indexOf('FINAL') != -1) {
        return;
    }

    var template = "BLD_INSPECTIONSCHEDULED";
    var params = aa.util.newHashtable();

    var result = aa.cap.getCap(capId);
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get cap. " + result.errorType + ': ' + result.errorMessage, 1);
        return;
    }

    var capModel = result.getOutput().getCapModel();

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
                    + " " + addressModel.unitStart : "") + ", " + addressModel.city + ", " + addressModel.state + ", "
                    + addressModel.zip;
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

    addParameter(params, "$$insp$$", String(inspType));

    Avo_LogDebug("Insp Date(" + inspSchedDate + ")", 2);   //debug //there seems to be a bug. Shown as Oct 6 when inspSchedDate is Oct 7.

    var inspectionSchedDate = Avo_GetDateFromAccelaDateString(inspSchedDate);

    if (vEventName == "InspectionMultipleScheduleAfter" || matches(currentUserID, "IVRUSER") == true) {
        inspectionSchedDate.setDate(inspectionSchedDate.getDate() + 1);
    }

    var formattedSchedDate = aa.util.formatDate(inspectionSchedDate, "MM/dd/yyyy");

    Avo_LogDebug("Actual Insp Date(" + formattedSchedDate + ")", 2);   //debug
    addParameter(params, "$$inspDate$$", String(formattedSchedDate));

    /*
    var inspectionInfo = aa.inspection.getInspection(capId, inspId).getOutput();
    var inspectModel = inspectionInfo.inspection;
    var inspectionSchedDate = inspectModel.getScheduledDate();
    var formattedSchedDate = aa.date.parseDate(aa.util.formatDate(inspectionSchedDate, "MM/dd/yyyy"));
    var actualSchedDate = addPadding(Number(formattedSchedDate.month)) + '/' + addPadding(Number(formattedSchedDate.dayOfMonth + 1)) + '/' + formattedSchedDate.year;

    Avo_LogDebug("Actual Insp Date(" + actualSchedDate + ")", 2);   //debug
    addParameter(params, "$$inspDate$$", String(actualSchedDate));
    */

    // Send notification to Applicant
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

    // Send notification to Owner
    var result = aa.owner.getOwnerByCapId(capId);
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get record owners. " + result.errorType + ": " + result.errorMessage, 1);
        return;
    }

    var allOwners = result.getOutput();
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
            Avo_LogDebug('Notification "' + template + '" sent to owner ' + name + ' at ' + email, 1);
        } else {
            Avo_LogDebug('Failed to send notification "' + template + '" to owner ' + name + ' at ' + email, 1);
        }
    }
})();

function addPadding(number) {
    return (number < 10 ? '0' : '') + number;
}

//aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC Prod: BLD_019_ISA_SendInspSchedEmail", debug); //debug