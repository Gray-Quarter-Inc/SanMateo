/*
Subscript Name: ES_WM_CAPID.js
Converted from Std Choice: ES_WM_CAPID
Called From Scripts:
ApplicationSubmitAfter
ConvertToRealCAPAfter
 */

parentID = getParent();
if (parentID) {
    myParentAltId = parentID.getCustomID();
    myParentSub = myParentAltId.substring(3, 13);
    myId = capIDString.substring(0, 5);
    newAltId = myId + myParentSub;
    aa.cap.updateCapAltID(capId, newAltId);

    contents = 'Record # ' + newAltId + ' has just been created in Citizen Access';
    email('sustainability@smcgov.org', 'noreply@smcgov.org', 'Record # ' + newAltId + ' created in Accela', contents);
    emailText = 'Thank you for using our Office of Sustainability Waste Management Plan online site.  <BR><BR>';
    emailText = emailText + 'Your Record Number is <B> ' + newAltId + '</B><BR><BR>';
    emailText = emailText + "Please be sure to save your receipts, photos, letters or other documentation of  materials diverted or disposed, as proof that you have met the County's waste management requirement prior to your final inspection. <BR><BR>";
    emailText = emailText + "You may log in to the online site at any time to view the status at '+  <a href='https://aca-prod.accela.com/SMCGOV/'>https://aca-prod.accela.com/SMCGOV/</a> + '<BR><BR>";
    emailText = emailText + "You can visit us at '+  <a href='http://www.recycleworks.org/con_dem/index.html'>http://www.recycleworks.org/con_dem/index.html</a>";
    emailText = emailText + " for more information on construction & demolition recycling or check out this great guide for information on where to properly dispose of your items ' + <a href='http://www.recycleworks.org/pdf/CD_office_guide.pdf'>http://www.recycleworks.org/pdf/CD_office_guide.pdf</a> + '.<BR><BR>";
    emailText = emailText + " If you have any questions please contact the Construction & Demolition program coordinator at  " +  "< a href = 'sustainability@smcgov.org' > sustainability @ smcgov.org <  / a >  " + " or call at 1 (888) 442-2666.";
    emailContact2('Waste Record Successfully Submitted', emailText, 'Waste Plan Contact');

}
