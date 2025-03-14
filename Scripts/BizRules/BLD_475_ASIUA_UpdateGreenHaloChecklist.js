/*******************************************************
| Script/Function: updateGreenHaloChecklist() - (ID475)
| Created by: Tom Grzegorczyk
| Created on: 07Jun23
| Usage: See the service request 20472 
| Modified by: Tom Grzegorczyk (15Sep23) - integration should commence only if status is unset or set to "Required" and "GreenHaloID" is empty. 
*********************************************************/
(function () {
    var greenHalo = getAppSpecific("Green Halo");
    var greenHaloID = getAppSpecific("GreenHaloID");

    if (matches(greenHalo, "completed", "Completed", "COMPLETED", "not required", "Not Required", "NOT REQUIRED")) {
        logDebug("'Green Halo' checklist is marked as '" + greenHalo + "'");
        return;
    } else if (matches(greenHalo, "required", "Required", "REQUIRED") && !matches(greenHaloID, null, undefined, "")) {
        logDebug("Already in Green Halo");
        return;
    }

    var require = false;
    //Building/Full Review/NA/NA - All meet criteria
    //Building/Residential/New/NA - All meet criteria
    //Building/Residential/Detached Structure/Full Utilities - All meet criteria
    if ((appMatch("Building/Full Review/NA/NA", capId) == true) || (appMatch("Building/Residential/New/NA", capId) == true) || (appMatch("Building/Residential/Detached Structure/Full Utilities", capId) == true)) {
        require = true;
    }

    //Building/Residential/Addition/NA - when increasing Conditioned square footage.
    if ((appMatch("Building/Residential/Addition/NA", capId) == true)) {
        var resAddition = getAppSpecific("Addition");
        Avo_LogDebug("Addition(" + resAddition + ")", 2);
        var resAlteration = getAppSpecific("Alteration");
        Avo_LogDebug("Alteration(" + resAlteration + ")", 2);
        var proposedArea = Number(getAppSpecific("Proposed cumulative square footage of conditioned space"));
        Avo_LogDebug("proposedArea(" + proposedArea + ")", 2);
        var currentArea = Number(getAppSpecific("Existing cumulative square footage of conditioned space"));
        Avo_LogDebug("currentArea(" + currentArea + ")", 2);
        var remodeledArea = Number(getAppSpecific("What is the cumulative square footage of the areas being remodeled?"));
        Avo_LogDebug("remodeledArea(" + remodeledArea + ")", 2);
        var newArea = Number(getAppSpecific("New square footage of conditioned space being added to residence (sq ft)"));
        Avo_LogDebug("newArea(" + newArea + ")", 2);
        if (resAddition == "CHECKED") {
            if (newArea > 0)
                require = true;
        } else if (resAlteration == "CHECKED") {
            if (remodeledArea > 500) {
                require = true;
            }
        }
    }

    //Building/Residential/Demolition/NA - All Demolition permits meet the criteria, except Pool Demolition and Minor Demolition, where "What type of minor demolition is being performed?" = Accessory Structures < 120 sq ft
    if ((appMatch("Building/Residential/Demolition/NA", capId) == true)) {
        var minorDemolition = getAppSpecific("Minor demolition", capId);
        Avo_LogDebug("Minor demolition(" + minorDemolition + ")", 2);
        var majorDemolition = getAppSpecific("Major demolition", capId);
        Avo_LogDebug("Major demolition(" + majorDemolition + ")", 2);
        var poolDemolition = getAppSpecific("Pool demolition", capId);
        Avo_LogDebug("Pool demolition(" + poolDemolition + ")", 2);

        if (majorDemolition && majorDemolition.toUpperCase() == "CHECKED") {
            require = true;
        } else if (minorDemolition && minorDemolition.toUpperCase() == "CHECKED") {
            var demolitionType = getAppSpecific("What type of minor demolition is being performed?", capId);
            Avo_LogDebug("demolitionType(" + demolitionType + ")", 2);
            if (demolitionType != "Accessory Structures < 120 sq ft") {
                require = true;
            }
        }
    }

    //Building/Residential/Bath Kitchen Remodel/NA - "Kitchen Remodel" is CHECKED, or "Bath Remodel" is CHECKED with "What is the cumulative square footage of the areas being remodeled?" >500
    if (appMatch("Building/Residential/Bath Kitchen Remodel/NA", capId) == true) {
        var bathRemodel = getAppSpecific("Bath remodel", capId);
        Avo_LogDebug("Bath Remodel(" + bathRemodel + ")", 2);
        var kitchenRemodel = getAppSpecific("Kitchen Remodel", capId);
        Avo_LogDebug("Kitchen Remodel(" + kitchenRemodel + ")", 2);
        var remodeledArea = Number(getAppSpecific("What is the cumulative square footage of the areas being remodeled?", capId));
        Avo_LogDebug("Remodeled Area(" + remodeledArea + ")", 2);
        if (kitchenRemodel == "CHECKED" || (bathRemodel == "CHECKED" && remodeledArea > 500)) {
            require = true;
        }
    }

    if (require == true) {
        logDebug("'Green Halo' integration is required.");
        if (appMatch("Building/Residential/New/NA", capId) == true) {
            var projectType = getAppSpecific("Project Type", capId);
            var buildingType = getAppSpecific("Type of Use", capId);
            if (matches(projectType, null, undefined, "") || matches(buildingType, null, undefined, "")) {
                Avo_LogDebug("Required fields are empty:'Project Type' and/or 'Type of Use'", 1);
                return;
            }
            continueProcessing();
        } else {
            var projBuild = getWMProjectAndBuildingType();
            if (projBuild == null) {
                Avo_LogDebug("Unable to map 'Project Type' and 'Type of Use'");
            }
            else {
                if (projBuild.projectType)
                    editAppSpecific("Project Type", projBuild.projectType);
                if (projBuild.buildingType)
                    editAppSpecific("Type of Use", projBuild.buildingType);
                continueProcessing();
            }
        }
    }
})();

