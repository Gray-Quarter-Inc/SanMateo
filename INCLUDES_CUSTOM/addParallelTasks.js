function addParallelTasks(itemCap) {
    var tNames = getStandardChoiceValues("P_INTERNAL_REVIEW_DEPT");
    var tStatus = taskStatus("Planning Review", "", itemCap);
    for (var tIndex in tNames) {
        var taskName = tNames[tIndex].key;
        if (AInfo[taskName] && AInfo[taskName] == "CHECKED") {
            if (!doesWorkflowHaveTask(taskName, itemCap)) {
                addTask("Planning Review",taskName,"P",itemCap);
                var dept = lookup("P_INTERNAL_REVIEW_DEPT", taskName);
                if (dept && dept != "") {
                    updateTaskDepartmentByCapId(taskName, dept, null, itemCap);
                    if (taskStatus && taskStatus != "")
                        updateTask(taskName, tStatus, "", "", null, itemCap);
                }
            }
        }
    }
}