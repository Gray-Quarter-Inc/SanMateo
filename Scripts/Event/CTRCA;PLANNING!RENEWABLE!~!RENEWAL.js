try {

    include("CONVERT2REALCAPAFTER4RENEW");
    aa.cap.updateAccessByACA(capId,"Y");

} catch (err) {
    logDebug("An error occurred in CTRCA;PLANNING!RENEWABLE!~!RENEWAL: " + err.message);
    logDebug(err.stack);
}