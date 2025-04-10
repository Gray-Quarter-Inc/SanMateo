if (wfTask == "Planning Review" && wfStatus == "Approved") {
    lic = new licenseObject(null, capId);
    lic.setStatus("Active");
    lic.setExpiration(dateAddMonths(wfDateMMDDYYYY, 36));
}