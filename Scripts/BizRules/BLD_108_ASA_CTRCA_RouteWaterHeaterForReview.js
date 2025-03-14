/*******************************************************
| Script/Function: routeWaterHeaterForReview() - (ID108)
| Created by: Nicolaj Bunting
| Created on: 30Nov20
| Usage: On submit If ASI "If new location, where located?" is "Within garage" Then close task "Application Submittal" with status of
| "Complete", "Plan Review Distribution" with status of "Routed for Review", deactivate tasks "Building Review", "Additional Review",
| call script 96
| Modified by: ()
*********************************************************/
(function () {
    var location = String(getAppSpecific("If new location, where located?", capId));
    Avo_LogDebug("Location(" + location + ")", 2); //debug
    
    var resOrComm = String(getAppSpecific("Residential or Commercial", capId));
    Avo_LogDebug("Residential or Commercial(" + resOrComm + ")", 2); //debug

    //var isSameLocation = String(getAppSpecific("Is this a repalcement water heater in the same location?", capId));
    //Avo_LogDebug("Is this a repalcement water heater in the same location?(" + isSameLocation + ")", 2); //debug
    

    /*if (resOrComm.toUpperCase() == "COMMERCIAL" && isSameLocation.toUpperCase() == "NO") {
        //Open up the "Fire Review" task (do not activate the Building Review and Planning Review.) task)
        var taskName = "Fire Review";
        var success = activateTask(taskName);
        if (success === false) {
            Avo_LogDebug('Failed to activate task "' + taskName + '"', 1);
            return;
        }
        Avo_LogDebug('Activated task "' + taskName + '"', 1);

        taskName = "Planning Review";
        success = deactivateTask(taskName);
        if (success === false) {
            Avo_LogDebug('Failed to deactivate task "' + taskName + '"', 1);
            return;
        }
    }*/
    if (resOrComm.toUpperCase() == "RESIDENTIAL" && location.toUpperCase() == "WITHIN GARAGE") {
        //Open up the Planning Review. (do not activate Building Review and Fire Review.)
    } else {
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

    ////Script 96 Auto Activate Planning Tasks
    //include("BLD_096_WTUA_AutoActivatePlanningTasks");
})();