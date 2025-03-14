/*******************************************************
| Script/Function: acaDocUpdate(ID414)
| Created by: Nicolaj Bunting
| Created on: 21Sep22
| Usage: On document upload in ACA If record status is "Revision Requested" Then set record status to
| "ACA Update"
| Modified by: ()
*********************************************************/
(function () {
    var status = String(cap.capStatus);
    Avo_LogDebug("Status(" + status + ")", 2);  //debug

    if (status != "Revision Requested") {
        return;
    }

    updateAppStatus("ACA Update", "Updated by ID414", capId);
})();

//aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC PROD: DPW_414_DUA_AcaDocUpdate", debug);    //debug