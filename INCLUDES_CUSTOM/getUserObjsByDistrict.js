function getUserObjsByDistrict(districtName) {
    var userObjArray = new Array();
    var sysUserList
    var sysUserResult = aa.people.getSysUserList(aa.util.newQueryFormat());

    if (sysUserResult.getSuccess()) {
        sysUserList = sysUserResult.getOutput()
    } else {
        logDebug("**ERROR: getUserObjsByDistrict: " + sysUserResult.getErrorMessage());
        return userObjArray;
    }

    for (var iUser in sysUserList) {
        var userId = sysUserList[iUser].getUserID();
        if (userId) {
            var vUserObj = new userObj(userId);
            var vUserDistArray = vUserObj.getUserDistricts();

            if (!districtName || exists(districtName, vUserDistArray)) {
                userObjArray.push(vUserObj);
            }
        }
    }

    return userObjArray;
}
