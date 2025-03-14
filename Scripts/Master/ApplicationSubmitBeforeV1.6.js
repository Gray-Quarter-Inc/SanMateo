/*------------------------------------------------------------------------------------------------------/
| SVN $Id: ApplicationSubmitBefore.js 4687 2009-08-21 21:35:56Z john.schomp $
| Program : ApplicationSubmitBeforeV1.6.js
| Event   : ApplicationSubmitBefore
|
| Usage   : Master Script by Accela.  See accompanying documentation and release notes.
|
| Client  : N/A
| Action# : N/A
|
| Notes   : Modified by: Truepoint Solutions - 5/9/2012 - Added new function called loadParcelAttributesTPS().
|                                                         Function is a revised version of the loadParcelAttributes().
|                                                         Function performs the same use to provide parcel data and attribute for scripting.
|                                                         Function does not use capId but the ParcelValidatedNumber variable listed the "BEGIN Event Specific Variables".
|                                                         Also allows a parcel number to be passed if not wanting to use the ParcelValidateNumber.
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START User Configurable Parameters
|
|     Only variables in the following section may be changed.  If any other section is modified, this
|     will no longer be considered a "Master" script and will not be supported in future releases.  If
|     changes are made, please add notes above.
/------------------------------------------------------------------------------------------------------*/
var showMessage = false;			// Set to true to see results in popup window
var showDebug = true;				// Set to true to see debug messages in popup window
var controlString = "ApplicationSubmitBefore"; 	// Standard choice for control
var preExecute = "PreExecuteForBeforeEvents"
var cancel = false ; 				// Setting cancel to true in standard choices will cancel the event
var documentOnly = false;			// Document Only -- displays hierarchy of std choice steps
var disableTokens = false;			// turn off tokenizing of App Specific and Parcel Attributes
var useAppSpecificGroupName = false;		// Use Group name when populating App Specific Info Values
var useTaskSpecificGroupName = false;		// Use Group name when populating Task Specific Info Values
var enableVariableBranching = false;		// Allows use of variable names in branching.  Branches are not followed in Doc Only
var maxEntries = 99;				// Maximum number of std choice entries.  Must be Left Zero Padded
/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/
var startDate = new Date();
var startTime = startDate.getTime();
var message =	"";					// Message String
var debug = "";
var br = "<BR>";					// Break Tag

if (documentOnly) {
	doStandardChoiceActions(controlString,false,0);
	aa.env.setValue("ScriptReturnCode", "0");
	aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed.");
	aa.abortScript();
	}

logDebug("<B>EMSE Script Results</B>");

/*------------------------------------------------------------------------------------------------------/
| BEGIN Event Specific Variables
/------------------------------------------------------------------------------------------------------*/

