/*******************************************************
| Script/Function: inspViolation()
| Created by: Nicolaj Bunting
| Created on: 18Aug20
| Usage: On inspection result If inspection type is "Site Inspection" And result is "In Violation" And "Inspections" task is active Then close task "Inspections" with 
| status of "In Violation", set record status to "Enforcement Level 4"
| Modified by: ()
*********************************************************/
(function () {
    Avo_LogDebug("Insp Type(" + inspType + ")", 2); //debug
    if (inspType !== "Site Inspection") {
        return;
    }

    Avo_LogDebug("Insp Result(" + inspResult + ")", 2); //debug
    if (inspResult !== "In Violation") {
        return;
    }

    var inspActive = isTaskActive("Inspections")
    Avo_LogDebug("Inspections Active(" + inspActive + ")", 2); //debug

    if (inspActive !== true) {
        return;
    }

    var taskName = "Inspections";
    var taskStatus = "In Violation";
    var success = closeTask(taskName, taskStatus, "Updated by script");
    if (success === false) {
        Avo_LogDebug('Failed to close task "' + taskName + '" with status of "' + taskStatus + '"', 1);
    } else {
        Avo_LogDebug('Closed task "' + taskName + '" with status of "' + taskStatus + '"', 1);
    }

    updateAppStatus("Enforcement Level 4", "Updated by script");
})();