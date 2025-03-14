function getPrimaryAddressLineParam4Notification(params) {
    // pass in a hashtable and it will add the additional parameters to the table
    var addressLine = "";
    adResult = aa.address.getPrimaryAddressByCapID(capId, "Y");
    if (adResult.getSuccess()) {
        ad = adResult.getOutput().getAddressModel();
        addParameter(params, "$$addressLine$$", ad.getDisplayAddress());
    }

    return params;
}
/*----------------------------------------------------------------------------------------------------/
| Green Halo Notification Functions
| Functions used to create new or attach records to Waste Management Plans
| Created by Accela 06/12/2015
/----------------------------------------------------------------------------------------------------*/
