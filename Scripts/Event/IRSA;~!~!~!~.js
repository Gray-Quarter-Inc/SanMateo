/*
Script Name: InspectionResultSubmitAfter.js
Converted from Std Choice: InspectionResultSubmitAfter
 */

/*
Script Name: V360InspectionResultSubmitAfter.js
Converted from Std Choice: V360InspectionResultSubmitAfter
 */

if (appMatch('Building/*/*/*') && !appMatch('Building/Residential/*/*')) {
    include('ES_BLD_INSPECTIONRESULTSUBMITAFTER'); /* replaced branch(ES_BLD_InspectionResultSubmitAfter) */
}

if (inspType == '111 Erosion Control' && matches(inspResult, 'Pass', 'Fail')) {
    var myHashMap = aa.util.newHashMap();
    myHashMap.put('p1Value', inspId);
    sendEmailwAttchmnt('noreply@accela.com', 'ekimmel@smcgov.org', '', 'Inspection Results', 'Please see attached Inspection Report', 'Guide Sheet Data eMail', myHashMap);
}

if (appMatch('PublicWorks/*/*/*')) {
    include('ES_PWIRSA'); /* replaced branch(ES_PWIRSA) */
}

if (appMatch('MenloParkFire/Permit/*/*') || appMatch('MenloParkFire/Plan Review/*/*')) {
    include('ES_FIREIRSA'); /* replaced branch(ES_FireIRSA) */
}
