/*------------------------------------------------------------------------------------------------------/
| Program: BuildingPermitExpiration.0.js  Trigger: Batch    
| Client : San Mateo County
|
| Version 1.0 - Base Version. 6/11/2010 - Joseph Cipriano - TruePoint Solutions
|
| 
| Modified By: TruePoint Solutions
| Modified Date: 11/20/2012
| Modified Desc: Added new parameter variable paramsAppType. Batch script will not process and records
|                that have a Sub-Per Type of the following values ("Electrical","Mechanical","Plumbing"),
|
| Script is run daily to expire Building Caps. Selects Caps by ASI field (Expiration Date) and date range.
| If data is returned script will process those Caps that have a Group Type of "Building" and a current Cap Status 
| equals the following: "Issued".
| For each Cap that is being expired, script will update the following:
| - Cap Status will be set to "Expired".  Status History record will also be created.
| - Complete any open Workflow Task on the Cap.
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: USER CONFIGURABLE PARAMETERS
/------------------------------------------------------------------------------------------------------*/
var showDebug = true;					                                  // Set to true to see debug messages in event log and email confirmation
var maxSeconds = 5 * 60;				                                  // Number of seconds allowed for batch run, usually < 5*60
//Variables needed to log parameters below in eventLog
var sysDate = aa.date.getCurrentDate();
var batchJobID = aa.batchJob.getJobID().getOutput();
var batchJobName = "" + aa.env.getValue("batchJobName");
//Global variables
var batchStartDate = new Date();                                                // System Date
var batchStartTime = batchStartDate.getTime();                                 // Start timer
var timeExpired = false;                                                      // Variable to identify if batch script has timed out. Defaulted to "false".
var systemUserObj = aa.person.getUser("ADMIN").getOutput();
var capId;                                                                  // Variable used to hold the Cap Id value.
var senderEmailAddr = "noreply@smcgov.org.gov";                            // Email address of the sender
var emailAddress = "ekimmel@smcgov.org";                                      // Email address of the person who will receive the batch script log information
var emailAddress2 = ""                                                   // CC email address of the person who will receive the batch script log information
var emailText = "Building permit expiration batch script ran";                                                     // Email body
//Parameter variables
var paramsOK = true;
var paramsAppGroup = "Building";                                                         // Group value of the Cap Type that the batch script is suppose to process.
// Per Type of the Cap Type that the batch script should process.
var paramsAppType = new Array("Full Review","OTC","Photovoltaic","Solar Water Heating","Solar Pool Heating");
var paramsAppStatusArr = new Array("Issued");                                            // Cap Status that the batch script is suppose to process.
var paramsAppSubGroupName = "GENERAL";                                                 // Application Spec Info Subgroup Name that the ASI field is associated to.
var paramsAppSpecInfoLabel = "Expiration Date";                                          // ASI field name that the batch script is to search.
var paramsStartDt = aa.date.parseDate(dateAdd(null,-1));                                 // Start Date for the batch script to select ASI data on.
var paramsEndDt = aa.date.parseDate(dateAdd(null,-1));                                   // End Date for the batch script to select ASI data on.
/*Note: Start Date and End Date are defaulted to use the current System Date.
|       To set the Start Date and End Date to specific values for a manual run
|       replace the following syntax dateAdd(null,-1) to a string date value
|       in the following format "MM/DD/YYYY".*/

/*------------------------------------------------------------------------------------------------------/
| END: USER CONFIGURABLE PARAMETERS
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/------------------------------------------------------------------------------------------------------*/
if (paramsOK)
        {
        logMessage("START","Start of BuildingPermitExpiration Batch Job.");

        var expireCapCount = expBuilding();

        logMessage("INFO","Number of Caps expired: " + expireCapCount + ".");
	logMessage("END","End of BuildingPermitExpiration Batch Job: Elapsed Time : " + elapsed() + " Seconds.");
	}

if (emailAddress.length)
	aa.sendMail(senderEmailAddr, emailAddress, emailAddress2, batchJobName + " Results", emailText);
