//ctrca for renewal script

//Set incomleted CAPID (CAP id)  for test.
//Unit Test Parameters --> begin
//aa.env.setValue("PermitId1", "07WEN");
//aa.env.setValue("PermitId2", "00000");
//aa.env.setValue("PermitId3", "00005");
//Unit Test Parameters --> end

var capID = getCapId();
var partialCapID = getPartialCapID(capID);
var result = aa.cap.isRenewalInProgess(capID);
if (result.getSuccess()) {
    //1. Set B1PERMIT.B1_ACCESS_BY_ACA to "N" for partial CAP to not allow that it is searched by ACA user.
    aa.cap.updateAccessByACA(capID, "Y");

    var parentLicenseCAPID = result.getOutput();
    //2 . Copy key information from child CAP to parent CAP.
    copyKeyInfo(capID, parentLicenseCAPID);

    //3. move renew document to parent cap
    aa.cap.transferRenewCapDocument(partialCapID, parentLicenseCAPID, true);
    aa.print("Transfer document for renew cap. Source Cap: " + partialCapID + ", target Cap:" + parentLicenseCAPID);

    //4. Send auto-issurance license email to public user
    aa.expiration.sendAutoIssueLicenseEmail(parentLicenseCAPID);
    aa.print("send auto-issuance license email to citizen user.");
    aa.env.setValue("isAutoIssuanceSuccess", "Yes");
    aa.print("CAP(" + parentLicenseCAPID + ") renewal is complete.");
}
aa.env.setValue("ScriptReturnCode", "0");
aa.env.setValue("ScriptReturnMessage", "Renewal process.");

function copyKeyInfo(srcCapId, targetCapId) {
    //copy ASI infomation
    copyAppSpecificInfo(srcCapId, targetCapId);
    //copy License infomation
    copyLicenseProfessional(srcCapId, targetCapId);
    //copy Address infomation
    copyAddress(srcCapId, targetCapId);
    //copy AST infomation
    copyAppSpecificTable(srcCapId, targetCapId);
    //copy Parcel infomation
    copyParcel(srcCapId, targetCapId);
    //copy People infomation
    //copyPeople(srcCapId, targetCapId);
    copyContactsWithAddress(srcCapId, targetCapId);
    //copy Owner infomation
    copyOwner(srcCapId, targetCapId);
    //Copy CAP condition information
    //copyCapCondition(srcCapId, targetCapId);
    //Copy additional info.
    copyAdditionalInfo(srcCapId, targetCapId);
    //Copy Education information.
    copyEducation(srcCapId, targetCapId);
    //Copy Continuing Education information.
    copyContEducation(srcCapId, targetCapId);
    //Copy Examination information.
    copyExamination(srcCapId, targetCapId);
    //Copy documents information
    var currentUserID = aa.env.getValue("CurrentUserID");
    copyRenewCapDocument(srcCapId, targetCapId, currentUserID);
}

function copyRenewCapDocument(srcCapId, targetCapId, currentUserID) {
    if (srcCapId != null && targetCapId != null) {
        aa.cap.copyRenewCapDocument(srcCapId, targetCapId, currentUserID);
    }
}



function copyEducation(srcCapId, targetCapId) {
    if (srcCapId != null && targetCapId != null) {
        aa.education.copyEducationList(srcCapId, targetCapId);
    }
}

function copyContEducation(srcCapId, targetCapId) {
    if (srcCapId != null && targetCapId != null) {
        aa.continuingEducation.copyContEducationList(srcCapId, targetCapId);
    }
}

function copyExamination(srcCapId, targetCapId) {
    if (srcCapId != null && targetCapId != null) {
        aa.examination.copyExaminationList(srcCapId, targetCapId);
    }
}

function copyAppSpecificInfo(srcCapId, targetCapId) {
    //1. Get Application Specific Information with source CAPID.
    var appSpecificInfo = getAppSpecificInfo(srcCapId);
    if (appSpecificInfo == null || appSpecificInfo.length == 0) {
        return;
    }
    //2. Set target CAPID to source Specific Information.
    for (loopk in appSpecificInfo) {
        var sourceAppSpecificInfoModel = appSpecificInfo[loopk];

        sourceAppSpecificInfoModel.setPermitID1(targetCapId.getID1());
        sourceAppSpecificInfoModel.setPermitID2(targetCapId.getID2());
        sourceAppSpecificInfoModel.setPermitID3(targetCapId.getID3());
        //3. Edit ASI on target CAP (Copy info from source to target)
        aa.appSpecificInfo.editAppSpecInfoValue(sourceAppSpecificInfoModel);
    }
}


