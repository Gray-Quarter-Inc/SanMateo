function getRecordParams4Notification(params) {
    itemCapId = (arguments.length == 2) ? arguments[1] : capId;
    // pass in a hashtable and it will add the additional parameters to the table

    var itemCapIDString = itemCapId.getCustomID();
    var itemCap = aa.cap.getCap(itemCapId).getOutput();
    var itemCapName = itemCap.getSpecialText();
    var itemCapStatus = itemCap.getCapStatus();
    var itemFileDate = itemCap.getFileDate();
    var itemCapTypeAlias = itemCap.getCapType().getAlias();
    var itemHouseCount;
    var itemFeesInvoicedTotal;
    var itemBalanceDue;

    var itemCapDetailObjResult = aa.cap.getCapDetail(itemCapId);
    if (itemCapDetailObjResult.getSuccess()) {
        itemCapDetail = itemCapDetailObjResult.getOutput();
        itemHouseCount = itemCapDetail.getHouseCount();
        itemFeesInvoicedTotal = itemCapDetail.getTotalFee();
        itemBalanceDue = itemCapDetail.getBalance();
    }

    var workDesc = workDescGet(itemCapId);

    addParameter(params, "$$altID$$", itemCapIDString);

    addParameter(params, "$$capName$$", itemCapName);

    addParameter(params, "$$recordTypeAlias$$", itemCapTypeAlias);

    addParameter(params, "$$capStatus$$", itemCapStatus);

    addParameter(params, "$$fileDate$$", itemFileDate);

    addParameter(params, "$$balanceDue$$", "$" + parseFloat(itemBalanceDue).toFixed(2));

    addParameter(params, "$$workDesc$$", (workDesc) ? workDesc : "");

    return params;
}
