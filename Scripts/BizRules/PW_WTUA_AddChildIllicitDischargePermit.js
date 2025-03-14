/*******************************************************
| Script/Function: addChildIllicitDischargePermit()
| Created by: Nicolaj Bunting
| Created on: 18Aug20
| Usage: When task status is set to "Open Illicit Discharge Case" add child record of type "PublicWorks/Illicit Discharge/NA/NA"
| Modified by: ()
*********************************************************/
(function () {
    var childCapId = createChild("PublicWorks", "Illicit Discharge", "NA", "NA", "Illicit Discharge Complaint", capId);

    var childAltId = aa.cap.getCap(childCapId).getOutput().capModel.altID;
    Avo_LogDebug("Create child Illicit Discharge permit " + childAltId, 1);
})();