if (wfTask == "Renewal Issuance" && wfStatus == "Issued") {
    include("WORKFLOWTASKUPDATEAFTER4RENEW");
    aa.cap.updateAccessByACA(capId,"Y");


}