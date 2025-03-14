/*******************************************************
| Script/Function: routePvSolarForReview() - (ID213)
| Created by: Nicolaj Bunting
| Created on: 21Jan21
| Usage: On submit close task "Application Submittal" with status of "Complete", deativate tasks "Environmental Health Review", 
| "Civil and Drainage Review", "Fire Review" If ASI "Solar Panel Type" is "Ground Mounted Solar Panels" Then deactivate task 
| "Building Review" Else if "Roof Mounted Solar Panels", "Solar Roof Tiles" Then close task "Plan Review Distribution" with status of 
| "Routed for Review", deactivate task "Planning Review", close task "Building Review Distribution" with status of "Routed for Review", 
| assign task "In House Simple Review" to user "MOCONNELL", deactivate tasks "In House Structure Review", "Primary Consultant Review", 
| "Secondary Consultant Review"
| Modified by: ()
*********************************************************/
(function () {
    var solarPanelType = String(getAppSpecific("Solar Panel Type", capId));
    Avo_LogDebug("Solar Panel Type(" + solarPanelType + ")", 2);    //debug

    var taskName, status, success;

    // Close task
    taskName = "Application Submittal";
    status = "Complete";
    success = closeTask(taskName, status, "", "");
    if (success === false) {
        Avo_LogDebug('Failed to close task "' + taskName + '" with status of "' + status + '"', 1);
        return;
    }

    if (solarPanelType == "Ground Mounted Solar Panels") {
        // Activate task
        taskName = "Plan Review Distribution";
        success = activateTask(taskName);
        if (success === false) {
            Avo_LogDebug('Failed to activate task "' + taskName + '"', 1);
            return;
        }
        
        taskName = "Planning Review";
        success = deactivateTask(taskName);
        if (success === false) {
            Avo_LogDebug('Failed to deactivate task "' + taskName + '"', 1);
            return;
        }
    }

    if (solarPanelType == "Roof Mounted Solar Panels" || solarPanelType == "Solar Roof Tiles") {
        // Close task
        taskName = "Plan Review Distribution";
        status = "Routed for Review";
        success = closeTask(taskName, status, "", "");
        if (success === false) {
            Avo_LogDebug('Failed to close task "' + taskName + '" with status of "' + status + '"', 1);
            return;
        }

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
    }

    // Deactivate tasks
    var allTaskNames = ["Environmental Health Review", "Civil and Drainage Review", "Fire Review"];
    for (var i in allTaskNames) {
        taskName = allTaskNames[i];

        success = deactivateTask(taskName);
        if (success === false) {
            Avo_LogDebug('Failed to deactivate task "' + taskName + '"', 1);
            continue;
        }
    }
})();