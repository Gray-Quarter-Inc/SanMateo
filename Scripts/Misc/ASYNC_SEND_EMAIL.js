var emailTemplate = aa.env.getValue("vEmailTemplate");
var emailTo = aa.env.getValue("vToEmail");
var altId = aa.env.getValue("vAltId");
var contactName = aa.env.getValue("vContactName");
var contactTypeToSend = null;
if (aa.env.getValue("vContactType") && aa.env.getValue("vContactType") != "") contactTypeToSend = aa.env.getValue("vContactType");
var contactType = aa.env.getValue("vContactType");
var reportName = aa.env.getValue("vReportName");
var reportModule = aa.env.getValue("vReportModule");
var docType = aa.env.getValue("vDocumentType");
var reportFiles = [];
var reportParameters = aa.util.newHashtable();
var debug = "";
useAppSpecificGroupName = false

try {
	logDebug("ASYNC_SEND_EMAIL");
    

	capId = aa.cap.getCapID(altId).getOutput();
	cap = aa.cap.getCap(capId).getOutput();
	var capDetail = aa.cap.getCapDetail(capId).getOutput();



	//Get Email Params
	var params = aa.util.newHashtable(); 
	params.put("$$altID$$", altId);
	params.put("$$recordAlias$$", cap.capModel.appTypeAlias);
	params.put("$$balance$$", "$" + parseFloat(capDetail.balance).toFixed(2));
	params.put("$$acaPaymentUrl$$", gqGetACAUrl(capId, "1009"));
	params.put("$$acaRecordUrl$$", gqGetACAUrl(capId, "1000") )
	params.put("$$applicantFirstName$$", contactName);
	params.put("$$assignedStaff$$", getAssignedStaffFullName());
    params.put("$$assignedStaffPhone$$", getAssignedStaffPhone());
    params.put("$$assignedStaffEmail$$", getAssignedStaffEmail());


    sleep(5);
	if (reportName && reportName != "") {
        logDebug("Looking for report " + reportName);
        var rParameters = aa.util.newHashtable();
        rParameters.put("capid",altId);
		var repFile = generateReportGq(capId, reportName, reportModule, rParameters);
		if (repFile) {
			reportFiles.push(repFile);
		}
	}

    var uniqueEmails = []; // Use an array to store unique email addresses
    if (emailTo == "ALLCONTACTS" || contactTypeToSend) {
        var contactObjArray = getContactObjs(capId, contactTypeToSend);
        var contactEmailMap = {}; // Use an object to map emails to contact objects

        // Iterate over each contact object to gather email addresses
        for (var iCon in contactObjArray) {
            var tContactObj = contactObjArray[iCon];
            var email = tContactObj.people.getEmail();

            // Check if email already exists in uniqueEmails array
            if (!exists(email, uniqueEmails)) {
                // If email is not already in the array, add it
                uniqueEmails.push(email);
                contactEmailMap[email] = tContactObj; // Map email to contact object
            }
        }
    }
    else {
        logDebug("Not sending to contacts");
        var uniqueEmailsPieces = emailTo.split(";");
        for (var uIndex in uniqueEmailsPieces)
            uniqueEmails.push(uniqueEmailsPieces[uIndex]);
    }

    if (docType && docType != "") {
        logDebug("Looking for documents of type " + docType);
        var capDocResult = aa.document.getDocumentListByEntity(capId,"CAP");
        if(capDocResult.getSuccess()) {
            if(capDocResult.getOutput().size() > 0) {
                for(docInx = 0; docInx < capDocResult.getOutput().size(); docInx++) {
                    var documentObject = capDocResult.getOutput().get(docInx);				
                    currDocCat = "" + documentObject.getDocCategory();	
                    if (currDocCat == docType) {			
                        // download the document content
                        var useDefaultUserPassword = true;
                        //If useDefaultUserPassword = true, there is no need to set user name & password, but if useDefaultUserPassword = false, we need define EDMS user name & password.
                        var EMDSUsername = null;
                        var EMDSPassword = null;
                        var downloadResult = aa.document.downloadFile2Disk(documentObject, documentObject.getModuleName(), EMDSUsername, EMDSPassword, useDefaultUserPassword);
                        if(downloadResult.getSuccess()) {
                            var path = downloadResult.getOutput();
                            logDebug("adding file to email");
                            reportFiles.push(path);
                        }
                    }
                }
            }
        }
    }

	//Send Email Notification
    logDebug("Sending to " + uniqueEmails.join(";"));
	sendNotification("",uniqueEmails.join(";"),"",emailTemplate,params,reportFiles, capId);
}
catch (e) {
	logDebug(e);
}

