/*******************************************************
| Script Title: apoCheck(ID405)
| Created by: Nic Bunting
| Created on: 2Jun22
| Event: Before
| Usage: If ASI "Address known" is "Yes" And no address Then block submittal, display message
| "You must add Address Information"
| Modified by: ()
*********************************************************/
/*------------------------------------------------------------------------------------------------------/
| Main Loop
/-----------------------------------------------------------------------------------------------------*/
try {
    (function () {
        Avo_LogDebug("ID405 apoCheck()", 1);

        var addrKnown = String(AInfo["Address known"]);
        Avo_LogDebug("Addr Known(" + addrKnown + ")", 2);   //debug

        if (addrKnown != "Yes") {
            return;
        }

        var addr = cap.addressModel;
        if (matches(addr, null, "null", "", undefined) != true) {
            Avo_LogDebug("Addr(" + addr.displayAddress + ")", 2);   //debug
        }

        var totalAddrs = 0;
        if (cap.addressModels) {
            totalAddrs = cap.addressModels.size();
        }

        Avo_LogDebug("Total Addrs(" + totalAddrs + ")", 2); //debug

        if (matches(addr, null, "null", "", undefined) != true || totalAddrs > 0) {
            return;
        }

        cancel = true;
        showMessage = true;
        comment("You must add Address Information");
    })();

    //aa.env.setValue("CapModel", cap);
}
catch (ex) {
    Avo_LogDebug("ERROR: " + ex.message, 1);
}

//aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC Prod: DPW_405_Before_APOCheck", debug); //debug

/*------------------------------------------------------------------------------------------------------/
| END Main Loop
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| BEGIN Functions
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| END Functions
/------------------------------------------------------------------------------------------------------*/