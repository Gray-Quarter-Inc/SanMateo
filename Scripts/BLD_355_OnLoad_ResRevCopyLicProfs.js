/*******************************************************
| Script Title: resRevCopyLicProfs(ID355)
| Created by: Nic Bunting
| Created on: 15Jul21
| Event: OnLoad
| Usage: copy all lic profs from parent
| Modified by: ()
*********************************************************/
/*------------------------------------------------------------------------------------------------------/
| Main Loop
/-----------------------------------------------------------------------------------------------------*/
try {
    (function () {
        Avo_LogDebug("ID355 resRevCopyLicProfs()", 1);

        if (!parentCapId) {
            return;
        }

        var parentAltId = aa.cap.getCap(parentCapId).getOutput().capModel.altID;
        Avo_LogDebug("Parent(" + parentAltId + ")", 2);  //debug

        if (!cap.licenseProfessionalList) {
            cap.licenseProfessionalList = new java.util.ArrayList();
        }

        // Get Lic Profs from parent
        var parentCap = aa.cap.getCapViewBySingle4ACA(parentCapId);

        var copied = 0;

        var allLicProfs = parentCap.licenseProfessionalList;
        if (allLicProfs && allLicProfs.size() > 0) {
            for (var i = 0; i < allLicProfs.size(); i++) {
                var licProf = allLicProfs.get(i);

                var licNum = licProf.licenseNbr;
                Avo_LogDebug("Lic #(" + licNum + ")", 2);   //debug

                var name = String(licProf.contactFirstName + " " + licProf.contactLastName);
                //var name = String(allLicProfs[i].businessName);

                Avo_LogDebug("Name(" + name + ")", 2);  //debug

                var licType = licProf.licenseType;
                Avo_LogDebug("Lic Type(" + licType + ")", 2);   //debug

                var email = licProf.email;
                Avo_LogDebug("Email(" + email + ")", 2);    //debug

                licProf.capID = capId;

                cap.licenseProfessionalList.add(licProf);
                Avo_LogDebug("Copied lic prof " + name, 2); //debug
                copied++;
            }
        }

        Avo_LogDebug("Copied " + copied.toString() + " lic profs from parent " + parentAltId, 2);
    })();

    aa.env.setValue("CapModel", cap);
}
catch (ex) {
    Avo_LogDebug("ERROR: " + ex.message, 1);
}

aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC Test: BLD_355_OnLoad_ResRevCopyLicProfs", debug); //debug

/*------------------------------------------------------------------------------------------------------/
| END Main Loop
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| BEGIN Functions
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| END Functions
/------------------------------------------------------------------------------------------------------*/