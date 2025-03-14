try {
    var debug = "";
    var br = "<BR>";
    var showDebug = true;
    var useAppSpecificGroupName = false;
    var dMessage = "";
    var cap = aa.env.getValue("cap");
    var emailtemplate = aa.env.getValue("emailtemplate");
    var tParams = aa.env.getValue("tParams");
    var emailTo = aa.env.getValue("emailTo");
    var emailFrom = aa.env.getValue("emailFrom");
    var currentUserID = "ADMIN";
    var capId = cap.getCapID();

    wait(10000);
    //get documents
    var documents = aa.document.getCapDocumentList(capId, currentUserID).getOutput();
    var docsArray = new Array();
    for (var d in documents) {
        var docModel = documents[d];
        var docCat = docModel.getDocCategory();
        var fileName = docModel.getFileName();
        var doc = prepareDocumentForEmailAttachment(capId, docCat, fileName);
        logDebug("Got this document: " + doc);
        if (doc)
            docsArray.push(doc);
    }
    sendNotification("", emailTo, "", emailtemplate, tParams, docsArray);
} catch(e) {
    //put debug here
    aa.sendMail("fishac@accela.com", "fishac@accela.com", "", "SMCGOV Error", "Error on line " + e.lineNumber + ": " + e.message);
}
finally
{
    if (showDebug)
    {
        aa.sendMail("fishac@accela.com", "fishac@accela.com", "", "SMCGOV Debug", debug);
    }
}
function getScriptText(vScriptName, servProvCode, useProductScripts) {
    if (!servProvCode)  servProvCode = aa.getServiceProviderCode();
    vScriptName = vScriptName.toUpperCase();    
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    try {
        if (useProductScripts) {
            var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
        } else {
            var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
        }
        return emseScript.getScriptText() + "";
    } catch (err) {
        return "";
    }
}  
function prepareDocumentForEmailAttachment(itemCapId, documentType, documentFileName) {
    if ((!documentType || documentType == "" || documentType == null) && (!documentFileName || documentFileName == "" || documentFileName == null)) {
        logDebug("**WARN at least docType or docName should be provided, abort...!");
        return null;
    }
    var documents = aa.document.getCapDocumentList(itemCapId, aa.getAuditID());
    if (!documents.getSuccess()) {
        logDebug("**WARN get cap documents error:" + documents.getErrorMessage());
        return null;
    } //get docs error
    documents = documents.getOutput();
    //sort (from new to old)
    documents.sort(function (d1, d2) {
        if (d1.getFileUpLoadDate().getTime() > d2.getFileUpLoadDate().getTime())
            return -1;
        else if (d1.getFileUpLoadDate().getTime() < d2.getFileUpLoadDate().getTime())
            return 1;
        else
            return 0;
    });
    //find doc by type or name
    var docToPrepare = null;
    for (var d in documents) {
        var catt = documents[d].getDocCategory();
        var namee = documents[d].getFileName();
        var size = documents[d].getFileSize();
        if (size >= 15000000) {
            continue;
        }
        if (documentType && documentType != null && documentType != "" && documentType == catt) {
            docToPrepare = documents[d];
            break;
        }
        if (documentFileName && documentFileName != null && documentFileName != "" && namee.indexOf(documentFileName) > -1) {
            docToPrepare = documents[d];
            break;
        }
    } //for all docs
    //download to disk
    if (docToPrepare == null) {
        logDebug("**WARN No documents of type or name found");
        return null;
    } //no docs of type or name
    var thisCap = aa.cap.getCap(itemCapId).getOutput();
    var moduleName = thisCap.getCapType().getGroup();
    var toClear = docToPrepare.getFileName();
    toClear = toClear.replace("/", "-").replace("\\", "-").replace("?", "-").replace("%", "-").replace("*", "-").replace(":", "-").replace("|", "-").replace('"', "").replace("'", "").replace("<", "-").replace(">", "-").replace(".", "").replace(" ", "_");
    docToPrepare.setFileName(toClear);
    var downloadRes = aa.document.downloadFile2Disk(docToPrepare, moduleName, "", "", true);
    if (downloadRes.getSuccess()) {
        return downloadRes.getOutput().toString();
    } else {
        logDebug("**WARN document download failed, " + docToPrepare.getFileName());
        logDebug(downloadRes.getErrorMessage());
        return null;
    } //download failed
    return null;
}
 function sendNotification(emailFrom,emailTo,emailCC,templateName,params,reportFile)
{
    var itemCap = capId;
    if (arguments.length == 7) itemCap = arguments[6]; // use cap ID specified in args

    var id1 = itemCap.ID1;
    var id2 = itemCap.ID2;
    var id3 = itemCap.ID3;

    var capIDScriptModel = aa.cap.createCapIDScriptModel(id1, id2, id3);
    var result = null;
    result = aa.document.sendEmailAndSaveAsDocument(emailFrom, emailTo, emailCC, templateName, params, capIDScriptModel, reportFile);
    if(result.getSuccess())
    {
        logDebug("Sent email successfully!");
        return true;
    }
    else
    {
        logDebug("Failed to send mail. - " + result.getErrorType());
        return false;
    }
}
function logDebug(dstr) {
    vLevel = 1
    if (arguments.length > 1)
        vLevel = arguments[1];
    if ((showDebug & vLevel) == vLevel || vLevel == 1)
        debug += dstr + br;
    if ((showDebug & vLevel) == vLevel)
        aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"), dstr);
}
function wait(milliseconds) {
    var date = new Date().getTime();
    var currentDate = null;
    do {
        currentDate = new Date().getTime();
    } while (currentDate - date < milliseconds);
}