var AdditionalInfoBuildingCount 	= aa.env.getValue("AdditionalInfoBuildingCount");
var AdditionalInfoConstructionTypeCode 	= aa.env.getValue("AdditionalInfoConstructionTypeCode");
var AdditionalInfoHouseCount 		= aa.env.getValue("AdditionalInfoHouseCount");
var AdditionalInfoPublicOwnedFlag 	= aa.env.getValue("AdditionalInfoPublicOwnedFlag");
var AdditionalInfoValuation 		= aa.env.getValue("AdditionalInfoValuation");
var AdditionalInfoWorkDescription 	= aa.env.getValue("AdditionalInfoWorkDescription");
var AddressCity 			= aa.env.getValue("AddressCity");
var AddressHouseFraction 		= aa.env.getValue("AddressHouseFraction");
var AddressHouseNumber 			= aa.env.getValue("AddressHouseNumber");
var AddressPrimaryFlag 			= aa.env.getValue("AddressPrimaryFlag");
var AddressState 			= aa.env.getValue("AddressState");
var AddressStreetDirection 		= aa.env.getValue("AddressStreetDirection");
var AddressStreetName 			= aa.env.getValue("AddressStreetName");
var AddressStreetSuffix 		= aa.env.getValue("AddressStreetSuffix");
var AddressUnitNumber 			= aa.env.getValue("AddressUnitNumber");
var AddressUnitType 			= aa.env.getValue("AddressUnitType");
var AddressValidatedNumber 		= aa.env.getValue("AddressValidatedNumber");
var AddressZip 				= aa.env.getValue("AddressZip");
var AppSpecificInfoModels 		= aa.env.getValue("AppSpecificInfoModels");
var ApplicantAddressLine1 		= aa.env.getValue("ApplicantAddressLine1");
var ApplicantAddressLine2 		= aa.env.getValue("ApplicantAddressLine2");
var ApplicantAddressLine3 		= aa.env.getValue("ApplicantAddressLine3");
var ApplicantBusinessName 		= aa.env.getValue("ApplicantBusinessName");
var ApplicantCity 			= aa.env.getValue("ApplicantCity");
var ApplicantContactType 		= aa.env.getValue("ApplicantContactType");
var ApplicantCountry 			= aa.env.getValue("ApplicantCountry");
var ApplicantEmail 			= aa.env.getValue("ApplicantEmail");
var ApplicantFirstName 			= aa.env.getValue("ApplicantFirstName");
var ApplicantId 			= aa.env.getValue("ApplicantId");
var ApplicantLastName 			= aa.env.getValue("ApplicantLastName");
var ApplicantMiddleName 		= aa.env.getValue("ApplicantMiddleName");
var ApplicantPhone1 			= aa.env.getValue("ApplicantPhone1");
var ApplicantPhone2 			= aa.env.getValue("ApplicantPhone2");
var ApplicantRelation 			= aa.env.getValue("ApplicantRelation");
var ApplicantState 			= aa.env.getValue("ApplicantState");
var ApplicantZip 			= aa.env.getValue("ApplicantZip");
var ApplicationSubmitMode 		= aa.env.getValue("ApplicationSubmitMode");
var ApplicationName 			= aa.env.getValue("AppSpecialText");
var ApplicationTypeLevel1 		= aa.env.getValue("ApplicationTypeLevel1");
var ApplicationTypeLevel2 		= aa.env.getValue("ApplicationTypeLevel2");
var ApplicationTypeLevel3 		= aa.env.getValue("ApplicationTypeLevel3");
var ApplicationTypeLevel4 		= aa.env.getValue("ApplicationTypeLevel4");
var CAEAddressLine1 			= aa.env.getValue("CAEAddressLine1");
var CAEAddressLine2 			= aa.env.getValue("CAEAddressLine2");
var CAEAddressLine3 			= aa.env.getValue("CAEAddressLine3");
var CAEBusinessName 			= aa.env.getValue("CAEBusinessName");
var CAECity 				= aa.env.getValue("CAECity");
var CAEEmail 				= aa.env.getValue("CAEEmail");
var CAEFirstName 			= aa.env.getValue("CAEFirstName");
var CAELastName 			= aa.env.getValue("CAELastName");
var CAELienseNumber 			= aa.env.getValue("CAELienseNumber");
var CAELienseType 			= aa.env.getValue("CAELienseType");
var CAEMiddleName 			= aa.env.getValue("CAEMiddleName");
var CAEPhone1 				= aa.env.getValue("CAEPhone1");
var CAEPhone2 				= aa.env.getValue("CAEPhone2");
var CAEState 				= aa.env.getValue("CAEState");
var CAEValidatedNumber 			= aa.env.getValue("CAEValidatedNumber");
var CAEZip 				= aa.env.getValue("CAEZip");
var ComplainantAddressLine1 		= aa.env.getValue("ComplainantAddressLine1");
var ComplainantAddressLine2 		= aa.env.getValue("ComplainantAddressLine2");
var ComplainantAddressLine3 		= aa.env.getValue("ComplainantAddressLine3");
var ComplainantBusinessName 		= aa.env.getValue("ComplainantBusinessName");
var ComplainantCity 			= aa.env.getValue("ComplainantCity");
var ComplainantContactType 		= aa.env.getValue("ComplainantContactType");
var ComplainantCountry 			= aa.env.getValue("ComplainantCountry");
var ComplainantEmail 			= aa.env.getValue("ComplainantEmail");
var ComplainantFax 			= aa.env.getValue("ComplainantFax");
var ComplainantFirstName 		= aa.env.getValue("ComplainantFirstName");
var ComplainantId 			= aa.env.getValue("ComplainantId");
var ComplainantLastName 		= aa.env.getValue("ComplainantLastName");
var ComplainantMiddleName 		= aa.env.getValue("ComplainantMiddleName");
var ComplainantPhone1 			= aa.env.getValue("ComplainantPhone1");
var ComplainantRelation 		= aa.env.getValue("ComplainantRelation");
var ComplainantState 			= aa.env.getValue("ComplainantState");
var ComplainantZip 			= aa.env.getValue("ComplainantZip");
var ComplaintDate 			= aa.env.getValue("ComplaintDate");
var ComplaintReferenceId1 		= aa.env.getValue("ComplaintReferenceId1");
var ComplaintReferenceId2 		= aa.env.getValue("ComplaintReferenceId2");
var ComplaintReferenceId3 		= aa.env.getValue("ComplaintReferenceId3");
var ComplaintReferenceSource 		= aa.env.getValue("ComplaintReferenceSource");
var ComplaintReferenceType 		= aa.env.getValue("ComplaintReferenceType");
var CurrentUserID 			= aa.env.getValue("CurrentUserID");
var OwnerFirstName 			= aa.env.getValue("OwnerFirstName");
var OwnerFullName 			= aa.env.getValue("OwnerFullName");
var OwnerLastName 			= aa.env.getValue("OwnerLastName");
var OwnerMailAddressLine1 		= aa.env.getValue("OwnerMailAddressLine1");
var OwnerMailAddressLine2 		= aa.env.getValue("OwnerMailAddressLine2");
var OwnerMailAddressLine3 		= aa.env.getValue("OwnerMailAddressLine3");
var OwnerMailCity 			= aa.env.getValue("OwnerMailCity");
var OwnerMailState 			= aa.env.getValue("OwnerMailState");
var OwnerMailZip 			= aa.env.getValue("OwnerMailZip");
var OwnerMiddleName 			= aa.env.getValue("OwnerMiddleName");
var OwnerPhone 				= aa.env.getValue("OwnerPhone");
var OwnerPrimaryFlag 			= aa.env.getValue("OwnerPrimaryFlag");
var OwnerValidatedNumber 		= aa.env.getValue("OwnerValidatedNumber");
var ParcelArea 				= aa.env.getValue("ParcelArea");
var ParcelBlock 			= aa.env.getValue("ParcelBlock");
var ParcelBook 				= aa.env.getValue("ParcelBook");
var ParcelExcemptValue 			= aa.env.getValue("ParcelExcemptValue");
var ParcelImprovedValue 		= aa.env.getValue("ParcelImprovedValue");
var ParcelLandValue 			= aa.env.getValue("ParcelLandValue");
var ParcelLegalDescription 		= aa.env.getValue("ParcelLegalDescription");
var ParcelLot 				= aa.env.getValue("ParcelLot");
var ParcelPage 				= aa.env.getValue("ParcelPage");
var ParcelParcel 			= aa.env.getValue("ParcelParcel");
var ParcelTract 			= aa.env.getValue("ParcelTract");
var ParcelValidatedNumber 		= aa.env.getValue("ParcelValidatedNumber");
var ViolationAddressLine1 		= aa.env.getValue("ViolationAddressLine1");
var ViolationAddressLine2 		= aa.env.getValue("ViolationAddressLine2");
var ViolationCity 			= aa.env.getValue("ViolationCity");
var ViolationComment 			= aa.env.getValue("ViolationComment");
var ViolationLocation 			= aa.env.getValue("ViolationLocation");
var ViolationState 			= aa.env.getValue("ViolationState");
var ViolationZip  			= aa.env.getValue("ViolationZip");

/*------------------------------------------------------------------------------------------------------/
| END Event Specific Variables
/------------------------------------------------------------------------------------------------------*/
var appTypeString = ApplicationTypeLevel1 + "/" + ApplicationTypeLevel2 + "/" + ApplicationTypeLevel3 + "/" + ApplicationTypeLevel4;
var appTypeArray = appTypeString.split("/");		// Array of application type string
var currentUserID = aa.env.getValue("CurrentUserID");   // Current USer
var publicUser = false;
if (currentUserID.indexOf("PUBLICUSER") == 0) { currentUserID = "ADMIN"; publicUser = true }

var AppSpecificInfoModels = aa.env.getValue("AppSpecificInfoModels");
var servProvCode = aa.getServiceProviderCode();
var CAENumber = parseInt(CAEValidatedNumber);
var CAE;
var CAEAtt;