aa.env.setValue("EventName", "ASYNC_SEND_EMAIL")
aa.env.setValue("ScriptReturnCode", "0");
aa.env.setValue("ScriptReturnMessage", "ASYNC_SEND_EMAIL" + debug);


//Custom Functions

function exists(eVal, eArray) {
	  for (ii in eArray)
	  	if (eArray[ii] == eVal) return true;
	  return false;
}

function sleep(seconds) 
{
  var e = new Date().getTime() + (seconds * 1000);
  while (new Date().getTime() <= e) {}
}

 
function getContactObjs(itemCap) // optional typeToLoad, optional return only one instead of Array?
{
    var typesToLoad = false;
    if (arguments.length == 2) {
        var typeStr = arguments[1];
        if (typeStr && typeStr != "")
            typesToLoad = [ typeStr ];
    }
    
    var capContactArray = new Array();
    var cArray = new Array();
    //if (itemCap.getClass().toString().equals("com.accela.aa.aamain.cap.CapModel"))   { // page flow script 
    if (!cap.isCompleteCap() && controlString != "ApplicationSubmitAfter") {

        if (cap.getApplicantModel()) {
            capContactArray[0] = cap.getApplicantModel();
        }
            
        if (cap.getContactsGroup().size() > 0) {
            var capContactAddArray = cap.getContactsGroup().toArray();
            for (ccaa in capContactAddArray)
                capContactArray.push(capContactAddArray[ccaa]);     
        }
    }
    else {
        var capContactResult = aa.people.getCapContactByCapID(itemCap);
        if (capContactResult.getSuccess()) {
            var capContactArray = capContactResult.getOutput();
            }
        }

    if (capContactArray) {
        for (var yy in capContactArray) {
            if (!typesToLoad || exists(capContactArray[yy].getPeople().contactType, typesToLoad)) {
                cArray.push(new contactObj(capContactArray[yy]));
            }
        }
    }
    
    logDebug("getContactObj returned " + cArray.length + " contactObj(s)");
    return cArray;
            
}

function contactObj(ccsm)  {

    this.people = null;         // for access to the underlying data
    this.capContact = null;     // for access to the underlying data
    this.capContactScript = null;   // for access to the underlying data
    this.capId = null;
    this.type = null;
    this.seqNumber = null;
    this.refSeqNumber = null;
    this.asiObj = null;
    this.asi = new Array();    // associative array of attributes
    this.primary = null;
    this.relation = null;
    this.addresses = null;  // array of addresses
    this.validAttrs = false;
        
    this.capContactScript = ccsm;
    if (ccsm)  {
        if (ccsm.getCapContactModel == undefined) {  // page flow
            this.people = this.capContactScript.getPeople();
            this.refSeqNumber = this.capContactScript.getRefContactNumber();
            }
        else {
            this.capContact = ccsm.getCapContactModel();
            this.people = this.capContact.getPeople();
            this.refSeqNumber = this.capContact.getRefContactNumber();       
        }  

        //this.primary = this.capContact.getPrimaryFlag().equals("Y");
        this.relation = this.people.relation;
        this.seqNumber = this.people.contactSeqNumber;
        this.type = this.people.getContactType();
        this.capId = this.capContactScript.getCapID();
      
    }       
    this.toString = function() { return this.capId + " : " + this.type + " " + this.people.getLastName() + "," + this.people.getFirstName() + " (id:" + this.seqNumber + "/" + this.refSeqNumber + ")" }
    
} 

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

 

function generateReportGq(itemCap, reportName, module, parameters) {
 
    //returns the report file which can be attached to an email.
    var user = "ADMIN"; // Setting the User Name
    var report = aa.reportManager.getReportInfoModelByName(reportName);
    report = report.getOutput();
    report.setModule(module);
    report.setCapId(itemCap.getID1() + "-" + itemCap.getID2() + "-" + itemCap.getID3());
    report.setReportParameters(parameters);
   // report.getEDMSEntityIdModel().setAltId(itemCap.getCustomID());
 
    var permit = aa.reportManager.hasPermission(reportName, user);
 
    if (permit.getOutput().booleanValue()) {
        var reportResult = aa.reportManager.getReportResult(report);
        if (reportResult) {
            reportOutput = reportResult.getOutput();
            if (reportOutput) {

                var reportFile = aa.reportManager.storeReportToDisk(reportOutput);
                reportFile = reportFile.getOutput();
                return reportFile;
            } else {
                logDebug("System failed get reportt: " + reportResult.getErrorType() + ":" + reportResult.getErrorMessage());
                return false;
            }
        } else {
            logDebug("System failed get report: " + reportResult.getErrorType() + ":" + reportResult.getErrorMessage());
            return false;
        }
    } else {
        logDebug("You have no permission.");
        return false;
    }
}

