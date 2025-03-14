//DUAB:Building/*/*/*

// Residential
if (appMatch("Building/Residential/*/*", capId) == true) {
  if (publicUser == true) {
    //Script 93 Block Document Submission
    include("BLD_093_DUB_BlockDocumentSubmit");
  }
}

aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC Prod: DUAB", debug); //debug