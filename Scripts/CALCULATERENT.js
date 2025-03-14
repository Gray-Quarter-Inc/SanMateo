/*------------------------------------------------------------------------------------------------------/
| Program: CalculateRent.0.js  Trigger: Batch
| Client : San Mateo Real Property
|
| Version 1.0 - Base Version. 11/18/2013 - Colin Parks - TruePoint Solutions
|
| 
| Modified By: TruePoint Solutions
| Modified Date: 11/18/2013
| Modified Desc:
|
| Script is run as needed to assess the next set of Rents due on a Lease. Selects Records by ASI field (Next Rent Due Date) and date range.
| If data is returned script will process those records that have a current Cap Status of "Active",
|
| For each record that is being activated, script will update the following:
| - Add a fee "Rent" in the amount of the ASI field "Rental Amount"
| - Invoice the fee
| - Increment the ASI field "Next Rent Due Date" based on the "Rent Period" field.  i.e. if it is "Monthly", add one month. if it is annually, add one year, etc.
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: USER CONFIGURABLE PARAMETERS
/------------------------------------------------------------------------------------------------------*/
var showDebug = true;					                                  // Set to true to see debug messages in event log and email confirmation
var maxSeconds = 100 * 60;				                                  // Number of seconds allowed for batch run, usually < 5*60
//Variables needed to log parameters below in eventLog
var sysDate = aa.date.getCurrentDate();
var batchJobID = aa.batchJob.getJobID().getOutput();
var batchJobName = "" + aa.env.getValue("batchJobName");
//Global variables
var batchStartDate = new Date();                                                         // System Date
var batchStartTime = batchStartDate.getTime();                                           // Start timer
var timeExpired = false;                                                                 // Variable to identify if batch script has timed out. Defaulted to "false".
var systemUserObj = aa.person.getUser("ADMIN").getOutput();
var capId;                                                                               // Variable used to hold the Cap Id value.
//var senderEmailAddr = "SMC@donotreply.gov";                                          // Email address of the sender
//var emailAddress = "cparks@truepointsolutions.com";                                      // Email address of the person who will receive the batch script log information
//var emailAddress2 = "Sally.Beno@slc.ca.gov";                                                                  // CC email address of the person who will receive the batch script log information
var emailText = "Batch Script Running";                                                                      // Email body
//Parameter variables
var paramsOK = true;
var paramsAppGroup = "RealProperty";                                                            // Group value of the Cap Type that the batch script is suppose to process.
var useAppSpecificGroupName = false;					                 // Use Group name when populating App Specific Info Values
var itemGroup = "";
var paramsAppType = new Array("County Tenant");
var paramsAppStatusArr = new Array("Completed","Terminated");                                         // Cap Status that the batch script is suppose to not process.
var paramsAppSubGroupName = "GENERAL";                                                   // Application Spec Info Subgroup Name that the ASI field is associated to.
var paramsAppSpecInfoLabel = "Next Rent Due Date";                                     // ASI field name that the batch script is to search.
//var paramsAppSpecInfoLabel2 = "Next Royalty Due Date";                                     // ASI Royalty field name that the batch script is to search.
//var paramsAppSpecInfoLabel3 = "Approved for Auto-Bill";                                     // ASI Approved for Auto-Bill field name that the batch script is to search.
var paramsStartDt = aa.date.parseDate(dateAdd(getParam("CalculateFrom"),+0));              // Start Date for the batch script to select ASI data on.
var paramsEndDt = aa.date.parseDate(dateAdd(getParam("CalculateTo"),+0));                 // End Date for the batch script to select ASI data on.
 /*
                var baseRent= parseFloat(getAppSpecific("Base Rent"));
                var rentAddress2= parseFloat(getAppSpecific("Rent Address 2"));
                var baseRentSF= parseFloat(getAppSpecific("Base Rent SF"));
                var rentAddress2SF= parseFloat(getAppSpecific("Rent Address 2 SF"));
                var percentage = parseFloat(getAppSpecific("Percentage"));
   */


