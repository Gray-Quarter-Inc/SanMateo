function formatAddressAndOwnerZips() {
   
    var allAddressModels = aa.address.getAddressByCapId(capId).getOutput();

    if (allAddressModels && allAddressModels.length > 0) {

        for (var i = 0; i < allAddressModels.length; i++) {
            var addressModel = allAddressModels[i];
            var zip = addressModel.zip;

            zip = formatZip(zip);

            addressModel.zip = zip;
            var result = aa.address.editAddress(addressModel);
            if (result.getSuccess() == true) {
                var number = i + 1;
                logDebug("Address " + number + " Zip code updated");
            }
        }
    }

    var allCapOwnerModels = aa.owner.getOwnerByCapId(capId).getOutput();

    if (allCapOwnerModels && allCapOwnerModels.length > 0) {
        for (i = 0; i < allCapOwnerModels.length; i++) {
            var capOwnerModel = allCapOwnerModels[i];
            var zip = capOwnerModel.mailZip;

            zip = formatZip(zip);

            capOwnerModel.mailZip = zip;
            var result = aa.owner.updateDailyOwnerWithAPOAttribute(capOwnerModel);
            if (result.getSuccess() == true) {
                var number = i + 1;
                logDebug("Owner " + number + " Zip code updated");
            }
        }
    }
}

