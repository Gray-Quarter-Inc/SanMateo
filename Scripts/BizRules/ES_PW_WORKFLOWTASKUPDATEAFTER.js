/*
Subscript Name: ES_PW_WORKFLOWTASKUPDATEAFTER.js
Converted from Std Choice: ES_PW_WorkflowTaskUpdateAfter
Called From Scripts:
WorkflowTaskUpdateAfter
 */

if (appMatch('*/Pump Station Monitoring/*/*') && wfStatus == 'Open Illicit Discharge Case') {
    createChild('PublicWorks/Illicit Discharge/NA/NA', '');
}