function getAppSpecificInfo(capId) {
    capAppSpecificInfo = null;
    var s_result = aa.appSpecificInfo.getByCapID(capId);
    if (s_result.getSuccess()) {
        capAppSpecificInfo = s_result.getOutput();
        if (capAppSpecificInfo == null || capAppSpecificInfo.length == 0) {
            aa.print("WARNING: no appSpecificInfo on this CAP:" + capId);
            capAppSpecificInfo = null;
        }
    }
    else {
        aa.print("ERROR: Failed to appSpecificInfo: " + s_result.getErrorMessage());
        capAppSpecificInfo = null;
    }
    // Return AppSpecificInfoModel[] 
    return capAppSpecificInfo;
}

function copyLicenseProfessional(srcCapId, targetCapId) {
    //1. Get license professionals with source CAPID.
    var capLicenses = getLicenseProfessional(srcCapId);
    if (capLicenses == null || capLicenses.length == 0) {
        return;
    }
    //2. Get license professionals with target CAPID.
    var targetLicenses = getLicenseProfessional(targetCapId);
    //3. Check to see which licProf is matched in both source and target.
    for (loopk in capLicenses) {
        sourcelicProfModel = capLicenses[loopk];
        //3.1 Set target CAPID to source lic prof.
        sourcelicProfModel.setCapID(targetCapId);
        targetLicProfModel = null;
        //3.2 Check to see if sourceLicProf exist.
        if (targetLicenses != null && targetLicenses.length > 0) {
            for (loop2 in targetLicenses) {
                if (isMatchLicenseProfessional(sourcelicProfModel, targetLicenses[loop2])) {
                    targetLicProfModel = targetLicenses[loop2];
                    break;
                }
            }
        }
        //3.3 It is a matched licProf model.
        if (targetLicProfModel != null) {
            //3.3.1 Copy information from source to target.
            aa.licenseProfessional.copyLicenseProfessionalScriptModel(sourcelicProfModel, targetLicProfModel);
            //3.3.2 Edit licProf with source licProf information. 
            aa.licenseProfessional.editLicensedProfessional(targetLicProfModel);
        }
        //3.4 It is new licProf model.
        else {
            //3.4.1 Create new license professional.
            aa.licenseProfessional.createLicensedProfessional(sourcelicProfModel);
        }
    }
}

function isMatchLicenseProfessional(licProfScriptModel1, licProfScriptModel2) {
    if (licProfScriptModel1 == null || licProfScriptModel2 == null) {
        return false;
    }
    if (licProfScriptModel1.getLicenseType().equals(licProfScriptModel2.getLicenseType())
        && licProfScriptModel1.getLicenseNbr().equals(licProfScriptModel2.getLicenseNbr())) {
        return true;
    }
    return false;
}

function getLicenseProfessional(capId) {
    capLicenseArr = null;
    var s_result = aa.licenseProfessional.getLicenseProf(capId);
    if (s_result.getSuccess()) {
        capLicenseArr = s_result.getOutput();
        if (capLicenseArr == null || capLicenseArr.length == 0) {
            aa.print("WARNING: no licensed professionals on this CAP:" + capId);
            capLicenseArr = null;
        }
    }
    else {
        aa.print("ERROR: Failed to license professional: " + s_result.getErrorMessage());
        capLicenseArr = null;
    }
    return capLicenseArr;
}


