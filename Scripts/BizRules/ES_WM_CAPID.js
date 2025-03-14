/*
Subscript Name: ES_WM_CAPID.js
Converted from Std Choice: ES_WM_CAPID
Called From Scripts:
ApplicationSubmitAfter
ConvertToRealCAPAfter
 */

myParentAltId = getParent().getCustomID();
myParentSub = myParentAltId.substring(3, 13);
myId = capIDString.substring(0, 5);
newAltId = myId + myParentSub;
aa.cap.updateCapAltID(capId, newAltId);
