function getAddressForEmail() {
    // get first address for emails 
    var capAddress = "";
    var capAddressResult1 = aa.address.getAddressByCapId(capId);
    if (capAddressResult1.getSuccess()) {
        var allAddrs = capAddressResult1.getOutput();
        for (var yy in allAddrs) {
            capAddress = allAddrs[yy].getHouseNumberStart();

            if (allAddrs[yy].getStreetDirection()) {
                capAddress += " " + allAddrs[yy].getStreetDirection();
            }

            capAddress += " " + allAddrs[yy].getStreetName();

            if (allAddrs[yy].getStreetSuffix()) {
                capAddress += " " + allAddrs[yy].getStreetSuffix();
            }

            if (allAddrs[yy].getUnitStart()) {
                capAddress += " " + allAddrs[yy].getUnitStart();
            }

            capAddress += ", " + allAddrs[yy].getCity();

            capAddress += " " + allAddrs[yy].getZip();
        }
    }

    return capAddress;
}
