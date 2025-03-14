function addPermitToWasteManagementPlan() {

    var wmPlan = new WasteManagementPlan();

    //var tsi = [];
    //loadTaskSpecific(tsi,capId);    

    wmPlan.permit = capIDString;
    wmPlan.wmpNumber = getAppSpecific("Green Halo Existing WMP Id");
    var wDesc = workDescGet(capId);
    if (wDesc)
        wmPlan.description = wDesc;
    wmPlan.projectType = getAppSpecific("Green Halo Project Type");
    if (estValue == 0) wmPlan.value = 1; else wmPlan.value = estValue;
    wmPlan.squareFootage = getAppSpecific("Green Halo Square Footage");

    var requestSendResult = wmPlan.addPermit();
    aa.print(JSON.stringify(JSON.parse(requestSendResult)));
    var ghResponse = JSON.parse(requestSendResult);
    if (ghResponse.status == "success") {
        editAppSpecific("Green Halo WMP Id", getAppSpecific("Green Halo Existing WMP Id"));
    } else {
        //handle errors
    }

    return ghResponse.status;
}
/*******************************************************
| Script/Function: addRoofingSysReqCondition(capId)
| Created by: Nicolaj Bunting
| Created on: 26Feb19
| Usage: On submit if record type is "Building/OTC/Reroof/NA" or "Building/Full Review/NA/NA" and parcel FIRE_SEVERITY_ZONE is "LRA Very High" 
| then add condition "Minimum Class A Roofing System Required" of type "Hazard"
| Modified by: ()
*********************************************************/
