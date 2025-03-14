function getInspectorWebConferenceURL(inspInspector, inspGroup, inspType, overrideURL, adhocRemoteInspection) {
    if (overrideURL && overrideURL != "") {
        return overrideURL;
    }

    var URL = lookup("REMOTE_INSPECTIONS_URLS", inspInspector);
    if (URL && URL != "") {
        if (adhocRemoteInspection) {
            return URL;
        }

        var inspGroupSetting = lookup("REMOTE_INSPECTIONS_ALLOWED_INSPECTION_TYPES", inspGroup);
        if (inspGroupSetting && inspGroupSetting != "") {
            var inspGroupSettingArray = inspGroupSetting.split(',');
            for (var i in inspGroupSettingArray) {
                var scInspType = inspGroupSettingArray[i];
                if (scInspType.toString().trim() == inspType) {
                    return URL;
                }
            }
        }
    }

    return "";
}
/*----------------------------------------------------------------------------------------------------/
| GIS Related Functions
/----------------------------------------------------------------------------------------------------*/
/*******************************************************
| Script/Function: getParcel()
| Created by: Mike Buell
| Created on: 02June17
| Usage: get parcel number from capmodel
| Modified by: 
| Modified on: 
*********************************************************/
