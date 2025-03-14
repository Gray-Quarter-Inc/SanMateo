/*******************************************************
| Script/Function: acaExtensionRequested(ID522)
| Created by: 
| Created on: 
| Usage: On document upload of "Extension Request" in ACA and If record status is "Permit Issued" Then set record status to
| "Extension Requested"
| Modified by: ()
*********************************************************/
(function () {
    var status = String(cap.capStatus);
    Avo_LogDebug("Status(" + status + ")", 2);  //debug

    if (status != "Permit Issued") {
        return;
    }

    var allDocs = documentModelArray.toArray();
    for (var i in allDocs) {
        var docModel = allDocs[i];

        var docId = docModel.documentNo
        Avo_LogDebug("Doc ID(" + docId + ")", 2);	//debug

        var name = String(docModel.docName);
        Avo_LogDebug("Name(" + name + ")", 2);	//debug

        var filename = String(docModel.fileName);
        Avo_LogDebug("Filename(" + filename + ")", 2);	//debug

        var uploadDate = new Date(docModel.fileUpLoadDate.time);
        Avo_LogDebug("Upload Date(" + aa.util.formatDate(uploadDate, "MM/dd/yyyy") + ")", 2);   //debug

        //var group = String(docModel.docGroup);
        //Avo_LogDebug("Group(" + group + ")", 2);    //debug

        //if (group != "BLD_RES_RRF") {
        //    continue;
        //}

        var category = String(docModel.docCategory);
        Avo_LogDebug("Category(" + category + ")", 2);  //debug

        if (category != "Extension Request | PWEX | 98") {
            continue;
        }
        updateAppStatus("Extension Requested", "Updated by ID414", capId);

        var template2 = "DPW_EXTENSION REQUEST APPLICANT"
        var template1 = "DPW_DOCUMENT UPLOAD NOTIFICATION";
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

        var email = "dpwpermit@smcgov.org";

        var success = sendNotification(null, email, "", template1, params, new Array(), capId);
        if (success == true) {
            Avo_LogDebug('Notification "' + template1 + '" sent to "' + email, 1);
        } else {
            Avo_LogDebug('Failed to send notification "' + template1 + '" to "' + email, 1);
        }


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

            var success = sendNotification(null, email, "", template2, params, new Array(), capId);
            if (success == true) {
                Avo_LogDebug('Notification "' + template2 + '" sent to "' + email, 1);
            } else {
                Avo_LogDebug('Failed to send notification "' + template2 + '" to "' + email, 1);
            }
        }
    }
})();

aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "",
    "SMC Prod: DPW_522_DUA_AcaExtensionRequested", debug);    //debug
