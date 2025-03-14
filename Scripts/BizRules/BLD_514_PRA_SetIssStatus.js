/*******************************************************
| Script/Function: setIssStatus(ID514)
| Created by: Nicolaj Bunting
| Created on: 28Sep23
| Usage: On payment If record status is "Pending Payment" Then set record status to "Issued", If parcel
| field "Fire District" is in std choice "Auto_Issue_Fire_District_Contact_Info" Then schedule insp
| "Final by Fire" for 30 days from today, generate report "Building Permit", send notification
| If parcel attribute "Fire District" exists in std choice "Auto_Issue_Fire_District_Contact_Info" Then
| "Auto_Issue_Fire_District" Else "Auto_Issue_No_Fire_District" with report attached to all contact types
| using std choice "Auto_Issue_Fire_District_Contact_Info"
| Modified by: ()
*********************************************************/
(function () {
    var recordStatus = String(cap.capStatus);
    Avo_LogDebug("Status(" + recordStatus + ")", 2);  //debug

    if (recordStatus != "Pending Payment") {
        return;
    }

    updateAppStatus("Issued", "Updated by ID514", capId);

    // Get fire district
    var allParcelAttrs = new Array();
    loadParcelAttributes(allParcelAttrs, capId);

    var fireDist = String(allParcelAttrs["ParcelAttribute." + "Fire District".toUpperCase()]);
    Avo_LogDebug("Fire District(" + fireDist + ")", 2); //debug

    var stdChoice = "Auto_Issue_Fire_District_Contact_Info";

    var result = aa.bizDomain.getBizDomain(stdChoice);
    if (result.getSuccess() !== true) {
        Avo_LogDebug("Failed to get values from standard choice " + stdChoice + ". "
            + result.errorType + ": " + result.errorMessage, 1);
        return;
    }

    var matchingDistrict = false;
    var stdChoiceArray = result.getOutput().toArray();
    for (var i in stdChoiceArray) {
        var value = String(stdChoiceArray[i].bizdomainValue);
        Avo_LogDebug("Value(" + value + ")", 2);    //debug

        //var desc = String(stdChoiceArray[i].description);

        if (value != fireDist) {
            continue;
        }

        matchingDistrict = true;
        Avo_LogDebug("Found matching fire district", 1);
        break;
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

    var capTypeModel = cap.capType;
    var recordTypeAlias = String(capTypeModel.alias);
    Avo_LogDebug("Record Type Alias(" + recordTypeAlias + ")", 2); //debug

    if (matchingDistrict == true) {
        Bld_514_FireDistrict(stdChoice, fireDist, reportName, reportParams, module, altId,
            recordTypeAlias);
    } else {
        Bld_514_NoFireDistrict(reportName, reportParams, module, altId, recordTypeAlias);
    }
})();

function Bld_514_FireDistrict(stdChoice, fireDist, reportName, reportParams, module, altId,
    recordTypeAlias) {
    // Sched inspection
    scheduleInspectDate("Final by Fire", dateAdd(null, 30));

    // Send emails
    var template = "Auto_Issue_Fire_District";

    var params = aa.util.newHashtable();
    addParameter(params, "$$altID$$", altId);

    var addr = Bld_514_GetAddr();
    addParameter(params, "$$address$$", addr);

    var parcelNum = Bld_514_GetParcelNum();
    if (parcelNum == null) {
        Avo_LogDebug("Failed to get parcel #", 1);
        return;
    }

    addParameter(params, "$$parcelNumber$$", parcelNum);

    addParameter(params, "$$appType$$", recordTypeAlias);

    addParameter(params, "$$FireDistrict$$", fireDist);

    var contactInfo = String(lookup(stdChoice, fireDist));
    addParameter(params, "$$ContactInfo$$", contactInfo);

    var report = generateReport(capId, reportName, module, reportParams);
    Avo_LogDebug("Generated report " + reportName, 1);

    var reportArr = new Array();
    reportArr.push(report);

    var allContacts = getContactArray(capId);
    for (var i in allContacts) {
        var peopleModel = allContacts[i].peopleModel;
        var contactTypeFlag = peopleModel.contactTypeFlag;
        Avo_LogDebug("Contact type flag(" + contactTypeFlag + ")", 2);  //debug

        var name = "";
        if (contactTypeFlag == "individual"
            || matches(contactTypeFlag, null, "null", "", undefined) == true) {
            name = String(allContacts[i].firstName + " " + allContacts[i].lastName);
        }
        if (contactTypeFlag == "organization"
            || matches(allContacts[i].firstName, null, "null", "", undefined) == true
            || matches(allContacts[i].lastName, null, "null", "", undefined) == true) {
            name = String(allContacts[i].businessName);
        }

        Avo_LogDebug("Name(" + name + ")", 2);  //debug

        var contactType = String(allContacts[i].contactType);
        Avo_LogDebug("Contact type(" + contactType + ")", 2);	//debug

        var email = allContacts[i].email;
        if (matches(email, null, "null", "", undefined) == true
            || String(email).length == 0
            || String(email).indexOf("@") == -1
            || String(email).indexOf(".") == -1) {
            Avo_LogDebug("Invalid email " + email, 1);
            continue;
        }

        var emailToSendTo = email;
        var success = sendNotification(null, emailToSendTo, "", template, params, reportArr, capId);
        if (success == true) {
            Avo_LogDebug('Notification "' + template + '" sent to "' + contactType + '" '
                + name + ' at ' + emailToSendTo + ' with report "' + reportName + '" attached', 1);
        } else {
            Avo_LogDebug('Failed to send notification "' + template + '" to "' + contactType
                + '" ' + name + ' at ' + emailToSendTo, 1);
        }
    }
}

function Bld_514_NoFireDistrict(reportName, reportParams, module, altId, recordTypeAlias) {
    // Send emails
    var template = "Auto_Issue_No_Fire_District";

    var params = aa.util.newHashtable();
    addParameter(params, "$$altID$$", altId);

    var addr = Bld_514_GetAddr();
    addParameter(params, "$$address$$", addr);

    var parcelNum = Bld_514_GetParcelNum();
    if (parcelNum == null) {
        Avo_LogDebug("Failed to get parcel #", 1);
        return;
    }

    addParameter(params, "$$parcelNumber$$", parcelNum);

    addParameter(params, "$$appType$$", recordTypeAlias);

    var report = generateReport(capId, reportName, module, reportParams);
    Avo_LogDebug("Generated report " + reportName, 1);

    var reportArr = new Array();
    reportArr.push(report);

    var allContacts = getContactArray(capId);
    for (var i in allContacts) {
        var peopleModel = allContacts[i].peopleModel;
        var contactTypeFlag = peopleModel.contactTypeFlag;
        Avo_LogDebug("Contact type flag(" + contactTypeFlag + ")", 2);  //debug

        var name = "";
        if (contactTypeFlag == "individual"
            || matches(contactTypeFlag, null, "null", "", undefined) == true) {
            name = String(allContacts[i].firstName + " " + allContacts[i].lastName);
        }
        if (contactTypeFlag == "organization"
            || matches(allContacts[i].firstName, null, "null", "", undefined) == true
            || matches(allContacts[i].lastName, null, "null", "", undefined) == true) {
            name = String(allContacts[i].businessName);
        }

        Avo_LogDebug("Name(" + name + ")", 2);  //debug

        var contactType = String(allContacts[i].contactType);
        Avo_LogDebug("Contact type(" + contactType + ")", 2);	//debug

        var email = allContacts[i].email;
        if (matches(email, null, "null", "", undefined) == true
            || String(email).length == 0
            || String(email).indexOf("@") == -1
            || String(email).indexOf(".") == -1) {
            Avo_LogDebug("Invalid email " + email, 1);
            continue;
        }

        var emailToSendTo = email;
        var success = sendNotification(null, emailToSendTo, "", template, params, reportArr, capId);
        if (success == true) {
            Avo_LogDebug('Notification "' + template + '" sent to "' + contactType + '" '
                + name + ' at ' + emailToSendTo + ' with report "' + reportName + '" attached', 1);
        } else {
            Avo_LogDebug('Failed to send notification "' + template + '" to "' + contactType
                + '" ' + name + ' at ' + emailToSendTo, 1);
        }
    }
}

function Bld_514_GetAddr() {
    var addr = "";

    var result = aa.address.getAddressByCapId(capId);
    if (result.getSuccess() != true) {
        Avo_LogDebug('Failed to get addresses. '
            + result.errorType + ": " + result.errorMessage, 1);
        return addr;
    }

    var allAddressModels = result.getOutput();
    for (var i in allAddressModels) {
        var addressModel = allAddressModels[i];
        if (allAddressModels.length > 1 && addressModel.primaryFlag != "Y") {
            continue;
        }

        addr = String(addressModel.displayAddress);
        if (matches(addr.toLowerCase(), null, "null", "", undefined, "undefined") == true) {
            addr = addressModel.houseNumberStart + " "
                + (addressModel.streetDirection ? addressModel.streetDirection + " " : "")
                + addressModel.streetName + " " + addressModel.streetSuffix
                + (addressModel.unitStart ? " " + addressModel.unitType
                    + " " + addressModel.unitStart : "") + ", " + addressModel.city + ", "
                + addressModel.state + ", " + addressModel.zip;
        }

        break;
    }
    Avo_LogDebug("Address(" + addr + ")", 2);   //debug

    return addr;
}

function Bld_514_GetParcelNum() {
    var parcelNum = null;

    var result = aa.parcel.getParcelByCapId(capId, aa.util.newQueryFormat());
    if (result.getSuccess() != true) {
        Avo_LogDebug('Failed to get parcels. ' + result.errorType + ": " + result.errorMessage, 1);
        return parcelNum;
    }

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

    if (matches(parcelNum, null, "null", "", undefined) == true) {
        return null;
    }

    return parcelNum;
}