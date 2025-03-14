/*******************************************************
| Script/Function: hvacSendPermitIssuedEmail() - (ID25)
| Created by: Nicolaj Bunting
| Created on: 22Oct20
| Usage: On submit If ASI "New or Replacement" is "Replacement" Then send notification "BLD_ACAOTC_PERMITISSUED" with report "ACA Permit" attached to 
| "Applicant" contact
| Modified by: ()
*********************************************************/
(function () {
    var replacement = String(getAppSpecific("New or Replacement", capId));
    Avo_LogDebug("New or Replacement(" + replacement + ")", 2); //debug

    if (replacement.toLowerCase() != "replacement") {
        return;
    }

    var template = "BLD_ACAOTC_PERMITISSUED";
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

    //Assigned Name
    var assignedName = "Online Permits";
    Avo_LogDebug("Assigned Name(" + assignedName + ")", 2);    //debug
    addParameter(params, "$$countyContactAssignedToRecord$$", assignedName);
    //Assigned Email
    var assignedEmail = "buildingcounter@smcgov.org";
    Avo_LogDebug("Assigned Email(" + assignedEmail + ")", 2);    //debug
    addParameter(params, "$$countyContactAssignedEmail$$", assignedEmail);

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

    // Generate report to attach
    var reportName = "ACA Permit";
    var reportParams = aa.util.newHashMap();
    reportParams.put("capid", altId);

    var recipientList = "";

    // Send notification to Applicants and Owners
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

        if (recipientList.length > 0) {
            recipientList += ',';
        }

        recipientList += email;
        Avo_LogDebug('Added "' + contactType + '" ' + name + ' at ' + email + ' to recipient list', 1);
    }

    var scriptName = "SMC_SendEmailWithReportAsync";
    var envParameters = aa.util.newHashMap();
    envParameters.put("CapID", capId);
    envParameters.put("User", currentUserID);
    envParameters.put("EmailTemplate", template);
    envParameters.put("EmailParams", params);
    envParameters.put("ReportName", reportName);
    envParameters.put("ReportParams", reportParams);
    envParameters.put("RecipientList", recipientList);

    aa.runAsyncScript(scriptName, envParameters);
    Avo_LogDebug("Executing async script : " + scriptName, 1);
})();