/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| <===========External Functions (used by Action entries)
/------------------------------------------------------------------------------------------------------*/
function expBuilding()
	{
	var capCount = 0;
	var getCapIdResult = aa.cap.getCapIDsByAppSpecificInfoDateRange(paramsAppSubGroupName, paramsAppSpecInfoLabel, paramsStartDt, paramsEndDt);
	if (!getCapIdResult.getSuccess())
		{
		logMessage("**ERROR","Retreiving Cap Id's by Application Specific field date range: " + getCapIdResult.getErrorMessage()+ ".");
		return false;
		}

	var capIdArray = getCapIdResult.getOutput(); //Array of CapIdScriptModel Objects

	for (i in capIdArray)
		{
		if (elapsed() > maxSeconds) // Only continue if time hasn't expired
		   {
		   logMessage("WARNING","A script timeout has caused partial completion of this process.  Please re-run.  " + elapsed() + " seconds elapsed, " + maxSeconds + " allowed.") ;
		   timeExpired = true;
		   break;
		   }

                capId = capIdArray[i].getCapID(); // CapIDModel Object
                var cap = aa.cap.getCap(capId).getOutput(); // Cap Object
                var capGroup = cap.getCapType().getGroup(); // Cap Type Group
                var capType = cap.getCapType().getType(); // Cap Per Type
                var capStatus = cap.getCapStatus(); // Current Cap Status

                //Expire Building Caps that have a Cap Status of "Issued"
                if (capGroup == paramsAppGroup && exists(capType,paramsAppType) && exists(capStatus,paramsAppStatusArr))
		   {
                   updateAppStatus("Expired","Status set by batch script BuildingPermitExpiration");
                   taskCloseAllActive("Expired Permit","Task completed by batch script BuildingPermitExpiration");
                   capCount++;
                   }
		}
	return capCount;
	}

/*------------------------------------------------------------------------------------------------------/
| <===========Internal Functions and Classes (Used by this script)
/------------------------------------------------------------------------------------------------------*/

function elapsed() {
	var thisDate = new Date();
	var thisTime = thisDate.getTime();
	return ((thisTime - batchStartTime) / 1000)
}

// exists:  return true if Value is in Array
function exists(eVal, eArray) {
	  for (ii in eArray)
	  	if (eArray[ii] == eVal) return true;
	  return false;
}

function matches(eVal,argList) {
   for (var i=1; i<arguments.length;i++)
   	if (arguments[i] == eVal)
   		return true;

}

function isNull(pTestValue,pNewValue)
	{
	if (pTestValue==null || pTestValue=="")
		return pNewValue;
	else
		return pTestValue;
	}

function logMessage(etype,edesc) {
		aa.eventLog.createEventLog(etype, "Batch Process", batchJobName, sysDate, sysDate,"", edesc,batchJobID);
	aa.print(etype + " : " + edesc);
	emailText+=etype + " : " + edesc + "<br />";
	}

function logDebug(edesc) {
	if (showDebug) {
		aa.eventLog.createEventLog("DEBUG", "Batch Process", batchJobName, sysDate, sysDate,"", edesc,batchJobID);
		aa.print("DEBUG : " + edesc);
		emailText+="DEBUG : " + edesc + " <br />"; }
	}

function getCapId(pid1,pid2,pid3)  {

    var s_capResult = aa.cap.getCapID(pid1, pid2, pid3);
    if(s_capResult.getSuccess())
      return s_capResult.getOutput();
    else
    {
      logMessage("**ERROR","Failed to get capId: " + s_capResult.getErrorMessage());
      return null;
    }
  }