function copyAddress(srcCapId, targetCapId) {
    //1. Get address with source CAPID.
    var capAddresses = getAddress(srcCapId);
    if (capAddresses == null || capAddresses.length == 0) {
        return;
    }
    //2. Get addresses with target CAPID.
    var targetAddresses = getAddress(targetCapId);
    //3. Check to see which address is matched in both source and target.
    for (loopk in capAddresses) {
        sourceAddressfModel = capAddresses[loopk];
        //3.1 Set target CAPID to source address.
        sourceAddressfModel.setCapID(targetCapId);
        targetAddressfModel = null;
        //3.2 Check to see if sourceAddress exist.
        if (targetAddresses != null && targetAddresses.length > 0) {
            for (loop2 in targetAddresses) {
                if (isMatchAddress(sourceAddressfModel, targetAddresses[loop2])) {
                    targetAddressfModel = targetAddresses[loop2];
                    break;
                }
            }
        }
        //3.3 It is a matched address model.
        if (targetAddressfModel != null) {

            //3.3.1 Copy information from source to target.
            aa.address.copyAddressModel(sourceAddressfModel, targetAddressfModel);
            //3.3.2 Edit address with source address information. 
            aa.address.editAddressWithAPOAttribute(targetCapId, targetAddressfModel);
        }
        //3.4 It is new address model.
        else {
            //3.4.1 Create new address.
            aa.address.createAddressWithAPOAttribute(targetCapId, sourceAddressfModel);
        }
    }
}

function isMatchAddress(addressScriptModel1, addressScriptModel2) {
    if (addressScriptModel1 == null || addressScriptModel2 == null) {
        return false;
    }
    var streetName1 = addressScriptModel1.getStreetName();
    var streetName2 = addressScriptModel2.getStreetName();
    if ((streetName1 == null && streetName2 != null)
        || (streetName1 != null && streetName2 == null)) {
        return false;
    }
    if (streetName1 != null && !streetName1.equals(streetName2)) {
        return false;
    }
    return true;
}

function getAddress(capId) {
    capAddresses = null;
    var s_result = aa.address.getAddressByCapId(capId);
    if (s_result.getSuccess()) {
        capAddresses = s_result.getOutput();
        if (capAddresses == null || capAddresses.length == 0) {
            aa.print("WARNING: no addresses on this CAP:" + capId);
            capAddresses = null;
        }
    }
    else {
        aa.print("ERROR: Failed to address: " + s_result.getErrorMessage());
        capAddresses = null;
    }
    return capAddresses;
}

function copyAppSpecificTable(srcCapId, targetCapId) {
    var tableNameArray = getTableName(srcCapId);
    if (tableNameArray == null) {
        return;
    }
    for (loopk in tableNameArray) {
        var tableName = tableNameArray[loopk];
        //1. Get appSpecificTableModel with source CAPID
        var targetAppSpecificTable = getAppSpecificTable(srcCapId, tableName);

        //2. Edit AppSpecificTableInfos with target CAPID
        var aSTableModel = null;
        if (targetAppSpecificTable == null) {
            return;
        }
        else {
            aSTableModel = targetAppSpecificTable.getAppSpecificTableModel();
        }
        aa.appSpecificTableScript.editAppSpecificTableInfos(aSTableModel,
            targetCapId,
            null);
    }

}

function getTableName(capId) {
    var tableName = null;
    var result = aa.appSpecificTableScript.getAppSpecificGroupTableNames(capId);
    if (result.getSuccess()) {
        tableName = result.getOutput();
        if (tableName != null) {
            return tableName;
        }
    }
    return tableName;
}

function getAppSpecificTable(capId, tableName) {
    appSpecificTable = null;
    var s_result = aa.appSpecificTableScript.getAppSpecificTableModel(capId, tableName);
    if (s_result.getSuccess()) {
        appSpecificTable = s_result.getOutput();
        if (appSpecificTable == null || appSpecificTable.length == 0) {
            aa.print("WARNING: no appSpecificTable on this CAP:" + capId);
            appSpecificTable = null;
        }
    }
    else {
        aa.print("ERROR: Failed to appSpecificTable: " + s_result.getErrorMessage());
        appSpecificTable = null;
    }
    return appSpecificTable;
}

