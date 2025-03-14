function getCapDetailByID(capId) {
    capDetailScriptModel = null;
    var s_result = aa.cap.getCapDetail(capId);
    if (s_result.getSuccess()) {
        capDetailScriptModel = s_result.getOutput();
        if (capDetailScriptModel == null) {
            logDebug("WARNING: no cap detail on this CAP:" + capId);
            capDetailScriptModel = null;
        }
    }
    else {
        logDebug("ERROR: Failed to get cap detail: " + s_result.getErrorMessage());
        capDetailScriptModel = null;
    }
    // Return capDetailScriptModel
    return capDetailScriptModel;
}
/*----------------------------------------------------------------------------------------------------/
| Green Halo Notification Functions
| Functions used to create new or attach records to Waste Management Plans
| Created by Accela 06/12/2015
/----------------------------------------------------------------------------------------------------*/
