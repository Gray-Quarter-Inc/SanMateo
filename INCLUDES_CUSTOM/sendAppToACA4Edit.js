function sendAppToACA4Edit(isEditable) {
    var vCapID = capId;
    if (arguments.length == 2)
        vCapID = arguments[1];

    var vCap = aa.cap.getCap(vCapID).getOutput().getCapModel();

    var editable = "EDITABLE";
    if (!isEditable) {
        editable = "COMPLETE";
    }

    vCap.setCapClass(editable);
    aa.cap.editCapByPK(vCap);
}
//email with attachment
