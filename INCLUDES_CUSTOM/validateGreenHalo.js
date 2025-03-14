function validateGreenHalo() {
    var greenHaloID = getAppSpecific("GreenHaloID");
    var projectType = getAppSpecific("Project Type");
    var typeOfUse = getAppSpecific("Type of Use");
    if (matches(greenHaloID, null, undefined, "")) {

        var messageToUser = "";

        if (matches(projectType, null, undefined, "")) {
            messageToUser += "'Project Type' is not selected <br>";
        }
        if (matches(typeOfUse, null, undefined, "")) {
            messageToUser += "'Type of Use' is not selected <br>";
        }

        var hasApplicant = false;
        var isValidApplicant = true;
        var contacts = getContactArray();

        for (var x in contacts) {

            logDebug("contacts[x].email " + contacts[x].email)
            if (contacts[x].contactType == "Applicant") {

                hasApplicant = true;

                if (!contacts[x].email) {
                    isValidApplicant = false;
                    break;
                }

            }
        }

        var hasAddress = true;
        var isValidAddress = true;
        var addr = getPrimaryCapAddress(capId);
        logDebug("addr " + addr)
        if (matches(addr, null, undefined)) {

            hasAddress = false;
        }
        else {

            if (!addr.zip) {

                isValidAddress = false;
            }
        }

        if (!hasApplicant) {

            messageToUser += "There is no Applicant contact <br>"
        }

        if (!isValidApplicant) {

            messageToUser += "The contact does not have an email <br>"
        }
        if (!hasAddress) {

            messageToUser += "There is no primary address associated with this record <br>"
        }

        if (!isValidAddress) {

            messageToUser += "The primary address does not have a zip code <br>"
        }

        if (messageToUser.length > 0) {

            showMessage = true;
            //cancel = true;
            comment("Cannot create a Green Halo project because: <br>" + messageToUser);
            comment("Please add the missing data and resave the Details");
            return false;
        }
        else {

            return true;
        }
    }
}
/*----------------------------------------------------------------------------------------------------/
| Green Halo Notification Functions
| Functions used to create new or attach records to Waste Management Plans
| Created by Accela 06/12/2015
/----------------------------------------------------------------------------------------------------*/
