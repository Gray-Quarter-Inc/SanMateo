/*
Subscript Name: ES_CSLB_AFTER.js
Converted from Std Choice: ES_CSLB_AFTER
Called From Scripts:
ES_BLD_APPSUBMITAFTER
LicProfAddAfter
 */

cslbMessage1 = null;
cslbMessage = 'None';
existsInCSLB = '-1';
theLicNumber = null;
capLicenseArr = aa.licenseScript.getLicenseProf(capId).getOutput();
if (capLicenseArr && capLicenseArr.length > 0) {
    theLicNumber = capLicenseArr[0].getLicenseNbr();
    comment('LicNumber = ' + theLicNumber);
} else {
    comment('There are no LPs');
}

lpTypeContractor = checkCapForLicensedProfessionalType('Contractor');
comment('Contractor = ' + lpTypeContractor);
if (theLicNumber != null && lpTypeContractor && theLicNumber.substr(0, 1) > 0 && theLicNumber.substr(0, 6) < 999999) {
    cslbMessage = externalLP_CA_SMCGOV(theLicNumber, 'Contractor', false, false, null);
    comment('The CSLB Message =' + cslbMessage);
}

if (cslbMessage != null) {
    existsInCSLB = cslbMessage.indexOf('License Number does not exist');
}

comment('Exisits in CSLB = ' + existsInCSLB);
if (lpTypeContractor && existsInCSLB == '-1') {
    cslbMessage1 = externalLP_CA_SMCGOV(null, 'Contractor', true, true, capId);
    comment('The CSLB Message =' + cslbMessage1);
}
