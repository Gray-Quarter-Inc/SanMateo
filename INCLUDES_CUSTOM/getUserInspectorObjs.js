function getUserInspectorObjs() {
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
        var isInspector = sysUserList[iUser].getIsInspector();
        if (isInspector && userId) {
            logDebug("userId = " + userId + " - isInspector = " + isInspector);
            userObjArray.push(new userObj(userId));
        }
    }

    return userObjArray;
}
/**
 * getUserObjs
 * Description: Returns an array of userObj objects for all users in the system
 * 
 * @return array {userObj}
 */
