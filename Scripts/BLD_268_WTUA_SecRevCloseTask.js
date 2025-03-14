/*******************************************************
| Script/Function: secRevCloseTask() - (ID268)
| Created by: Nicolaj Bunting
| Created on: 21Apr21
| Usage: When task "Waste Mangement", "PCB Monitoring", "EC Pre-Construction", "Grading Permit" has status set to
| "Passed with Conditions", "Passed", "No Comment" deactivate task "Inspections"
| Modified by: ()
*********************************************************/
(function () {
    deactivateTask("Inspections", wfProcess);
})();