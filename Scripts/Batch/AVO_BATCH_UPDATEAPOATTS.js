/*******************************************************
| Script Title: SMC#53781
| Created by: Abhi Jagdev
| Created on: 14Nov2018
| Usage: Update the DB for APO table B3APO_ATTRIBUTE and remove space from the value of B1_ATTRIBUTE_VALUE 
|        Update the DB for APO table L3APO_ATTRIBUTE and remove space from the value of L1_ATTRIBUTE_VALUE     
|
| Modified by: Jei Yang 
| Modified on: Dec 20, 2021
| Modified by: Sheryll Tabamo - cleaning up code 
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
	
    updateL3APODB();
	updateAPODB();
	//testQuery();
	//testdbQuery();
    
	theMessage = "END SCRIPT **********************************************************";
    printLine(theMessage);

}

//L3APO_ATTRIBUTE.L1_ATTRIBUTE_VALUE


/*******************************************************
| Script/Function: updateL3APODB()
| Created by: Abhi Jagdev
| Created on: 14Nov2018
| Usage: update the DB for L3 APO table APO_ATTRIBUTE and remove space from the value of L1_ATTRIBUTE_VALUE 
| Modified by: 
| Modified on: 
*********************************************************/
function updateL3APODB() {
	
	var arrArea = ["Area 1", "Area 2", "Area 3", "Area 4", "Area 5", "Area 6", "Area 7", "Area 8", "Area 9"]
	
	var i;
	for (i = 0; i < arrArea.length; i++) { 
		
		// var sqlString = "UPDATE L3APO_ATTRIBUTE set L1_ATTRIBUTE_VALUE = REPLACE(L1_ATTRIBUTE_VALUE, ' ', '') where L1_ATTRIBUTE_VALUE like 'Area%' AND L1_ATTRIBUTE_NAME = 'BUILDING INSPECTION AREA' AND SOURCE_SEQ_NBR=181"				
		var sqlString = "UPDATE dbo.L3APO_ATTRIBUTE SET L1_ATTRIBUTE_VALUE = '" + removeAllWhiteSpace(arrArea[i]) + "' WHERE L1_ATTRIBUTE_NAME = 'BUILDING INSPECTION AREA' AND L1_ATTRIBUTE_VALUE = '" +  arrArea[i] +  "' AND SOURCE_SEQ_NBR=181";
		try {
																										
													 
						var conn = aa.db.getConnection();
						var SQLStatement = aa.db.prepareStatement(conn, sqlString);
						var rSet = SQLStatement.executeQuery();
					
						
						printLine("Updated db - " + sqlString)
						
						
						
		}
		catch (e) {
						aa.print("Exception getting data from G6: " + e.message);
		}
		finally {
						SQLStatement.close();
						if(rSet) {
										rSet.close();
						}
						conn.close();
		}
	}
}

/*******************************************************
| Script/Function: updateAPODB()
| Created by: Abhi Jagdev
| Created on: 14Nov2018
| Usage: update the DB for APO table 3APO_ATTRIBUTE and remove space from the value of B1_ATTRIBUTE_VALUE 
| Modified by: 
| Modified on: 
*********************************************************/
function updateAPODB() {
	
	var arrArea = ["Area 1", "Area 2", "Area 3", "Area 4", "Area 5", "Area 6", "Area 7", "Area 8", "Area 9"]
	
	var i;
	for (i = 0; i < arrArea.length; i++) { 
		
		//var sqlString = "UPDATE B3APO_ATTRIBUTE set B1_ATTRIBUTE_VALUE = REPLACE(B1_ATTRIBUTE_VALUE, ' ', '') where B1_ATTRIBUTE_VALUE like 'Area%' AND SERV_PROV_CODE = 'SMCGOV'"
		var sqlString = "UPDATE dbo.B3APO_ATTRIBUTE SET B1_ATTRIBUTE_VALUE = '" + removeAllWhiteSpace(arrArea[i]) + "' WHERE SERV_PROV_CODE = 'SMCGOV' AND B1_ATTRIBUTE_VALUE = '" +  arrArea[i] +  "'";

		try {
																										
													 
						var conn = aa.db.getConnection();
						var SQLStatement = aa.db.prepareStatement(conn, sqlString);
						var rSet = SQLStatement.executeQuery();
						printLine("Updated db - " + sqlString)
						
		}
		catch (e) {
						aa.print("Exception getting data from G6: " + e.message);
		}
		finally {
						SQLStatement.close();
						if(rSet) {
										rSet.close();
						}
						conn.close();
		}
	}	
}


