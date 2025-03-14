function updateParcelAttr(attField, theValue) {

    //var apoAtts = aa.B3APOAttributeScriptModel.getB3APOAttributeModel();
    //var parcelAtts = aa.parcel.getParcelandAttribute(capId,null).getOutput();
    var parcelAtts = aa.parcel.getParcelByCapId(capId, null).getOutput();
    //var parcelModel = aa.parcel.getCapParcelModel().getOutput();


    //helperObjectInfo(parcelModel);
    //logDebug("THE PARCEL IS - " + parcelModel.getParcelNumber());

    var parcelArray = parcelAtts.toArray();

    //get the parcel objects attached
    for (y in parcelArray) {
        //logDebug("What is this " + parcelArray[x]);
        //helperObjectInfo(parcelArray[x]);
        //get the primary parcel flag
        var primaryParcel = parcelArray[y].getPrimaryParcelFlag();
        if (primaryParcel == "Y") {
            //this will get the parcel attributes - array of b3apoobjects 
            var apoAtts = parcelArray[y].getParcelAttribute().toArray();
            //logDebug("These are the apo atts - " + apoAtts);
            //helperObjectInfo(apoAtts[0]);
            for (x in apoAtts) {
                //logDebug(apoAtts[x].getB1AttributeName() + " - " + apoAtts[x].getB1AttributeValue());
                if (apoAtts[x].getB1AttributeName() == attField) {
                    logDebug("Initial value - " + apoAtts[x].getB1AttributeName() + " - " + apoAtts[x].getB1AttributeValue());
                    apoAtts[x].setB1AttributeValue(theValue);
                    //apoAtts[x].setB1AttributeValue("X");					
                    //aa.parcel.updateDailyParcelWithAPOAttribute(parcelArray[y]);
                    var testing1 = aa.parcel.warpCapIdParcelModel2CapParcelModel(capId, parcelArray[y]).getOutput();
                    logDebug("What did I get - " + testing1);
                    var testing2 = aa.parcel.updateDailyParcelWithAPOAttribute(testing1);
                    logDebug("Did this work - " + testing2.getSuccess());
                    logDebug("Updated value - " + apoAtts[x].getB1AttributeName() + " - " + apoAtts[x].getB1AttributeValue());
                }
            }
        }
    }
}
/**
 * User Object
 * Constructor:
 * @param vUserId {string} User ID
 * @return {boolean}
 *
 * Methods:
 * getEmailTemplateParams
 * @param params {HashTable}
 * @param [userType] {string} Used to create email paramerters
 * @return params {HashTable}
 *
 * getUserDisciplines()
 * @return disciplineArray {array}
 *
 * getUserDistricts()
 * @return districtArray {array}
 */