//var rentalAmount = getAppSpecific("Rental Amount");
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
        logMessage("START","Start of Standard Rent Batch Job.");

        var actCapCountEscalated = actEscalated();

	logMessage("END","End of Standard Rent Batch Job: Elapsed Time : " + elapsed() + " Seconds.");
	}


/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| <===========External Functions (used by Action entries)
/------------------------------------------------------------------------------------------------------*/

function actEscalated()
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
            	var capId1 = capId.getID1();
		var capId2 = capId.getID2();
		var capId3 = capId.getID3();
		var capIdObject = getCapId(capId1,capId2,capId3); // call internal function
		capIDString = capIdObject.getCustomID(); // Alternate Cap ID string
		cap = aa.cap.getCap(capId).getOutput(); // Cap Object
		var capDetail = "";
		var balanceDue = 0;
                var capDetailObjResult = aa.cap.getCapDetail(capId); // Record Detail
                var capDetailObjResult = aa.cap.getCapDetail(capId); // Record Detail
                var paymentFrequency = getAppSpecific("Payment Frequency");
                var rentalAmount = parseFloat(getAppSpecific("Rental Amount"));
                var nextRentDueDate = getAppSpecific("Next Rent Due Date");
                var areaOfPremises1 = parseFloat(getAppSpecific("Area of Premises 1"));
                var areaOfPremises2= parseFloat(getAppSpecific("Area of Premises 2"));
                var baseRent= parseFloat(getAppSpecific("Base Rent"));
                var rentAddress2= parseFloat(getAppSpecific("Rent Address 2"));
                var baseRentSF= parseFloat(getAppSpecific("Base Rent SF"));
                var rentAddress2SF= parseFloat(getAppSpecific("Rent Address 2 SF"));
                var percentage = parseFloat(getAppSpecific("Percentage"));
                var percentAdjustment = getAppSpecific("Percent Adjustment");
                var percentagePriorAmount= parseFloat(getAppSpecific("Percentage Prior Amount"));


                if (capGroup == paramsAppGroup && exists(capType,paramsAppType) && !exists(capStatus,paramsAppStatusArr))
                // && percentAdjustment == "CHECKED")
		   {
                   // addFeeWithExtraData("RENT","LEASE","FINAL",rentalAmount * (1 + escalatedPercentage) ,"Y",capId,paymentFrequency + " Escalated Rental Due Date = " + nextRentDueDate,nextRentDueDate,"UDF2");
                   // editAppSpecific("Percentage Prior Amount",rentalAmount);
                   // editAppSpecific("Rental Amount",Math.round(rentalAmount * (1 + escalatedPercentage)*100)/100);

                   //editAppSpecific("Percentage Prior Amount",rentAddress2);
                   //editAppSpecific("Percentage Prior Amount",(baseRent+rentAddress2)*(1+percentage));

                   editAppSpecific("Base Rent",baseRent*(1+percentage));
                   //editAppSpecific("Rent Address 2", (Math.round(rentAddress2 *(1+percentage)));


                   editAppSpecific("Percentage Prior Amount",4);
                    

 /*
                   if (paymentFrequency == "Monthly")
                     {
                     editAppSpecific("Next Rent Due Date",dateAddMonths(nextRentDueDate,1));
                     }
                   if (paymentFrequency == "Annually")
                     {
                     editAppSpecific("Next Rent Due Date",dateAddYears(nextRentDueDate,1));
                     }
                   if (paymentFrequency == "Semi-Annual")
                     {
                     editAppSpecific("Next Rent Due Date",dateAddMonths(nextRentDueDate,6));
                     }
                    if (paymentFrequency == "Quarterly")
                     {
                     editAppSpecific("Next Rent Due Date",dateAddMonths(nextRentDueDate,3));
                     }
                      */
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

function getParam(pParamName) // gets parameter value and logs message showing param value
{
   var ret = "" + aa.env.getValue(pParamName);
   logMessage("PARAMETER", pParamName + " = " + ret);
   return ret;
}


function editAppSpecific(itemName,itemValue)  // optional: itemCap
{
	var updated = false;
	var i=0;
	
	itemCap = capId;
	
	if (arguments.length == 3) itemCap = arguments[2]; // use cap ID specified in args
   	
  	if (useAppSpecificGroupName)
	{
		if (itemName.indexOf(".") < 0)
			{ logMessage("**WARNING","CAP # " + capIDString + ", editAppSpecific requires group name prefix when useAppSpecificGroupName is true") ; return false }
		
		var itemGroup = itemName.substr(0,itemName.indexOf("."));
		var itemName = itemName.substr(itemName.indexOf(".")+1);
	}
   	
   	var appSpecInfoResult = aa.appSpecificInfo.getByCapID(itemCap);
	if (appSpecInfoResult.getSuccess())
 	{
		var appspecObj = appSpecInfoResult.getOutput();
		if (itemName != "")
		{
			while (i < appspecObj.length && !updated)
			{
				if (appspecObj[i].getCheckboxDesc() == itemName && (!useAppSpecificGroupName || appspecObj[i].getCheckboxType() == itemGroup))
				{
					appspecObj[i].setChecklistComment(itemValue);

					var actionResult = aa.appSpecificInfo.editAppSpecInfos(appspecObj);
					if (actionResult.getSuccess()) 
					{							
						logMessage("INFO","CAP # " + capIDString + ", App spec info item " + itemName + " has been given a value of " + itemValue);
					} 
					else
					{
						logMessage("**ERROR","CAP # " + capIDString + ", Error setting the app spec info item " + itemName + " to " + itemValue + " .\nReason is: " +   actionResult.getErrorType() + ":" + actionResult.getErrorMessage());
					}
						
					updated = true;
					//AInfo[itemName] = itemValue;  // Update array used by this script
				}

				i++;

			} // while loop
		} // item name blank
	} // got app specific object
	else
	{ 
		logMessage("**ERROR","CAP # " + capIDString + ", Error getting app specific info for Cap : " + appSpecInfoResult.getErrorMessage());
	}
}//End Function

function getAppSpecific(itemName)  // optional: itemCap
{
	var updated = false;
	var i=0;
	var itemCap = capId;
	if (arguments.length == 2) itemCap = arguments[1]; // use cap ID specified in args
   	
	if (useAppSpecificGroupName)
	{
		if (itemName.indexOf(".") < 0)
			{ logDebug("**WARNING: editAppSpecific requires group name prefix when useAppSpecificGroupName is true") ; return false }


		var itemGroup = itemName.substr(0,itemName.indexOf("."));
		var itemName = itemName.substr(itemName.indexOf(".")+1);
	}

    var appSpecInfoResult = aa.appSpecificInfo.getByCapID(itemCap);
	if (appSpecInfoResult.getSuccess())
 	{
		var appspecObj = appSpecInfoResult.getOutput();

		if (itemName != "")
		{
			for (i in appspecObj)
				if( appspecObj[i].getCheckboxDesc() == itemName && (!useAppSpecificGroupName || appspecObj[i].getCheckboxType() == itemGroup) )
				{
					return appspecObj[i].getChecklistComment();
					break;
				}
		} // item name blank
	}
	else
		{ logDebug( "**ERROR: getting app specific info for Cap : " + appSpecInfoResult.getErrorMessage()) }
}

function lookup(stdChoice,stdValue)
	{
	var strControl;
	var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice,stdValue);

   	if (bizDomScriptResult.getSuccess())
   		{
		var bizDomScriptObj = bizDomScriptResult.getOutput();
		strControl = "" + bizDomScriptObj.getDescription(); // had to do this or it bombs.  who knows why?
		logDebug("lookup(" + stdChoice + "," + stdValue + ") = " + strControl);
		}
	else
		{
		logDebug("lookup(" + stdChoice + "," + stdValue + ") does not exist");
		}
	return strControl;
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