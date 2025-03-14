/*******************************************************
| Script Title: landReqDoc(ID238)
| Created by: Jei Yang
| Created on: 15Mar21
| Event: Before
| Usage: If no document of type "Plan Set | PLANS"
| Or ASI "Amount of new or repalced impervious surface" > 150 and no document of type
| "C3 and C6 Checklist | C3C6"
| Or ASI "Amount of rehabilitated or new irrigated landscaping area" >= 500 and < 2500 and no
| document of type "WELO Prescriptive Compliance Form | WELOPC"
| Or ASI "Amount of rehabilitated or new irrigated landscaping area" >= 2500 and no document
| of type "WELO Performance Approach | WELOPA"
| Or ASI "Is the retaining wall on piers?" is "Yes" OR ASI "retaining wall max hight above grade (ft)"
| >= 4 and no document of type "Geotechnical Report | GEO"
| Or ASI "Is this a stepped or terraced retaining wall and or does the wall support surcharge?" is "Yes"
| and no document of type "Structural Calculations and Details | SCALCS"
| Then block submittal, display message
| "The following document(s) are missing. To continue please upload a document of the following type(s):"
| + "-" + docType + "For further details please refer to the instructional text below."
| Modified by: ()
*********************************************************/
/*------------------------------------------------------------------------------------------------------/
| Main Loop
/-----------------------------------------------------------------------------------------------------*/
try {
    (function () {
        Avo_LogDebug("ID238 landReqDoc()", 1);

        var allReqDocTypes = new Object();
        allReqDocTypes["Plan Set | PLANS"] = true;

        var newOrReplacedSurface = parseInt(String(AInfo[
            "Amount of new or replaced impervious surface"]));
        Avo_LogDebug("Impervious surface(" + newOrReplacedSurface + ")", 2); //debug
    
        if (newOrReplacedSurface > 150) {
            allReqDocTypes["C3 and C6 Checklist | C3C6"] = true;
        }
    
        var landscapingArea = parseInt(String(AInfo[
            "Amount of rehabilitated or new irrigated landscaping area"]));
        Avo_LogDebug("Landscaping area(" + landscapingArea + ")", 2); //debug
    
        if (landscapingArea >= 500 && landscapingArea < 2500) {
            allReqDocTypes["WELO Prescriptive Compliance Form | WELOPC"] = true;
        } else if (landscapingArea >= 2500) {
            allReqDocTypes["WELO Performance Approach | WELOPA"] = true;
        }
    
        var onPiers = String(AInfo["Is the retaining wall on piers?"]);
        Avo_LogDebug("Is the retaining wall on piers?(" + onPiers + ")", 2); //debug
    
        var maxHeight =parseFloat(String(AInfo["Retaining wall max height above grade (ft)"]));
        Avo_LogDebug("Retaining wall max height above grade (ft)(" + maxHeight + ")", 2); //debug
        
        if (onPiers.toUpperCase() == "YES" || (!isNaN(maxHeight) && maxHeight >= 4)) {
            allReqDocTypes["Geotechnical Report | GEO"] = true;
        }
    
        var isSteppedOrTerraced = String(AInfo[
            "Is this a stepped or terraced retaining wall and or does the wall support surcharge?"]);
        Avo_LogDebug("Stepped or terraced retaining wall(" + isSteppedOrTerraced + ")", 2); //debug
    
        if (isSteppedOrTerraced.toUpperCase() == "YES") {
            allReqDocTypes["Structural Calculations and Details | SCALCS"] = true;
        }

        // Check docs
        var allDocs = new Array();
        var result = aa.document.getDocumentListByEntity(capId, "TMP_CAP");
        if (result.getSuccess() != true) {
            Avo_LogDebug("Failed to find any documents. "
                + result.errorType + ': ' + result.errorMessage, 1);
        } else {
            allDocs = result.getOutput().toArray();
        }

        Avo_LogDebug("Total Docs(" + allDocs.length + ")", 2);  //debug

        for (var i in allDocs) {
            var docModel = allDocs[i];

            var docId = docModel.documentNo;
            Avo_LogDebug("Doc ID(" + docId + ")", 2);	//debug

            var filePath = docModel.fileName;
            Avo_LogDebug("Path(" + filePath + ")", 2);	//debug

            var name = docModel.docName;
            Avo_LogDebug("Name(" + name + ")", 2);  //debug

            var group = docModel.docGroup;
            Avo_LogDebug("Group(" + group + ")", 2); //debug

            var category = docModel.docCategory;
            Avo_LogDebug("Category(" + category + ")", 2); //debug

            if (!(category in allReqDocTypes)) {
                continue;
            }

            delete allReqDocTypes[category];
            Avo_LogDebug("Found " + category + " doc", 1);
        }

        if (Object.keys(allReqDocTypes).length == 0) {
            return;
        }

        Avo_LogDebug(br + "No " + Object.keys(allReqDocTypes).join(", ") + " doc(s) found", 1);

        cancel = true;
        showDebug = false;
        showMessage = true;

        var msg = "The following document(s) are missing. \
To continue please upload a document of the following type(s):";
        for (var i in Object.keys(allReqDocTypes)) {
            msg += "\n- " + Object.keys(allReqDocTypes)[i];
        }

        msg += "\nFor further details please refer to the instructional text below.";

        comment(msg);
    })();

    aa.env.setValue("CapModel", cap);
}
catch (ex) {
    Avo_LogDebug("ERROR: " + ex.message, 1);
}

/*------------------------------------------------------------------------------------------------------/
| END Main Loop
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| BEGIN Functions
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| END Functions
/------------------------------------------------------------------------------------------------------*/