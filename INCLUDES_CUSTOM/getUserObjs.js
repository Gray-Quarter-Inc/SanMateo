function getUserObjs() {
    var userObjArray = new Array();
    var sysUserList
    var sysUserResult = aa.people.getSysUserList(aa.util.newQueryFormat());

    if (sysUserResult.getSuccess()) {
        sysUserList = sysUserResult.getOutput();
    } else {
        logDebug("**ERROR: getUserObjs: " + sysUserResult.getErrorMessage());
        return userObjArray;
    }

    for (var iUser in sysUserList) {
        var userId = sysUserList[iUser].getUserID();
        if (userId) {
            userObjArray.push(new userObj(userId));
        }
    }

    return userObjArray;
}
/**
 * getUserObjsByDistrict
 * Description: Returns an array of userObj objects for all users in the system that match districtName
 * 
 * @param districtName {string}
 * @return array {userObj}
 */
