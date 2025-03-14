/*******************************************************
| Script/Function: hardHoldRevision() - (ID137)
| Created by: Nicolaj Bunting
| Created on: 7Dec20
| Usage: When task "Inspections" has status set to "091 Hard Hold Revision" deactivate task "Inspections", activate task 
| "Application Submittal"
| Modified by: ()
*********************************************************/
(function () {
    var taskName = "Inspections";
    var success = deactivateTask(taskName);
    if (success === false) {
        Avo_LogDebug('Failed to deactivate task "' + taskName + '"', 1);
        return;
    }

    Avo_LogDebug('Deactivated task "' + taskName + '"', 1);

    taskName = "Application Submittal";
    success = activateTask(taskName);
    if (success === false) {
        Avo_LogDebug('Failed to activate task "' + taskName + '"', 1);
        return;
    }

    Avo_LogDebug('Activated task "' + taskName + '"', 1);
})();