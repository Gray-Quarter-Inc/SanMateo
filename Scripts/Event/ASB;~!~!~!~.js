/*
Script Name: ApplicationSubmitBefore.js
Converted from Std Choice: ApplicationSubmitBefore
 */

comment('FEMA = ' + AInfo['ParcelAttribute.FEMA']) // test to see if a parcel attribute is visible;
theAddrCity = aa.env.getValue('AddressCity');
comment('The City is : ' + theAddrCity);
if (AInfo['ParcelAttribute.ZONING DESIGNATION'] == 'NO DATA ASSIGNED' && !appMatch('PublicWorks/*/*/*') && !appMatch('MenloParkFire/*/*/*') && !appMatch('*/Zoning Violation/*/*') && !appMatch('RealProperty/*/*/*')) {
    showMessage = true;
    comment('Warning: This parcel is outside the County jurisdiction and not within the City of San Carlos. A record cannot be created using a parcel outside the county jurisdiction that is not a public works project or Zoning Violation in the City of San Carlos.');
    cancel = true;
}

if (appMatch('*/Zoning Violation/*/*') && AInfo['ParcelAttribute.ZONING DESIGNATION'] == 'NO DATA ASSIGNED' && theAddrCity != 'SAN CARLOS') {
    showMessage = true;
    comment('Warning: This parcel is outside the County jurisdiction and not within the City of San Carlos. A Zoning Violation cannot be created outside of the Counties jurisdiction and not in the City of San Carlos.');
    cancel = true;
}

if (appMatch('*/*/Electric Service/*') && publicUser && AInfo['Less than 300 Amps'] != 'CHECKED') {
    showMessage = true;
    comment('<font size=small><b>Stop!:</b></font><br><br>This permit cannot be processed online. Please go to the County office at 455 County Center, 2nd floor to apply for this permit.<br><br>');
    cancel = true;
}

if (appMatch('*/*/Windows or Doors Size for Size/*') && publicUser && AInfo['Size for Size'] != 'CHECKED') {
    showMessage = true;
    comment('<font size=small><b>Stop!:</b></font><br><br>This permit cannot be processed online. Please go to the County offices at 455 County Center, 2nd floor to apply for this permit.<br><br>');
    cancel = true;
}

if (appMatch('*/*/Reroof/*') && publicUser && AInfo['Materials'] == 'Other') {
    showMessage = true;
    comment('The use of selected materials or color needs to be approved by the Planning Division before you apply for the permit. Please visit our office at 455 County Center, 2nd Floor, Redwood City to apply for the permit +é-áin person.<br><br>');
    cancel = true;
}

if (appMatch('*/*/Reroof/*') && publicUser && AInfo['Materials'] == 'Metal') {
    showMessage = true;
    comment('The use of selected materials or color needs to be approved by the Planning Division before you apply for the permit. Please visit our office at 455 County Center, 2nd Floor, Redwood City to apply for the permit +é-áin person.<br><br>');
    cancel = true;
}

if (appMatch('*/*/Reroof/*') && publicUser && AInfo['Materials'] == 'Reflective') {
    showMessage = true;
    comment('The use of selected materials or color needs to be approved by the Planning Division before you apply for the permit. Please visit our office at 455 County Center, 2nd Floor, Redwood City to apply for the permit +é-áin person.<br><br>');
    cancel = true;
}

if (appMatch('*/*/Reroof/*') && publicUser && AInfo['Colors'] == 'White') {
    showMessage = true;
    comment('The use of selected materials or color needs to be approved by the Planning Division before you apply for the permit. Please visit our office at 455 County Center, 2nd Floor, Redwood City to apply for the permit +é-áin person.<br><br>');
    cancel = true;
}

if (appMatch('*/*/Reroof/*') && publicUser && AInfo['Colors'] == 'Other') {
    showMessage = true;
    comment('The use of selected materials or color needs to be approved by the Planning Division before you apply for the permit. Please visit our office at 455 County Center, 2nd Floor, Redwood City to apply for the permit +é-áin person.<br><br>');
    cancel = true;
}
