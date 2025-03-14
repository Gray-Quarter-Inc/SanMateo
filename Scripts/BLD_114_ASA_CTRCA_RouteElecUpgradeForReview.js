/*******************************************************
| Script/Function: routeElecUpgradeForReview() - (ID114)
| Created by: Nicolaj Bunting
| Created on: 27Nov20
| Usage: On submit If ASI "Is the service upgrade less than 300 Amps" is "No" Then close task "Application Submittal" with status of 
| "Complete", "Plan Review Distribution" with status of "Routed for Review", deactivate task "Additional Review"
| Modified by: ()
*********************************************************/
(function () {
    var lessThan300Amps = String(getAppSpecific("Is the service upgrade less than 300 Amps", capId));
    Avo_LogDebug("<300 A(" + lessThan300Amps + ")", 2); //debug

    if (lessThan300Amps.toUpperCase() != "NO") {
        return;
    }

    var taskName, status, success;

    taskName = "Application Submittal";
    status = "Complete";
    success = closeTask(taskName, status, "", "");
    if (success === false) {
        Avo_LogDebug('Failed to close task "' + taskName + '" with status of "' + status + '"', 1);
        return;
    }

    Avo_LogDebug('Closed task "' + taskName + '" with status of "' + status + '"', 1);

    taskName = "Plan Review Distribution";
    status = "Routed for Review";
    success = closeTask(taskName, status, "", "");
    if (success === false) {
        Avo_LogDebug('Failed to close task "' + taskName + '" with status of "' + status + '"', 1);
        return;
    }

    Avo_LogDebug('Closed task "' + taskName + '" with status of "' + status + '"', 1);

    taskName = "Additional Review";
    success = deactivateTask(taskName);
    if (success === false) {
        Avo_LogDebug('Failed to deactivate task "' + taskName + '"', 1);
        return;
    }

    Avo_LogDebug('Deactivated task "' + taskName + '"', 1);
})();