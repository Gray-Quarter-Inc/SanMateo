/*
Script Name: ES_WM_AssessParentFee.js
Converted from Std Choice: ES_WM_AssessParentFee
*/


holdId = capId;
capId=getParent();
updateFee('PW066','B_PERMIT','FINAL',1,'Y');
capId=holdId;

