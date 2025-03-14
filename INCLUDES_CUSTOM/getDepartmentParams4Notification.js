function getDepartmentParams4Notification(eParamsHash, deptName) {
    if (deptName == null) {
        return eParamsHash;
    }
    var rptInfoStdArray = getStandardChoiceArray("DEPARTMENT_INFORMATION");
    var foundDept = false;

    var valDesc = null;
    var defaultDeptValDesc = null;
    for (s in rptInfoStdArray) {
        if (rptInfoStdArray[s]["active"] == "A" && String(rptInfoStdArray[s]["value"]).toUpperCase() == String(deptName).toUpperCase()) {
            valDesc = rptInfoStdArray[s]["valueDesc"];
            if (isEmptyOrNull(valDesc)) {
                return eParamsHash;
            }
            valDesc = String(valDesc).split("|");
            foundDept = true;
            break;
        }//active and name match
        if (rptInfoStdArray[s]["active"] == "A" && String(rptInfoStdArray[s]["value"]).toUpperCase() == "DEFAULT") {
            defaultDeptValDesc = rptInfoStdArray[s]["valueDesc"];
            if (isEmptyOrNull(valDesc)) {
                return eParamsHash;
            }
            defaultDeptValDesc = String(defaultDeptValDesc).split("|");
        }
    }//all std-choice rows

    if (!foundDept) {
        // No department found, use default values
        valDesc = defaultDeptValDesc;
    }

    if (!isEmptyOrNull(valDesc)) {
        for (e in valDesc) {
            var parameterName = "";
            var tmpParam = valDesc[e].split(":");
            if (tmpParam[0].indexOf("$$") < 0)
                parameterName = "$$" + tmpParam[0].replace(/\s+/g, '') + "$$";
            else
                parameterName = tmpParam[0];

            addParameter(eParamsHash, parameterName, tmpParam[1]);
        }//for all parameters in each row
    }//has email parameters

    return eParamsHash;
}
/*----------------------------------------------------------------------------------------------------/
| GIS Related Functions
/----------------------------------------------------------------------------------------------------*/
/*******************************************************
| Script/Function: getGISBufferInfoCustom()
| Created by: Mike Buell
| Created on: 02June17
| Usage: get values from buffer
| Modified by: 
| Modified on: 
*********************************************************/