var AInfo = new Array()					// Create array for tokenized variables
loadAppSpecificBefore(AInfo);

if (ParcelValidatedNumber.length != 0 && ParcelValidatedNumber != "" && ParcelValidatedNumber != null)
   loadParcelAttributesTPS(AInfo);                      // Add parcel attributes. This was added by TPS to provide Parcel data and attribute data. 5/9/2012

// Get CAE Attributes


if (CAENumber > 0)
	{
	var CAEResult = aa.licenseScript.getRefLicenseProfBySeqNbr(servProvCode,CAENumber)
	if (CAEResult.getSuccess())
		{ CAE=CAEResult.getOutput(); }
	else
		{ logDebug("**ERROR: getting CAE : " + CAEResult.getErrorMessage()); }
	}

if (CAE)
	CAEAtt = CAE.getLicenseModel().getAttributes();

if (CAEAtt)
	{
	itr = CAEAtt.values().iterator();
	while(itr.hasNext())
		{
		y = itr.next()
		itr2 = y.iterator();
		while (itr2.hasNext())
			{
			pam = itr2.next();
			AInfo["CAEAttribute." + pam.getAttributeName()] = pam.getAttributeValue();
			}
		}
	}

var systemUserObj = aa.person.getUser(currentUserID).getOutput();  // Current User Object
var sysDate = aa.date.getCurrentDate();

if (preExecute.length) doStandardChoiceActions(preExecute,true,0); 	// run Pre-execution code

logGlobals(AInfo);
/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/
//
//  Get the Standard choices entry we'll use for this App type
//  Then, get the action/criteria pairs for this app
//

doStandardChoiceActions(controlString,true,0);

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

if (debug.indexOf("**ERROR") > 0)
	{
	aa.env.setValue("ScriptReturnCode", "1");
	aa.env.setValue("ScriptReturnMessage", debug);
	}
else
	{
	if (cancel)
		{
		aa.env.setValue("ScriptReturnCode", "1");
		if (showMessage) aa.env.setValue("ScriptReturnMessage", "<font color=red><b>Action Cancelled</b></font><br><br>" + message);
		if (showDebug) 	aa.env.setValue("ScriptReturnMessage", "<font color=red><b>Action Cancelled</b></font><br><br>" + debug);
		}
	else
		{
		aa.env.setValue("ScriptReturnCode", "0");
		if (showMessage) aa.env.setValue("ScriptReturnMessage", message);
		if (showDebug) 	aa.env.setValue("ScriptReturnMessage", debug);
		}
	}


/*------------------------------------------------------------------------------------------------------/
| <===========External Functions (used by Action entries)
/------------------------------------------------------------------------------------------------------*/

function appMatch(ats) // optional capId or CapID string
	{
	var matchArray = appTypeArray //default to current app
	if (arguments.length == 2) 
		{
		matchCapParm = arguments[1]
		if (typeof(matchCapParm) == "string")
			matchCapId = aa.cap.getCapID(matchCapParm).getOutput();   // Cap ID to check
		else
			matchCapId = matchCapParm;
		if (!matchCapId)
			{
			logDebug("**WARNING: CapId passed to appMatch was not valid: " + arguments[1]);
			return false
			}
		matchCap = aa.cap.getCap(matchCapId).getOutput();
		matchArray = matchCap.getCapType().toString().split("/");
		}
		
	var isMatch = true;
	var ata = ats.split("/");
	if (ata.length != 4)
		logDebug("**ERROR in appMatch.  The following Application Type String is incorrectly formatted: " + ats);
	else
		for (xx in ata)
			if (!ata[xx].equals(matchArray[xx]) && !ata[xx].equals("*"))
				isMatch = false;
	return isMatch;
	}	


function branch(stdChoice)
	{
	doStandardChoiceActions(stdChoice,true,0);
	}

function comment(cstr)
	{
	if (showDebug) logDebug(cstr);
	if (showMessage) logMessage(cstr);
	}
	

function convertDate(thisDate)
// convert ScriptDateTime to Javascript Date Object
	{
	return new Date(thisDate.getMonth() + "/" + thisDate.getDayOfMonth() + "/" + thisDate.getYear());
	}

function convertStringToPhone(theString)
	{
	var n = "22233344455566677778889999";

	var compString = String(theString.toUpperCase());
	var retString = "";

	for (var x=0 ; x< compString.length ; x++)
   		{
   		if (compString[x] >= "A" && compString[x] <= "Z")
   			retString += n[compString.charCodeAt(x)-65]
  		 else
   			retString += compString[x];
  		}
   	return retString;
 	}

function docWrite(dstr,header,indent)
	{
	var istr = "";
	for (i = 0 ; i < indent ; i++)
		istr+="|  ";
	if (header && dstr)
		aa.print(istr + "------------------------------------------------");
	if (dstr) aa.print(istr + dstr);
	if (header)
		aa.print(istr + "------------------------------------------------");
	}



function doStandardChoiceActions(stdChoiceEntry, doExecution, docIndent) {
    var thisDate = new Date();
    var thisTime = thisDate.getTime();
    var lastEvalTrue = false;
    logDebug("Executing: " + stdChoiceEntry + ", Elapsed Time: " + ((thisTime - startTime) / 1000) + " Seconds")

    var pairObjArray = getScriptAction(stdChoiceEntry);
    if (!doExecution) docWrite(stdChoiceEntry, true, docIndent);
    for (xx in pairObjArray) {
        doObj = pairObjArray[xx];
        if (doExecution) {
            if (doObj.enabled) {
                logDebug(aa.env.getValue("CurrentUserID") + " : " + stdChoiceEntry + " : #" + doObj.ID + " : Criteria : " + doObj.cri, 2)

                if (eval(token(doObj.cri)) || (lastEvalTrue && doObj.continuation)) {
                    logDebug(aa.env.getValue("CurrentUserID") + " : " + stdChoiceEntry + " : #" + doObj.ID + " : Action : " + doObj.act, 2)

                    eval(token(doObj.act));
                    lastEvalTrue = true;
                }
                else {
                    if (doObj.elseact) {
                        logDebug(aa.env.getValue("CurrentUserID") + " : " + stdChoiceEntry + " : #" + doObj.ID + " : Else : " + doObj.elseact, 2)
                        eval(token(doObj.elseact));
                    }
                    lastEvalTrue = false;
                }
            }
        }
        else // just document
        {
            docWrite("|  ", false, docIndent);
            var disableString = "";
            if (!doObj.enabled) disableString = "<DISABLED>";

            if (doObj.elseact)
                docWrite("|  " + doObj.ID + " " + disableString + " " + doObj.cri + " ^ " + doObj.act + " ^ " + doObj.elseact, false, docIndent);
            else
                docWrite("|  " + doObj.ID + " " + disableString + " " + doObj.cri + " ^ " + doObj.act, false, docIndent);

            for (yy in doObj.branch) {
                doStandardChoiceActions(doObj.branch[yy], false, docIndent + 1);
            }
        }
    } // next sAction
    if (!doExecution) docWrite(null, true, docIndent);
    var thisDate = new Date();
    var thisTime = thisDate.getTime();
    logDebug("Finished: " + stdChoiceEntry + ", Elapsed Time: " + ((thisTime - startTime) / 1000) + " Seconds")
}

