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
var variable0=expression.getValue("CONTACT::contactsModel*addressLine1");


if (variable0 && variable0.value && variable0.value != "") {
	var addr1 = "" + variable0.value
	pattern = new RegExp('\\bP(ost|ostal)?([ \\.]*(O|0)(ffice)?)?([\\ \\.]*Box)\\b', 'gmi')
	var result = pattern.test(addr1);
	if (result) {
		variable0.message = 'PO BOX not allowed';
		variable0.blockSubmit = true;
		expression.setReturn(variable0);
	}
	else {
		variable0.message="";
		variable0.blockSubmit = false;
		expression.setReturn(variable0);
	}
}
