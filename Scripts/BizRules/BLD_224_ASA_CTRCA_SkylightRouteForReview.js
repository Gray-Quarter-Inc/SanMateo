/*******************************************************
| Script/Function: skylightRouteForReview() - (ID224)
| Created by: Jei Yang
| Created on: 17Feb21
| Usage: set workflow task "Application Submittal" to status of "Complete"
|       Complete the task "Plan Review Distribution" with the status of "Routed for Review" and open up the "Building Review" task as well as the subprocess BUILDING REVIEW SUBPROCESS.
|       On the subprocess: Set the Subprocess task "Building Review Distribution" to "Routed for Review" and open up the "In House Simple Review" task only (do not open any other parallel review tasks) and assign that task to use ID "STEPHENC"
|       Open up the Planning Review task as well if ASI "Will these energy storage system(s) be exterior freestanding units? " == "Y"
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

    // Activate task
    taskName = "Building Review";
    success = activateTask(taskName);
    if (success === false) {
        Avo_LogDebug('Failed to activate task "' + taskName + '"', 1);
        return;
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
    var username = "STEPHENC";
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
    
    var exterior = String(getAppSpecific("Will these energy storage system(s) be exterior freestanding units?", capId));
    Avo_LogDebug("Will these energy storage system(s) be exterior freestanding units?(" + exterior + ")", 2);    //debug
    if (exterior.toUpperCase() != 'YES') {
        return;
    }

    // Activate tasks
    taskName = "Planning Review";
    success = activateTask(taskName);
    if (success === false) {
        Avo_LogDebug('Failed to activate task "' + taskName + '"', 1);
    }

    taskName = "Additional Review";
    success = deactivateTask(taskName);
    if (success === false) {
        Avo_LogDebug('Failed to deactivate task "' + taskName + '"', 1);
    }
    
})();