function copyParcel(srcCapId, targetCapId) {
    //1. Get parcels with source CAPID.
    var copyParcels = getParcel(srcCapId);
    if (copyParcels == null || copyParcels.length == 0) {
        return;
    }
    //2. Get parcel with target CAPID.
    var targetParcels = getParcel(targetCapId);
    //3. Check to see which parcel is matched in both source and target.
    for (i = 0; i < copyParcels.size(); i++) {
        sourceParcelModel = copyParcels.get(i);
        //3.1 Set target CAPID to source parcel.
        sourceParcelModel.setCapID(targetCapId);
        targetParcelModel = null;
        //3.2 Check to see if sourceParcel exist.
        if (targetParcels != null && targetParcels.size() > 0) {
            for (j = 0; j < targetParcels.size(); j++) {
                if (isMatchParcel(sourceParcelModel, targetParcels.get(j))) {
                    targetParcelModel = targetParcels.get(j);
                    break;
                }
            }
        }
        //3.3 It is a matched parcel model.
        if (targetParcelModel != null) {
            //3.3.1 Copy information from source to target.
            var tempCapSourceParcel = aa.parcel.warpCapIdParcelModel2CapParcelModel(targetCapId, sourceParcelModel).getOutput();
            var tempCapTargetParcel = aa.parcel.warpCapIdParcelModel2CapParcelModel(targetCapId, targetParcelModel).getOutput();
            aa.parcel.copyCapParcelModel(tempCapSourceParcel, tempCapTargetParcel);
            //3.3.2 Edit parcel with sourceparcel. 
            aa.parcel.updateDailyParcelWithAPOAttribute(tempCapTargetParcel);
        }
        //3.4 It is new parcel model.
        else {
            //3.4.1 Create new parcel.
            aa.parcel.createCapParcelWithAPOAttribute(aa.parcel.warpCapIdParcelModel2CapParcelModel(targetCapId, sourceParcelModel).getOutput());
        }
    }
}

function isMatchParcel(parcelScriptModel1, parcelScriptModel2) {
    if (parcelScriptModel1 == null || parcelScriptModel2 == null) {
        return false;
    }
    if (parcelScriptModel1.getParcelNumber().equals(parcelScriptModel2.getParcelNumber())) {
        return true;
    }
    return false;
}

function getParcel(capId) {
    capParcelArr = null;
    var s_result = aa.parcel.getParcelandAttribute(capId, null);
    if (s_result.getSuccess()) {
        capParcelArr = s_result.getOutput();
        if (capParcelArr == null || capParcelArr.length == 0) {
            aa.print("WARNING: no parcel on this CAP:" + capId);
            capParcelArr = null;
        }
    }
    else {
        aa.print("ERROR: Failed to parcel: " + s_result.getErrorMessage());
        capParcelArr = null;
    }
    return capParcelArr;
}

function copyPeople(srcCapId, targetCapId) {
    //1. Get people with source CAPID.
    var capPeoples = getPeople(srcCapId);
    if (capPeoples == null || capPeoples.length == 0) {
        return;
    }
    //2. Get people with target CAPID.
    var targetPeople = getPeople(targetCapId);
    //3. Check to see which people is matched in both source and target.
    for (loopk in capPeoples) {
        sourcePeopleModel = capPeoples[loopk];
        //3.1 Set target CAPID to source people.
        sourcePeopleModel.getCapContactModel().setCapID(targetCapId);
        targetPeopleModel = null;
        //3.2 Check to see if sourcePeople exist.
        if (targetPeople != null && targetPeople.length > 0) {
            for (loop2 in targetPeople) {
                if (isMatchPeople(sourcePeopleModel, targetPeople[loop2])) {
                    targetPeopleModel = targetPeople[loop2];
                    break;
                }
            }
        }
        //3.3 It is a matched people model.
        if (targetPeopleModel != null) {
            //3.3.1 Copy information from source to target.
            aa.people.copyCapContactModel(sourcePeopleModel.getCapContactModel(), targetPeopleModel.getCapContactModel());
            //3.3.2 Edit People with source People information. 
            aa.people.editCapContactWithAttribute(targetPeopleModel.getCapContactModel());
        }
        //3.4 It is new People model.
        else {
            //3.4.1 Create new people.
            aa.people.createCapContactWithAttribute(sourcePeopleModel.getCapContactModel());
        }
    }
}