function testdbQuery() {
// Run an SQL query
// #SQL

	var arrArea = ["Area1", "Area2", "Area3", "Area4", "Area5", "Area6", "Area7", "Area8", "Area9"]
	
	var i;
	for (i = 0; i < arrArea.length; i++) { 
	
			var selectString = "SELECT TOP(10) L3APO_ATTRIBUTE.L1_ATTRIBUTE_NAME, L3APO_ATTRIBUTE.L1_ATTRIBUTE_VALUE, L3PARCEL.L1_PARCEL_NBR, ROW_NUMBER() OVER(ORDER BY (SELECT 1)) ROWNUM FROM dbo.L3APO_ATTRIBUTE, dbo.L3PARCEL WHERE L3PARCEL.SOURCE_SEQ_NBR=181 AND L3PARCEL.L1_PARCEL_NBR = L3APO_ATTRIBUTE.L1_APO_NBR AND L3APO_ATTRIBUTE.L1_ATTRIBUTE_NAME='BUILDING INSPECTION AREA' AND L3APO_ATTRIBUTE.L1_ATTRIBUTE_Value='"+arrArea[i]+"'";

				
			try {
																										 
													  
							var conn = aa.db.getConnection();
							var SQLStatement = aa.db.prepareStatement(conn, selectString);
							var rSet = SQLStatement.executeQuery();
							var arrCapList = new Array();
							while (rSet.next()) {
											//servCode = rSet.getString("SERV_PROV_CODE");
					//seqNum = rSet.getString("SOURCE_SEQ_NBR");
					//printLine(servCode + " - " + seqNum);
					//seqNum = rSet.getString("SOURCE_SEQ_NBR");
					attValue = rSet.getString("L1_ATTRIBUTE_VALUE");
					//attValue = rSet.getString("L1_ATTRIBUTE_VALUE");
					parNum = rSet.getString("L1_PARCEL_NBR");
					
					
					printLine(attValue + " - " + parNum);
							}
							
			}
			catch (e) {
							aa.print("Exception getting data from G6: " + e.message);
			}
			finally {
							SQLStatement.close();
							if(rSet) {
											rSet.close();
							}
							conn.close();
			}
	}
}


function testQuery() {
// Run an SQL query
// #SQL
//var selectString = "Select DISTINCT SERV_PROV_CODE, SOURCE_SEQ_NBR FROM L3PARCEL_DISTRICT WHERE SERV_PROV_CODE='SMCGOV'";
//var selectString = "Select DISTINCT SOURCE_SEQ_NBR, L1_ATTRIBUTE_NAME, L1_ATTRIBUTE_VALUE FROM L3APO_ATTRIBUTE WHERE SOURCE_SEQ_NBR=181 AND L1_ATTRIBUTE_NAME='BUILDING INSPECTION AREA'";
var selectString = "Select DISTINCT SERV_PROV_CODE, B1_ATTRIBUTE_VALUE FROM dbo.B3APO_ATTRIBUTE WHERE SERV_PROV_CODE='SMCGOV' AND B1_ATTRIBUTE_VALUE LIKE 'Area%'";

    
    
try {
																												  
															   
                var conn = aa.db.getConnection();
                var SQLStatement = aa.db.prepareStatement(conn, selectString);
                var rSet = SQLStatement.executeQuery();
                var arrCapList = new Array();
                while (rSet.next()) {
                    //servCode = rSet.getString("SERV_PROV_CODE");
					//seqNum = rSet.getString("SOURCE_SEQ_NBR");
					//printLine(servCode + " - " + seqNum);
					
					servProvCode = rSet.getString("SERV_PROV_CODE");
					attValue = rSet.getString("B1_ATTRIBUTE_VALUE");
					printLine(servProvCode + " - " + attValue);
					
					
					//seqNum = rSet.getString("SOURCE_SEQ_NBR");
					//attName = rSet.getString("L1_ATTRIBUTE_NAME");
					//attValue = rSet.getString("L1_ATTRIBUTE_VALUE");
					//printLine(seqNum + " - " + attName + " - " + attValue);
                }
                
}
catch (e) {
                aa.print("Exception getting data from G6: " + e.message);
}
finally {
                SQLStatement.close();
                if(rSet) {
                                rSet.close();
                }
                conn.close();
}

}


/*******************************************************
| Script/Function: removeAllWhiteSpace()
| Created by: Abhi Jagdev
| Created on: 11Nov18
| Usage: remove all white spaces from a string
| Modified by: 
| Modified on: 
*********************************************************/
function removeAllWhiteSpace(str)
{
	 /*
     if (str) {
		 if (/\s/g.test(str)) {
			 str = str.replace(/\s/g,''); 
		 } else {
			 str = str;
		 }
		return str;
	} else {
		logDebug("No string found to remove space from.");
		return null;
	}
    */
    
    
    if (str) {
		var strArr = str.split(" ");
        if(strArr.length > 1){
            str = strArr[0] + strArr[1];
        } else {
            str = str;
        }
        return str;
	} else {
		logDebug("No string found to remove space from.");
		return null;
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
