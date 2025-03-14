//WATUA:PublicWorks/*/*/*

if (matches(currentUserID, "AVOCETTE") && showMessage != true) {
    showDebug = true;
    showMessage = true;
    comment(debug); //debug
}

// BlueBeam integration - keep at the bottom
include("BB_WATUA");