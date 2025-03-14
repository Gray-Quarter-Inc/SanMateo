/*
Subscript Name: ES_WM_UPDATEPARENTINSPECTION.js
Converted from Std Choice: ES_WM_UpdateParentInspection
Called From Scripts:
ES_WM_WORKFLOWTASKUPDATEAFTER
 */

holdId = capId;
holdStatus = wfStatus;
holdComment = wfComment;
capId = getParent();
resultInspection('Final by Waste Management', 'Pass', dateAdd(null, 0), 'WMP Section 2 inspection approved');
capId = holdId;
