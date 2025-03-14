/*
Script Name: ES_BLD_InspSchedBefore.js
Converted from Std Choice: ES_BLD_InspSchedBefore
*/


if (!appMatch('*/Stop Work Notice/*/*') && !matches(capStatus,'Issued','Revision Issued','Reinstatement+óGé¼-¥, +óGé¼+ôTemp CofO Issued','Extension') && !matches(currentUserID,'ADMIN', +óGé¼+ôJBRENNAN', 'JHE', 'ASANTIAGO',' 'MOCONNELL', 'MPAYUMO', 'GCHAPMAN', 'ASANDOVAL', 'RMMCLAUGHLIN', 'PTHOMSEN') && !matches(inspType,'Height Verification', 'Setback Verification', '071 Pre-site Inspection', '081 Damage Report', 'Final Drainage Public Works', '111 Erosion Control', '901 Building Final', 'Final by Fire', 'Final by Geotechnical', 'Final by Green Building', 'Final by Health', 'Final by Planning', 'Final by Public Works', 'Final by Sewer District', 'Final by Waste Management', 'Final by Water District', 'Final +óGé¼GÇ£ T.24', 'Final AntiEntrapment Device', 'Final CO +óGé¼GÇ£ Smoke Alarm', 'Final Other', 'Final Other Permit', 'Final SWN', 'Final by Cal Trans', 'Final by Fish & Game')) {
	showMessage = true;
	comment('An inspection cannot be scheduled until the permit has been issued.');
	cancel = true;
	}

if (appMatch('Building/*/*/*') && balanceDue > 0 && !matches(currentUserID,'ADMIN','MOCONNELL','MPAYUMO','GCHAPMAN','JBRENNAN','JHE') && !matches(inspType,'Height Verification', 'Setback Verification', '071 Pre-site Inspection', '081 Damage Report', '111 Erosion Control', '901 Building Final', 'Final by Fire', 'Final by Geotechnical', 'Final by Green Building', 'Final by Health', 'Final by Planning', 'Final by Public Works', 'Final by Sewer District', 'Final by Waste Management', 'Final by Water District', 'Final Drainage Public Works','Final Other')) {
	showMessage=true;
	comment('Inspection cannot be scheduled because there is a balance due on the record. The balance due is ' + balanceDue + '.');
	cancel = true;
	}

