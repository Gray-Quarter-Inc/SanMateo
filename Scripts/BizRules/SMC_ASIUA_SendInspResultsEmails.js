/*******************************************************
| Script/Function: sendInspResultsEmails()
| Created by: Nicolaj Bunting
| Created on: 18Aug20
| Usage: on ASI update If current user is KHOBDAY Then send emails with attachments
| Modified by: ()
*********************************************************/
(function () {
    if (matches(currentUserID, "KHOBDAY") !== true) {
        return;
    }

    var myHashMap = aa.util.newHashMap();
    myHashMap.put("p1Value", "4647168");
    sendEmailwAttchmnt("noreply@accela.com", "ekimmel@smcgov.org", "", "Inspection Results", "Please see attached Inspection Report", "Guide Sheet Data eMail", myHashMap);

    myHashMap = aa.util.newHashMap();
    myHashMap.put("p1Value", "4647168");
    mSubject = "Test subject";
    mText = "Text Body";
    reportName = "Guide Sheet Data eMail";
    emailContactWithAttachment(mSubj, mText, reportName, myHashMap);
})();