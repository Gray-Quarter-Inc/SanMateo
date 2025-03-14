/*******************************************************
| Script/Function: decAcaInspsRemain() - (ID199)
| Created by: Nicolaj Bunting
| Created on: 15Jan21
| Usage: On inspection scheduled If in ACA Then decrement value of ZONE#_INSPS_REMAINING in std choice "ACA_INSPECTION_LIMIT" Where zone 
| # is same as area # in parcel attribute "Building Inspection Area"
| Modified by: ()
*********************************************************/
(function () {
    var parcelObj = new Object();
    loadParcelAttributes(parcelObj);

    var area = String(parcelObj["ParcelAttribute.BUILDING INSPECTION AREA"]);
    Avo_LogDebug("Insp Area(" + area + ")", 2); //debug

    const regex = /AREA(\d+)/gi;
    var num = regex.exec(area)[1];

    // Update std choice
    var stdChoice = "ACA_INSPECTION_LIMIT";

    var stdValue = "ZONE" + num + "_INSPS_REMAINING";
    var result = aa.bizDomain.getBizDomainByValue(stdChoice, stdValue);
    if (result.getSuccess() != true) {
        Avo_LogDebug('Failed to get key "' + stdValue + '" in std choice "' + stdChoice + '". '
            + result.errorType + ': ' + result.errorMessage, 1);
        return;
    }

    var bizDomain = result.getOutput();

    var inspsRemain = String(bizDomain.description);
    Avo_LogDebug("Insps Remaining(" + inspsRemain + ")", 2);    //debug

    var inspsRemainNum = parseInt(inspsRemain, 10);

    if (isNaN(inspsRemainNum) == true) {
        return;
    }

    inspsRemainNum--;
    bizDomain.description = String(inspsRemainNum);

    result = aa.bizDomain.editBizDomain(bizDomain.bizDomain);
    if (result.getSuccess() != true) {
        Avo_LogDebug('Failed to set key "' + stdValue + '" in std choice "' + stdChoice + '". '
            + result.errorType + ': ' + result.errorMessage, 1);
        return;
    }

    Avo_LogDebug('Set key "' + stdValue + '" in std choice "' + stdChoice + '" to "' + inspsRemainNum + '"', 1);
})();

aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC Supp: BLD_199_ISA_DecAcaInspsRemain", debug); //debug