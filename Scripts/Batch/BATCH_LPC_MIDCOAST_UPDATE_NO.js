/*******************************************************
| Script Title: Batch_MidCoast
| Created by: Mike Buell
| Created on: July 11, 2017
| Usage: Set the Parcel attribute Mid Coast
|                
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
//var message = "";
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
	var gisService = "AGIS_SMCGOV";
	var valueToSet = new Array();
	var processCount = 0;
	
	//get all the building records
	var apsArray = aa.cap.getByAppType("Building",null).getOutput();
	//var apsArray = aa.cap.getByAppType("Building","Photovoltaic").getOutput();
	//var apsArray = aa.cap.getByAppType("Building","Full Review").getOutput();
	
	var midCoastValueUpdated = false;
	
	for (aps in apsArray){
	
		midCoastValueUpdated = false;
		
		var capId = apsArray[aps].getCapID();
		//var myCap = aa.cap.getCap(apsArray[aps].getCapID()).getOutput();
		var myCap = aa.cap.getCap(capId).getOutput();
		var myAppTypeString = myCap.getCapType().toString();
		var myAppTypeArray = myAppTypeString.split("/");
		var customId = capId.getCustomID();
							
		midCoastValue = updateParcelAttrMidCoastNo("LPC MIDCOAST PROJECT AREA", "", capId);
		
		if (midCoastValue) {
			processCount++;
		}
		
	}
	
	theMessage = "Processed - " + processCount + " - records";
	printLine(theMessage);
	theMessage = "END SCRIPT **********************************************************";
	printLine(theMessage);
	
}




/*******************************************************
| Script/Function: updateParcelAttrMidCoastNo()
| Created by: Mike Buell
| Created on: 02June17
| Usage: update the parcel attribute value
| Modified by: 
| Modified on: 
*********************************************************/
function updateParcelAttrMidCoastNo(attField, theValue, capId) {
	
	var parcelAtts = aa.parcel.getParcelByCapId(capId,null).getOutput();
	
	var parcelArray = parcelAtts.toArray();
	
	//get the parcel objects attached
	for (y in parcelArray) {
		//get the primary parcel flag
		var primaryParcel = parcelArray[y].getPrimaryParcelFlag();
		if (primaryParcel == "Y"){
			//this will get the parcel attributes - array of b3apoobjects 
			var apoAtts = parcelArray[y].getParcelAttribute().toArray();
			for (x in apoAtts){
				if(apoAtts[x].getB1AttributeName() == attField){
					//printLine("Initial value - " + apoAtts[x].getB1AttributeName() + " - " + 
					if (apoAtts[x].getB1AttributeValue() == "No") {
						apoAtts[x].setB1AttributeValue(theValue);
						//apoAtts[x].setB1AttributeValue("X");					
						//aa.parcel.updateDailyParcelWithAPOAttribute(parcelArray[y]);
						var testing1 = aa.parcel.warpCapIdParcelModel2CapParcelModel(capId,parcelArray[y]).getOutput();
						//printLine("What did I get - " + testing1);
						var testing2 = aa.parcel.updateDailyParcelWithAPOAttribute(testing1);
						//printLine("Did this work - " + testing2.getSuccess());
						//printLine("Updated value - " + apoAtts[x].getB1AttributeName() + " - " + apoAtts[x].getB1AttributeValue());
						return true;
					}
				}
			}
		}
	}
}


/*******************************************************
| Script/Function: evaluateResult()
| Created by: Mike Buell
| Created on: 02June17
| Usage: put together string of value
| Modified by: 
| Modified on: 
*********************************************************/	
function evaluateResultCustom(valueToSet, attributeName) {

	strValueToDisplay = "NA";

    if (valueToSet.length == 1) {

        strValueToDisplay = valueToSet[0][attributeName];
		
    }
    else if (valueToSet.length > 1) {
        strValueToDisplay = "";
        
		if(attributeName == "Shape_Area") {
			strValueToDisplay = Math.round(valueToSet[0][attributeName]);
		} else {	
			for (x in valueToSet) {

				logDebug(strValueToDisplay.indexOf(valueToSet[x][attributeName]));
			
				//if (strValueToDisplay.indexOf(valueToSet[x][attributeName]) == -1) {
				strValueToDisplay = strValueToDisplay + valueToSet[x][attributeName] + " | ";
				//logDebug(strValueToDisplay);
				//}
			}
			strValueToDisplay = strValueToDisplay.substring(0, strValueToDisplay.length - 3)
		}
    }
	
	return strValueToDisplay;

}


