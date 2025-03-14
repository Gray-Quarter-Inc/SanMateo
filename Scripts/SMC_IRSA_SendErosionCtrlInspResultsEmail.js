/*******************************************************
| Script/Function: sendErosionCtrlInspResultsEmail()
| Created by: Nicolaj Bunting
| Created on: 18Aug20
| Usage: On inspection result If inspection type is "111 Erosion Control" And result is "Pass" or "Fail" Then send insp results email
| Modified by: ()
*********************************************************/
(function () {
    Avo_LogDebug("Insp Type(" + inspType + ")", 2); //debug
    if (inspType !== "111 Erosion Control") {
        return;
    }

    Avo_LogDebug("Insp Result(" + inspResult + ")", 2); //debug
    if (matches(inspResult, "Pass", "Fail") !== true) {
        return;
    }

    var myHashMap = aa.util.newHashMap();
    myHashMap.put("p1Value", inspId);
    sendEmailwAttchmnt("noreply@accela.com", "ekimmel@smcgov.org", "", "Inspection Results", "Please see attached Inspection Report", "Guide Sheet Data eMail",
        myHashMap);
})();