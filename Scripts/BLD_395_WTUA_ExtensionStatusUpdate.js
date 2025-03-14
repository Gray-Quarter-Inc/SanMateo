/*******************************************************
| Script/Function: extensionStatusUpdate(ID395)
| Created by: Jei Yang
| Created on: 12Dec21
| Usage: When the workflow status on the task "Inspections" has been updated to 
|        "180 Day Extension", or "90 Day Extension', or "60 day Extension", or "30 day Extension",
|        update the Record status to "Issued"
*********************************************************/
(function () {
    //For DUA, check the script is skipped for the document type 'Reinstatement Request | REINR' and 'Extension Request | EXTR'.
    //For PRA, skip this requirement.
    var comment = "Updated by ID395 extensionStatusUpdate";
    
    if (!capId) {
        return;
    }

    updateAppStatus("Issued", comment, capId);
})();
