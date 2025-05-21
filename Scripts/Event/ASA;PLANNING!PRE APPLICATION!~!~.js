if (AInfo["Pre-Application Request Type"] == "Design Review Pre-application"){
    logDebug("Design Review Preapp………… $400.00")
    updateFee("P144DR", "PL_PREAPP", "FINAL", 1, "N");
}else {
    removeFee("P144DR","FINAL")
}

if (AInfo["Pre-Application Request Type"] == "Development Footprint Analysis"){
    logDebug("Development Footprint Analysis……….. $400.00")
    updateFee("P136", "PL_PREAPP", "FINAL", 1, "N");
}else {
    removeFee("P136","FINAL")
}
 if (AInfo["Pre-Application Request Type"] == "Early Assistance Meeting for SB9"){
    logDebug("Early Assistance Meeting	…………$400.00 ")
    updateFee("P144EAM ", "PL_PREAPP", "FINAL", 1, "N");
}else {
    removeFee("P144EAM","FINAL")
}

 if (AInfo["Pre-Application Request Type"] == "Major Development Pre-application Public Workshop"){
logDebug("Major Development Preapplication Public Workshop…………$1,962.00")
updateFee("P074", "PL_PREAPP", "FINAL", 1, "N");
}else {
    removeFee("P074","FINAL")
}
    if (AInfo["Pre-Application Request Type"] == "Other Pre-application"){
        lofDebug("Other - preapp………..$400.00 ")
        updateFee("P144", "PL_PREAPP", "FINAL", 1, "N");
    }else {
        removeFee("P44","FINAL")
    }