function dateAdd(td,amt)
	// perform date arithmetic on a string
	// td can be "mm/dd/yyyy" (or any string that will convert to JS date)
	// amt can be positive or negative (5, -3) days
	// if optional parameter #3 is present, use working days only
	{

	var useWorking = false;
	if (arguments.length == 3)
		useWorking = true;

	if (!td)
		dDate = new Date();
	else
		dDate = new Date(td);
	var i = 0;
	if (useWorking)
		if (!aa.calendar.getNextWorkDay)
			{
			logMessage("**ERROR","getNextWorkDay function is only available in Accela Automation 6.3.2 or higher.");
			while (i < Math.abs(amt))
				{
				dDate.setTime(dDate.getTime() + (1000 * 60 * 60 * 24 * (amt > 0 ? 1 : -1)));
				if (dDate.getDay() > 0 && dDate.getDay() < 6)
					i++
				}
			}
		else
			{
			while (i < Math.abs(amt))
				{
				dDate = new Date(aa.calendar.getNextWorkDay(aa.date.parseDate(dDate.getMonth()+1 + "/" + dDate.getDate() + "/" + dDate.getFullYear())).getOutput().getTime());
				i++;
				}
			}
	else
		dDate.setTime(dDate.getTime() + (1000 * 60 * 60 * 24 * amt));

	return (dDate.getMonth()+1) + "/" + dDate.getDate() + "/" + dDate.getFullYear();
	}

function jsDateToMMDDYYYY(pJavaScriptDate)
	{
	//converts javascript date to string in MM/DD/YYYY format
	//
	if (pJavaScriptDate != null)
		{
		if (Date.prototype.isPrototypeOf(pJavaScriptDate))
	return (pJavaScriptDate.getMonth()+1).toString()+"/"+pJavaScriptDate.getDate()+"/"+pJavaScriptDate.getFullYear();
		else
			{
			logMessage("**ERROR","Parameter is not a javascript date");
			return ("INVALID JAVASCRIPT DATE");
			}
		}
	else
		{
		logMessage("**ERROR","Parameter is null");
		return ("NULL PARAMETER VALUE");
		}
	}

function updateAppStatus(stat,cmt) // optional cap id
	{

	var itemCap = capId;
	if (arguments.length == 3) itemCap = arguments[2]; // use cap ID specified in args

	var updateStatusResult = aa.cap.updateAppStatus(itemCap,"APPLICATION",stat, sysDate, cmt ,systemUserObj);
	if (updateStatusResult.getSuccess())
		logMessage("INFO","CAP # "+capId.getCustomID()+" Updated Application Status to " + stat + " successfully.");
	else
		logMessage("**ERROR","CAP # "+capId.getCustomID()+" Application Status update to " + stat + " was unsuccessful. Application Status will need to be updated manually.  The reason is "  + updateStatusResult.getErrorType() + ":" + updateStatusResult.getErrorMessage());
	}

function taskCloseAllActive(pStatus,pComment)
 {
 // Closes all active tasks in CAP with specified status and comment
 // Function is a copy of the taskCloseAllExcept function.

 var workflowResult = aa.workflow.getTasks(capId);
 if (workflowResult.getSuccess())
    var wfObj = workflowResult.getOutput();
 else
     {
     logMessage("**ERROR: CAP # "+capId.getCustomID()+" Failed to get workflow object: " + workflowResult.getErrorMessage());
     return false;
     }

 var fTask;
 var stepnumber;
 var processID;
 var dispositionDate = aa.date.getCurrentDate();
 var wfnote = " ";
 var wftask;

 for (i in wfObj)
     {
     fTask = wfObj[i];
     wftask = fTask.getTaskDescription();
     stepnumber = fTask.getStepNumber();
     processID = fTask.getProcessID();
     if (fTask.getActiveFlag().equals("Y"))
        {
        //aa.workflow.handleDisposition(capId,stepnumber,processID,pStatus,dispositionDate,wfnote,pComment,systemUserObj,"Y");
        aa.workflow.handleDisposition(capId,stepnumber,pStatus,dispositionDate,wfnote,pComment,systemUserObj,"U");
        logMessage("INFO","Completed Workflow Task: " + wftask + " with a status of: " + pStatus + " for CAP # " + capId.getCustomID());

        wfObj[i].setCompleteFlag("Y");
	var fTaskModel = wfObj[i].getTaskItem();
	var tResult = aa.workflow.adjustTaskWithNoAudit(fTaskModel);
	    if (tResult.getSuccess())
	       logMessage("INFO","Completed Workflow Task: " + wftask + ", for CAP # " + capId.getCustomID());
            else
	        logMessage("**ERROR: CAP # "+capId.getCustomID()+" Failed to complete workflow task: " + tResult.getErrorMessage());
        }
     }
 }