/*******************************************************
| Script/Function: findParcelInGISCustom(parcelId)
| Created by: Mike Buell
| Created on: 02June17
| Usage: find parcel from REST service
| Modified by: 
| Modified on: 
*********************************************************/
function findParcelInGISCustom(parcelId) {

    return null;
    
	//var url = "http://maps.smcgov.org/arcgis/rest/services/PLN/PLN_LAYERS_DMZ/MapServer/0/query";
	//var url = "http://maps.smcgov.org/arcgis/rest/services/COMMON/PLN_BASE/MapServer/1/query";
	var url = "http://maps.smcgov.org/arcgis/rest/services/PLN/PLN_ACELLA/MapServer/0/query";
	
	

	var requestParameters = "text=&geometry=&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&objectIds=&time=&returnCountOnly=false&returnIdsOnly=false&returnGeometry=true&maxAllowableOffset=&outSR=&outFields=*&f=pjson";
	
	requestParameters = requestParameters + "&where=APN%3D%27" + parcelId + "%27"

	// send http request
    var rootNode = aa.util.httpPost(url, requestParameters).getOutput();
	//show the ESRI string
	var esriString = (url + requestParameters);
	logDebug("The ESRI search string is - " + esriString);
	// get response in JSON format and parse
	var obj = JSON.parse(rootNode);

    if (obj) {

        return obj;
    }
    else {
        return null;
    }
	
}


/*******************************************************
| Script/Function: getGISBufferInfoCustom()
| Created by: Mike Buell
| Created on: 02June17
| Usage: get values from buffer
| Modified by: 
| Modified on: 
*********************************************************/
function getGISBufferInfoCustom(svc,layer,numDistance,capId)
	{
	// returns an array of associative arrays
	// each additional parameter will return another value in the array
	//x = getGISBufferInfo("flagstaff","Parcels","50","PARCEL_ID1","MAP","BOOK","PARCEL","LOT_AREA");
	//
	//for (x1 in x)
	//   {
	//   aa.print("Object " + x1)
	//   for (x2 in x[x1])
	//      aa.print("  " + x2 + " = " + x[x1][x2])
	//   }

	var distanceType = "feet";
	var retArray = new Array();

	var bufferTargetResult = aa.gis.getGISType(svc,layer); // get the buffer target
	if (bufferTargetResult.getSuccess())
		{
		var buf = bufferTargetResult.getOutput();
		for (argnum = 4; argnum < arguments.length ; argnum++)
			buf.addAttributeName(arguments[argnum]);
		}
	else
		{ aa.print("**WARNING: Getting GIS Type for Buffer Target.  Reason is: " + bufferTargetResult.getErrorType() + ":" + bufferTargetResult.getErrorMessage()) ; return false }

	var gisObjResult = aa.gis.getCapGISObjects(capId); // get gis objects on the cap
	if (gisObjResult.getSuccess())
		var fGisObj = gisObjResult.getOutput();
	else
		{ aa.print("**WARNING: Getting GIS objects for Cap.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()) ; return false }

	for (a1 in fGisObj) // for each GIS object on the Cap
		{
		
		if(fGisObj[a1].getGisTypeId() == "Active Parcels") {
			var bufchk = aa.gis.getBufferByRadius(fGisObj[a1], numDistance, distanceType, buf);

			if (bufchk.getSuccess())
				var proxArr = bufchk.getOutput();
			else
				{ aa.print("**WARNING: Retrieving Buffer Check Results.  Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage()) ; return false }

			logDebug("We got something from the buffer");
			//helperObjectInfo(proxArr);
			for (a2 in proxArr)
				{
				var proxObj = proxArr[a2].getGISObjects();  // if there are GIS Objects here, we're done
				
				for (z1 in proxObj)
					{
					
					var n = proxObj[z1].getAttributeNames();
					var v = proxObj[z1].getAttributeValues();

					var valArray = new Array();

					//
					// 09/18/08 JHS Explicitly adding the key field of the object, since getBufferByRadius will not pull down the key field
					// hardcoded this to GIS_ID
					//

					valArray["GIS_ID"] = proxObj[z1].getGisId()
					for (n1 in n)
						{
						valArray[n[n1]] = v[n1];
						//logDebug(v[n1]);
						}
					retArray.push(valArray);
					}

				}
			}
		}
	return retArray
	}

/*******************************************************
| Script/Function: getParcelCustom(capId)
| Created by: Mike Buell
| Created on: 02June17
| Usage: get parcel number from capmodel
| Modified by: 
| Modified on: 
*********************************************************/
function getParcelCustom(capId) {
    var parcelNumber = null;
    try {
        var parcelResult = aa.parcel.getParcelandAttribute(capId,null);
		//var parcelResult = aa.proxyInvoker.newInstance("com.accela.aa.aamain.parcel.ParcelModel");
		
		if(parcelResult.getSuccess()) {
			
			var parcels = parcelResult.getOutput().toArray();
			//will return the primary parcel
			for (zz in parcels) {
				if (parcels[zz]. getPrimaryParcelFlag() == "Y") {
					parcelNumber = parcels[zz].getParcelNumber();
				}
			}
			
		} else {
			printLine("**ERROR: Failed to get Parcel List " + parcelResult.getErrorMessage());
			return parcelNumber;
		}
		
    } catch (err) {
        return parcelNumber;
    }
    return parcelNumber;
}


function helperObjectInfo(theObj) {
    aa.print("Object info is - " + theObj.getClass());

    aa.print("The methods are - " + theObj.getClass());
    for (x in theObj) {
        if (typeof (theObj[x]) == "function") {
            aa.print("  " + x);
        }
    }
    aa.print("The properties are - " + theObj.getClass());
    for (x in theObj) {
        if (typeof (theObj[x]) != "function") {
            aa.print("  " + x + " = " + theObj[x]);
        }
    }
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