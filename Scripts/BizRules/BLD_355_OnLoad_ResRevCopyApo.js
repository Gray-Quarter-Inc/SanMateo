/*******************************************************
| Script Title: resRevCopyApo(ID355)
| Created by: Nic Bunting
| Created on: 15Jul21
| Event: OnLoad
| Usage: copy all addresses, parcels, owners from parent
| Modified by: ()
*********************************************************/
/*------------------------------------------------------------------------------------------------------/
| Main Loop
/-----------------------------------------------------------------------------------------------------*/
try {
    (function () {
        Avo_LogDebug("ID355 resRevCopyAPO()", 1);

        if (!parentCapId) {
            return;
        }

        var parentCap = aa.cap.getCapViewBySingle4ACA(parentCapId);

        var parentAltId = aa.cap.getCap(parentCapId).getOutput().capModel.altID;
        Avo_LogDebug("Parent(" + parentAltId + ")", 2);  //debug

        // Copy Addresses
        var addrModel = parentCap.addressModel;
        if (addrModel) {
            addrModel.capID = cap.capID;

            cap.addressModel = addrModel;
            Avo_LogDebug("Copied address " + addrModel.displayAddress + " from parent " + parentAltId, 1);  //debug
        }

        var allAddrs = parentCap.getAddressModels();
        if (allAddrs && allAddrs.size() > 0) {
            Avo_LogDebug("Total Addresses(" + allAddrs.size() + ")", 2);    //debug

            for (var i = 0; i < allAddrs.size(); i++) {
                var addrModel = allAddrs.get(i);
                Avo_LogDebug(serialize(addrModel), 2);    //debug

                addrModel.capID = cap.capID;

                Avo_LogDebug("Address(" + addrModel.displayAddress + ")", 2);    //debug
            }

            cap.setAddressModels(allAddrs);
            Avo_LogDebug("Copied " + allAddrs.size().toString() + " address(es) from parent " + parentAltId, 1);   //debug
        }

        // Copy Parcels
        var capParcelModel = parentCap.parcelModel;
        if (capParcelModel) {
            capParcelModel.capIDModel = cap.capID;

            cap.parcelModel = capParcelModel;
            Avo_LogDebug("Copied parcel " + capParcelModel.parcelNumber + " from parent " + parentAltId, 1);  //debug
        }

        var allParcels = parentCap.getParcelList();
        if (allParcels && allParcels.size() > 0) {
            Avo_LogDebug("Total Parcels(" + allParcels.size() + ")", 2);    //debug

            for (var i = 0; i < allParcels.size(); i++) {
                var parcelModel = allParcels.get(i);

                parcelModel.capIDModel = cap.capID;

                Avo_LogDebug("Parcel(" + parcelModel.parcelNumber + ")", 2);    //debug
            }

            cap.setParcelList(allParcels);
            Avo_LogDebug("Copied " + allParcels.size().toString() + " parcel(s) from parent " + parentAltId, 1);   //debug
        }

        // Copy Owners
        var refOwnerModel = parentCap.ownerModel;
        if (refOwnerModel) {
            refOwnerModel.capID = cap.capID;

            cap.ownerModel = refOwnerModel;
            Avo_LogDebug("Copied ref owner " + refOwnerModel.ownerFullName + " from parent " + parentAltId, 1);  //debug
        }

        var ownerModel = parentCap.capOwnerModel;
        if (ownerModel) {
            cap.capOwnerModel = ownerModel;
            Avo_LogDebug("Copied owner " + ownerModel.ownerFullName + " from parent " + parentAltId, 1);  //debug
        }

        var allOwners = parentCap.capOwnerList;
        if (allOwners && allOwners.size() > 0) {
            Avo_LogDebug("Total Owners(" + allOwners.size() + ")", 2);    //debug

            for (var i = 0; i < allOwners.size(); i++) {
                var refOwnerModel = allOwners.get(i);

                refOwnerModel.capID = cap.capID;

                Avo_LogDebug("Owner(" + refOwnerModel.ownerFullName + ")", 2);    //debug
            }

            cap.capOwnerList = allOwners;
            Avo_LogDebug("Copied " + allOwners.size().toString() + " ref owner(s) from parent " + parentAltId, 1);   //debug
        }
    })();

    aa.env.setValue("CapModel", cap);
}
catch (ex) {
    Avo_LogDebug("ERROR: " + ex.message, 1);
}

aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC Test: BLD_355_OnLoad_ResRevCopyApo", debug); //debug

/*------------------------------------------------------------------------------------------------------/
| END Main Loop
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| BEGIN Functions
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| END Functions
/------------------------------------------------------------------------------------------------------*/