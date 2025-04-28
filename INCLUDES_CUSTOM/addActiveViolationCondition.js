function addActiveViolationCondition(itemCap) {
    var rTypeToMatch = "Planning/Zoning Violation/NA/NA";
    var matchingCaps = [];
    var OkayStatuses = ["Received", "Court", "Enforcement", "Final Processing", "Investigation", "Pending", "Recorded"];
    var addResult = aa.address.getAddressByCapId(itemCap);
	if (addResult.getSuccess())
		{ var aoArray = addResult.getOutput(); }
	else	
		{ logDebug("ERROR: getting address by cap ID: " + addResult.getErrorMessage()); return false; }
	
	if (aoArray.length)
		{ var ao = aoArray[0]; }
	else
		{ logDebug("**WARNING: no address for comparison:"); return false; }
	
	// get caps with same address
	var capAddResult = aa.cap.getCapListByDetailAddress(ao.getStreetName(),ao.getHouseNumberStart(),ao.getStreetSuffix(),ao.getZip(),ao.getStreetDirection(),null);
	if (capAddResult.getSuccess())
	 	{ var capIdArray=capAddResult.getOutput(); }
	else
	 	{ logDebug("ERROR: getting similar addresses: " + capAddResult.getErrorMessage());  return false; }

    for (var cappy in capIdArray) {
        var relCapId = capIdArray[cappy].getCapID();
        var relcap = aa.cap.getCap(relCapId).getOutput();
        var relStatus = relcap.getCapStatus();
        if (appMatch(rTypeToMatch, relCapId) && IsStrInArry(relStatus, OkayStatuses)) {
            var addResult2 = aa.address.getAddressByCapId(relCapId);
            if (addResult2.getSuccess()) { 
                var arArray = addResult2.getOutput();
                if (arArray.length) { 
                    var ar = arArray[0];
                    if (ar.getCity() == ao.getCity() && ar.getState() == ao.getState()) {
                        matchingCaps.push(relCapId.getCustomID());
                    }
                }
            }             
        }
    }
    logDebug("Found " + matchingCaps.length + " active violation records");
    logDebug(matchingCaps.join(","));
    if (matchingCaps.length > 0) {
        addStdConditionWithComment("Code Compliance", "Active Violation Case", "Active Violation Case(s) : " + matchingCaps.join(","));
    }    
}