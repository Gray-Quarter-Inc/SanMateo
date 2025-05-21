function getStandardChoiceValues(stdChoiceName) {
	var bizDomain = aa.bizDomain.getBizDomain(stdChoiceName);
	var stdChoiceArr = new Array();	
	if(bizDomain.getSuccess()) {
		var stdOut = bizDomain.getOutput().toArray();	
		for(index in stdOut) {
			var record = {
				key: stdOut[index].getBizdomainValue(),
				value: stdOut[index].getDescription()
			};
			stdChoiceArr.push(record);
		}
	}	
	return stdChoiceArr;
}