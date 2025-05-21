function routeToExternalReviews() {
    var checkboxFields = ["Ag Commissioner", "Agricultural Advisory Committee", "CA Department of Fish and Game ", "County Counsel", "Midcoast Community Council",
        "California Coastal Commission", "County Housing", "North Fair Oaks Community Council", "CalTrans", "County Sheriff's Coastside Substation", "Pescadero Municipal Advisory Council",
        "Sonoma State", "County Sheriff's Office", "Historical Resources Advisory Board", "Parks Department", "Airport Land Use Commission", "US Fish and Wildlife Service",
        "City of San Mateo Sanitary District", "Airports", "Daly City Municipal", "Midpeninsula Regional Open Space District", "North San Mateo County Sanitary District", 
        "Regional Water Quality", "Sewer Authority Mid-Coastside", "San Francisco Internatial Airport", "San Mateo County Farm Bureau", "City of Belmont Planning", 
        "Baywood Park HOA", "Burlingame Municipal Water Department", "City of Brisbane Planning", "Broadmoor Property Owners Association", "Butano Canyon Mutual Water Company", 
        "City of Burlingame Community Dev Dept", "Burlingame Hills Improvement Association", "County Service Area 11", "City of Colma Planning", "Cuesta La Honda Guild", 
        "County Service Area 7", "City of Daly City Economoci & Community Dev", "Emerald Hills Community Coalition", "Hillsborough Municipal Water Department", 
        "City of East Palo Alto Community Dev Dept", "Emerald Lake Hills Assocation", "Kings Mountain Park Mutual Water Company", "City of Foster City Community Dev", 
        "Fair Oaks Beautification Association", "Loma Mar Mutual Water Company", "City of Half Moon Bay Planning", "Harbor Industrial Association", 
        "Menlo Park Municipal Water District", "City of Menlo Park Community Dev Dept", "Home Owners Association", "North Coast County Water District", 
        "City of Millbrae Community Dev Dept", "Kings Mountain Association", "Redwood Terrace Mutual Water Company", "City of Pacifica Community Dev Dept", 
        "Ladera Community Assocation", "Skylonda Mutual Water Company", "City of Redwood City Community Dev Dept", "Los Trancos Woods Community Association", 
        "Westborough County Water Department", "City of San Bruno Community Dev Dept", "Midcoast Park Lands Inc.", "City of San Carlos Community Dev Dept", 
        "North Fair Oaks Community Council Siena Youth Center", "City of San Mateo Community Dev Dept", "Palomar Park Property Owners Associaton", 
        "City of South San Francisco Community Dev", "Neighboring Town/Cities", "Polhemus Heights HOA", "Palo Alto Planning", "Princeton Citizens Advisory Committee",
        "Santa Clara County Community Dev", "Princeton-by-the-Sea HOA", "Town of Atherton Planning", "San Gregorio Environmental Resource Center", "Town of Hillsborough Planning",
        "San Mateo Highlands Community Association", "Town of Portola Valley", "San Mateo Highlands Recreation District", "Town of Woodside Planning", "San Mateo Oaks HOA",
        "Skylonda Area Association", "South Skyline Association", "Stanford Weekend Acres HOA", "Vista Verde Community Association", "Belmont/San Carlos Fire",
        "Brisbane - North County Fire Authority", "Burlingame Fire", "Colma Fire", "Daly City - North County Fire Authority", "Foster City Fire", "Millbrae Fire",
        "Pacifica Fire", "San Bruno Fire", "San Mateo Consolidated Fire", "South San Francisco Fire"];

    for (var fIndex in checkboxFields) {
        var checkboxField = checkboxFields[fIndex];
        var altId = aa.env.getValue("vAltId");
        logDebug(checkboxField + ":" + AInfo[checkboxField]);
        if (AInfo[checkboxField] == "CHECKED") {
            var LPNumber = lookup("P_EXTERNAL_REVIEW", checkboxField);
            if (LPNumber) {
                var LPNumberPieces = String(LPNumber).split('|');
                logDebug(LPNumberPieces.length);
                var LPNum = LPNumberPieces[0];
                logDebug(LPNum);
                var agencyGroup = null;
                if (LPNumberPieces.length > 1)
                    agencyGroup = LPNumberPieces[1];
            
                // add LP to record
                logDebug("Retrieving the LP");
                var licObj = getRefLicenseProf(LPNum);
	            attachResult = aa.licenseScript.associateLpWithCap(capId, licObj);
                if (attachResult.getSuccess()) {
                    logDebug("Associated LP to record")
                } else {
                    logDebug("Error associating LP to record :" + attachResult.getErrorMessage())
                }

                // send them an email
                logDebug(licObj.getEMailAddress());
                var toEmail = licObj.getEMailAddress();
                if (toEmail && toEmail != "") {
                    var params = aa.util.newHashtable(); 
                    params.put("$$altID$$", altId);
                    params.put("$$recordAlias$$", cap.capModel.appTypeAlias);
                    params.put("$$acaUrl$$", gqGetACAUrl(capId, "1000"));
                    sendNotification("",toEmail,"","P_EXTERNAL_REVIEW_NEEDED",params,null, capId);
                }

                // add row to ASIT CONSOLIDATED COMMENTS
                var newRow = [];
                newRow["Agency Group"] = new asiTableValObj("Agency Group", ""+agencyGroup, "N");
                newRow["Reviewer"] = new asiTableValObj("Reviewer", ""+checkboxField, "N");
                newRow["Date Sent"] = new asiTableValObj("Date Sent", ""+wfDateMMDDYYYY, "N");
                newRow["Comment"] = new asiTableValObj("Comment", "",  "N");
                newRow["Comment Date"] = new asiTableValObj("Comment Date", "",  "N");
                newRow["Review Cycle"] = new asiTableValObj("Review Cycle", "" + AInfo["Current Review Cycle"],  "N");
                newRow["Review Status"] = new asiTableValObj("Review Status", "",  "N");
                addToASITable("CONSOLIDATED COMMENTS" , newRow, capId);
            }
        }
    }
}