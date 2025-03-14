/*******************************************************
| Script/Function: noHardHoldRevision() - (ID136)
| Created by: Nicolaj Bunting
| Created on: 7Dec20
| Usage: When task "Inspections" has status set to "081 No Hard Hold Revision" activate task "Application Submittal"
| Modified by: ()
*********************************************************/
(function () {
    var taskName = "Application Submittal";
    var success = activateTask(taskName);
    if (success === false) {
        Avo_LogDebug('Failed to activate task "' + taskName + '"', 1);
        return;
    }

    Avo_LogDebug('Activated task "' + taskName + '"', 1);
})();