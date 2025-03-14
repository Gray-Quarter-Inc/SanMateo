/*******************************************************
| Script/Function: createAssociatedForm() - (ID278)
| Created by: Nic Bunting
| Created on: 7May21
| Usage: On submit If ASI "Will you be creating, replacing, or altering landscaping or retaining walls not part of residence?" is "Yes" 
| Then create child associated form of type "Building/Residential/Landscaping/NA", copy addresses, parcels, owners, "Applicant" and 
| "Owner/Builder" contacts, licensed professionals to child record Else create child associated form of type 
| "Building/Residential/Confirmation/NA", copy addresses, parcels to child
| Modified by: ()
*********************************************************/
(function () {
    var landscaping = String(getAppSpecific(
        "Will you be creating, replacing, or altering landscaping or retaining walls not part of residence?", capId));
    Avo_LogDebug("Landscaping(" + landscaping + ")", 2);    //debug

    var recordTypeArr = new Array("Building", "Residential", "Confirmation", "NA");
    if (landscaping.toUpperCase() == "YES") {
        recordTypeArr = new Array("Building", "Residential", "Landscaping", "NA");
    }

    var childCapId = createChildTempRecord(recordTypeArr, null, null);
    if (!childCapId) {
        Avo_LogDebug("Failed to create child associated form", 1);
        return;
    }

    var childAltId = aa.cap.getCap(childCapId).getOutput().capModel.altID;
    Avo_LogDebug("Child(" + childAltId + ")", 2);  //debug

    if (landscaping.toUpperCase() == "YES") {
        copyOwner(capId, childCapId);
        copyContactsByType(capId, childCapId, "Applicant");
        copyContactsByType(capId, childCapId, "Owner/Builder");
        copyLicensedProf(capId, childCapId);
    }

    Avo_LogDebug("Child record has been created with ID (" + childAltId + ").", 2);   //debug
})();