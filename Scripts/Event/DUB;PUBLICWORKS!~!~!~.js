//DUB:PublicWorks/*/*/*

// Residential or Commercial
if ((appMatch("PublicWorks/Permit/*/*") == true)) {
    if (publicUser == true) {
        include("DPW_521_DUB_ExtensionRequestBlock");
    }

    //Script 521 Extension Request Block
    include("DPW_521_DUB_ExtensionRequestBlock");
}


if (matches(currentUserID, "AVOCETTE")) {
    showMessage = true;
    comment(debug); //debug
}