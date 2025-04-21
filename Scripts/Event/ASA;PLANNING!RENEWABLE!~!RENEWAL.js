try {

    include("APPLICATIONSUBMITAFTER4RENEW");
    aa.cap.updateAccessByACA(capId,"Y");

} catch (err) {
    logDebug("An error occurred in ASA;PLANNING!RENEWABLE!~!RENEWAL: " + err.message);
    logDebug(err.stack);
}