function isMatchPeople(capContactScriptModel, capContactScriptModel2) {
    if (capContactScriptModel == null || capContactScriptModel2 == null) {
        return false;
    }
    var contactType1 = capContactScriptModel.getCapContactModel().getPeople().getContactType();
    var contactType2 = capContactScriptModel2.getCapContactModel().getPeople().getContactType();
    var firstName1 = capContactScriptModel.getCapContactModel().getPeople().getFirstName();
    var firstName2 = capContactScriptModel2.getCapContactModel().getPeople().getFirstName();
    var lastName1 = capContactScriptModel.getCapContactModel().getPeople().getLastName();
    var lastName2 = capContactScriptModel2.getCapContactModel().getPeople().getLastName();
    var fullName1 = capContactScriptModel.getCapContactModel().getPeople().getFullName();
    var fullName2 = capContactScriptModel2.getCapContactModel().getPeople().getFullName();
    if ((contactType1 == null && contactType2 != null)
        || (contactType1 != null && contactType2 == null)) {
        return false;
    }
    if (contactType1 != null && !contactType1.equals(contactType2)) {
        return false;
    }
    if ((firstName1 == null && firstName2 != null)
        || (firstName1 != null && firstName2 == null)) {
        return false;
    }
    if (firstName1 != null && !firstName1.equals(firstName2)) {
        return false;
    }
    if ((lastName1 == null && lastName2 != null)
        || (lastName1 != null && lastName2 == null)) {
        return false;
    }
    if (lastName1 != null && !lastName1.equals(lastName2)) {
        return false;
    }
    if ((fullName1 == null && fullName2 != null)
        || (fullName1 != null && fullName2 == null)) {
        return false;
    }
    if (fullName1 != null && !fullName1.equals(fullName2)) {
        return false;
    }
    return true;
}

function getPeople(capId) {
    capPeopleArr = null;
    var s_result = aa.people.getCapContactByCapID(capId);
    if (s_result.getSuccess()) {
        capPeopleArr = s_result.getOutput();
        if (capPeopleArr == null || capPeopleArr.length == 0) {
            aa.print("WARNING: no People on this CAP:" + capId);
            capPeopleArr = null;
        }
    }
    else {
        aa.print("ERROR: Failed to People: " + s_result.getErrorMessage());
        capPeopleArr = null;
    }
    return capPeopleArr;
}

function copyOwner(srcCapId, targetCapId) {
    //1. Get Owners with source CAPID.
    var capOwners = getOwner(srcCapId);
    if (capOwners == null || capOwners.length == 0) {
        return;
    }
    //2. Get Owners with target CAPID.
    var targetOwners = getOwner(targetCapId);
    //3. Check to see which owner is matched in both source and target.
    for (loopk in capOwners) {
        sourceOwnerModel = capOwners[loopk];
        //3.1 Set target CAPID to source Owner.
        sourceOwnerModel.setCapID(targetCapId);
        targetOwnerModel = null;
        //3.2 Check to see if sourceOwner exist.
        if (targetOwners != null && targetOwners.length > 0) {
            for (loop2 in targetOwners) {
                if (isMatchOwner(sourceOwnerModel, targetOwners[loop2])) {
                    targetOwnerModel = targetOwners[loop2];
                    break;
                }
            }
        }
        //3.3 It is a matched owner model.
        if (targetOwnerModel != null) {
            //3.3.1 Copy information from source to target.
            aa.owner.copyCapOwnerModel(sourceOwnerModel, targetOwnerModel);
            //3.3.2 Edit owner with source owner information. 
            aa.owner.updateDailyOwnerWithAPOAttribute(targetOwnerModel);
        }
        //3.4 It is new owner model.
        else {
            //3.4.1 Create new Owner.
            aa.owner.createCapOwnerWithAPOAttribute(sourceOwnerModel);
        }
    }
}

function isMatchOwner(ownerScriptModel1, ownerScriptModel2) {
    if (ownerScriptModel1 == null || ownerScriptModel2 == null) {
        return false;
    }
    var fullName1 = ownerScriptModel1.getOwnerFullName();
    var fullName2 = ownerScriptModel2.getOwnerFullName();
    if ((fullName1 == null && fullName2 != null)
        || (fullName1 != null && fullName2 == null)) {
        return false;
    }
    if (fullName1 != null && !fullName1.equals(fullName2)) {
        return false;
    }
    return true;
}

