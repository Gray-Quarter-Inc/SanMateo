/*
Script Name: LicProfAddAfter.js
Converted from Std Choice: LicProfAddAfter
 */

if (appMatch('Building/*/*/*') && !appMatch('Building/Residential/*/*')) {
    include('ES_CSLB_AFTER'); /* replaced branch(ES_CSLB_AFTER) */
}
