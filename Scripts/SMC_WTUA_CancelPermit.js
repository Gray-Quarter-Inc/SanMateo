/*******************************************************
| Script/Function: cancelPermit()
| Created by: Nicolaj Bunting
| Created on: 18Aug20
| Usage: When task status set to "Cancelled" Then close all tasks with status of "Cancelled"
| Modified by: ()
*********************************************************/
(function () {
    taskCloseAllExcept("Cancelled", "Cancelled by script");
})();