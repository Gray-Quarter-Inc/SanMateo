/*******************************************************
| Script Title: reqLicProf(ID157)
| Created by: Nic Bunting
| Created on: 7Dev20
| Event: Before
| Usage: If no contact of type "Owner/Builder" And no lic profs Then block submittal and display message
| "Please enter a Licensed Contractor, or an Owner/Builder Contact on the previous page"
| Modified by: ()
*********************************************************/
/*------------------------------------------------------------------------------------------------------/
| Main Loop
/-----------------------------------------------------------------------------------------------------*/
try {
    (function () {
        Avo_LogDebug("ID157 reqLicProf()", 1);

        //showDebug = true;   //testing
        //cancel = true;  //testing

        var allContacts = cap.contactsGroup.toArray();
        for (var i in allContacts) {
            var capContactModel = allContacts[i];

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

            var refContactId = capContactModel.refContactNumber;
            Avo_LogDebug("Ref Contact ID(" + refContactId + ")", 2);	//debug

            var contactId = capContactModel.contactSeqNumber;
            Avo_LogDebug("Contact ID(" + contactId + ")", 2);   //debug

            var contactType = capContactModel.contactType;
            Avo_LogDebug("Contact Type(" + contactType + ")", 2);   //debug

            if (contactType != "Owner/Builder") {
                continue;
            }

            Avo_LogDebug('Found "Owner/Builder" contact. Exiting', 1);
            return;
        }

        var allLicProfs = new Array();

        if (cap.licenseProfessionalList) {
            allLicProfs = cap.licenseProfessionalList.toArray();
            for (var i in allLicProfs) {
                var licProf = allLicProfs[i]

                var licNum = licProf.licenseNbr;
                Avo_LogDebug("Lic #(" + licNum + ")", 2);   //debug

                var name = String(licProf.contactFirstName + " " + licProf.contactLastName);
                //var name = String(allLicProfs[i].businessName);

                Avo_LogDebug("Name(" + name + ")", 2);  //debug

                var licType = licProf.licenseType;
                Avo_LogDebug("Lic Type(" + licType + ")", 2);   //debug
            }
        }

        if (allLicProfs.length > 0) {
            return;
        }

        cancel = true;
        showMessage = true;
        showDebug = false;
        comment("Please enter a Licensed Contractor, or an Owner/Builder Contact on the previous page");
    })();

    //aa.env.setValue("CapModel", cap);
}
catch (ex) {
    Avo_LogDebug("ERROR: " + ex.message, 1);
}

// aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC Test: BLD_157_Before_ReqLicProf", debug); //debug

/*------------------------------------------------------------------------------------------------------/
| END Main Loop
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| BEGIN Functions
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| END Functions
/------------------------------------------------------------------------------------------------------*/