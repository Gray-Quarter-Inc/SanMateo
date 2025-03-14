/*******************************************************
| Script/Function: sendPermitIssuedEmail() - (ID54)
| Created by: Nicolaj Bunting
| Created on: 22Oct20
| Usage: send notification "BLD_PERMITISSUED" with report "ACA Permit" attached to all contacts and licensed professionals,
| display any inspection that does not have a result of 'Pass' and has the word 'final' in the inspection type except 
| '901 Building Final', Else, display 'None', call ID75
| Modified by: Jei Yang
*********************************************************/
(function () {
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

    var result = aa.cap.getCapDetail(capId);
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get cap detail. " + result.errorType + ": " + result.errorMessage, 1);
        return;
    }

    var capDetail = result.getOutput();
    var assignedUsername = capDetail.asgnStaff;
    var sysUserModel;

    if (assignedUsername) {
        //if assignedUsername is not null, retrieve a sysUser data using the username.
        Avo_LogDebug("Assigned Username(" + assignedUsername + ")", 2); //debug

        result = aa.people.getSysUserByID(assignedUsername);
        if (result.getSuccess() != true) {
            Avo_LogDebug("Failed to get sysUser " + assignedUsername + ". "+ result.errorType + ": " + result.errorMessage, 1);
        }
        sysUserModel = result.getOutput();

    } else {
        Avo_LogDebug("No Username defined.", 1);
    }

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

    //Display any inspection that does not have a result of 'Pass' and has the word 'final' in the inspection type except 
    //'901 Building Final' else display 'None'

    // Check inspections
    var allInsps = new Array();
    var result = aa.inspection.getInspections(capId);
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to find any inspections. " + result.errorType + ": " + result.errorMessage, 1);
    } else {
        allInsps = result.getOutput();
    }

    Avo_LogDebug("Total Insps(" + allInsps.length + ")", 2);  //debug

    var finalInspList = new Object();

    for (var i in allInsps) {
        var insp = allInsps[i];

        var inspType = String(insp.inspectionType);
        Avo_LogDebug("Insp Type(" + inspType + ")", 2); //debug

        var inspResult = String(insp.inspectionStatus);
        Avo_LogDebug("Insp Result(" + inspResult + ")", 2); //debug

        if (inspResult == "Pass") {
            continue;
        }
        Avo_LogDebug("Found inspection " + inspType + " that does not have a result of 'Pass'", 1);
        
        if (inspType.toLowerCase().indexOf("final") != -1 && inspType != "901 Building Final") {
            finalInspList[inspType] = true;
        }
    }

    var finalList = "None";
    if (Object.keys(finalInspList).length > 0) {
        finalList = Object.keys(finalInspList).join(", ");
    }

    Avo_LogDebug("Final(" + finalList + ")", 2);    //debug
    addParameter(params, "$$Final$$", finalList);

    // Generate report to attach
    var reportName = "ACA Permit";
    var reportParams = aa.util.newHashMap();
    reportParams.put("capid", altId);

    var recipientList = "";

    // Send notification to all contacts
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

        if (recipientList.length > 0) {
            recipientList += ',';
        }

        recipientList += email;
        Avo_LogDebug('Added "' + contactType + '" ' + name + ' at ' + email + ' to recipient list', 1);
    }

    // Send notification to all Lic Profs
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

        if (recipientList.length > 0) {
            recipientList += ',';
        }

        recipientList += email;
        Avo_LogDebug('Added "' + licType + '" ' + name + ' at ' + email + ' to recipient list', 1);
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

    //Script 75 Set Expiration Date
    include("BLD_075_ASA_CTRCA_SetExpDate");
})();