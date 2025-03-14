function getInspectionScheduleParams4Notification(params) {

    if (inspId) addParameter(params, "$$inspId$$", inspId);

    if (inspInspector) addParameter(params, "$$inspInspector$$", inspInspector);

    if (InspectorFirstName) addParameter(params, "$$InspectorFirstName$$", InspectorFirstName);

    if (InspectorMiddleName) addParameter(params, "$$InspectorMiddleName$$", InspectorMiddleName);

    if (InspectorLastName) addParameter(params, "$$InspectorLastName$$", InspectorLastName);

    if (InspectorFirstName && InspectorLastName) addParameter(params, "$$InspectorName$$", InspectorFirstName + " " + InspectorLastName);

    if (inspGroup) addParameter(params, "$$inspGroup$$", inspGroup);

    if (inspType) addParameter(params, "$$inspType$$", inspType);

    if (inspSchedDate) addParameter(params, "$$inspSchedDate$$", inspSchedDate);

    if (exists(vEventName, ['InspectionMultipleScheduleAfter', 'InspectionScheduleAfter'])) {
        var adHocRemoteInspection = false;
        var adHocURL = null;
        var pim = inspObj.getInspection();
        var pact = pim.getActivity();
        var iUnits = null;
        if (pact.getUnitNBR() != null && pact.getUnitNBR() != "") {
            var inspUnitNumberUpper = pact.getUnitNBR().toString().toUpperCase();
            if (inspUnitNumberUpper == "REMOTE") {
                adHocRemoteInspection = true;
            }
            if (inspUnitNumberUpper == "REMOTE") {
                adHocRemoteInspection = true;
            }
            else if (inspUnitNumberUpper == "ONSITE") {
                adHocRemoteInspection = false;
                adHocURL = "NOT APPLICABLE - WILL BE ONSITE";
            }
            else if (inspUnitNumberUpper.indexOf("HTTP") > -1) {
                adHocURL = pact.getUnitNBR();
            }
        }
        addParameter(params, "$$inspectorURL$$", getInspectorWebConferenceURL(inspInspector, inspGroup, inspType, adHocURL, adHocRemoteInspection));
    }

    return params;
}