function getOwner(capId) {
    capOwnerArr = null;
    var s_result = aa.owner.getOwnerByCapId(capId);
    if (s_result.getSuccess()) {
        capOwnerArr = s_result.getOutput();
        if (capOwnerArr == null || capOwnerArr.length == 0) {
            aa.print("WARNING: no Owner on this CAP:" + capId);
            capOwnerArr = null;
        }
    }
    else {
        aa.print("ERROR: Failed to Owner: " + s_result.getErrorMessage());
        capOwnerArr = null;
    }
    return capOwnerArr;
}
function copyCapCondition(srcCapId, targetCapId) {
    //1. Get Cap condition with source CAPID.
    var capConditions = getCapConditionByCapID(srcCapId);
    if (capConditions == null || capConditions.length == 0) {
        return;
    }
    //2. Get Cap condition with target CAPID.
    var targetCapConditions = getCapConditionByCapID(targetCapId);
    //3. Check to see which Cap condition is matched in both source and target.
    for (loopk in capConditions) {
        sourceCapCondition = capConditions[loopk];
        //3.1 Set target CAPID to source Cap condition.
        sourceCapCondition.setCapID(targetCapId);
        targetCapCondition = null;
        //3.2 Check to see if source Cap condition exist in target CAP. 
        if (targetCapConditions != null && targetCapConditions.length > 0) {
            for (loop2 in targetCapConditions) {
                if (isMatchCapCondition(sourceCapCondition, targetCapConditions[loop2])) {
                    targetCapCondition = targetCapConditions[loop2];
                    break;
                }
            }
        }
        //3.3 It is a matched Cap condition model.
        if (targetCapCondition != null) {
            //3.3.1 Copy information from source to target.
            sourceCapCondition.setConditionNumber(targetCapCondition.getConditionNumber());
            //3.3.2 Edit Cap condition with source Cap condition information. 
            aa.capCondition.editCapCondition(sourceCapCondition);
        }
        //3.4 It is new Cap condition model.
        else {
            //3.4.1 Create new Cap condition.
            aa.capCondition.createCapCondition(sourceCapCondition);
        }
    }
}

function isMatchCapCondition(capConditionScriptModel1, capConditionScriptModel2) {
    if (capConditionScriptModel1 == null || capConditionScriptModel2 == null) {
        return false;
    }
    var description1 = capConditionScriptModel1.getConditionDescription();
    var description2 = capConditionScriptModel2.getConditionDescription();
    if ((description1 == null && description2 != null)
        || (description1 != null && description2 == null)) {
        return false;
    }
    if (description1 != null && !description1.equals(description2)) {
        return false;
    }
    var conGroup1 = capConditionScriptModel1.getConditionGroup();
    var conGroup2 = capConditionScriptModel2.getConditionGroup();
    if ((conGroup1 == null && conGroup2 != null)
        || (conGroup1 != null && conGroup2 == null)) {
        return false;
    }
    if (conGroup1 != null && !conGroup1.equals(conGroup2)) {
        return false;
    }
    return true;
}

function getCapConditionByCapID(capId) {
    capConditionScriptModels = null;

    var s_result = aa.capCondition.getCapConditions(capId);
    if (s_result.getSuccess()) {
        capConditionScriptModels = s_result.getOutput();
        if (capConditionScriptModels == null || capConditionScriptModels.length == 0) {
            aa.print("WARNING: no cap condition on this CAP:" + capId);
            capConditionScriptModels = null;
        }
    }
    else {
        aa.print("ERROR: Failed to get cap condition: " + s_result.getErrorMessage());
        capConditionScriptModels = null;
    }
    return capConditionScriptModels;
}
function copyAdditionalInfo(srcCapId, targetCapId) {
    //1. Get Additional Information with source CAPID.  (BValuatnScriptModel)
    var additionalInfo = getAdditionalInfo(srcCapId);
    if (additionalInfo == null) {
        return;
    }
    //2. Get CAP detail with source CAPID.
    var capDetail = getCapDetailByID(srcCapId);
    //3. Set target CAP ID to additional info.
    additionalInfo.setCapID(targetCapId);
    if (capDetail != null) {
        capDetail.setCapID(targetCapId);
    }
    //4. Edit or create additional infor for target CAP.
    aa.cap.editAddtInfo(capDetail, additionalInfo);
}

//Return BValuatnScriptModel for additional info.
function getAdditionalInfo(capId) {
    bvaluatnScriptModel = null;
    var s_result = aa.cap.getBValuatn4AddtInfo(capId);
    if (s_result.getSuccess()) {
        bvaluatnScriptModel = s_result.getOutput();
        if (bvaluatnScriptModel == null) {
            aa.print("WARNING: no additional info on this CAP:" + capId);
            bvaluatnScriptModel = null;
        }
    }
    else {
        aa.print("ERROR: Failed to get additional info: " + s_result.getErrorMessage());
        bvaluatnScriptModel = null;
    }
    // Return bvaluatnScriptModel
    return bvaluatnScriptModel;
}

