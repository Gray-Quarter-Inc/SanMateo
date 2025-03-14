function sendAmnestyEmailNotification(templateName) {
    try {
        var applicantEmail = null;
        var applicantFirstName = "";
        var applicantLastName = "";

        var contacts = getContactArray();
        for (var x in contacts) {
            if (contacts[x].contactType == "Applicant") {
                applicantEmail = contacts[x].email;
                applicantFirstName = contacts[x].firstName;
                applicantLastName = contacts[x].lastName;
            }
        }

        var capDetail = aa.cap.getCapDetail(capId).getOutput()
        var user = aa.person.getUser(capDetail.getAsgnStaff()).getOutput()
        aa.print(user.getFullName())

        if (applicantEmail) {
            params.put("$$APPLICANT$$", applicantEmail);
            params.put("$$RECORDID$$", capIDString);
            params.put("$$FIRSTNAME$$", applicantFirstName);
            params.put("$$LASTNAME$$", applicantLastName);

            if (user.getFullName()) {
                params.put("$$PLANNERNAME$$", user.getFullName());
            }
            else {
                params.put("$$PLANNERNAME$$", "Planner Name not available");
            }

            if (user.getPhoneNumber()) {
                params.put("$$PLANNERPHONE$$", user.getPhoneNumber());
            }
            else {
                params.put("$$PLANNERPHONE$$", "Phone number not available");
            }

            if (user.getEmail()) {
                params.put("$$PLANNEREMAIL$$", user.getEmail());
            }
            else {
                params.put("$$PLANNEREMAIL$$", "Email not available");
            }

            fileNames = new Array();
            sendNotification("noreply@smcgov.org", applicantEmail, user.getEmail(), templateName, params, fileNames)
        }
        else {
            showMessage = true;
            comment("The applicant does not have an associated email address so we cound not send the notification: " + templateName);
        }
    } catch (ex) {
        logDebug("A JavaScript Error occurred in FUNCTION sendAmnestyEmailNotification" + ex.message);
    }
}
