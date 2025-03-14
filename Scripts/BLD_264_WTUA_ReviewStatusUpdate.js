/*******************************************************
| Script/Function: reviewStatusUpdate() - (ID264)
| Created by: Jei Yang
| Created on: 14Apr21
| Usage: When the following workflow task has been set to a particular sets of status, update the corresponding ASI's values.
|        
| Modified by: ()
*********************************************************/
(function () {
    // Get the task status
    // #workflow, #status
    var taskBuildingReview = "Building Review";
    var otherReviews = ["Building Review", "Planning Review", "Fire Review", "Geotechnical Review", "Civil and Drainage Review", "Environmental Health Review", "Public Works Review", "Sewer Review", "Water Review", "Additional Review"];
    var stop = true;
    
    for(var i in otherReviews) {
        if (wfTask == otherReviews[i]) {
            stop = false;
            break;
        }
    }
    if (stop) {
        return;
    }

    Avo_LogDebug(wfTask + " (" + wfStatus + ")", 2);	//debug

    if (wfTask == taskBuildingReview) {
        //Building Review
        if (wfStatus == "Passed" || wfStatus == "Passed with Conditions") {
            editAppSpecific(wfTask, "Approved", capId);
            Avo_LogDebug(wfTask + " has been set to the status of 'Approved'.", 2);	//debug
        } else if (wfStatus == "Recommend Cancellation" || wfStatus == "Resubmittal Required") {
            editAppSpecific(wfTask, "Not Approved", capId);
            Avo_LogDebug(wfTask + " has been set to the status of 'Not Approved'.", 2);	//debug
        }
    } else {         
        //Other Reviews
        if (wfStatus == "Passed" || wfStatus == "Passed with Conditions") {
            editAppSpecific(wfTask, "Approved", capId);
            Avo_LogDebug(wfTask + " has been set to the status of 'Approved'.", 2);	//debug
        } else if (wfStatus == "Recommend Denial" || wfStatus == "Resubmittal Required") {
            editAppSpecific(wfTask, "Not Approved", capId);
            Avo_LogDebug(wfTask + " has been set to the status of 'Not Approved'.", 2);	//debug
        }
    }

})();
