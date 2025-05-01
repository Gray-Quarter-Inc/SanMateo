/*******************************************************
| Script/Function: acaUpdate(ID346)
| Created by: Nicolaj Bunting
| Created on: 23Jun21
| Usage: On payment or document upload If in ACA And cap is complete And wf has history Then set record status to "ACA Update"
| Modified by: Jei Yang - 346 is skipped for the document type 'Reinstatement Request | REINR' and 'Extension Request | EXTR'.
|              Jei Yang - 346 is skipped when DUA event is triggered by Revision record creation. 
|                         When the doc is added to its parent permit (Entity Type = Related Record) skip the status update.
|              Tom Grzegorczyk - record type exceptions only for PRA event     
|              TP  - 12338 - changed functionality          
*********************************************************/
(function () {
    try {
        Avo_LogDebug("Running BLD_346_DUA_PRA_acaUpdate", 1);
        var comment = "";
        if (controlString == "DocumentUploadAfter") {
            var isRevisionPermit = appMatch("Building/Revision/NA/NA", capId);

            var allDocs = documentModelArray.toArray();
            var skippedForThisDocType = true;
            var isRevisionDoc = true; //if entity type is 'Related Record', 
            for (var i in allDocs) {
                var docModel = allDocs[i];

                var docId = docModel.documentNo
                Avo_LogDebug("Doc ID(" + docId + ")", 2);	//debug

                var name = String(docModel.docName);
                Avo_LogDebug("Name(" + name + ")", 2);	//debug

                var filename = String(docModel.fileName);
                Avo_LogDebug("Filename(" + filename + ")", 2);	//debug

                var uploadDate = new Date(docModel.fileUpLoadDate.time);
                Avo_LogDebug("Upload Date(" + aa.util.formatDate(uploadDate, "MM/dd/yyyy") + ")", 2);   //debug

                var group = String(docModel.docGroup);
                Avo_LogDebug("Group(" + group + ")", 2);    //debug

                var category = String(docModel.docCategory);
                Avo_LogDebug("Category(" + category + ")", 2);  //debug

                var entityType = String(docModel.entityType);
                Avo_LogDebug("Entity Type(" + entityType + ")", 2);

                if (category != "Reinstatement Request | REINR" && category != "Extension Request | EXTR") {
                    skippedForThisDocType = false;
                }
                if (group != "BLD_REV") {
                    isRevisionDoc = false;
                }
            }
            if (skippedForThisDocType) {
                Avo_LogDebug("346 is skipped for the document type 'Reinstatement Request | REINR' and 'Extension Request | EXTR'.", 2);  //debug
                return;
            }
            if (isRevisionDoc && !isRevisionPermit) {
                //For Related Records - DUA event triggered for parent permit when doc is added to its Revision.
                Avo_LogDebug("346 is skipped when DUA event is triggered by Related Record.", 2);  //debug
                return;
            }
        }

        if (appMatch("Building/Residential/Window or Door/NA", capId) == true
            || appMatch("Building/Residential/Plumbing/Water Heater", capId) == true
            || appMatch("Building/Residential/Plumbing/NA", capId) == true
            || appMatch("Building/Residential/Re-Roof/NA", capId) == true
            || appMatch("Building/Residential/Siding and Stucco/NA", capId) == true
            || appMatch("Building/Residential/Electrical/Service Upgrade", capId) == true
            || appMatch("Building/Residential/Mechanical/HVAC", capId) == true) {
            //Record type exceptions 
            Avo_LogDebug("This one of the exception record types",2);

            if (!capId) {
                Avo_LogDebug("no capId", 2);
                return;
            }

            var result = aa.cap.getCap(capId);
            if (result.getSuccess() != true) {
                Avo_LogDebug("Failed to get cap. " + result.errorType + ': ' + result.errorMessage, 1);
                return;
            }

            var cap = result.getOutput();
            var completeCap = cap.isCompleteCap();
            Avo_LogDebug("Complete(" + completeCap.toString() + ")", 2); //debug

            if (!completeCap || completeCap != true) {
                Avo_LogDebug("Record is only temporary", 1);
                return;
            }

            if (controlString == "DocumentUploadAfter") {
                Avo_LogDebug("updating app status", 1);
                comment = "Document(s) uploaded";
                updateAppStatus("ACA Update", comment, capId);
            }
            
            var hasWFHist = false;
            var appAccNoStatus = false;
            var wfHist = aa.workflow.getWorkflowHistory(capId, aa.util.newQueryFormat());
            if (wfHist.getSuccess()){
                wfHist = wfHist.getOutput();
                if(wfHist.length > 0){
                    hasWFHist = true;
                }
            }

            var wfTaskResult = aa.workflow.getTasks(capId);
            if(wfTaskResult.getSuccess()){
                var workflowTaskArray = wfTaskResult.getOutput();
                if (workflowTaskArray.length >0){
                    for (t in workflowTaskArray){
                        var workTask = workflowTaskArray[0];
                        if (workTask.getTaskDescription() == "Application Submittal"){
                            Avo_LogDebug("App submittal status is " + workTask.getDisposition(), 1);
                            if (!workTask.getDisposition() || workTask.getDisposition()== "" ){
                                appAccNoStatus = true;
                            }
                        }                       
                    }
                }
            }

            var electServiceAuto = false;
            if (appMatch("Building/Residential/Electrical/Service Upgrade", capId) == true){
                var lessThanUpgrade = getAppSpecific("Is the service upgrade less than 300 Amps");
                if (lessThanUpgrade && matches(lessThanUpgrade, "Y", "YES", "Yes")){
                    Avo_LogDebug("Service Upgrade is less than 300 amps", 2);
                    electServiceAuto = true;
                }
            }

            var plumbAuto = false;//need clarification
            if (appMatch("Building/Residential/Plumbing/NA", capId)==true){
                Avo_LogDebug("plumbing record", 2);
                plumbAuto = true;
            }

            var waterHeaterAuto = false;
            if (appMatch("Building/Residential/Plumbing/Water Heater", capId)==true){
                var sameSpot = getAppSpecific("Is this a replacement water heater in the same location?");
                if (sameSpot && matches(sameSpot, "Y", "YES", "Yes")){
                    Avo_LogDebug("water heater in same spot", 2);
                    waterHeaterAuto = true;
                }
            }
            
            var windowAuto = false;
            if (appMatch("Building/Residential/Window or Door/NA", capId) == true) {
                var restrictedValueFound = false;

                var reqTempPole = String(getAppSpecific("Trim Color", capId));
                Avo_LogDebug("Trim Color(" + reqTempPole + ")", 2);  //debug

                var matchingColor = String(getAppSpecific(
                    "For partial window/door replacement, does the new match the existing colors? ", capId));
                Avo_LogDebug("Matching colour?(" + matchingColor + ")", 2); //debug

                var allZoningAttrs = ["ZONING DESIGNATION", "ZONING 2", "ZONING 3", "ZONING 4"];

                var parcelObj = new Object();
                loadParcelAttributes(parcelObj);
                for (var i in allZoningAttrs) {
                    var zoningAttrName = allZoningAttrs[i];
                    var zoningAttr = String(parcelObj["ParcelAttribute." + zoningAttrName]);
                    Avo_LogDebug(zoningAttrName + "(" + zoningAttr + ")", 2); //debug

                    if (zoningAttr.indexOf("CD") != -1 || zoningAttr.indexOf("DR") != -1) {
                        restrictedValueFound = true;
                        break;
                    }
                }
        
                if (((matchingColor.toUpperCase() == "YES") || (reqTempPole.toUpperCase() == "EARTHTONE")) && !restrictedValueFound) {
                    windowAuto = true;
                }
            }
        
            var reroofAuto= false;
            if(appMatch("Building/Residential/Re-Roof/NA", capId) == true){
                var altId = aa.cap.getCap(capId).getOutput().capModel.altID;
                var earthtoneFound = false;
                var restrictedValueFound = false;
                        
                var reqTempPole = String(getAppSpecific("Color", capId));
                Avo_LogDebug("Color(" + reqTempPole + ")", 2);  //debug
            
                if (reqTempPole.toUpperCase() == "EARTHTONE") {
                    earthtoneFound = true;
                }
            
                var allZoningAttrs = ["ZONING DESIGNATION", "ZONING 2", "ZONING 3", "ZONING 4"];
            
            
                var parcelObj = new Object();
                loadParcelAttributes(parcelObj);
                for (var i in allZoningAttrs) {
                    var zoningAttrName = allZoningAttrs[i];
                    var zoningAttr = String(parcelObj["ParcelAttribute." + zoningAttrName]);
                    Avo_LogDebug(zoningAttrName + "(" + zoningAttr + ")", 2); //debug
            
                    if (zoningAttr.indexOf("CD") != -1 || zoningAttr.indexOf("DR") != -1) {
                        restrictedValueFound = true;
                        break;
                    } 
                }
                
                if (earthtoneFound && !restrictedValueFound) {
                    reroofAuto = true;
                }
            }

            
            var sidingAuto = false;
            if (appMatch("Building/Residential/Siding and Stucco/NA", capId) == true) {
                var altId = aa.cap.getCap(capId).getOutput().capModel.altID;
                var earthtoneFound = false;
                var restrictedValueFound = false;

                var reqTempPole = String(getAppSpecific("Color", capId));
                Avo_LogDebug("Color(" + reqTempPole + ")", 2);  //debug

                if (reqTempPole.toUpperCase() == "EARTHTONE") {
                    earthtoneFound = true;
                }

                var allZoningAttrs = ["ZONING DESIGNATION", "ZONING 2", "ZONING 3", "ZONING 4"];

                var parcelObj = new Object();
                loadParcelAttributes(parcelObj);
                for (var i in allZoningAttrs) {
                    var zoningAttrName = allZoningAttrs[i];
                    var zoningAttr = String(parcelObj["ParcelAttribute." + zoningAttrName]);
                    Avo_LogDebug(zoningAttrName + "(" + zoningAttr + ")", 2); //debug

                    if (zoningAttr.indexOf("CD") != -1 || zoningAttr.indexOf("DR") != -1) {
                        restrictedValueFound = true;
                        break;
                    }
                }

                if (!restrictedValueFound && earthtoneFound) {
                    sidingAuto = true;
                }
            }

            var furnAuto = false;
            if(appMatch("Building/Residential/Mechanical/HVAC", capId) == true){
                var reqAllMet = true;
                var projType = String(getAppSpecific("Project Type", capId));
                Avo_LogDebug("Project Type(" + projType + ")", 2);  //debug
            
                if (projType != "Residential") {
                    reqAllMet = false;
                }
            
                var subgroupArray = ['AC', 'Furnace', 'Heat Pump', 'Boiler Installation',
                    'Factory-built fireplace', 'Decorative gas appliances'];
                var checkReqList = new Object(); //Check required list
                
                //Check the General subgroup
                for (var i = 0; i < subgroupArray.length; i++) {
                    var value = String(AInfo[subgroupArray[i]]);
                    Avo_LogDebug(subgroupArray[i] + "(" + value + ")", 2); //debug
            
                    if (value.toUpperCase() == "CHECKED") {
                        checkReqList[subgroupArray[i]] = true;
                    }
                }
            
            
                if (checkReqList['Furnace']) {
                    var newOrReplace = String(AInfo["Furnace New or Replacement"]);
                    Avo_LogDebug("Furnace New or Replacement(" + newOrReplace + ")", 2); //debug
            
                    /*var furnaceGarage = String(
                        AInfo["Furnace Is the installation or replacement located in the garage"]);
                    Avo_LogDebug("Furnace Garage(" + furnaceGarage + ")", 2); //debug
                    */
            
                    var usingExisting = String(AInfo["Furnace Using existing gas and electrical circuits?"]);
                    Avo_LogDebug("Furnace Using existing gas and electrical circuits(" + usingExisting
                        + ")", 2); //debug
            
                    var locatedSame = String(
                        AInfo["Furnace Is the furnace/AC being located in the same location?"]);
                    Avo_LogDebug("Furnace located in the same location?(" + locatedSame + ")", 2); //debug
            
                    if (newOrReplace.toUpperCase() == 'NEW' || usingExisting.toUpperCase() != 'YES' || locatedSame.toUpperCase() != 'YES') {
                        Avo_LogDebug("Furnace requirements failed", 2); //debug
                        reqAllMet = false;
                    }
                }
                if (checkReqList['AC']) {
                    var newOrReplace = String(AInfo["AC New or Replacement"]);
                    Avo_LogDebug("AC New or Replacement(" + newOrReplace + ")", 2); //debug
            
                    /*var acGarage = String(AInfo["AC Is the installation or replacement located in the garage"]);
                    Avo_LogDebug("AC Garage(" + acGarage + ")", 2); //debug
                    */
            
                    var usingExisting = String(AInfo["AC Using existing gas and electrical circuits?"]);
                    Avo_LogDebug("Using existing gas and electrical circuits(" + usingExisting + ")", 2); //debug
            
                    var locatedSame = String(AInfo["AC Is the furnace/AC being located in the same location?"]);
                    Avo_LogDebug("AC located in the same location?(" + locatedSame + ")", 2); //debug
            
                    if (newOrReplace.toUpperCase() == 'NEW' || usingExisting.toUpperCase() != 'YES' || locatedSame.toUpperCase() != 'YES') {
                        Avo_LogDebug("AC requirements failed", 2); //debug
                        reqAllMet = false;
                    }
                }
                if (checkReqList['Boiler Installation']) {
                    var newOrReplace = String(AInfo["Boiler New or Replacement"]);
                    Avo_LogDebug("Boiler New or Replacement(" + newOrReplace + ")", 2); //debug
                    if (newOrReplace.toUpperCase() == 'NEW') {
                        reqAllMet = false;
                    }
                }
                if (checkReqList['Factory-built fireplace']) {
                    var newOrReplace = String(AInfo["Factory Built Fireplace New or Replacement"]);
                    Avo_LogDebug("Factory Built Fireplace New or Replacement(" + newOrReplace + ")", 2); //debug
                    if (newOrReplace.toUpperCase() == 'NEW') {
                        reqAllMet = false;
                    }
                }
                if (checkReqList['Decorative gas appliances']) {
                    var newOrReplace = String(AInfo["Decorative Gas Appliance New or Replacement"]);
                    Avo_LogDebug("Decorative Gas Appliance New or Replacement(" + newOrReplace + ")", 2); //debug
                    if (newOrReplace.toUpperCase() == 'NEW') {
                        reqAllMet = false;
                    }
                }
                if (checkReqList['Heat Pump']) {
                    var newOrReplace = String(AInfo["Heat Pump New or Replacement"]);
                    Avo_LogDebug("Heat Pump New or Replacement(" + newOrReplace + ")", 2); //debug
                    if (newOrReplace.toUpperCase() == 'NEW') {
                        reqAllMet = false;
                    }
                }
            
                if (reqAllMet){
                    furnAuto = true;
                }
            }
            


            
            if ((hasWFHist || !appAccNoStatus) && !electServiceAuto && !plumbAuto && !reroofAuto && !furnAuto && !sidingAuto && !windowAuto && !waterHeaterAuto) {
                if (controlString == "PaymentReceiveAfter") {
                    comment = "Payment Received";
                    updateAppStatus("ACA Update", comment, capId);
                }
            }

        } else {
            Avo_LogDebug("Not an exception record type", 1);

            if (wfHist.getSuccess()) {
                wfHist = wfHist.getOutput();
                if (wfHist.length = 0) {
                    Avo_LogDebug("Workflow History length is 0", 1);
                    return;
                }
                if (wfHist.length > 0) {
                    if (controlString == "DocumentUploadAfter") {
                        comment = "Document(s) uploaded";
                        updateAppStatus("ACA Update", comment, capId);
                    }
                    if (controlString == "PaymentReceiveAfter") {
                        comment = "Payment Received";
                        updateAppStatus("ACA Update", comment, capId);
                    }
                }
            }
        }
    } catch (ex) {
        Avo_LogDebug("**Error in acaUpdate(ID346): " + ex.message, 1);
    }
})();

//aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC PROD: BLD_346_DUA_PRA_acaUpdate", debug);    //debug
