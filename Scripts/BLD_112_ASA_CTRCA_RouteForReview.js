/*******************************************************
| Script/Function: routeForReview() - (ID112)
| Created by: Nicolaj Bunting
| Created on: 27Nov20
| Usage: On submit close task "Application Submittal" with status of "Complete", "Plan Review Distribution" with status of 
| "Routed for Review", deactivate tasks "Building Review", and "Additional Review"
| Modified by: ()
*********************************************************/
(function () {
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