//ASUA:Building/~/~/~
//Application Status Update After

// Residential or Commercial
if ((appMatch("Building/Residential/*/*", capId) == true) || (appMatch("Building/Commercial/*/*", capId) == true)) {
    if (appStatus == "Reinstatement Pending Payment") {
        //Script 388 Reinstatement Pending Payment
        include("BLD_388_ASUA_ReinstatementPendingPayment");
    }
}