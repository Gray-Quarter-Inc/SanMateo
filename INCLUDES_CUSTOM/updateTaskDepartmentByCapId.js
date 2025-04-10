function updateTaskDepartmentByCapId(wfstr, wfDepartment) // optional process name
{
	// Update the task assignment department
	//
	var useProcess = false;
    var itemCap = capId;
	var processName = "";
	if (arguments.length >= 3) {
		processName = arguments[2]; // subprocess
		if (processName) useProcess = true;
	}
    if (arguments.length == 4) {
		itemCap = arguments[3];
	}

	var workflowResult = aa.workflow.getTaskItems(itemCap, wfstr, processName, null, null, null);
	if (workflowResult.getSuccess())
		wfObj = workflowResult.getOutput();
	else {
		logDebug("ERROR: Failed to get workflow object: " + workFlowResult.getErrorMessage());
		return false;
	}

	for (var i in wfObj) {
		fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) {
			if (wfDepartment) {
                
				var taskUserObj = fTask.getTaskItem().getAssignedUser()
					taskUserObj.setDeptOfUser(wfDepartment);

				fTask.setAssignedUser(taskUserObj);
				var taskItem = fTask.getTaskItem();

				var adjustResult = aa.workflow.assignTask(taskItem);
				if (adjustResult.getSuccess())
					logDebug("Updated Workflow Task : " + wfstr + " Department Set to " + wfDepartment);
				else
					logDebug("Error updating wfTask : " + adjustResult.getErrorMessage());
			} else
				logDebug("Couldn't update Department.  Invalid department : " + wfDepartment);
		}
	}
}
