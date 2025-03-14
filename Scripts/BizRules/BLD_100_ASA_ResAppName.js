/*******************************************************
| Script/Function: resAppname() - (ID100)
| Created by: Jei Yang
| Created on: 26Nov20
| Usage: If record type is 
|        Building/Residential/Electrical/Service Upgrade, set "Application Name" (a field on the record summary page) to value of "ELE"
|        Building/Residential/Mechanical/HVAC, set "Application Name" to value of "MEC"
|        Building/Residential/Plumbing/NA AND Building/Residential/Plumbing/Water Heater, set "Application Name" to value of "PLM"
|        Building/Residential/Re-Roof/NA set "Application Name" to value of "Re-Roof"
|        Building/Residential/Siding and Stucco/NA. set "Application Name" to value of "Siding and Stucco"
|        Building/Residential/Window or Door/NA. set "Application Name" to value of "Window or Door"
|        Building/Residential/Electrical/Temporary Power Pole. set "Application Name" to value "TPP"
|        Building/Residential/Electrical/PV Solar, set "Application Name" to Value "PVS"
|        Building/Residential/Electrical/Storage Systems set "Application Name" to Value "ESS"
|        Building/Residential/Electrical/Car Charger set "Application Name" to Value "EVC"
|        Building/Residential/Demolition/NA set "Application Name" to Value "Demolition"
|        Building/Residential/Electrical/Generator set "Application Name" to Value "Generator"
|        Building/Residential/Deck and Patio/NA set "Application Name" to Value "Deck and Patio"
|        Building/Residential/Landscaping/NA set "Application Name" to Value "Landscaping"
|        Building/Residential/Bath Kitchen Remodel/NA set "Application Name" to Value "Bath Kitchen Remodel"
| Modified by: (10Jan22 Jei Yang) Added application name values for the following permits;
|       Fire Sprinklers - Fire
|       Propane Tank / Water Storage Tank - Tanks
|       Residential Addition / Alteration to Existing Residence - ADD / ALT
|       Residential Detached Non-Habitable Accessory Structures - Non-Hab ACC
|       Residential New Single Family / Multi Family / Manufactured / Detached ADU - New Residential
|       Skylight - Skylight
|       Swimming Pool / Spa / Hot Tub / Pond - Pool
*********************************************************/
(function () {
    var fieldValue;

    var result = aa.cap.getCap(capId);
    if (result.getSuccess() != true) {
        Avo_LogDebug("Failed to get cap for record " + capId + ". " + result.errorType + ": " + result.errorMessage, 1);
        return;
    }
    var cap = result.getOutput();
    var altId = cap.capModel.altID;
    var capTypeModel = cap.capType;
    var recordType = String(capTypeModel);
    Avo_LogDebug("Record Type(" + recordType + ")", 2); //debug

    switch (recordType) {
        case "Building/Residential/Electrical/Service Upgrade":
            fieldValue = "ELE";
            break;
        case "Building/Residential/Mechanical/HVAC":
            fieldValue = "MEC";
            break;
        case "Building/Residential/Plumbing/NA":
        case "Building/Residential/Plumbing/Water Heater":
            fieldValue = "PLM";
            break;
        case "Building/Residential/Re-Roof/NA":
            fieldValue = "Re-Roof";
            break;
        case "Building/Residential/Siding and Stucco/NA":
            fieldValue = "Siding and Stucco";
            break;
        case "Building/Residential/Window or Door/NA":
            fieldValue = "Window or Door";
            break;
        case "Building/Residential/Electrical/Temporary Power Pole":
            fieldValue = "TPP";
            break;
        case "Building/Residential/Electrical/PV Solar":
            fieldValue = "PVS";
            break;
        case "Building/Residential/Electrical/Storage Systems":
            fieldValue = "ESS";
            break;
        case "Building/Residential/Electrical/Car Charger":
            fieldValue = "EVC";
            break;
        case "Building/Residential/Demolition/NA":
            fieldValue = "Demolition";
            break;
        case "Building/Residential/Electrical/Generator":
            fieldValue = "Generator";
            break;
        case "Building/Residential/Deck and Patio/NA":
            fieldValue = "Deck and Patio";
            break;
        case "Building/Residential/Landscaping/NA":
            fieldValue = "Landscaping";
            break;
        case "Building/Residential/Bath Kitchen Remodel/NA":
            fieldValue = "Bath Kitchen Remodel";
            break;
        case "Building/Residential/Fire/NA":
            fieldValue = "Fire";
            break;
        case "Building/Residential/Fire Systems/NA":
            fieldValue = "Fire Systems";
            break;
        case "Building/Residential/Propane Tank/NA":
            fieldValue = "Tanks";
            break;
        case "Building/Residential/Addition/NA":
            fieldValue = "ADD / ALT";
            break;
        case "Building/Residential/Detached Structure/Full Utilities":
            fieldValue = "Non-Hab ACC";
            break;
        case "Building/Residential/New/NA":
            fieldValue = "New Residential";
            break;
        case "Building/Residential/Skylight/NA":
            fieldValue = "Skylight";
            break;
        case "Building/Residential/Pool or Spa/NA":
            fieldValue = "Pool";
            break;
    }

    if (!fieldValue || fieldValue.length == 0) {
        return;
    }

    var success = editAppName(fieldValue, capId);
    if(success === false) {
        Avo_LogDebug('Failed to set ASI "Application Name" to "' + fieldValue + '" on record' + altId, 1);
    }

    Avo_LogDebug('Set ASI "Application Name" to "' + fieldValue + '" on record ' + altId, 2); //debug

})();