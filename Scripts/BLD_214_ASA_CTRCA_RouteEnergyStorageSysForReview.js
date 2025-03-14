/*******************************************************
| Script/Function: routeEnergyStorageSysForReview() - (ID214)
| Created by: Nicolaj Bunting
| Created on: 25Jan21
| Usage: On submit close task "Application Submittal" with status of "Complete", close task "Plan Review Distribution" with status of 
| "Routed for Review", deactivate task "Fire Review", close task "Building Review Distribution" with status of "Routed for Review", 
| assign task "In House Simple Review" to user "MOCONNELL", deactivate tasks "In House Structure Review", "Primary Consultant Review", 
| "Secondary Consultant Review" If ASI "Will these energy storage system(s) be exterior freestanding units?" is Not "Yes" Then 
| deactivate tasks "Planning Review", "Planning Review Distribution"
| Modified by: ()
*********************************************************/
(function () {
    var taskName, status, success;

    // Close task
    taskName = "Application Submittal";
    status = "Complete";
    success = closeTask(taskName, status, "", "");
    if (success === false) {
        Avo_LogDebug('Failed to close task "' + taskName + '" with status of "' + status + '"', 1);
        return;
    }

    // Close task
    taskName = "Plan Review Distribution";
    status = "Routed for Review";
    success = closeTask(taskName, status, "", "");
    if (success === false) {
        Avo_LogDebug('Failed to close task "' + taskName + '" with status of "' + status + '"', 1);
        return;
    }

    var exteriorUnits = String(getAppSpecific("Will these energy storage system(s) be exterior freestanding units?", capId));
    Avo_LogDebug("Exterior Units(" + exteriorUnits + ")", 2);    //debug

    if (exteriorUnits != "Yes") {
        // Deactivate task
        taskName = "Planning Review Distribution";
        success = deactivateTask(taskName);
        if (success === false) {
            Avo_LogDebug('Failed to deactivate task "' + taskName + '"', 1);
            return;
        }

        taskName = "Planning Review";
        success = deactivateTask(taskName);
        if (success === false) {
            Avo_LogDebug('Failed to deactivate task "' + taskName + '"', 1);
            return;
        }
    }

    // Close task
    taskName = "Building Review Distribution";
    status = "Routed for Review";
    success = closeTask(taskName, status, "", "");
    if (success === false) {
        Avo_LogDebug('Failed to close task "' + taskName + '" with status of "' + status + '"', 1);
        return;
    }

    // Assign task to user
    taskName = "In House Simple Review";
    var username = "MOCONNELL";
    success = assignTask(taskName, username);
    if (success === false) {
        Avo_LogDebug('Failed to assign task "' + taskName + '" to user "' + username + '"', 1);
        return;
    }

    // Deactivate tasks
    var allTaskNames = ["In House Structure Review", "Primary Consultant Review", "Secondary Consultant Review"];
    for (var i in allTaskNames) {
        taskName = allTaskNames[i];

        success = deactivateTask(taskName, "BUILDING REVIEW SUBPROCESS");
        if (success === false) {
            Avo_LogDebug('Failed to deactivate task "' + taskName + '"', 1);
            continue;
        }
    }

    // Deactivate tasks
    taskName = "Fire Review";
    success = deactivateTask(taskName);
    if (success === false) {
        Avo_LogDebug('Failed to deactivate task "' + taskName + '"', 1);
    }
})();