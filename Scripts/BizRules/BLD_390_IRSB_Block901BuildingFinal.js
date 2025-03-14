//BLD_390_IRSB_Block901BuildingFinal
/*******************************************************
| Script/Function: block901BuildingFinal() - (ID390)
| Created by: Jei Yang
| Created on: 10Mar21
| Usage: If there are any child revision permits (Building/Revision/NA/NA) that are not in the status of "expired", "cancelled", "Finaled" or "Issued"
|        do not allow inspection type “901 Building Final” to result in “Pass” and display message “One or more revisions are still in progress.”
| Modified by: ()
*********************************************************/
(function () {
    //showDebug = true;   //testing
    var children = getChildren("Building/Revision/*/*", capId); //Returns an array of capIds

    
    //Check the application status of child revision permits
    var appStatusList = ["Expired", "Cancelled", "Finaled", "Issued"];
    
    if (!children) {
        return;
    }
    logDebug("Number of revision records: " + children.length);
    
    for (var x in children) {
        var childCapId = children[x];
        var capToCheck = aa.cap.getCap(childCapId).getOutput();
        
        var isTemp = String(cap.capClass) == "INCOMPLETE TMP" || String(cap.capClass == "INCOMPLETE CAP") || String(cap.capClass == "INCOMPLETE EST");
        
        var altId = capToCheck.capModel.altID;
        var status = String(capToCheck.capStatus);
        Avo_LogDebug("Child Record '"+ altId + "' - Status(" + status + ") Temp(" + isTemp.toString() + ") CapClass(" + String(cap.capClass) + ")", 2);	//debug

        if (altId.indexOf("TMP-") != -1)
            continue;

        //If any child revision permits are not in the given statuses. Block scheduling and display the message.
        if (appStatusList.indexOf(status) == -1) {
            cancel = true;
            showMessage = true;
            Avo_LogDebug("-------One or more revisions are still in progress.-------", 1);
            comment("One or more revisions are still in progress.");
            return;
        }

    }

    //comment(debug); //debug
})();