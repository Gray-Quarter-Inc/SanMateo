function createChildTempRecord(cTypeArray, asiFieldArray, asiTableMapping) {
    var childCapId = null;
    var itemCap = capId;
    if (arguments.length > 3) {
        itemCap = arguments[3];
    }

    var parentAltId = aa.cap.getCap(itemCap).getOutput().capModel.altID;
    Avo_LogDebug("Parent(" + parentAltId + ")", 2);  //debug

    var groupsIgnoreArray;
    var capClass = "INCOMPLETE TMP";

    if (cTypeArray[0] == "ICMSLicensing" && cTypeArray[1] == "General" && cTypeArray[2] == "Associated Form" && cTypeArray[3] == "NA") {
        capClass = "INCOMPLETE EST";
    }

    //Avo_LogDebug("Class(" + capClass + ")", 2); //debug

    var cRecordArray = getChildren(cTypeArray[0] + "/" + cTypeArray[1] + "/" + cTypeArray[2] + "/" + cTypeArray[3], capId);
    if (isEmpty(cRecordArray)) {
        try {
            ctm = aa.proxyInvoker.newInstance("com.accela.aa.aamain.cap.CapTypeModel").getOutput();
            ctm.setGroup(cTypeArray[0]);
            ctm.setType(cTypeArray[1]);
            ctm.setSubType(cTypeArray[2]);
            ctm.setCategory(cTypeArray[3]);

            if (publicUser) {
                childCapId = aa.cap.createSimplePartialRecord(ctm, null, capClass).getOutput();
            }
            else {
                childCapId = aa.cap.createApp(cTypeArray[0], cTypeArray[1], cTypeArray[2], cTypeArray[3], "Associated form").getOutput();
            }

            var childAltId = aa.cap.getCap(childCapId).getOutput().capModel.altID;
            Avo_LogDebug("Child(" + childAltId + ")", 2);  //debug

            Avo_LogDebug("Record Type(" + cTypeArray[0] + "/" + cTypeArray[1] + "/" + cTypeArray[2] + "/" + cTypeArray[3]
                + ")", 2);    //debug

            aa.cap.createAssociatedFormsHierarchy(itemCap, childCapId);

            //copyAdditionalInfo(itemCap, childId);
            copyAddresses(itemCap, childCapId);
            copyParcels(itemCap, childCapId);

            if (asiTableMapping) {
                copySpecifiedASITable(childCapId, asiTableMapping)
            }

            if (asiFieldArray) {
                copySpecifiedASI(childCapId, asiFieldArray);
            }
        }
        catch (err) {
            logDebug("CreateChildTempRecord Error occured: " + err.message);
        }
    }

    aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC Supp: createChildTempRecord", debug);    //debug
    return childCapId;
}

