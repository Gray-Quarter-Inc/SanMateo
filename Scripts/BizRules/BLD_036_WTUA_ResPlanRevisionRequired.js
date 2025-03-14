/*******************************************************
| Script/Function: resPlanRevisionRequired() - (ID36)
| Created by: Jei Yang
| Created on: 28Oct20
| Usage: On WTUA - If the task Review Consolidation is set to status of Plan Revisions Required, 
|        send email tempalte "BLD_PLANREVISIONS_REQUIRED" to all contacts and licensed professionals.
| Modified by: ()
*********************************************************/
(function () {

    var template = "BLD_PLANREVISIONS_REQUIRED";
    var params = aa.util.newHashtable();


    //CAP
    var result = aa.cap.getCap(capId);
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get cap. " + result.errorType + ': ' + result.errorMessage, 1);
        return;
    }

    var capModel = result.getOutput().getCapModel();
    
    //altID
    var altId = capModel.altID;
    addParameter(params, "$$altID$$", altId);

    //address
    var result = aa.address.getAddressByCapId(capId);
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get addresses. " + result.errorType + ": " + result.errorMessage, 1);
        return;
    }

    var address = "";
    var allAddressModels = result.getOutput();
    Avo_LogDebug("Total Address(" + allAddressModels.length + ")", 2); //debug

    for (var i in allAddressModels) {
        var addressModel = allAddressModels[i];
        //If there is more than one address, find the primary one and get its address value.
        if (allAddressModels.length > 1 && addressModel.primaryFlag != "Y") {
            continue;
        }

        address = String(addressModel.displayAddress);
        if (!address || address.length == 0 || address.toLowerCase() == "null") {
            address = addressModel.houseNumberStart + " " + (addressModel.streetDirection ? addressModel.streetDirection + " " : "")
            + addressModel.streetName + " " + addressModel.streetSuffix + (addressModel.unitStart ? " " + addressModel.unitType
                + " " + addressModel.unitStart : "") + ", " + addressModel.city + ", " + addressModel.state + ", " + addressModel.zip;
        }

        Avo_LogDebug("Address(" + address + ")", 2); //debug
        break;
    }
    addParameter(params, "$$address$$", address);

    //parcelNumber
    var result = aa.parcel.getParcelByCapId(capId, aa.util.newQueryFormat());
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get parcels. " + result.errorType + ": " + result.errorMessage, 1);
        return;
    }

    var parcelNum = 'None';
    var allParcelModels = result.getOutput().toArray();
    for (var i in allParcelModels) {
        var parcelModel = allParcelModels[i];
        //If there is more than one parcel, find the primary parcel.
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
    Avo_LogDebug("Alias(" + alias + ")", 2); //debug
    addParameter(params, "$$appType$$", alias);

    var result = aa.cap.getCapDetail(capId);
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get cap detail. " + result.errorType + ": " + result.errorMessage, 1);
        return;
    }

    var capDetail = result.getOutput();
    var assignedUsername = capDetail.asgnStaff;
    if (!assignedUsername) {
        Avo_LogDebug("No Username defined.", 1);
        return;
    }

    Avo_LogDebug("Assigned Username(" + assignedUsername + ")", 2); //debug

    result = aa.people.getSysUserByID(assignedUsername);
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get sysUser " + assignedUsername + ". "+ result.errorType + ": " + result.errorMessage, 1);
    }
    var sysUserModel = result.getOutput();

    var contactName = "Online Permits";
    var contactPhone = "";
    var contactEmail = "BuildingCounter@smcgov.org";

    if (sysUserModel) {
        Avo_LogDebug("Assigned Name(" + sysUserModel.fullName + ")", 2); //debug
        Avo_LogDebug("Assigned Phone #(" + sysUserModel.phoneNumber + ")", 2); //debug
        Avo_LogDebug("Assigned Email(" + sysUserModel.email + ")", 2); //debug

        if (sysUserModel.fullName && sysUserModel.fullName.length > 0) {
            contactName = sysUserModel.fullName;
        }
        if (sysUserModel.phoneNumber && sysUserModel.phoneNumber.length > 0) {
            contactPhone = sysUserModel.phoneNumber;
        }
        if (sysUserModel.email && sysUserModel.email.length > 0) {
            contactEmail = sysUserModel.email;
        }
    }

    //countyContactAssignedToRecord
    Avo_LogDebug("contactName(" + contactName + ")", 2); //debug
    addParameter(params, "$$countyContactAssignedToRecord$$", contactName);

    //countyContactAssignedPhoneNumber
    Avo_LogDebug("contactPhone(" + contactPhone + ")", 2); //debug
    addParameter(params, "$$countyContactAssignedPhoneNumber$$", contactPhone);

    //countyContactAssignedEmail
    Avo_LogDebug("contactEmail(" + contactEmail + ")", 2); //debug
    addParameter(params, "$$countyContactAssignedEmail$$", contactEmail);




    //Send email to all contacts
    var allContacts = getContactArray(capId);

    for (var i in allContacts) {
        var peopleModel = allContacts[i].peopleModel;
        var contactTypeFlag = peopleModel.contactTypeFlag;
        Avo_LogDebug("Contact type flag(" + contactTypeFlag + ")", 2); //debug

        var name = "";
        if (contactTypeFlag == "individual") {
            name = String(allContacts[i].firstName + " " + allContacts[i].lastName);
        }
        if (contactTypeFlag == "organization") {
            name = String(allContacts[i].businessName);
        }

        var email = allContacts[i].email;
        if (!email || String(email).length == 0 || String(email).indexOf("@") == -1 || String(email).indexOf(".") == -1) {
            Avo_LogDebug("Invalid email " + email, 1);
            continue;
        }

        var contactType = String(allContacts[i].contactType);
        Avo_LogDebug("Contact type(" + contactType + ")", 2);	//debug

        var contactType = String(allContacts[i].contactType);
        if (contactType != "Applicant" && contactType != "Owner" && contactType != "Licensed Professional") {
            continue;
        }

        var success = sendNotification(null, email, "", template, params, new Array(), capId);
        if (success == true) {
            Avo_LogDebug('Notification "' + template + '" sent to ""' + contactType + '" ' + name + ' at ' + email, 1);
        } else {
            Avo_LogDebug('Failed to send notification "' + template + '" to "' + contactType + '" ' + name + ' at ' + email, 1);
        }
    }

    //Send email to licenced professionals
    var allLicProfs = getLicenseProfessional(capId);
    for (var i in allLicProfs) {
        var licNum = allLicProfs[i].licenseNbr;
        Avo_LogDebug("Lic #(" + licNum + ")", 2); //debug

        var name = String(allLicProfs[i].contactFirstName + " " + allLicProfs[i].contactLastName);
        var email = allLicProfs[i].email;
        if (!email || String(email).length == 0 || String(email).indexOf("@") == -1 || String(email).indexOf(".") == -1) {
            Avo_LogDebug("Invalid email " + email, 1);
            continue;
        }
        var licType = allLicProfs[i].licenseType;
        Avo_LogDebug("Lic Type(" + licType + ")", 2);   //debug

        var success = sendNotification(null, email, "", template, params, new Array(), capId);
        if (success == true) {
            Avo_LogDebug('Notification "' + template + '" sent to licensed professional ' + name + ' at ' + email, 1);
        } else {
            Avo_LogDebug('Failed to send notification "' + template + '" to licensed professional ' + name + ' at ' + email, 1);
        }
    }



})();