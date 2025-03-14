function emailContact2(mSubj, mText)   // optional: Contact Type, default Applicant
{
    var replyTo = "noreply@smcgov.org";
    var contactType = "Applicant"
    var emailAddress = "";

    if (arguments.length == 3) contactType = arguments[2]; // use contact type specified

    var capContactResult = aa.people.getCapContactByCapID(capId);
    if (capContactResult.getSuccess()) {
        var Contacts = capContactResult.getOutput();
        for (yy in Contacts)
            if (contactType.equals(Contacts[yy].getCapContactModel().getPeople().getContactType()))
                if (Contacts[yy].getEmail() != null)
                    emailAddress = "" + Contacts[yy].getEmail();
    }

    if (emailAddress.indexOf("@") > 0) {
        aa.sendMail(replyTo, emailAddress, "", mSubj, mText);
        logDebug("Successfully sent email to " + contactType);
    }
    else
        logDebug("Couldn't send email to " + contactType + ", no valid email address");
}
/*******
This would be called from InspectionMultipleScheduleAfter and/or InspectionScheduleAfter
Assumes you have a standard choice called DEPARTMENT_INFORMATION that stores department spcific information for the email. ex:
Standard Choice Value: Building Department
Value Desc: $$DepartmentName$$:Building Department|$$DepartmentAddress$$:123 S Overhere St.|$$DepartmentCity$$:Salt Lake City|$$DepartmentState$$:UT|$$DepartmentContactPhone$$:999-999-9999|$$DepartmentContactEmail$$:buildingdept@ut.com
*************************/
