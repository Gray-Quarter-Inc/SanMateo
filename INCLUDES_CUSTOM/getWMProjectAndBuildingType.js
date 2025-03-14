function getWMProjectAndBuildingType() {
    //Return object params
    var projectType, buildingType;
    //App type matching
    var cap = aa.cap.getCap(capId).getOutput();
    var appType = String(cap.getCapType());
    //ASIs
    var majorDemolitionASI = getAppSpecific("Major demolition");
    var minorDemolitionASI = getAppSpecific("Minor demolition");
    var typeOfMajorDemo = getAppSpecific("Is this a residential, mixed use, or commercial project?");
    var typeOfMinorDemo = getAppSpecific("What type of minor demolition is being performed?");
    var typeOfResStruct = getAppSpecific("What type of residential structure is being constructed?");
    var projectTypeASI = getAppSpecific("Project Type");
    var proposedOccType = getAppSpecific("Proposed Occupancy type?");
    var typeOfResBuilding = getAppSpecific("What type of residential building is this structure?");
    var resAddition = getAppSpecific("Addition");
    var resAlteration = getAppSpecific("Alteration");


    logDebug("appType(" + appType + ")");
    switch (appType) {
        case "Building/Residential/Demolition/NA":
            projectType = "Demolition/Deconstruction";
            if (majorDemolitionASI == "CHECKED") {
                if (typeOfMajorDemo == "Commercial / Agricultural") {
                    buildingType = "Commercial";
                } else if (typeOfMajorDemo == "Residential (Multi Family)") {
                    buildingType = "Multi-Family";
                } else if (typeOfMajorDemo == "Mixed Use") {
                    buildingType = "Mixed Use Commercial - Residential";
                } else if (typeOfMajorDemo == "Residential (Single Family)") {
                    buildingType = "Single Family";
                }
            } else if (minorDemolitionASI == "CHECKED") {
                if (typeOfMinorDemo == "Accessory structures 120 sq ft - 250 sq ft") {
                    buildingType = "Accessory Structure";
                }
            }
            break;

        case "Building/Residential/New/NA":
            projectType = "New Construction";
            if (typeOfResStruct == "ADU (Detached)"
                || typeOfResStruct == "Apartment (With attached ADU)"
                || typeOfResStruct == "Condominium (With attached ADU)"
                || typeOfResStruct == "Apartment"
                || typeOfResStruct == "Condominium"
                || typeOfResStruct == "Townhome"
                || typeOfResStruct == "Townhome (With attached ADU)") {
                buildingType = "Residential";
            } else if (typeOfResStruct == "Duplex"
                || typeOfResStruct == "Duplex (With Attached ADU) "
                || typeOfResStruct == "Four-Plex"
                || typeOfResStruct == "Four-Plex (With attached ADU)"
                || typeOfResStruct == "Tri-Plex"
                || typeOfResStruct == "Tri-Plex (With attached ADU)") {
                buildingType = "Multi-Family";
            } else if (typeOfResStruct == "Single Family Dwelling (With Attached ADU)"
                || typeOfResStruct == "Single Family Dwelling (With JADU and attached ADU)"
                || typeOfResStruct == "Single Family Dwelling (With JADU)"
                || typeOfResStruct == "Single Family Dwelling") {
                buildingType = "Single Family";
            }
            break;
        case "Building/Residential/Detached Structure/Full Utilities":
            if (typeOfResStruct && typeOfResStruct != null && typeOfResStruct != "") {
                projectType = "New Construction";
                buildingType = "Accessory Structure";
            }
            break;
        case "Building/Residential/Addition/NA":
            var newArea = Number(getAppSpecific("New square footage of conditioned space being added to residence (sq ft)"));
            var proposedArea = Number(getAppSpecific("Proposed cumulative square footage of conditioned space"));
            var remodeledArea = Number(getAppSpecific("What is the cumulative square footage of the areas being remodeled?"));
            if (resAddition == "CHECKED") {
                projectType = "Addition";
                if (newArea > 120) {
                    if (typeOfResBuilding == "ADU"
                        || typeOfResBuilding == "Apartment"
                        || typeOfResBuilding == "Condominium"
                        || typeOfResBuilding == "Townhome") {
                        buildingType = "Residential";
                    } else if (typeOfResBuilding == "Duplex"
                        || typeOfResBuilding == "Triplex") {
                        buildingType = "Multi-Family";
                    } else if (typeOfResBuilding == "Single family") {
                        buildingType = "Single Family";
                    }
                }
            } else if (resAlteration == "CHECKED") {
                projectType = "Alteration";
                if (remodeledArea > 500) {
                    if (typeOfResBuilding == "Single family") {
                        buildingType = "Single Family";
                    } else if (typeOfResBuilding == "ADU") {
                        buildingType = "Residential";
                    } else {
                        buildingType = "Multi-Family";
                    }
                }
            }
            break;
        case "Building/Residential/Bath Kitchen Remodel/NA":
            projectType = "Alteration";
            var bathRemodel = getAppSpecific("Bath remodel");
            var kitchenRemodel = getAppSpecific("Kitchen Remodel");
            var remodeledArea = Number(getAppSpecific("What is the cumulative square footage of the areas being remodeled?"));
            if (kitchenRemodel == "CHECKED" || (bathRemodel == "CHECKED" && remodeledArea > 500)) {
                if (typeOfResBuilding == "Single family (detached)") {
                    buildingType = "Single Family";
                } else if (typeOfResBuilding == "ADU") {
                    buildingType = "Residential";
                } else {
                    buildingType = "Multi-Family";
                }
            }

            break;
        case "Building/Commercial/Demolition/NA"://Prospective: Commercial Demolition
            projectType = "Demolition/Deconstruction";
            if (majorDemolitionASI == "CHECKED") {
                if (typeOfMajorDemo == "Hotel & Motel") {
                    buildingType = "Hotel & Motel";
                } else if (typeOfMajorDemo == "Industrial") {
                    buildingType = "Industrial";
                } else {
                    if (projectTypeASI == "Office") {
                        buildingType = "Industrial";
                    } else if (projectTypeASI == "Retail") {
                        buildingType = "Retail";
                    } else if (projectTypeASI == "Shopping Center") {
                        buildingType = "Shopping Center";
                    } else if (projectTypeASI == "Warehouse") {
                        buildingType = "Warehouse";
                    }
                }
            }

            break;
        case "Building/Commercial/New/NA"://Prospective: Commercial New Structure
             //st/ct updated
            projectType = "New Construction";
            buildingType = "Commercial";
            /*if (projectTypeASI == "Hotel / Motel / Boarding House / Transient") {
                buildingType = "Hotel & Motel";
            } else if (projectTypeASI == "Factory / Industrial") {
                buildingType = "Industrial";
            } else if (projectTypeASI == "Duplex"
                || projectTypeASI == "Duplex (With Attached ADU) "
                || projectTypeASI == "Four-Plex"
                || projectTypeASI == "Four-Plex (With attached ADU)"
                || projectTypeASI == "Tri-Plex"
                || projectTypeASI == "Tri-Plex (With attached ADU)") {
                buildingType = "Multi-Family";
            } else if (projectTypeASI == "Business / Office Building") {
                buildingType = "Office";
            } else if (projectTypeASI == "Mercantile / Retail / Motor Vehicle Repair & Refueling Stations") {
                buildingType = "Retail";
            } else if (projectTypeASI == "Storage / Warehouse / Parking Structure") {
                buildingType = "Warehouse";
            } else if (projectTypeASI == "Commercial Accessory Buildings") {
                buildingType = "Accessory Structure";
            } else {
                if (x == x) {

                } else {
                    buildingType = "Commercial";
                }
            }*/
            break;
        case "Building/Commercial/Add Alt Imp/NA"://Prospective: Commercial Additions / Alterations / Tenant Improvements
            //st/ct updated
            /*var remodeledArea = Number(getAppSpecific("What is the cumulative square footage of the areas being remodeled?"));
            var proposedArea = Number(getAppSpecific("Proposed Square Footage of the Addition to the Existing Building:"));
            if (flProposedArea > 1) {
                projectType = "Addition";
            } else if (remodeledArea > 0 && proposedArea < 1) {
                projectType = "Tenant Improvement";
            }*/
            var comAddition = getAppSpecific("Addition");
            var comAlteration = getAppSpecific("Alteration");

            if (comAddition == "CHECKED") {
                projectType = "Addition";
            } else if (resAlteration == "CHECKED") {
                projectType = "Alteration";
            }

            /*if (projectTypeASI == "Hotel / Motel / Boarding House / Transient") {
                buildingType = "Hotel & Motel";
            } else if (projectTypeASI == "Factory / Industrial") {
                buildingType = "Industrial";
            } else if (projectTypeASI == "Business / Office Building") {
                buildingType = "Office";
            } else if (projectTypeASI == "Mercantile / Retail / Motor Vehicle Repair & Refueling Stations") {
                buildingType = "Retail";
            } else if (projectTypeASI == "Storage / Warehouse / Parking Structure") {
                buildingType = "Warehouse";
            } else if (projectTypeASI == "Commercial Accessory Buildings") {
                buildingType = "Accessory Structure";
            } else {
                buildingType = "Commercial";
            }*/
            buildingType = "Commercial";
            break;
        default:
            logDebug("Record type not found!");
            break;
    }

    logDebug("projectType('" + projectType + "')");
    logDebug("buildingType('" + buildingType + "')");

    return { projectType: projectType, buildingType: buildingType };
}

