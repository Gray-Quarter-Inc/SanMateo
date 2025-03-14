//PRA:PublicWorks/*/*/*

// Permit
if (appMatch("PublicWorks/Permit/NA/NA", capId) == true) {

    //Script 403 "Payment Due" to "Received"
    include("DPW_403_PRA_PaymentDuetoReceived");
}

//aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC PROD: PRA:PUBLICWORKS/~/~/~", debug);