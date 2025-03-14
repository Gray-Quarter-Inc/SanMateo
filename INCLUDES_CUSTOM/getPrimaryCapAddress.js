function getPrimaryCapAddress(itemCap) {
    var capAddressResult = aa.address.getAddressByCapId(itemCap);
    var capAddr;

    if (capAddressResult.getSuccess()) {
        var addressModelArray = capAddressResult.getOutput();
        for (k in addressModelArray) {
            if ("Y" == addressModelArray[k].getPrimaryFlag()) {
                capAddr = addressModelArray[k];
                break;
            }

        }
        if (addressModelArray.length > 0)
            capAddr = addressModelArray[0];
    }

    return capAddr;
}
