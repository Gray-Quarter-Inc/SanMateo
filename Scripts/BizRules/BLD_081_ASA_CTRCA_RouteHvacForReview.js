/*******************************************************
| Script/Function: routeHvacForReview() - (ID81)
| Created by: Nicolaj Bunting
| Created on: 12Nov20
| Usage: On submit if ASI "New or Replacement" is "New" or ASI "Is the installation or replacement located in the garage" is "Yes" Then 
| close task "Application Submittal" with status of "Complete", "Plan Review Distribution" with status of "Routed for Review", 
| deactivate task "Additional Review" If ASI "Using existing gas and electrical circuits?" is "Yes" or ASI 
| "Is the furnace/AC being located in the same location?" is "Yes" Then deactivate task "Building Review"
| if ASI "New or Replacement" is "Replacement" And ASI "Is the installation or replacement located in the garage" is "No" And either ASI 
| "Using existing gas and electrical circuits?", "Is the furnace/AC being located in the same location?" are "No" Then close task 
| "Application Submittal" with status of "Complete", "Plan Review Distribution" with status of "Routed for Review", deactivate task 
| "Additional Review"
| Modified by: ()
*********************************************************/
(function () {
    var taskName, success;

    var replacement = String(getAppSpecific("New or Replacement", capId));
    Avo_LogDebug("New or Replacement(" + replacement + ")", 2); //debug

    var locatedInGarage = String(getAppSpecific("Is the installation or replacement located in the garage", capId));
    Avo_LogDebug("Is the installation or replacement located in the garage?(" + locatedInGarage + ")", 2); //debug

    var usingExisting = String(getAppSpecific("Using existing gas and electrical circuits?", capId));
    Avo_LogDebug("Using existing gas and electrical circuits?(" + usingExisting + ")", 2); //debug

    var locatedInSameLocation = String(getAppSpecific("Is the furnace/AC being located in the same location?", capId));
    Avo_LogDebug("Is the furnace/AC being located in the same location?(" + locatedInSameLocation + ")", 2); //debug


    //Scenario 1 Open up Planning Review only
    if ((replacement.toUpperCase() == "NEW" || locatedInGarage.toUpperCase() == "YES") &&
         (usingExisting.toUpperCase() == "YES" && locatedInSameLocation.toUpperCase() == "YES")) {
        Avo_LogDebug('Scenario #1', 2); //debug

        taskName = "Planning Review";
        success = activateTask(taskName);
        if (success === false) {
            Avo_LogDebug('Failed to activate task "' + taskName + '"', 1);
            return;
        }
        Avo_LogDebug('Activated task "' + taskName + '"', 1);
        closeTasksAsRequired();
    }

    //Scenario 2 Open up Planning Review & Building Review
    if ((replacement.toUpperCase() == "NEW" || locatedInGarage.toUpperCase() == "YES") &&
    (usingExisting.toUpperCase() == "NO" || locatedInSameLocation.toUpperCase() == "NO")) {  
        Avo_LogDebug('Scenario #2', 2); //debug

        taskName = "Planning Review";
        success = activateTask(taskName);
        if (success === false) {
            Avo_LogDebug('Failed to activate task "' + taskName + '"', 1);
            return;
        }
        Avo_LogDebug('Activated task "' + taskName + '"', 1);

        taskName = "Building Review";
        success = activateTask(taskName);
        if (success === false) {
            Avo_LogDebug('Failed to activate task "' + taskName + '"', 1);
            return;
        }
        Avo_LogDebug('Activated task "' + taskName + '"', 1);
        
        closeTasksAsRequired();
    }

    //Scenarion 3 Open up Building Review only
    if ((replacement.toUpperCase() == "REPLACEMENT" && locatedInGarage.toUpperCase() == "NO") &&
    (usingExisting.toUpperCase() == "NO" || locatedInSameLocation.toUpperCase() == "NO")) {
        Avo_LogDebug('Scenario #3', 2); //debug

        taskName = "Building Review";
        success = activateTask(taskName);
        if (success === false) {
            Avo_LogDebug('Failed to activate task "' + taskName + '"', 1);
            return;
        }
        Avo_LogDebug('Activated task "' + taskName + '"', 1);

        closeTasksAsRequired();
    }

})();

function closeTasksAsRequired() {
    var taskName, status, success;

    taskName = "Application Submittal";
    status = "Complete";
    success = branchTask(taskName, status, "", "");
    if (success === false) {
        Avo_LogDebug('Failed to close task "' + taskName + '" with status of "' + status + '"', 1);
        return;
    }

    Avo_LogDebug('Closed task "' + taskName + '" with status of "' + status + '"', 1);

    taskName = "Plan Review Distribution";
    status = "Routed for Review";
    success = branchTask(taskName, status, "", "");
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

}