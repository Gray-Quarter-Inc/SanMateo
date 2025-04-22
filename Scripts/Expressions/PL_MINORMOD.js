var toPrecision=function(value){
  var multiplier=10000;
  return Math.round(value*multiplier)/multiplier;
}
function addDate(iDate, nDays){ 
	if(isNaN(nDays)){
		throw("Day is a invalid number!");
	}
	return expression.addDate(iDate,parseInt(nDays));
}

function diffDate(iDate1,iDate2){
	return expression.diffDate(iDate1,iDate2);
}

function parseDate(dateString){
	return expression.parseDate(dateString);
}

function formatDate(dateString,pattern){ 
	if(dateString==null||dateString==''){
		return '';
	}
	return expression.formatDate(dateString,pattern);
}

var servProvCode=expression.getValue("$$servProvCode$$").value;
var rpr=expression.getValue("ASI::MINOR MODIFICATION::Related Planning Record");
var aa = expression.getScriptRoot();
var msg = "";

try {
	if (rpr && rpr.value && rpr.value != "") {
		var relCapId = aa.cap.getCapID("" + rpr.value).getOutput();
		if (!relCapId) {
			msg = "Invalid related planning record number, please try again";
			rpr.message = msg;
			rpr.value = "";
			expression.setReturn(rpr);
		}
		else {
			var record = aa.cap.getCap(relCapId).getOutput();
			var recordType = record.getCapType();
			if (recordType != "Planning/Project/NA/NA") {
				msg = "The Related Planning Record number was not found please check the number and enter it again";
				rpr.message = msg;
				rpr.value = "";
				expression.setReturn(rpr);
			}
		}
	}
}
catch (err) {
	msg  = err;
}
rpr.message = msg;
expression.setReturn(rpr);