//
// exists:  return true if Value is in Array
//
function exists(eVal, eArray) {
	  for (ii in eArray)
	  	if (eArray[ii] == eVal) return true;
	  return false;
}

function getApplication(appNum) 
//
// returns the capId object of an application
//
	{
	var getCapResult = aa.cap.getCapID(appNum);
	if (getCapResult.getSuccess())
		return getCapResult.getOutput();
	else
		{ logDebug( "**ERROR: getting cap id (" + appNum + "): " + getCapResult.getErrorMessage()) }
	}


function getCapId()  {

    var s_id1 = aa.env.getValue("PermitId1");
    var s_id2 = aa.env.getValue("PermitId2");
    var s_id3 = aa.env.getValue("PermitId3");

    var s_capResult = aa.cap.getCapID(s_id1, s_id2, s_id3);
    if(s_capResult.getSuccess())
      return s_capResult.getOutput();
    else
    {
      logMessage("**ERROR: Failed to get capId: " + s_capResult.getErrorMessage());
      return null;
    }
  }

function getCSLBInfoBefore()
	{
	// Requires getNode and getProp functions.
	//
	// Get the first lic prof from the app
	//

	var rlpId = aa.env.getValue("CAEValidatedNumber")

	if (rlpId == "" || rlpId == null) return true;  // empty or null

	//
	// Now make the call to the California State License Board
	//

	var getout = aa.util.httpPost("http://www2.cslb.ca.gov/IVR/License+Detail.asp?LicNum=" + rlpId,"");
	if (getout.getSuccess())
	  var lpXML = getout.getOutput();
	else
	   { logDebug("**ERROR: communicating with CSLB: " + getout.getErrorMessage()); return false; }

	// Check to see if error message in the XML:

	if (lpXML.indexOf("<Error>") > 0 )
		{
		logDebug("**ERROR: CSLB information returned an error: " + getNode(getNode(lpXML,"License"),"**ERROR"))
		return false;
		}

	var lpBiz = getNode(lpXML,"BusinessInfo");
	var lpStatus = getNode(lpXML,"PrimaryStatus");
	var lpClass = getNode(lpXML,"Classifications");
	var lpBonds = getNode(lpXML,"ContractorBond");
	var lpWC = getNode(lpXML,"WorkersComp");

	var expDate = new Date(getNode(lpBiz,"ExpireDt"));
	if (expDate < startDate)
		{
		showMessage = true ;
		comment("**WARNING: Professional License expired on " + expDate.toString());
		}
	}

function getGISBufferInfo(svc,layer,numDistance)
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
                for (argnum = 3; argnum < arguments.length ; argnum++) 
                        buf.addAttributeName(arguments[argnum]); 
                }
	else
		{ logDebug("**ERROR: Getting GIS Type for Buffer Target.  Reason is: " + bufferTargetResult.getErrorType() + ":" + bufferTargetResult.getErrorMessage()) ; return false }

	var gisObjResult = aa.gis.getParcelGISObjects(ParcelValidatedNumber); // get gis objects on the parcel number
	if (gisObjResult.getSuccess())
		var fGisObj = gisObjResult.getOutput();
	else
		{ logDebug("**ERROR: Getting GIS objects for Parcel.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()) ; return false }
	for (a1 in fGisObj) // for each GIS object on the Cap
		{
		var bufchk = aa.gis.getBufferByRadius(fGisObj[a1], numDistance, distanceType, buf);

		if (bufchk.getSuccess())
			var proxArr = bufchk.getOutput();
		else
			{ aa.print("**ERROR: Retrieving Buffer Check Results.  Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage()) ; return false }

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
					}
				retArray.push(valArray);
				}

			}
		}
	return retArray
	}
