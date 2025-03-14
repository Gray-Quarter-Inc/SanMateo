/*******************************************************
| Script Title: Fire Occupancy Jan1 Inspection Status Change (AVO_ANNUALINSPSTATUSCHANGE)
| Created by: Abhi Jagdev
| Created on: 19Nov2018
| Usage: Automatically set the workflow status to 'Pending Inspection' for 'Fire Occupancy' for records 
|        with ASI: Inspection Type = 'State Mandated' OR 'Operational/Hazmat'  
|        CRITICAL: the business rule requires that this Script be run only on Jan1 of every year
| Modified by: 
| Modified on: 
*********************************************************/
/* ***************************************************************************************************************************
 IMPORTANT NOTE: IF USING COMMIT() - To test the script, it must be executed by setting the Script Transaction drop down to "Use User Transaction"
****************************************************************************************************************************/

/*------------------------------------------------------------------------------------------------------/
| START: USER CONFIGURABLE PARAMETERS
/------------------------------------------------------------------------------------------------------*/
var showDebug = true;
//var showMessage = false;
var message = "";
//var maxSeconds = 4.5 * 60;
var br = "<br>";
var debug;
var emailText = "";				 
var maxSeconds = 4.5 * 60;		
var startDate = new Date();
var startTime = startDate.getTime(); // Start timer
var systemUserObj = aa.person.getUser("ADMIN").getOutput();
//Validate workflow parameters
var paramsOK = true;	
var timeExpired = false;	 
var useAppSpecificGroupName = false;
// Set time out to 60 minutes
var timeOutInSeconds = 60*60;
/*------------------------------------------------------------------------------------------------------/
| END: USER CONFIGURABLE PARAMETERS
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: TEST DATA
/------------------------------------------------------------------------------------------------------*/
/*
aa.env.setValue("appGroup","Licenses");
aa.env.setValue("appTypeType","Registration");
*/
/*------------------------------------------------------------------------------------------------------/
| END: TEST DATA
/------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------/
| Start: BATCH PARAMETERS
/------------------------------------------------------------------------------------------------------*/
/**/
//var appGroup = getParam("appGroup");
//var appTypeType = getParam("appTypeType");
//var appSubtype = getParam("appSubtype");
//var appCategory = getParam("appCategory");

/*----------------------------------------------------------------------------------------------------/
| End: BATCH PARAMETERS
/------------------------------------------------------------------------------------------------------*/
sysDate = aa.date.getCurrentDate();
batchJobResult = aa.batchJob.getJobID()
batchJobName = "" + aa.env.getValue("BatchJobName");

eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
//eval(getScriptText("INCLUDES_CUSTOM"));

function getScriptText(vScriptName) {
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
    return emseScript.getScriptText() + "";
}


batchJobID = 0;
if (batchJobResult.getSuccess()) {
    batchJobID = batchJobResult.getOutput();
    printLine("Batch Job " + batchJobName + " Job ID is " + batchJobID);
}
else {
    printLine("Batch job ID not found " + batchJobResult.getErrorMessage());
}

/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/

if (paramsOK) {
    printLine("Start of Job");
    if (!timeExpired) {
        try {
			mainProcess();
			printLine("End of Job");
			//commit();
        }
        catch (e) {
            printLine("Error in process " + e.message);
        }
    }
    else {
        printLine("End of Job: Elapsed Time : " + elapsed() + " Seconds");
    }
}

//if (emailAddress.length) {
//    aa.sendMail("noreply@accela.com", emailAddress, "", batchJobName + " Results", emailText);
//}

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

	
function mainProcess() {
    var theMessage = "START SCRIPT **********************************************************";
    printLine(theMessage);

    changeWorkflowStatus("State Mandated");
	changeWorkflowStatus("Operational/Hazmat");
	
    
	theMessage = "END SCRIPT **********************************************************";
    printLine(theMessage);

}


/*******************************************************
| Script/Function: changeWorkflowStatus(asiFieldValue)
| Created by: Abhi Jagdev
| Created on: 19Nov2018
| Usage: Change the workflow status to 'Pending Inspection' for records with ASI : Inspection of <<asiFieldValue>>
| Modified by: 
| Modified on: 
*********************************************************/
function changeWorkflowStatus(asiFieldValue) {
	
	var result = aa.cap.getCapIDsByAppSpecificInfoField("Inspection Type", asiFieldValue);

	if (result.getSuccess() != true) 
	{
			logDebug("ERROR: Retrieving Cap IDs: " + result.getErrorType() + ":" + result.getErrorMessage());
			return;
		
			
	}

	var capIdArray = result.getOutput();  //Array of CapIdScriptModel Objects
	
	if (capIdArray.length == 0) {
		
		printLine("No records exists with ASI : Inspection Type = " + asiFieldValue);
		//printLine("No changes made");
	}  
	
	for (i in capIdArray) {
		
		capId = capIdArray[i].getCapID(); // CapIDModel Object

		//printLine(capId)
		
		var status = isTaskStatus("Fire Occupancy", "Pending Inspection")
		if (status == false) {
			var altId = aa.cap.getCap(capId).getOutput().capModel.altID;
			//printLine("Record(" + altId + ")")
			updateTask("Fire Occupancy", "Pending Inspection", "Task Status updated via batch", "Task Status updates via batch");
			printLine("Status Updated for task Fire Occupancy to Pending Inspection for Record " + altId);
		}
	}
	
	return;
}




/** ************************************************************************************** 
*  
*/
function startTransaction(timeOutInSec) {

	aa.batchJob.beginTransaction(timeOutInSec);
	logDebug(" *** A new transaction has been initiated");

}

/** ************************************************************************************** 
*  
*/
function commit() {

	aa.batchJob.commitTransaction();
	logDebug(" *** The transaction has been committed (script changes saved)");
	// aa.batchJob.rollbackTransaction();
	// logDebug(" *** The transaction has been rolled back (for testing)");

}

/** ************************************************************************************** 
*  
*/
function rollback() {

	aa.batchJob.rollbackTransaction();
	logDebug(" *** The transaction has been rolled back (script changes are not saved)");

}

/** ************************************************************************************** 
*  
*/

function printLine(str){
	aa.print(str);	
}