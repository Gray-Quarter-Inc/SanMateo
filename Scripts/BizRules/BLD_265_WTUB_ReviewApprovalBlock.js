/*******************************************************
| Script Title: reviewApprovalBlock(ID263)
| Created by: Jei Yang
| Created on: 19April21
| Event: ASB
| Usage: If task Review Consolidation is set to the status of "Approved - Plan Prep for Issuance" and ANY of the follow ASIs has value of "Not approved"
|        ["Building Review","Planning Review", "Fire Review", "Geotechnical Review", "Civil & Drainage Review", 
|         "Environmental Health Review", "Public Works Review", "Sewer Review", "Water Review", "Additional Review"]
|        Block submit with message of "One or more of the required review agencies has not approved the plans"
*********************************************************/
(function () {
    var listOfReviews = ["Building Review","Planning Review", "Fire Review", "Geotechnical Review", "Civil & Drainage Review", 
                            "Environmental Health Review", "Public Works Review", "Sewer Review", "Water Review", "Additional Review"];
    var allApproved = true;

    for (var i in listOfReviews) {
        var review = listOfReviews[i];
        var reviewStatus = String(AInfo[review]);
        Avo_LogDebug(review + "(" + reviewStatus + ")", 2); //debug

        if (reviewStatus.toLowerCase() == "not approved") {
            allApproved = false;
            break;
        }
    }

    if(allApproved) {
        return;
    }

    cancel = true;
    showMessage = true;
    comment("One or more of the required review agencies has not approved the plans");
})();