function getCapDetailByID(capId) {
    capDetailScriptModel = null;
    var s_result = aa.cap.getCapDetail(capId);
    if (s_result.getSuccess()) {
        capDetailScriptModel = s_result.getOutput();
        if (capDetailScriptModel == null) {
            aa.print("WARNING: no cap detail on this CAP:" + capId);
            capDetailScriptModel = null;
        }
    }
    else {
        aa.print("ERROR: Failed to get cap detail: " + s_result.getErrorMessage());
        capDetailScriptModel = null;
    }
    // Return capDetailScriptModel
    return capDetailScriptModel;
}


function getCapId() {
    var s_id1 = aa.env.getValue("PermitId1");
    var s_id2 = aa.env.getValue("PermitId2");
    var s_id3 = aa.env.getValue("PermitId3");

    var s_capResult = aa.cap.getCapIDModel(s_id1, s_id2, s_id3);
    if (s_capResult.getSuccess()) {
        return s_capResult.getOutput();
    }
    else {
        aa.print("ERROR: Failed to get capId: " + s_capResult.getErrorMessage());
        return null;
    }
}

// Get partial cap id
function getPartialCapID(capid) {
    if (capid == null || aa.util.instanceOfString(capid)) {
        return null;
    }
    //1. Get original partial CAPID  from related CAP table.
    var result = aa.cap.getProjectByChildCapID(capid, "EST", null);
    if (result.getSuccess()) {
        projectScriptModels = result.getOutput();
        if (projectScriptModels == null || projectScriptModels.length == 0) {
            aa.print("ERROR: Failed to get partial CAP with CAPID(" + capid + ")");
            return null;
        }
        //2. Get original partial CAP ID from project Model
        projectScriptModel = projectScriptModels[0];
        return projectScriptModel.getProjectID();
    }
    else {
        aa.print("ERROR: Failed to get partial CAP by child CAP(" + capid + "): " + result.getErrorMessage());
        return null;
    }
}

function copyContactsWithAddress(pFromCapId, pToCapId) {
    // Copies all contacts from pFromCapId to pToCapId and includes Contact Address objects
    //
    if (pToCapId == null)
        var vToCapId = capId;
    else
        var vToCapId = pToCapId;

    var capContactResult = aa.people.getCapContactByCapID(pFromCapId);
    var copied = 0;
    if (capContactResult.getSuccess()) {
        var Contacts = capContactResult.getOutput();
        for (yy in Contacts) {
            var newContact = Contacts[yy].getCapContactModel();

            var newPeople = newContact.getPeople();
            // aa.print("Seq " + newPeople.getContactSeqNumber());

            var addressList = aa.address.getContactAddressListByCapContact(newContact).getOutput();
            newContact.setCapID(vToCapId);
            aa.people.createCapContact(newContact);
            newerPeople = newContact.getPeople();
            // contact address copying
            if (addressList) {
                for (add in addressList) {
                    var transactionAddress = false;
                    contactAddressModel = addressList[add].getContactAddressModel();
                    if (contactAddressModel.getEntityType() == "CAP_CONTACT") {
                        transactionAddress = true;
                        contactAddressModel.setEntityID(parseInt(newerPeople.getContactSeqNumber()));
                    }
                    // Commit if transaction contact address
                    if (transactionAddress) {
                        var newPK = new com.accela.orm.model.address.ContactAddressPKModel();
                        contactAddressModel.setContactAddressPK(newPK);
                        aa.address.createCapContactAddress(vToCapId, contactAddressModel);
                    }
                    // Commit if reference contact address
                    else {
                        // build model
                        var Xref = aa.address.createXRefContactAddressModel().getOutput();
                        Xref.setContactAddressModel(contactAddressModel);
                        Xref.setAddressID(addressList[add].getAddressID());
                        Xref.setEntityID(parseInt(newerPeople.getContactSeqNumber()));
                        Xref.setEntityType(contactAddressModel.getEntityType());
                        Xref.setCapID(vToCapId);
                        // commit address
                        aa.address.createXRefContactAddress(Xref.getXRefContactAddressModel());
                    }

                }
            }
            // end if
            copied++;
            logDebug("Copied contact from " + pFromCapId.getCustomID() + " to " + vToCapId.getCustomID());
        }
    }
    else {
        logMessage("**ERROR: Failed to get contacts: " + capContactResult.getErrorMessage());
        return false;
    }
    return copied;
}