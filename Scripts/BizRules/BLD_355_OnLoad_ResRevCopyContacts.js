/*******************************************************
| Script Title: resRevCopyContacts(ID355)
| Created by: Nic Bunting
| Created on: 15Jul21
| Event: OnLoad
| Usage: copy all contacts from parent
| Modified by: ()
*********************************************************/
/*------------------------------------------------------------------------------------------------------/
| Main Loop
/-----------------------------------------------------------------------------------------------------*/
try {
    (function () {
        Avo_LogDebug("ID355 resRevCopyContacts()", 1);

        if (!parentCapId) {
            return;
        }

        var parentAltId = aa.cap.getCap(parentCapId).getOutput().capModel.altID;
        Avo_LogDebug("Parent(" + parentAltId + ")", 2);  //debug

        var copied = 0;
        var contactList = cap.getContactsGroup();

        var parentCap = aa.cap.getCapViewBySingle4ACA(parentCapId);
        var parentContactList = parentCap.getContactsGroup();
        for (var i = 0; i < parentContactList.size(); i++) {
            var capContactModel = parentContactList.get(i);

            var contactTypeFlag = capContactModel.contactTypeFlag;
            Avo_LogDebug("Contact type flag(" + contactTypeFlag + ")", 2);  //debug

            var name = "";
            if (contactTypeFlag == "individual") {
                name = String(capContactModel.firstName + " " + capContactModel.lastName);
            }
            if (contactTypeFlag == "organization") {
                name = String(capContactModel.businessName);
            }

            Avo_LogDebug("Name(" + name + ")", 2);  //debug

            var contactType = capContactModel.contactType;
            Avo_LogDebug("Contact type(" + contactType + ")", 2);  //debug

            var peopleModel = capContactModel.people;

            peopleModel.setContactSeqNumber(null);
            capContactModel.setComponentName(null);
            capContactModel.setCapID(capId);

            contactList.add(capContactModel);
            Avo_LogDebug("Copied " + contactType + " contact " + name, 2); //debug
            copied++;
        }

        cap.setContactsGroup(contactList);
        Avo_LogDebug("Copied " + copied.toString() + " contacts from parent " + parentAltId, 2);

        // Copy primary applicant
        var applicantModel = parentCap.getApplicantModel();
        applicantModel.getPeople().setContactSeqNumber(null);
        applicantModel.setComponentName(null);
        cap.setApplicantModel(applicantModel);
        Avo_LogDebug('Copied "Applicant" from parent ' + parentAltId, 2);
    })();

    aa.env.setValue("CapModel", cap);
}
catch (ex) {
    Avo_LogDebug("ERROR: " + ex.message, 1);
}

aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC Test: BLD_355_OnLoad_ResRevCopyContacts", debug); //debug

/*------------------------------------------------------------------------------------------------------/
| END Main Loop
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| BEGIN Functions
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| END Functions
/------------------------------------------------------------------------------------------------------*/