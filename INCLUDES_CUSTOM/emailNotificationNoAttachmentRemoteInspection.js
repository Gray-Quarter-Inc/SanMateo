function emailNotificationNoAttachmentRemoteInspection(contactTypesList, notificationTemplateOnsite, notificationTemplateRemote, vCapId) {
    //contact types separated by commas
    contactTypes = new Array;
    contactTypes = contactTypesList.split(",")
    var capId = vCapId
    var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
    if (!matches(acaURLDefault, null, undefined, ""))
        acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
    else
        acaURLDefault = null;

    var acaURL = acaURLDefault;
    report = null;
    contactArray = new Array;
    contactArray = getContactArray(capId);
    for (iCon in contactArray) {
        if (exists(contactArray[iCon]["contactType"], contactTypes)) {
            params = aa.util.newHashtable();
            tContact = contactArray[iCon];
            getRecordParams4Notification(params);
            getACARecordParam4Notification(params, acaURL, capId);
            getInspectionScheduleParams4Notification(params)
            addParameter(params, "$$ContactName$$", tContact["firstName"] + " " + tContact["lastName"]);
            getPrimaryAddressLineParam4Notification(params);
            getDepartmentParams4Notification(params, "Building Department");
            if (inspSchedDate) {
                addParameter(params, "$$inspSchedDate$$", inspSchedDate);
            }

            var hasRemoteInspectorURL = false;

            if (!matches(params.get("$$inspectorURL$$"), "NOT APPLICABLE - WILL BE ONSITE", "")) {
                hasRemoteInspectorURL = true;
            }


            if (!matches(tContact["email"], null, "", undefined)) {
                if (hasRemoteInspectorURL) {
                    sendNotification("civic.solutions@accela.com", tContact["email"], "", notificationTemplateRemote, params, null);
                }
                else {
                    sendNotification("civic.solutions@accela.com", tContact["email"], "", notificationTemplateOnsite, params, null);
                }
            }
        }
    }
}
/*----------------------------------------------------------------------------------------------------/
| GIS Related Functions
/----------------------------------------------------------------------------------------------------*/
/*******************************************************
| Script/Function: evaluateResult()
| Created by: Mike Buell
| Created on: 02June17
| Usage: put together string of value
| Modified by: 
| Modified on: 
*********************************************************/
