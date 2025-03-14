/*
Subscript Name: AMNESTY_ASIUPDATEAFTER.js
Converted from Std Choice: AMNESTY_ASIUpdateAfter
Called From Scripts:
ApplicationSpecificInfoUpdateAfter
 */

params = aa.util.newHashtable();
var updateAndSendEmail = false;
if (EXTENSIONINFO.length > 0 && EXTENSIONINFO[EXTENSIONINFO.length - 1]['Email Sent'].fieldValue != 'CHECKED') {
    updateAndSendEmail = true;
}

if (updateAndSendEmail) {
    var daysExtended = EXTENSIONINFO[EXTENSIONINFO.length - 1]['# of Days Extended'].fieldValue;
    var newProjectEndDate = dateAdd(null, daysExtended);
}

if (updateAndSendEmail) {
    params.put('$$PROJECTENDDATE$$', newProjectEndDate);
    sendAmnestyEmailNotification('AMNESTY TIMELINE UPDATED NOTIFICATION');
}

if (updateAndSendEmail) {
    editAppSpecific('Project End Date', newProjectEndDate);
    editAppSpecific('Extension Granted', 'CHECKED');
}

if (updateAndSendEmail) {
    EXTENSIONINFO[EXTENSIONINFO.length - 1]['Email Sent'].fieldValue = 'CHECKED';
    removeASITable('EXTENSION INFO');
    addASITable('EXTENSION INFO', EXTENSIONINFO);
}
