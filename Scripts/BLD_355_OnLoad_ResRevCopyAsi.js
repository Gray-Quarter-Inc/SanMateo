/*******************************************************
| Script Title: resRevCopyAsi(ID355)
| Created by: Nic Bunting
| Created on: 15Jul21
| Event: OnLoad
| Usage: copy all ASI from parent
| Modified by: ()
*********************************************************/
/*------------------------------------------------------------------------------------------------------/
| Main Loop
/-----------------------------------------------------------------------------------------------------*/
try {
    (function () {
        Avo_LogDebug("ID355 resRevCopyAsi()", 1);

        if (!parentCapId) {
            return;
        }

        parentCap = aa.cap.getCapViewBySingle4ACA(parentCapId);
        copyAppSpecific4ACA(parentCap);
    })();

    aa.env.setValue("CapModel", cap);
}
catch (ex) {
    Avo_LogDebug("ERROR: " + ex.message, 1);
}

aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC Supp: BLD_355_OnLoad_ResRevCopyAsi", debug); //debug

/*------------------------------------------------------------------------------------------------------/
| END Main Loop
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| BEGIN Functions
/------------------------------------------------------------------------------------------------------*/
function copyAppSpecific4ACA(capFrom) { // copy all App Specific info into new Cap
    var i = capFrom.getAppSpecificInfoGroups().iterator();

    while (i.hasNext()) {
        var group = i.next();
        var fields = group.getFields();
        if (fields != null) {
            var iteFields = fields.iterator();
            while (iteFields.hasNext()) {
                var field = iteFields.next();

                editAppSpecific4ACA(field.getCheckboxDesc(), field.getChecklistComment());
            }
        }
    }
}

/*------------------------------------------------------------------------------------------------------/
| END Functions
/------------------------------------------------------------------------------------------------------*/