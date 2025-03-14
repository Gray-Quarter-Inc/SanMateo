
showDebug = false;
showMessage = false;

if (matches(currentUserID, "KHOBDAY", "MNICCORE", "RVALLEJOS", "AVOCETTE","GRAYQUARTER")) {
    showDebug = true;
}

/*-------------- Used by Avo_LogDebug function: -----------------*/
// 0: no debug
// 1: minimal debugging
// 2: full debugging
var debugLevel = 2;
// if true use logDebug (Best for EMSE)
// if false use aa.print (Best for Batch)
var useLogDebug = true;
/*-----------------------------  --------------------------------*/

var envName = "Prod";