function getGISInfo(svc,layer,attributename)
{
	// use buffer info to get info on the current object by using distance 0
	// usage: 
	//
	// x = getGISInfo("flagstaff","Parcels","LOT_AREA");
	//
	// to be used with ApplicationSubmitBefore only
	
	var distanceType = "feet";
	var retString;
   	
	var bufferTargetResult = aa.gis.getGISType(svc,layer); // get the buffer target
	if (bufferTargetResult.getSuccess())
	{
		var buf = bufferTargetResult.getOutput();
		buf.addAttributeName(attributename);
	}
	else
	{ logDebug("**ERROR: Getting GIS Type for Buffer Target.  Reason is: " + bufferTargetResult.getErrorType() + ":" + bufferTargetResult.getErrorMessage()) ; return false }
			
	var gisObjResult = aa.gis.getParcelGISObjects(ParcelValidatedNumber); // get gis objects on the parcel number
	if (gisObjResult.getSuccess()) 	
		var fGisObj = gisObjResult.getOutput();
	else
		{ logDebug("**ERROR: Getting GIS objects for Parcel.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()) ; return false }

	for (a1 in fGisObj) // for each GIS object on the Parcel.  We'll only send the last value
	{
		var bufchk = aa.gis.getBufferByRadius(fGisObj[a1], "0", distanceType, buf);

		if (bufchk.getSuccess())
			var proxArr = bufchk.getOutput();
		else
			{ logDebug("**ERROR: Retrieving Buffer Check Results.  Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage()) ; return false }	
		
		for (a2 in proxArr)
		{
			var proxObj = proxArr[a2].getGISObjects();  // if there are GIS Objects here, we're done
			for (z1 in proxObj)
			{
				var v = proxObj[z1].getAttributeValues()
				retString = v[0];
			}
		}
	}
	
	return retString
}function getRelatedCapsByAddressBefore(ats) 
//
// returns the capId object of the parent.  Assumes only one parent!
//
	{
	var retArr = new Array();
	
	
	if (AddressValidatedNumber > 0) // get the address info from lookup table
	  {
	  addObj = aa.address.getRefAddressByPK(parseInt(AddressValidatedNumber)).getOutput();
	  AddressStreetName = addObj.getStreetName();
	  AddressHouseNumber = addObj.getHouseNumberStart();
	  AddressStreetSuffix = addObj.getStreetSuffix();
	  AddressZip = addObj.getZip();
	  AddressStreetDirection = addObj.getStreetDirection();
	  }

	 if (AddressStreetDirection == "") AddressStreetDirection = null;
	 if (AddressHouseNumber == "") AddressHouseNumber = 0;
	 if (AddressStreetSuffix == "") AddressStreetSuffix = null;
	 if (AddressZip == "") AddressZip = null;
 
 	// get caps with same address
 	capAddResult = aa.cap.getCapListByDetailAddress(AddressStreetName,parseInt(AddressHouseNumber),AddressStreetSuffix,AddressZip,AddressStreetDirection,null);
	if (capAddResult.getSuccess())
		{ var capIdArray=capAddResult.getOutput(); }
	else
		{ logDebug("**ERROR: getting similar addresses: " + capAddResult.getErrorMessage());  return false; }


	// loop through related caps
	for (cappy in capIdArray)
		{
		// get file date
		relcap = aa.cap.getCap(capIdArray[cappy].getCapID()).getOutput();

		// get cap type

		reltype = relcap.getCapType().toString();

		var isMatch = true;
		var ata = ats.split("/");
		if (ata.length != 4)
			logDebug("**ERROR: The following Application Type String is incorrectly formatted: " + ats);
		else
			for (xx in ata)
				if (!ata[xx].equals(appTypeArray[xx]) && !ata[xx].equals("*"))
					isMatch = false;

		if (isMatch)			
			retArr.push(capIdArray[cappy]);

		} // loop through related caps

	if (retArr.length > 0)
		return retArr;
		
	}
	function getRelatedCapsByParcelBefore(ats) 
//
// appsubmitBefore script only.  Returns an array of capids that match the parcelValidatedNumber
// ats, app type string to check for
//
	{
	var retArr = new Array();
	

	// get caps with same parcel
	var capAddResult = aa.cap.getCapListByParcelID(ParcelValidatedNumber,null);
	if (capAddResult.getSuccess())
		{ var capIdArray=capAddResult.getOutput(); }
	else
		{ logDebug("**ERROR: getting similar parcels: " + capAddResult.getErrorMessage());  return false; }

	// loop through related caps
	for (cappy in capIdArray)
		{
		var relcap = aa.cap.getCap(capIdArray[cappy].getCapID()).getOutput();
		// get cap type

		var reltypeArray = relcap.getCapType().toString().split("/");


		var isMatch = true;
		var ata = ats.split("/");
		if (ata.length != 4)
			logDebug("**ERROR: The following Application Type String is incorrectly formatted: " + ats);
		else
			for (xx in ata)
				if (!ata[xx].equals(reltypeArray[xx]) && !ata[xx].equals("*"))
					isMatch = false;

		if (isMatch)			
			retArr.push(capIdArray[cappy]);

		} // loop through related caps
		
	if (retArr.length > 0)
		return retArr;
		
	}
//
// Get the standard choices domain for this application type
//
function getScriptAction(strControl)
	{
	var actArray = new Array();
	var maxLength = String("" + maxEntries).length;

	for (var count=1; count <= maxEntries; count++)  // Must be sequential from 01 up to maxEntries
		{
		var countstr = "000000" + count;
		countstr = String(countstr).substring(countstr.length,countstr.length - maxLength);
		var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(strControl,countstr);

	   	if (bizDomScriptResult.getSuccess())
	   		{
			bizDomScriptObj = bizDomScriptResult.getOutput();
			var myObj= new pairObj(bizDomScriptObj.getBizdomainValue());
			myObj.load(bizDomScriptObj.getDescription());
			if (bizDomScriptObj.getAuditStatus() == 'I') myObj.enabled = false;
			actArray.push(myObj);
			}
		else
			{
			break;
			}
		}
	return actArray;
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
			logDebug("Parameter is not a javascript date");
			return ("INVALID JAVASCRIPT DATE");
			}
		}
	else
		{
		logDebug("Parameter is null");
		return ("NULL PARAMETER VALUE");
		}
	}
function loadAppSpecificBefore(thisArr) {
	//
	// Returns an associative array of App Specific Info
	//
	for (loopk in AppSpecificInfoModels)
		{
		if (useAppSpecificGroupName)
			{
			thisArr[AppSpecificInfoModels[loopk].getCheckboxType() + "." + AppSpecificInfoModels[loopk].checkboxDesc] = AppSpecificInfoModels[loopk].checklistComment;
			logDebug("{" + AppSpecificInfoModels[loopk].getCheckboxType() + "." + AppSpecificInfoModels[loopk].checkboxDesc + "} = " + AppSpecificInfoModels[loopk].checklistComment);
			}
			else
			{
			thisArr[AppSpecificInfoModels[loopk].checkboxDesc] = AppSpecificInfoModels[loopk].checklistComment;
			logDebug("{" + AppSpecificInfoModels[loopk].checkboxDesc + "} = " + AppSpecificInfoModels[loopk].checklistComment);
			}
		}
	}

function loadASITablesBefore() {

 	//
 	// Loads App Specific tables into their own array of arrays.  Creates global array objects
	//
	//

	var gm =  aa.env.getValue("AppSpecificTableGroupModel");
	var ta = gm.getTablesMap().values()
	var tai = ta.iterator();

	while (tai.hasNext())
	  {
	  var tsm = tai.next();

	  if (tsm.rowIndex.isEmpty()) continue;  // empty table

	  var tempObject = new Array();
	  var tempArray = new Array();
	  var tn = tsm.getTableName();

	  tn = String(tn).replace(/[^a-zA-Z0-9]+/g,'');

	  if (!isNaN(tn.substring(0,1))) tn = "TBL" + tn  // prepend with TBL if it starts with a number

	  var tsmfldi = tsm.getTableField().iterator();
	  var tsmcoli = tsm.getColumns().iterator();
	  var numrows = 1;

	  while (tsmfldi.hasNext())  // cycle through fields
		{
		if (!tsmcoli.hasNext())  // cycle through columns
			{
			var tsmcoli = tsm.getColumns().iterator();
			tempArray.push(tempObject);  // end of record
			var tempObject = new Array();  // clear the temp obj
			numrows++;
			}
		var tcol = tsmcoli.next();
		var tval = tsmfldi.next();
		tempObject[tcol.getColumnName()] = tval;
		}
	  tempArray.push(tempObject);  // end of record
	  var copyStr = "" + tn + " = tempArray";
	  logDebug("ASI Table Array : " + tn + " (" + numrows + " Rows)");
	  eval(copyStr);  // move to table name
	  }

	}

function loadParcelAttributes(thisArr) {
	//
	// Returns an associative array of Parcel Attributes
	// Optional second parameter, cap ID to load from
	//
	
	var itemCap = capId;
	if (arguments.length == 2) itemCap = arguments[1]; // use cap ID specified in args

	var fcapParcelObj = null;
   	var capParcelResult = aa.parcel.getParcelandAttribute(itemCap, null);
   	if (capParcelResult.getSuccess())
   		var fcapParcelObj = capParcelResult.getOutput().toArray();
   	else
     		logDebug("**ERROR: Failed to get Parcel object: " + capParcelResult.getErrorType() + ":" + capParcelResult.getErrorMessage())
  	
  	for (i in fcapParcelObj)
  		{
  		parcelArea += fcapParcelObj[i].getParcelArea()
  		parcelAttrObj = fcapParcelObj[i].getParcelAttribute().toArray();
  		for (z in parcelAttrObj)
			thisArr["ParcelAttribute." + parcelAttrObj[z].getB1AttributeName()]=parcelAttrObj[z].getB1AttributeValue();

		// Explicitly load some standard values
		thisArr["ParcelAttribute.Block"] = fcapParcelObj[i].getBlock();
		thisArr["ParcelAttribute.Book"] = fcapParcelObj[i].getBook();
		thisArr["ParcelAttribute.CensusTract"] = fcapParcelObj[i].getCensusTract();
		thisArr["ParcelAttribute.CouncilDistrict"] = fcapParcelObj[i].getCouncilDistrict();
		thisArr["ParcelAttribute.ExemptValue"] = fcapParcelObj[i].getExemptValue();
		thisArr["ParcelAttribute.ImprovedValue"] = fcapParcelObj[i].getImprovedValue();
		thisArr["ParcelAttribute.InspectionDistrict"] = fcapParcelObj[i].getInspectionDistrict();
		thisArr["ParcelAttribute.LandValue"] = fcapParcelObj[i].getLandValue();
		thisArr["ParcelAttribute.LegalDesc"] = fcapParcelObj[i].getLegalDesc();
		thisArr["ParcelAttribute.Lot"] = fcapParcelObj[i].getLot();
		thisArr["ParcelAttribute.MapNo"] = fcapParcelObj[i].getMapNo();
		thisArr["ParcelAttribute.MapRef"] = fcapParcelObj[i].getMapRef();
		thisArr["ParcelAttribute.ParcelStatus"] = fcapParcelObj[i].getParcelStatus();
		thisArr["ParcelAttribute.SupervisorDistrict"] = fcapParcelObj[i].getSupervisorDistrict();
		thisArr["ParcelAttribute.Tract"] = fcapParcelObj[i].getTract();
		thisArr["ParcelAttribute.PlanArea"] = fcapParcelObj[i].getPlanArea();
  		}
	}
function logDebug(dstr) {

    if (!aa.calendar.getNextWorkDay) {

		vLevel = 1
		if (arguments.length > 1)
			vLevel = arguments[1]

		if ((showDebug & vLevel) == vLevel || vLevel == 1)
			debug += dstr + br;

		if ((showDebug & vLevel) == vLevel)
			aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"), dstr)
		}
	else {
			debug+=dstr + br;
		}

}

function logGlobals(globArray) {

	for (loopGlob in globArray)
		logDebug("{" + loopGlob + "} = " + globArray[loopGlob])
	}


function logMessage(dstr)
	{
	message+=dstr + br;
	}
function lookup(stdChoice,stdValue) 
	{
	var strControl;
	var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice,stdValue);
	
   	if (bizDomScriptResult.getSuccess())
   		{
		var bizDomScriptObj = bizDomScriptResult.getOutput();
		var strControl = "" + bizDomScriptObj.getDescription(); // had to do this or it bombs.  who knows why?
		logDebug("lookup(" + stdChoice + "," + stdValue + ") = " + strControl);
		}
	else
		{
		logDebug("lookup(" + stdChoice + "," + stdValue + ") does not exist");
		}
	return strControl;
	}

function lookupDateRange(stdChoiceEntry,dateValue) // optional val number 
	{
	var valNumber = 1;
	if (arguments.length == 3) valNumber = arguments[2];

	var compDate = new Date(dateValue);
	var domArr
	for (var count=1; count <= 9999; count++)  // Must be sequential from 01 up to 9999
		{
		var countstr = "0000" + count;
		var countstr = String(countstr).substring(countstr.length,countstr.length - 4);
		var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoiceEntry,countstr);
	   	
	   	if (bizDomScriptResult.getSuccess())
	   		{
			var bizDomScriptObj = bizDomScriptResult.getOutput();
			var domVal = bizDomScriptObj.getDescription();
			if (bizDomScriptObj.getAuditStatus() != 'I')
				{
				var domOld = domArr;
				var domArr = domVal.split("\\^")
				var domDate = new Date(domArr[0])
				if (domDate >= compDate)     //  found the next tier, use the last value
					if (domOld)
						return domOld[valNumber];
					else
						break;
				}					
			}
		else
			if (domArr)
				return domArr[valNumber];
			else
				break;
		}
	}	
