//BLD_238_ASB_LandReqDoc
/*******************************************************
| Script Title: landReqDoc(ID238)
| Created by: Jei Yang
| Created on: 15Mar21
| Event: ASB
| Usage: Always require doc type Plan Set | PLANS. 
|        If ASI "Amount of new or repalced impervious surface" is "150 - 749 sq ft" require document type "C3 and C6 Checklist | C3C6"
|        If ASI "Amount of rehabilitated or new irrigated landscaping area" is "500 - 2499 sq ft" then require document type 
|        "WELO Prescriptive Compliance Form | WELOPC"
|        If ASI "Amount of rehabilitated or new irrigated landscaping area" is "2500+ sq ft" then require document type 
|        "WELO Performance Approach | WELOPA"
|        If ASI "Is the retaining wall on piers?" is "Yes" OR If the value of ASI "retaining wall max hight above grade (ft)" is greater than equals to 4, 
|        then require document type "Geotechnical Report | GEO
|        If ASI "Is this a stepped or terraced retaining wall and or does the wall support surcharge?" is "Yes"
|        then require document type "Structural Calculations and Details | SCALCS"
|        Same error message as others if document type if missing
| Modified by: ()
*********************************************************/
(function () {
    var allReqDocTypes = new Object();
    allReqDocTypes["Plan Set | PLANS"] = true;


    var newOrReplacedSurface = parseInt(String(AInfo["Amount of new or replaced impervious surface"]));
    Avo_LogDebug("Amount of new or replaced impervious surface(" + newOrReplacedSurface + ")", 2); //debug

    if (newOrReplacedSurface > 150) {
        allReqDocTypes["C3 and C6 Checklist | C3C6"] = true;
    }

    var landscapingArea = parseInt(String(AInfo["Amount of rehabilitated or new irrigated landscaping area"]));
    Avo_LogDebug("Amount of rehabilitated or new irrigated landscaping area(" + landscapingArea + ")", 2); //debug

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

    var isSteppedOrTerraced = String(AInfo["Is this a stepped or terraced retaining wall and or does the wall support surcharge?"]);
    Avo_LogDebug("Is this a stepped or terraced retaining wall and or does the wall support surcharge?(" + isSteppedOrTerraced + ")", 2); //debug

    if (isSteppedOrTerraced.toUpperCase() == "YES") {
        allReqDocTypes["Structural Calculations and Details | SCALCS"] = true;
    }


    // Check docs
    var allDocs = aa.env.getValue("DocumentModelList");
    for (var i = 0; i < allDocs.size(); i++) {
        var docModel = allDocs.get(i);

        var name = String(docModel.fileName);
        Avo_LogDebug("Name(" + name + ")", 2);  //debug

        var group = String(docModel.docGroup);
        Avo_LogDebug("Group(" + group + ")", 2);    //debug

        var category = String(docModel.docCategory);
        Avo_LogDebug("Category(" + category + ")", 2);  //debug

        if (!(category in allReqDocTypes)) {
            continue;
        }

        delete allReqDocTypes[category];
        Avo_LogDebug("Found " + category + " doc", 1);
    }

    if (Object.keys(allReqDocTypes).length == 0) {
        return;
    }

    Avo_LogDebug("No " + Object.keys(allReqDocTypes).join(", ") + " doc(s) found", 1);

    cancel = true;
    showMessage = true;
    comment("The following document(s) are missing. For further details please refer to the instuctional text below.\n- " + Object.keys(allReqDocTypes).join("\n- "));
})();