function continueProcessing() {
    Avo_LogDebug("Green Halo is required", 2);
    editAppSpecific("Green Halo", "Required");
/*
    var feeCode = "BLD_049";
    var feeSched = "BLD_GEN";
    var found = feeExists(feeCode);
    if (found != true) {
        var feeResult = updateFee(feeCode, feeSched, "FINAL", 1, "Y");
        if (feeResult) {
            Avo_LogDebug("Fee " + feeCode + " has been added with quantity of 1", 1);
        }
        else if (feeResult == null) {
            Avo_LogDebug("Fee " + feeCode + " has been adjusted to a quantity of 1", 1);
        } else {
            Avo_LogDebug("Failed to add fee " + feeCode, 1);
        }
    } else {
        Avo_LogDebug("Fee '" + feeCode + "' already exists.", 1);
    }
*/
    sendGreenHaloEmailToApplicant();

    var canCreateGreenHalo = validateGreenHalo();
    if (canCreateGreenHalo == true) {
        Avo_LogDebug("Creating Green Halo WMP", 1);
        createWasteManagementPlan();
    }
}

function sendGreenHaloEmailToApplicant() {
    try {
        var template = "GREENHALO_WASTEMANAGEMENT_NOTIFICATION";
        var params = aa.util.newHashtable();

        var result = aa.cap.getCap(capId);
        if (result.getSuccess() != true) {
            Avo_LogDebug("Failed to get cap. " + result.errorType + ': ' + result.errorMessage, 1);
            return;
        }

        var cap = result.getOutput();
        var capModel = cap.capModel;

        //altID
        var altId = capModel.altID;
        addParameter(params, "$$altID$$", altId);
        //address
        result = aa.address.getAddressByCapId(capId);
        if (result.getSuccess() != true) {
            Avo_LogDebug('Failed to get addresses. ' + result.errorType + ": " + result.errorMessage, 1);
            return;
        }

        var addr = "";
        var allAddressModels = result.getOutput();
        Avo_LogDebug("Total Addrs(" + allAddressModels.length + ")", 2);    //debug

        for (var i in allAddressModels) {
            var addressModel = allAddressModels[i];
            if (allAddressModels.length > 1 && addressModel.primaryFlag != "Y") {
                continue;
            }

            addr = String(addressModel.displayAddress);
            if (!addr || addr.length == 0 || addr.toLowerCase() == "null") {
                addr = addressModel.houseNumberStart + " " + (addressModel.streetDirection ? addressModel.streetDirection + " " : "")
                    + addressModel.streetName + " " + addressModel.streetSuffix + (addressModel.unitStart ? " " + addressModel.unitType
                        + " " + addressModel.unitStart : "") + ", " + addressModel.city + ", " + addressModel.state + ", " + addressModel.zip;

            }

            Avo_LogDebug("Address(" + addr + ")", 2);   //debug

            break;
        }
        addParameter(params, "$$address$$", addr);

        //appType
        var alias = capModel.appTypeAlias;
        Avo_LogDebug("Alias(" + alias + ")", 2);    //debug
        addParameter(params, "$$appType$$", alias);


        // Send notification to contacts
        var allContacts = getContactArray(capId);
        for (var i in allContacts) {
            var peopleModel = allContacts[i].peopleModel;
            var contactType = String(allContacts[i].contactType);
            Avo_LogDebug("Contact type(" + contactType + ")", 2);	//debug

            if (contactType != "Applicant") {
                continue;
            }

            var contactTypeFlag = peopleModel.contactTypeFlag;
            Avo_LogDebug("Contact type flag(" + contactTypeFlag + ")", 2);  //debug
            var name = "";
            if (contactTypeFlag == "individual") {
                name = String(allContacts[i].firstName + " " + allContacts[i].lastName);
            }
            if (contactTypeFlag == "organization") {
                name = String(allContacts[i].businessName);
            }

            Avo_LogDebug("Name(" + name + ")", 2);  //debug

            addParameter(params, "$$applicant$$", name);

            var email = allContacts[i].email;
            if (!email || String(email).length == 0 || String(email).indexOf("@") == -1 || String(email).indexOf(".") == -1) {
                Avo_LogDebug("Invalid email " + email, 1);
                continue;
            }

            var success = sendNotification(null, email, "", template, params, new Array(), capId);
            if (success == true) {
                Avo_LogDebug('Notification "' + template + '" sent to "' + contactType + '" ' + name + ' at ' + email, 1);
            } else {
                Avo_LogDebug('Failed to send notification "' + template + '" to "' + contactType + '" ' + name + ' at ' + email, 1);
            }
        }
    } catch (ex) {
        logDebug("A JavaScript Error occurred in FUNCTION sendGreenHaloEmailToApplicant" + ex.message);
    }
}

function feeExists(feeCode) {
    var found = false;
    var result = aa.fee.getFeeItems(capId);
    if (result.getSuccess() !== true) {
        Avo_LogDebug('Failed to get fees. ' + result.errorType + ": " + result.errorMessage, 1);
        return found;
    }

    var allFeeItems = result.getOutput();
    for (var i in allFeeItems) {
        var feeItem = allFeeItems[i];
        //Avo_LogDebug('feeCode: ' + feeItem.feeCod, 2);
        if (feeItem.feeCod != feeCode) {
            continue;
        }
        found = true;
        break;
    }
    return found;
}