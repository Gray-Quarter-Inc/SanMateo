/*******************************************************
| Script/Function: buildingFinaled() - (ID38)
| Created by: Nicolaj Bunting
| Created on: 2Nov20
| Usage: On inspection result If inspection type is "901 Building Final" and inspection result is "Pass" Then close task "Inspections" with status of 
"Finaled"
| Modified by: ()
*********************************************************/
(function () {
    var taskName = "Inspections";
    var status = "Finaled";
    var success = closeTask(taskName, status, "Closed by ID38 buildingFinaled", "");
    if (success === false) {
        Avo_LogDebug('Failed to close task "' + taskName + '" with status of "' + status + '"', 1);
        return;
    }

    Avo_LogDebug('Closed task "' + taskName + '" with status of "' + status + '"', 1);

    updateAppStatus(status, "Updated by ID38 buildingFinaled");
    Avo_LogDebug('Set record status to "' + status + '"', 2);
})();