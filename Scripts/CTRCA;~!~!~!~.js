//doConfigurableScriptActions()
// showMessage = true; 
// showDebug = true;

try {
    var settings = "ONLINE_PERMIT_EMAILS";
    var isGenericACA = false;
    var emailtemplate = "ONLINE_PERMIT_EMAIL";
    var emailFrom = lookup("ACA_EMAIL_TO_AND_FROM_SETTING", "RENEW_LICENSE_AUTO_ISSUANCE_MAILFROM");

    if (isGenericACA) {
        emailTo = lookup(settings, AInfo["Permit Type"]);
    } else {
        emailTo = lookup(settings, appTypeArray[0] + "/*/*/*");
        for (i = 0; i < 7; i++) {
            if (i > 0) {
                if (i == 1) {
                    emailTo = lookup(settings, appTypeArray[0] + "/" + appTypeArray[1] + "/" + appTypeArray[2] + "/*");
                } else if (i == 2) {
                    emailTo = lookup(settings, appTypeArray[0] + "/*/" + appTypeArray[2] + "/*");
                } else if (i == 3) {
                    emailTo = lookup(settings, appTypeArray[0] + "/*/" + appTypeArray[2] + "/" + appTypeArray[3]);
                } else if (i == 4) {
                    emailTo = lookup(settings, appTypeArray[0] + "/*/*/" + appTypeArray[3]);
                } else if (i == 5) {
                    emailTo = lookup(settings, appTypeArray[0] + "/" + appTypeArray[1] + "/*/" + appTypeArray[3]);
                } else if (i == 5) {
                    emailTo = lookup(settings, appTypeArray[0] + "/" + appTypeArray[1] + "/*/" + appTypeArray[3]);
                }
            }
            if (emailTo && emailTo != "") {
                break;
            }
        }
    }

    if (emailTo && emailTo != "") {
        var rTypeParam = appTypeAlias;
        if(isGenericACA){
            rTypeParam = AInfo["Permit Type"];
        }

        //create template parameters
        var tParams = aa.util.newHashtable();
        tParams.put("$$altID$$", capId.getCustomID());
        tParams.put("$$RecordType$$", rTypeParam);
        getRecordParams4Notification(tParams);

        
        asyncParams = aa.util.newHashMap();
        asyncParams.put("cap", cap);
        asyncParams.put("emailtemplate", emailtemplate);
        asyncParams.put("tParams", tParams);
        asyncParams.put("emailTo", emailTo);
        asyncParams.put("emailFrom", emailFrom);
        aa.runAsyncScript("SEND_ASYNC_EMAIL", asyncParams);
        
    }
} catch (e) {
    logDebug(capIDString + ": Problem while executing " + e.message + " on line " + e.lineNumber);
} 
/*finally
{

        aa.sendMail("jtu@accela.com", "noreply@standarddev.org", "Debug", debug);

}*/