/*******************************************************
| Script/Function: setApplicantAsPrimary() - (ID92)
| Created by: Nicolaj Bunting
| Created on: 18Nov20
| Usage: On submit set "Applicant" as primary contact
| Modified by: ()
*********************************************************/
(function () {
    var result = aa.people.getCapContactByCapID(capId);
    if (result.getSuccess() != true) {
        Avo_LogDebug('Failed to get contacts. ' + result.errorType + ": " + result.errorMessage, 1);
        return;
    }

    var allContacts = result.getOutput();
    for (var i in allContacts) {
        var contact = allContacts[i];
        var capContactModel = contact.capContactModel;

        var contactTypeFlag = capContactModel.contactTypeFlag;
        Avo_LogDebug("Contact type flag(" + contactTypeFlag + ")", 2);  //debug

        var name = "";
        if (contactTypeFlag == "individual") {
            name = String(capContactModel.firstName + " " + capContactModel.lastName);
        }
        if (contactTypeFlag == "organization") {
            name = String(capContactModel.businessName);
        }

        var contactType = capContactModel.contactType;
        Avo_LogDebug("Contact Type(" + contactType + ")", 2);   //debug

        if (contactType != "Applicant") {
            continue;
        }

        var flag = capContactModel.primaryFlag;
        Avo_LogDebug("Flag(" + flag + ")", 2);	//debug

        if (flag == "Y") {
            Avo_LogDebug("Contact " + name + " already set as primary", 1);
            return;
        }

        capContactModel.primaryFlag = "Y";

        var result = aa.people.editCapContact(capContactModel);
        if (result.getSuccess() != true) {
            Avo_LogDebug('Failed to set contact ' + name + ' as primary. ' + result.errorType + ": " + result.errorMessage, 1);
            continue;
        }

        Avo_LogDebug('Set contact ' + name + ' as primary', 1);
        break;
    }
})();