function getAssignedStaffFullName(){
    var cdScriptObjResult = aa.cap.getCapDetail(capId);
    if (!cdScriptObjResult.getSuccess()) {
        logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage());
        return ""
    }
    var cdScriptObj = cdScriptObjResult.getOutput();
    if (!cdScriptObj) {
        logDebug("**ERROR: No cap detail script object");
        return ""
    }
    var cd = cdScriptObj.getCapDetailModel();
    var	userId=cd.getAsgnStaff();
    if (userId==null) return "";
    var iNameResult = aa.person.getUser(userId);
    var iName = iNameResult.getOutput();
    var fullName=iName.getFullName();
    return fullName;
}

function getAssignedStaffPhone(){
    var cdScriptObjResult = aa.cap.getCapDetail(capId);
    if (!cdScriptObjResult.getSuccess()) {
        logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage());
        return ""
    }
    var cdScriptObj = cdScriptObjResult.getOutput();
    if (!cdScriptObj) {
        logDebug("**ERROR: No cap detail script object");
        return ""
    }
    var cd = cdScriptObj.getCapDetailModel();
    var	userId=cd.getAsgnStaff();
    if (userId==null) return "";
    var iNameResult = aa.person.getUser(userId);
    var iName = iNameResult.getOutput();
    var fullName=iName.getPhoneNumber();
    return fullName;
}
function getAssignedStaffEmail(){
    var cdScriptObjResult = aa.cap.getCapDetail(capId);
    if (!cdScriptObjResult.getSuccess()) {
        logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage());
        return ""
    }
    var cdScriptObj = cdScriptObjResult.getOutput();
    if (!cdScriptObj) {
        logDebug("**ERROR: No cap detail script object");
        return ""
    }
    var cd = cdScriptObj.getCapDetailModel();
    var	userId=cd.getAsgnStaff();
    if (userId==null) return "";
    var iNameResult = aa.person.getUser(userId);
    var iName = iNameResult.getOutput();
    var email=iName.getEmail();
    return email;
}

function logDebug(s) {
    debug += s + "\r\n";
}


function sendNotification(emailFrom,emailTo,emailCC,templateName,params,reportFile) {
	var itemCap = capId;

	if (arguments.length == 7) itemCap = arguments[6]; // use cap ID specified in args

	var id1 = itemCap.ID1;
	var id2 = itemCap.ID2;
	var id3 = itemCap.ID3;
	var capIDScriptModel = aa.cap.createCapIDScriptModel(id1, id2, id3);
	var result = null;
	result = aa.document.sendEmailAndSaveAsDocument(emailFrom, emailTo, emailCC, templateName, params, capIDScriptModel, reportFile);
	if (result.getSuccess()) {
		aa.print("Sent email successfully!");
		return true;
	} else {
		aa.print("Failed to send mail. - " + result.getErrorType());
		return false;
	}
}
function gqGetACAUrl(itemCap, routeId) {
    // returns the path to the record on ACA.  Needs to be appended to the site    
    var enableCustomWrapper = lookup("ACA_CONFIGS", "ENABLE_CUSTOMIZATION_PER_PAGE");
    var acaUrl = lookup("ACA_CONFIGS", "ACA_SITE");
    acaUrl = acaUrl.substr(0, acaUrl.toUpperCase().indexOf("/ADMIN"));
    var id1 = itemCap.getID1();
    var id2 = itemCap.getID2();
    var id3 = itemCap.getID3();
    var itemCapModel = aa.cap.getCap(itemCap).getOutput().getCapModel();
    if(!routeId) {
        routeId = "1000";
    }
    acaUrl += "/urlrouting.ashx?type=" + routeId;
    acaUrl += "&Module=" + itemCapModel.getModuleName();
    acaUrl += "&capID1=" + id1 + "&capID2=" + id2 + "&capID3=" + id3;
    acaUrl += "&agencyCode=" + aa.getServiceProviderCode();
    if (enableCustomWrapper && enableCustomWrapper != "" && enableCustomWrapper.toLowerCase() == "yes")
        acaUrl += "&FromACA=Y";

    return acaUrl;
}

function lookup(stdChoice,stdValue) {
	var strControl;
	var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice,stdValue);
	
    if (bizDomScriptResult.getSuccess()) {
		var bizDomScriptObj = bizDomScriptResult.getOutput();
		strControl = "" + bizDomScriptObj.getDescription(); // had to do this or it bombs.  who knows why?
		aa.print("lookup(" + stdChoice + "," + stdValue + ") = " + strControl);
	} else {
		aa.print("lookup(" + stdChoice + "," + stdValue + ") does not exist");
	}
	return strControl;
}
