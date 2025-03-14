/*******************************************************
| Script/Function: sendPaymentDueEmail(ID404)
| Created by: Nicolaj Bunting
| Created on: 2Jun22
| Usage: When status set to "Payment Due" send notification "DPW_Payment_Due" to all "Applicant" contacts
| Modified by: ()
*********************************************************/
(function () {
    var template = "DPW_Payment_Due";

    var altId = cap.capModel.altID;

    var contactTypeToFind = "Applicant";
    var allContacts = getContactArray(capId);
    for (var i in allContacts) {
        var peopleModel = allContacts[i].peopleModel;
        var contactTypeFlag = peopleModel.contactTypeFlag;
        Avo_LogDebug("Contact type flag(" + contactTypeFlag + ")", 2);  //debug

        var name = "";
        if (contactTypeFlag == "individual" || matches(contactTypeFlag, null, "null", "", undefined) == true) {
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

        if (contactType != contactTypeToFind) {
            continue;
        }

        var email = allContacts[i].email;
        if (!email || String(email).length == 0 || String(email).indexOf("@") == -1 || String(email).indexOf(".") == -1) {
            Avo_LogDebug("Invalid email " + email, 1);
            continue;
        }

        var emailToSendTo = email;

        var params = aa.util.newHashtable();
        addParameter(params, "$$Applicant$$", name);
        addParameter(params, "$$RecordID$$", altId);
        addParameter(params, "$$FeeAmount$$", balanceDue);

        var success = sendNotification(null, emailToSendTo, "", template, params, new Array(), capId);
        if (success == true) {
            Avo_LogDebug('Notification "' + template + '" sent to "' + contactTypeToFind + '" ' + name + ' at '
                + emailToSendTo, 1);
        } else {
            Avo_LogDebug('Failed to send notification "' + template + '" to "' + contactTypeToFind + '" ' + name + ' at '
                + emailToSendTo, 1);
        }
    }
})();