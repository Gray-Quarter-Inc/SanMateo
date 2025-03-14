function formatAddressAndOwnerZips(recordId) {
    var altId = aa.cap.getCap(recordId).getOutput().getCapModel().altID;
    logDebug("formatAddressAndOwnerZips(" + altId + ")");

    if (!recordId) {
        logDebug("Invalid capId provided");
        return;
    }

    capId = recordId;

    var allAddressModels = aa.address.getAddressByCapId(capId).getOutput();

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

    var allCapOwnerModels = aa.owner.getOwnerByCapId(capId).getOutput();

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
/*******************************************************
| Script/Function: formatZip(zip)
| Created by: Nicolaj Bunting
| Created on: 31May17
| Usage: Formats a provided Zip code to use the 9 digit "#####-####" format
| Modified by: ()
*********************************************************/
