function getStandardChoiceArray(stdChoice) {
    var cntItems = 0;
    var stdChoiceArray = new Array();
    var bizDomScriptResult = aa.bizDomain.getBizDomain(stdChoice);
    if (bizDomScriptResult.getSuccess()) {
        var bizDomScriptObj = bizDomScriptResult.getOutput();
        if (bizDomScriptObj != null) {
            cntItems = bizDomScriptObj.size();
            logDebug("getStdChoiceArray: " + stdChoice + " size = " + cntItems);
            if (cntItems > 0) {
                var bizDomScriptItr = bizDomScriptObj.iterator();
                while (bizDomScriptItr.hasNext()) {
                    var bizBomScriptItem = bizDomScriptItr.next();
                    var stdChoiceArrayItem = new Array();
                    stdChoiceArrayItem["value"] = bizBomScriptItem.getBizdomainValue();
                    stdChoiceArrayItem["valueDesc"] = bizBomScriptItem.getDescription();
                    stdChoiceArrayItem["active"] = bizBomScriptItem.getAuditStatus();
                    stdChoiceArray.push(stdChoiceArrayItem);
                }
            }
        }
        else {
            logDebug("getStdChoiceArray: WARNING stdChoice not found - " + stdChoice);
        }
    }

    return stdChoiceArray;
}
/**
 * getUserInspectorObjs
 * Description: Returns an array of userObj objects for all users in the system that are inspectors
 * 
 * @return array {userObj}
 */
