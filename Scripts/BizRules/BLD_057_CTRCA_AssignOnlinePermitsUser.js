/*******************************************************
| Script/Function: assignOnlinePermitsUser() - (ID57)
| Created by: Nicolaj Bunting
| Created on: 2Nov20
| Usage: On submittal If in ACA Then assign user "ONLINE PERMITS" to record, set assigned date to today
| Modified by: ()
*********************************************************/
(function () {
    var username = "ONLINE PERMITS";
    var result = aa.person.getUser(username);
    if (result.getSuccess() != true) {
        Avo_LogDebug('Failed to get user "' + username + '". ' + result.errorType + ": " + result.errorMessage, 1);
        return;
    }

    var user = result.getOutput();
    if (!user) {
        return;
    }

    var capDetail = aa.cap.getCapDetail(capId).getOutput();

    var dept = String(user.getDeptOfUser());
    Avo_LogDebug("Dept(" + dept + ")", 2); //debug
    capDetail.setAsgnDept(dept);

    var username = String(user.getUserID());
    Avo_LogDebug("Username(" + username + ")", 2); //debug
    capDetail.setAsgnStaff(username);

    capDetail.asgnDate = aa.date.parseDate(aa.util.formatDate(new Date(), "MM/dd/yyyy"));

    result = aa.cap.editCapDetail(capDetail.capDetailModel);
    if (result.getSuccess() != true) {
        Avo_LogDebug('Failed to assign user "' + username + '" to record. ' + result.errorType + ': ' + result.errorMessage, 1);
        return;
    }

    Avo_LogDebug('Assigned user "' + username +'" to record', 1);
})();