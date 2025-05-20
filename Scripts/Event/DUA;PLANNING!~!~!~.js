//DUA:Planning/*/*/*

try {
    if (publicUser) {
        var documentModelList=aa.env.getValue("DocumentModelList");
        if (documentModelList) {
            docModelArr = documentModelList.toArray();
            for (var dIndex = 0; dIndex < docModelArr.length; dIndex++) {
                var thisDocModel = docModelArr[dIndex];
                var docCat = thisDocModel.getDocCategory();
                var docGroup = thisDocModel.getDocGroup();
                if (docCat == "External Review Comments") {
                    var revComment = getDocumentASI(thisDocModel, "REVIEW COMMENTS", "Comment");
                    var revStatus = getDocumentASI(thisDocModel, "REVIEW COMMENTS", "Status");
                    
                    if ( (revComment && revComment != "") || (revStatus && revStatus != "")) {
                        // update the ASIT
                        // get the LP associated with the publicUser
                        logDebug("Looking for public user " + publicUserID);
                        var publicUserModelResult = aa.publicUser.getPublicUserByPUser(publicUserID);
                        if (!publicUserModelResult.getSuccess() || !publicUserModelResult.getOutput())  {
                            logDebug("**WARNING** couldn't find public user " + publicUser + " " + publicUserModelResult.getErrorMessage()); }             
                        var userSeqNum = publicUserModelResult.getOutput().getUserSeqNum();    
                        var associatedLPResult = aa.licenseScript.getRefLicProfByOnlineUser(userSeqNum);
                    
                        if (!associatedLPResult.getSuccess() || !associatedLPResult.getOutput())  {
                            logDebug("**WARNING** no associated LPs to public user " + publicUser + " " + associatedLPResult.getErrorMessage()); }
                    
                        var associatedLPs = associatedLPResult.getOutput();
                        var bName = null;
                        logDebug("Found " + associatedLPs.length + " associated LPs");
                        for (var x in associatedLPs) {
                            var lp = associatedLPs[x];
                            logDebug("Found LP " + lp.getStateLicense() + ":" + lp.getLicenseType());
                            if (lp.getLicenseType() == "External Reviewer") {
                                bName = lp.getBusinessName();
                                logDebug(bName);
                            }
                        }
                        if (bName && bName != "") {
                            var tmpTable = loadASITable("CONSOLIDATED COMMENTS");
                            var newTable = [];
                            for (var rowIndex in tmpTable) {
                                var thisRow = tmpTable[rowIndex];
                                var thisReviewer = thisRow["Reviewer"].fieldValue;
                                if (thisReviewer.toUpperCase() == bName.toUpperCase()) {
                                    // edit this one
                                    thisRow["Comment"] = new asiTableValObj("Comment", "" + revComment, "N");
                                    thisRow["Review Status"] = new asiTableValObj("Review Status", "" + revStatus, "N");
                                    thisRow['Comment Date'] = new asiTableValObj("Comment Date", "" + sysDateMMDDYYYY, "N")
                                    newTable.push(thisRow);
                                }
                                else {
                                    newTable.push(thisRow);
                                }
                            }
                            removeASITable("CONSOLIDATED COMMENTS");
                            addASITable("CONSOLIDATED COMMENTS", newTable);
                        }
                    }
                }
            }
        }
    }
}
catch (e) {
    logDebug(e);
}
if (publicUser && (capStatus == "Additional Info Required" )) {
    var workflowResult = aa.workflow.getTaskItems(capId, null, null, null, null, "Y");
        if (workflowResult.getSuccess()) {
            wfObj = workflowResult.getOutput();
            for (var i in wfObj) {
                var fTask = wfObj[i];
                if (fTask.getActiveFlag().equals("Y")) {
                    updateTask(fTask.getTaskDescription(), "Additional Info Received", "Set by EMSE", "");
                }
            }
        }
}
