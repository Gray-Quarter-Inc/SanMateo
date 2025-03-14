function getCapAddress(recCapId) {
    var CapAddress = "";
    var itemCap = recCapId;

    capAddressResult1 = aa.address.getAddressByCapId(itemCap);
    if (capAddressResult1.getSuccess()) {
        Address = capAddressResult1.getOutput();
        for (yy in Address) {
            CapAddress = Address[yy].getHouseNumberStart();

            if (Address[yy].getStreetDirection())
                CapAddress += " " + Address[yy].getStreetDirection();

            CapAddress += " " + Address[yy].getStreetName();

            if (Address[yy].getStreetSuffix())
                CapAddress += " " + Address[yy].getStreetSuffix();

            if (Address[yy].getUnitStart())
                CapAddress += " " + Address[yy].getUnitStart();

            CapAddress += ", " + Address[yy].getCity();
            CapAddress += " " + Address[yy].getZip();
        }
        return CapAddress;
    }
    else { logDebug("No record address available for capId: " + capId); return null; }
}
