//BLD_366_WTUA_ReadyLetter
/*******************************************************
| Script/Function: readyLetter() - (ID366)
| Created by: Jei Yang
| Created on: 12Aug21
| Usage: When task "Plan Preparation for Issuance" is set to the status of "Ready letter Issued" 
| send the notification template BLD_READYLETTER to the contact type "Applicant" "Owner/Builder" and all licensed professionals. Attach the report "Ready Letter" to the email
| Modified by: ()
*********************************************************/
(function () {
    var template = "BLD_READYLETTER";
    var params = aa.util.newHashtable();

    var result = aa.cap.getCap(capId);
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get cap. " + result.errorType + ': ' + result.errorMessage, 1);
        return;
    }

    var cap = result.getOutput();
    var capModel = cap.capModel;

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


    // Generate report to attach
    var reportName = "Ready Letter";
    var reportParams = aa.util.newHashMap();
    reportParams.put("capid", altId);

    var capTypeModel = cap.getCapType();
    var module = String(capTypeModel.getGroup());
    Avo_LogDebug("Module(" + module + ")", 2); //debug

    var report = generateReport(capId, reportName, module, reportParams);
    Avo_LogDebug('Generated report "' + reportName + '"', 1);

    var reportArr = new Array();
    reportArr.push(report);



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

        if (contactType != "Applicant" && contactType != "Owner/Builder") {
            continue;
        }

        var success = sendNotification(null, email, "", template, params, reportArr, capId);
        if (success == true) {
            Avo_LogDebug('Notification "' + template + '" sent to "' + contactType + '" ' + name + ' at ' + email, 1);
        } else {
            Avo_LogDebug('Failed to send notification "' + template + '" to "' + contactType + '" ' + name + ' at ' + email, 1);
        }
    }

    // Get Owmers
    /*
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
    */

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

        var success = sendNotification(null, email, "", template, params, reportArr, capId);
        if (success == true) {
            Avo_LogDebug('Notification "' + template + '" sent to "' + licType + '" ' + name + ' at ' + email, 1);
        } else {
            Avo_LogDebug('Failed to send notification "' + template + '" to "' + licType + '" ' + name + ' at ' + email, 1);
        }
    }


})();