function createWasteManagementPlan() {

    //TODO: Make this field read only
    var greenHaloID = getAppSpecific("GreenHaloID");
    if (!matches(greenHaloID, null, undefined, "")) {

        logDebug("Already in Green Halo");
        return;
    }

    var projectType = getAppSpecific("Project Type");
    if (matches(projectType, null, undefined, "")) {
        var message = "'Project Type' is not selected";
        logDebug(message);
        return message;
    }
    var typeOfUse = getAppSpecific("Type of Use");
    if (matches(typeOfUse, null, undefined, "")) {
        var message = "'Type of Use' is not selected <br>";
        logDebug(message);
        return message;
    }

    var wmPlan = new WasteManagementPlan();

    var contacts = getContactArray();
    //company_name
    var companyName = "";

    for (x in contacts) {

        if (contacts[x].contactType == "Applicant") {


            if (contacts[x].businessName) {

                companyName = contacts[x].businessName;
            }
            else {

                companyName = contacts[x].firstName + " " + contacts[x].lastName;
            }
            wmPlan.companyName = companyName;

            //phone 
            //TODO: if null check phone 2. One should be required
            if (contacts[x].phone1) {

                wmPlan.phone = contacts[x].phone1;
            }
            else if (contacts[x].phone2) {

                wmPlan.phone = contacts[x].phone2;
            }
            else {

                wmPlan.phone = "NA";
            }


            //email

            wmPlan.email = contacts[x].email;


        }
    }

    //Get address data, primary
    //TODO: If no primary need to get first address
    var addr = getPrimaryCapAddress(capId);

    if (!matches(addr, null, undefined)) {
        //Need to clean up the formatting of concatenating these values
        var fullStreet = "";
        if (!matches(addr.houseNumberStart, null, undefined, ""))
            fullStreet += addr.houseNumberStart;
        if (!matches(addr.streetDirection, null, undefined, ""))
            fullStreet += " " + addr.streetDirection;
        if (!matches(addr.streetName, null, undefined, ""))
            fullStreet += " " + addr.streetName;
        if (!matches(addr.streetSuffix, null, undefined, ""))
            fullStreet += " " + addr.streetSuffix;

        if (fullStreet == "") {

            fullStreet = "NA";
        }
        wmPlan.street = fullStreet;
        wmPlan.apt_suite = addr.unitStart;
        wmPlan.city = "";
        wmPlan.state = addr.state;
        wmPlan.zipcode = addr.zip;
    }
    else {

        wmPlan.street = "NA";
        wmPlan.apt_suite = "NA";
        wmPlan.city = "NA";
        wmPlan.state = "NA";
        wmPlan.zipcode = "NA";
    }

    wmPlan.projectStartDate = sysDateMMDDYYYY;
    //TODO: They said to use built in end date but I cannot find it. Using 1 year for now
    wmPlan.projectEndDate = dateAdd(wmPlan.projectStartDate, "365");
    // default 0 to 1 as required on Green Halo website
    if (estValue == 0) {
        wmPlan.value = 1;
        wmPlan.permitValue = 1;
    }
    else {
        wmPlan.value = estValue;
        wmPlan.permitValue = estValue;
    }
    //TODO: Clarify which sq ft to use
    wmPlan.squareFootage = getAppSpecific("Building Sq Ft");
    wmPlan.PermitSqFootage = getAppSpecific("Building Sq Ft");
    var wDesc = workDescGet(capId);
    //TODO: Can we send empty string is this is empty?
    if (wDesc) {
        wmPlan.description = wDesc;
        wmPlan.permitNote = wDesc;
    }
    else {

        wmPlan.description = "NA";
        wmPlan.permitNote = "NA";
    }

    // project name
    wmPlan.projectName = projectType;

    wmPlan.projectType = projectType;
    wmPlan.permitProjectType = projectType;
    wmPlan.buildingType = typeOfUse;

    //wmPlan.password = " ";
    wmPlan.permit = capIDString;

    var requestSendResult = wmPlan.createProject();
    comment(requestSendResult);
    //aa.print(JSON.stringify(JSON.parse(requestSendResult)));

    var ghResponse = JSON.parse(requestSendResult);
    aa.print(ghResponse);
    //helperObjectInfo(ghResponse);
    logDebug(JSON.stringify(ghResponse));
    if (ghResponse.status == "success") {
        logDebug("Green Halo WMP Id: " + ghResponse.wmp_number)
        editAppSpecific("GreenHaloID", ghResponse.wmp_number);
        //editTaskSpecific("Permit Issuance", "WMP ID", ghResponse.wmp_number);
    } else {
        //handle errors
        logDebug("Error");
    }

    return ghResponse.status;
}

