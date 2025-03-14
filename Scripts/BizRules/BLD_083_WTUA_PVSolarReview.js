/*******************************************************
| Script/Function: pvSolarReview() - (ID83)
| Created by: Jei Yang
| Created on: 24Nov20
| Usage: If Workflow task "Plan Review Distribution" is set to status of "Routed for Review",  and ASI "Ground mounted or roof?" has the value of "ground Mounted". 
|        Activate task "Planning Review", "Fire Review", asd "Civil Review".
| Modified by: ()
*********************************************************/
(function () {
    var taskName, success;
    var allTaskNames = ["Planning Review", "Fire Review", "Civil Review"];

    var groundMountedOrRoof = String(getAppSpecific("Ground mounted or roof?", capId));
    Avo_LogDebug("Ground mounted or roof?(" + groundMountedOrRoof + ")", 2); //debug

    if (groundMountedOrRoof.toLowerCase() != "ground mounted") {
        return;
    }

    for (var i in allTaskNames) {
        taskName = allTaskNames[i];
        success = activateTask(taskName);
        if (success === false) {
            Avo_LogDebug('Failed to activate task "' + taskName + '"', 1);
            continue;
        }

        Avo_LogDebug('Activated task "' + taskName + '"', 1);
    }

})();