function lookupFeesByValuation(stdChoiceEntry,stdChoiceValue,capval) // optional arg number 
	{
	var valNumber = 1;
	if (arguments.length == 4) valNumber = arguments[3];

	var saveVal ; 
	var lookupStr = lookup(stdChoiceEntry,stdChoiceValue);
	
	if (lookupStr)
		{
		workArr = lookupStr.split("^");
		for (var i in workArr)
			{
                        aa.print(workArr[i]);
			workVals = workArr[i].split("|");
			if (workVals[0] > capval) 
				return saveVal;
			else
				if (valNumber == 1)
					saveVal = workVals[valNumber];
				else
					{
					saveVal = parseInt((capval - workVals[0])/100);
					if ((capval - workVals[0]) % 100 > 0) saveVal++;
					saveVal = saveVal * workVals[valNumber];
					}
			}
		}
	return saveVal;
	}



//
// matches:  returns true if value matches any of the following arguments
//
function matches(eVal,argList) {
   for (var i=1; i<arguments.length;i++)
   	if (arguments[i] == eVal)
   		return true;

}


function pairObj(actID)
	{
	this.ID = actID;
	this.cri = null;
	this.act = null;
	this.elseact = null;
	this.enabled = true;
	this.continuation = false;
	this.branch = new Array();

	this.load = function(loadStr) {
		//
		// load() : tokenizes and loades the criteria and action
		//
		loadArr = loadStr.split("\\^");
		if (loadArr.length < 2 || loadArr.length > 3)
			{
			logMessage("**ERROR: The following Criteria/Action pair is incorrectly formatted.  Two or three elements separated by a caret (\"^\") are required. " + br + br + loadStr)
			}
		else
			{
			this.cri     = loadArr[0];
			this.act     = loadArr[1];
			this.elseact = loadArr[2];

			if (this.cri.length() == 0) this.continuation = true; // if format is like ("^action...") then it's a continuation of previous line

			var a = loadArr[1];
			var bb = a.indexOf("branch");
			while (!enableVariableBranching && bb >= 0)
			  {
			  var cc = a.substring(bb);
			  var dd = cc.indexOf("\")");
			  this.branch.push(cc.substring(8,dd));
			  a = cc.substring(dd);
			  bb = a.indexOf("branch");
			  }

			}
		}
	}

