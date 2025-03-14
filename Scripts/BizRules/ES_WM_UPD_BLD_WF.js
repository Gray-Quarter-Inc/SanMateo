/*
Subscript Name: ES_WM_UPD_BLD_WF.js
Converted from Std Choice: ES_WM_UPD_BLD_WF
Called From Scripts:
ES_WM_WORKFLOWTASKUPDATEAFTER
 */

holdId = capId;
capId = getParent();
closeTask('Waste Management Review', 'Approved', 'WMP Section 1 Approved', '');
capId = holdId;
