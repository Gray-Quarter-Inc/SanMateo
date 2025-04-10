function doesWorkflowHaveTask(tName, itemCap) {
    logDebug("doesWorkflowHaveTask " + tName + ":" + itemCap);
    var taskResult = aa.workflow.getTasks(itemCap);
	if (taskResult.getSuccess())
		{ taskArr = taskResult.getOutput(); }
	else
		{ logDebug( "ERROR: getting tasks : " + taskResult.getErrorMessage()); return false }
		
	for (xx in taskArr)
		if (taskArr[xx].getTaskDescription() == tName)
			return true;
    return false;
}