function proximity(svc,layer,numDistance)  // optional: distanceType
	{
	// returns true if the app has a gis object in proximity
	// to be used with ApplicationSubmitBefore only

	var distanceType = "feet"
	if (arguments.length == 4) distanceType = arguments[3]; // use distance type in arg list
   	
	bufferTargetResult = aa.gis.getGISType(svc,layer); // get the buffer target
	if (bufferTargetResult.getSuccess())
		{
		buf = bufferTargetResult.getOutput();
		buf.addAttributeName(layer + "_ID");
		}
	else
		{ logDebug("**ERROR: Getting GIS Type for Buffer Target.  Reason is: " + bufferTargetResult.getErrorType() + ":" + bufferTargetResult.getErrorMessage()) ; return false }
	
	
	var gisObjResult = aa.gis.getParcelGISObjects(ParcelValidatedNumber); // get gis objects on the parcel number
	if (gisObjResult.getSuccess()) 	
		var fGisObj = gisObjResult.getOutput();
	else
		{ logDebug("**ERROR: Getting GIS objects for Parcel.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()) ; return false }

	for (a1 in fGisObj) // for each GIS object on the Cap
		{
		var bufchk = aa.gis.getBufferByRadius(fGisObj[a1], numDistance, distanceType, buf);

		if (bufchk.getSuccess())
			var proxArr = bufchk.getOutput();
		else
			{ logDebug("**ERROR: Retrieving Buffer Check Results.  Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage()) ; return false }	
		
		for (a2 in proxArr)
			{
			proxObj = proxArr[a2].getGISObjects();  // if there are GIS Objects here, we're done
			if (proxObj.length) 
				{
				return true;
				}
			}
		}
	}

function proximityToAttribute(svc,layer,numDistance,distanceType,attributeName,attributeValue)
	{
	// returns true if the app has a gis object in proximity that contains the attributeName = attributeValue
	// use with all events except ApplicationSubmitBefore
	// example usage:
	// 01 proximityToAttribute("flagstaff","Parcels","50","feet","BOOK","107") ^ DoStuff...

	var bufferTargetResult = aa.gis.getGISType(svc,layer); // get the buffer target
	if (bufferTargetResult.getSuccess())
		{
		buf = bufferTargetResult.getOutput();
		buf.addAttributeName(attributeName);
		}
	else
		{ logDebug("**ERROR: Getting GIS Type for Buffer Target.  Reason is: " + bufferTargetResult.getErrorType() + ":" + bufferTargetResult.getErrorMessage()) ; return false }
			
	var gisObjResult = aa.gis.getParcelGISObjects(ParcelValidatedNumber); // get gis objects on the parcel number
	if (gisObjResult.getSuccess()) 	
		var fGisObj = gisObjResult.getOutput();
	else
		{ logDebug("**ERROR: Getting GIS objects for Parcel.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()) ; return false }
	for (a1 in fGisObj) // for each GIS object on the Cap
		{
		var bufchk = aa.gis.getBufferByRadius(fGisObj[a1], numDistance, distanceType, buf);

		if (bufchk.getSuccess())
			var proxArr = bufchk.getOutput();
		else
			{ logDebug("**ERROR: Retrieving Buffer Check Results.  Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage()) ; return false }	
		
		for (a2 in proxArr)
			{
			var proxObj = proxArr[a2].getGISObjects();  // if there are GIS Objects here, we're done
			for (z1 in proxObj)
				{
				var v = proxObj[z1].getAttributeValues()
				retString = v[0];
				if (retString && retString.equals(attributeValue))
					return true;
				}
			
			}
		}
	}
function refLicProfGetDate (pLicNum, pDateType)
	{
	//Returns expiration date from reference licensed professional record
	//pDateType parameter decides which date field is returned.  Options: "EXPIRE" (default), "RENEW","ISSUE","BUSINESS","INSURANCE"
	//Internal Functions needed: convertDate(), jsDateToMMDDYYYY()
	//07SSP-00033/SP5014
	//
	if (pDateType==null || pDateType.length==0)
		var dateType = "EXPIRE";
	else 
		{
		var dateType = pDateType.toUpperCase();
		if ( !(dateType=="ISSUE" || dateType=="RENEW" || dateType=="BUSINESS" || dateType=="INSURANCE") )
			dateType = "EXPIRE";		
		}
		
	if (pLicNum==null || pLicNum.length==0)
		{
		logDebug("Invalid license number parameter");
		return ("INVALID PARAMETER");
		}
		
	var refLicenseResult = aa.licenseScript.getRefLicensesProfByLicNbr(aa.getServiceProviderCode(),pLicNum);
	if (!refLicenseResult.getSuccess())
		{
		logDebug("**ERROR retrieving reference license professional: " + refLicenseResult.getErrorMessage());
		return false; 
		}
		
	var newLicArray = refLicenseResult.getOutput();
	if (newLicArray)
		{
		newLic = newLicArray[0];
		var jsExpDate = new Date();
		if (dateType=="EXPIRE")
			{
			if (newLic.getLicenseExpirationDate())
				{
				jsExpDate = convertDate(newLic.getLicenseExpirationDate());
				logDebug(pLicNum+" License Expiration Date: "+jsDateToMMDDYYYY(jsExpDate));
				return jsExpDate;
				}
			else
				{
				logDebug("Reference record for license "+pLicNum+" has no License Expiration Date");
				return ("NO DATE FOUND");
				}
			}
		else if (dateType=="INSURANCE")
			{
			if (newLic.getInsuranceExpDate())
				{
				jsExpDate = convertDate(newLic.getInsuranceExpDate());
				logDebug(pLicNum+" Insurance Expiration Date: "+jsDateToMMDDYYYY(jsExpDate));
				return jsExpDate;
				}
			else
				{
				logDebug("Reference record for license "+pLicNum+" has no Insurance Expiration Date");
				return ("NO DATE FOUND");
				}
			}
		else if (dateType=="BUSINESS")
			{
			if (newLic.getBusinessLicExpDate())
				{
				jsExpDate = convertDate(newLic.getBusinessLicExpDate());
				logDebug(pLicNum+" Business Lic Expiration Date: "+jsDateToMMDDYYYY(jsExpDate));
				return jsExpDate;
				}
			else
				{
				logDebug("Reference record for license "+pLicNum+" has no Business Lic Exp Date");
				return ("NO DATE FOUND");
				}
			}
		else if (dateType=="ISSUE")
			{
			if (newLic.getLicenseIssueDate())
				{
				jsExpDate = convertDate(newLic.getLicenseIssueDate());
				logDebug(pLicNum+" License Issue Date: "+jsDateToMMDDYYYY(jsExpDate));
				return jsExpDate;
				}
			else
				{
				logDebug("Reference record for license "+pLicNum+" has no Issue Date");
				return ("NO DATE FOUND");
				}
			}
		else if (dateType=="RENEW")
			{
			if (newLic.getLicenseLastRenewalDate())
				{
				jsExpDate = convertDate(newLic.getLicenseLastRenewalDate());
				logDebug(pLicNum+" License Last Renewal Date: "+jsDateToMMDDYYYY(jsExpDate));
				return jsExpDate;
				}
			else
				{
				logDebug("Reference record for license "+pLicNum+" has no Last Renewal Date");
				return ("NO DATE FOUND");
				}
			}
		else
			return ("NO DATE FOUND");
		}
	else
		{
		logMessage("No reference licensed professional found with state license number of "+pLicNum);
		logDebug("No reference licensed professional found with state license number of "+pLicNum);
		return ("NO LICENSE FOUND");
		}
	}

function token(tstr)
	{
	if (!disableTokens)
		{
		re = new RegExp("\\{","g") ; tstr = String(tstr).replace(re,"AInfo[\"");
		re = new RegExp("\\}","g") ; tstr = String(tstr).replace(re,"\"]");
		}
	return String(tstr);
  	}

function loadParcelAttributesTPS(thisArr) {
	// Modified version of the loadParcelAttributes()
	// Returns an associative array of Parcel Attributes
	// Optional second parameter, parcel number to load from
	// If no parcel is passed, function is using the ParcelValidatedNumber variable defined in the "BEGIN Event Specific Variables" list in ApplicationSubmitBefore

	var parcelNum = ParcelValidatedNumber;
	if (arguments.length == 2) parcelNum = arguments[1]; // use parcel number specified in args
 	
        if (parcelNum.length != 0 && parcelNum != "" && parcelNum != null)
           {
	   var fParcelObj = null;
   	   var parcelResult = aa.parcel.getParceListForAdmin(parcelNum, null, null, null, null, null, null, null, null, null);
   	   if (!parcelResult.getSuccess())
              logDebug("**ERROR: Failed to get Parcel object: " + parcelResult.getErrorType() + ":" + parcelResult.getErrorMessage());
    	   else
               var fParcelObj = parcelResult.getOutput()[0];
               var fParcelModel = fParcelObj.parcelModel;

               var parcelAttrObj = fParcelModel.getParcelAttribute().toArray();
               for (z in parcelAttrObj)
                   thisArr["ParcelAttribute." + parcelAttrObj[z].getAttributeName()]=parcelAttrObj[z].getAttributeValue();

              // Explicitly load some standard values
              thisArr["ParcelAttribute.Block"] = fParcelModel.getBlock();
              thisArr["ParcelAttribute.Book"] = fParcelModel.getBook();
              thisArr["ParcelAttribute.CensusTract"] = fParcelModel.getCensusTract();
              thisArr["ParcelAttribute.CouncilDistrict"] = fParcelModel.getCouncilDistrict();
              thisArr["ParcelAttribute.ExemptValue"] = fParcelModel.getExemptValue();
              thisArr["ParcelAttribute.ImprovedValue"] = fParcelModel.getImprovedValue();
              thisArr["ParcelAttribute.InspectionDistrict"] = fParcelModel.getInspectionDistrict();
              thisArr["ParcelAttribute.LandValue"] = fParcelModel.getLandValue();
              thisArr["ParcelAttribute.LegalDesc"] = fParcelModel.getLegalDesc();
              thisArr["ParcelAttribute.Lot"] = fParcelModel.getLot();
              thisArr["ParcelAttribute.MapNo"] = fParcelModel.getMapNo();
              thisArr["ParcelAttribute.MapRef"] = fParcelModel.getMapRef();
              thisArr["ParcelAttribute.ParcelArea"] = fParcelModel.getParcelArea();
              thisArr["ParcelAttribute.ParcelStatus"] = fParcelModel.getParcelStatus();
              thisArr["ParcelAttribute.SupervisorDistrict"] = fParcelModel.getSupervisorDistrict();
              thisArr["ParcelAttribute.Tract"] = fParcelModel.getTract();
              thisArr["ParcelAttribute.PlanArea"] = fParcelModel.getPlanArea();
           }
	}