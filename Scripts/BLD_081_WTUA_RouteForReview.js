/*******************************************************
| Script/Function: routeForReview() - (ID81)
| Created by: Nicolaj Bunting
| Created on: 12Nov20
| Usage: When task "Application Submittal" has status set to "Complete" close task "Plan Review Distribution" with status of "Routed for Review", deactivate 
| tasks "Building Review", and "Additional Review"
| Modified by: ()
*********************************************************/
(function () {
    var taskName = "Plan Review Distribution";
    var status = "Routed for Review";
    var success = closeTask(taskName, status, "Closed by ID81 routeForReview", "");
    if (success === false) {
        Avo_LogDebug('Failed to close task "' + taskName + '" with status of "' + status + '"', 1);
        return;
    }

    Avo_LogDebug('Closed task "' + taskName + '" with status of "' + status + '"', 1);

    taskName = "Building Review";
    success = deactivateTask(taskName);
    if (success === false) {
        Avo_LogDebug('Failed to deactivate task "' + taskName + '"', 1);
        return;
    }

    Avo_LogDebug('Deactivated task "' + taskName + '"', 1);

    taskName = "Additional Review";
    success = deactivateTask(taskName);
    if (success === false) {
        Avo_LogDebug('Failed to deactivate task "' + taskName + '"', 1);
        return;
    }

    Avo_LogDebug('Deactivated task "' + taskName + '"', 1);
})();