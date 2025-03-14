/*
Subscript Name: ES_FIREASA.js
Converted from Std Choice: ES_FireASA
Called From Scripts:
ES_MPF_APPSUBMITAFTER
 */

if (AInfo['Sub Type'] == 'AMMR') {
    updateFee('MP41890', 'MP_CONSTRUCTION', 'FINAL', 1, 'Y');
}

if (appMatch('*/Plan Review/*/*') && AInfo['Sub Type'] == 'Comm Site Access / Water') {
    updateFee('MP41745', 'MP_CONSTRUCTION', 'FINAL', 1, 'Y');
}

if (AInfo['Sub Type'] == 'Variance Request') {
    updateFee('MP41815', 'MP_CONSTRUCTION', 'FINAL', 1, 'Y');
}

if (appMatch('*/Plan Review/*/*') && AInfo['Sub Type'] == 'Res Site Review') {
    updateFee('MP41740', 'MP_CONSTRUCTION', 'FINAL', 1, 'Y');
}

if (AInfo['Sub Type'] == 'Planning' && AInfo['Type'] == 'Residential') {
    updateFee('MP41740', 'MP_CONSTRUCTION', 'FINAL', 1, 'Y');
}

if (appMatch('*/*/Alternative Suppression System/*') && AInfo['Number of Systems'] > 0) {
    updateFee('MP41485', 'MP_CONSTRUCTION', 'FINAL', AInfo['Number of Systems'], 'Y');
}

if (appMatch('*/*/Battery System incl Cell Site/*')) {
    updateFee('MP41495', 'MP_CONSTRUCTION', 'FINAL', 1, 'Y');
}

if (appMatch('*/*/Emergency Repair/*')) {
    updateFee('MP41335', 'MP_CONSTRUCTION', 'FINAL', 1, 'Y');
}

if (appMatch('*/*/Event/*')) {
    updateFee('MP41351', 'MP_EVENT', 'FINAL', 1, 'Y');
}

if (appMatch('*/*/Fire Fighter Air or Radio Sys/*')) {
    updateFee('MP41570', 'MP_CONSTRUCTION', 'FINAL', 1, 'Y');
}

if (appMatch('*/*/Gate/*')) {
    updateFee('MP41697', 'MP_CONSTRUCTION', 'FINAL', 1, 'Y');
}

if (appMatch('*/*/Generator/*')) {
    updateFee('MP41698', 'MP_CONSTRUCTION', 'FINAL', AInfo['Number of Units'], 'Y');
}

if (appMatch('*/*/High Pile Storage/*')) {
    updateFee('MP41666', 'MP_CONSTRUCTION', 'FINAL', 1, 'Y');
}

if (appMatch('*/*/Hood and Duct Kitchen/*') && AInfo['Number of Systems'] > 0) {
    updateFee('MP41490', 'MP_CONSTRUCTION', 'FINAL', AInfo['Number of Systems'], 'Y');
}

if (appMatch('*/*/HVAC/*') && AInfo['Cubic Feet per Minute'] > 0) {
    updateFee('MP41667', 'MP_CONSTRUCTION', 'FINAL', 1, 'Y');
}

if (appMatch('*/*/Photovoltaic/*') && AInfo['Type'] == 'Residential') {
    updateFee('MP41741', 'MP_CONSTRUCTION', 'FINAL', 1, 'Y');
}

if (appMatch('*/*/Photovoltaic/*') && AInfo['Type'] == 'Commercial') {
    updateFee('MP41742', 'MP_CONSTRUCTION', 'FINAL', 1, 'Y');
}

if (appMatch('*/*/Hazardous Material Tank/*') && AInfo['Number of Tanks'] > 0) {
    updateFee('MP41340', 'MP_CONSTRUCTION', 'FINAL', 1, 'Y');
}

if (appMatch('*/*/Alarm/*') && AInfo['Number of Floors'] > 0 && AInfo['Devices'] > 0 && AInfo['Group Care Facility?'] == null) {
    updateFee('MP41540', 'MP_CONSTRUCTION', 'FINAL', 1, 'Y');
}

if (appMatch('*/*/Monitoring System/*')) {
    updateFee('MP41870', 'MP_CONSTRUCTION', 'FINAL', 1, 'Y');
}

if (appMatch('*/*/Sprinkler/Commercial New System')) {
    updateFee('MP41825', 'MP_CONSTRUCTION', 'FINAL', AInfo['Number of Floors'], 'Y');
}

if (appMatch('*/*/Sprinkler/Commercial TI')) {
    updateFee('MP41827', 'MP_CONSTRUCTION', 'FINAL', 1, 'Y');
}

if (appMatch('*/*/Sprinkler/Residential Modification')) {
    updateFee('MP41866', 'MP_CONSTRUCTION', 'FINAL', 1, 'Y');
}

if (appMatch('*/*/Sprinkler/Residential New System')) {
    updateFee('MP41860', 'MP_CONSTRUCTION', 'FINAL', AInfo['Risers'], 'Y');
}

if (appMatch('*/*/Tent/*')) {
    updateFee('MP41380', 'MP_EVENT', 'FINAL', 1, 'Y');
}

if (appMatch('*/*/Underground Piping/*') && AInfo['Linear Ft'] > 0) {
    updateFee('MP41800', 'MP_CONSTRUCTION', 'FINAL', 1, 'Y');
}

if (appMatch('*/*/Alarm/*') && (AInfo['Number of Floors'] > 4 || AInfo['Devices'] > 50) && AInfo['Group Care Facility?'] == null) {
    var quantity = Math.max(AInfo['Number of Floors'] - 4, 0) + Math.max(Math.ceil(AInfo['Devices'] / 50) - 1, 0);
    updateFee('MP41545', 'MP_CONSTRUCTION', 'FINAL', quantity, 'Y');
}

if (appMatch('*/Plan Review/*/*') && (AInfo['Sub Type'] == 'Comm New' || AInfo['Sub Type'] == 'Comm TI')) {
    updateFee('MP41700', 'MP_CONSTRUCTION', 'FINAL', AInfo['Number of Floors'], 'Y');
}

if (appMatch('*/Plan Review/*/*') && (AInfo['Sub Type'] == 'Comm New' || AInfo['Sub Type'] == 'Comm TI') && Avo_GetTotalSquareFootageQuantity(capId) > 0) {
    updateFee('MP41705', 'MP_CONSTRUCTION', 'FINAL', Avo_GetTotalSquareFootageQuantity(capId), 'Y');
}

if (appMatch('*/*/Monitoring System/*') && AInfo['Number of Devices'] > 25) {
    updateFee('MP41871', 'MP_CONSTRUCTION', 'FINAL', AInfo['Number of Devices'], 'Y');
}

if (appMatch('*/*/Sprinkler/Commercial New System') && Avo_GetTotalNumberOfHeadsQuantity(capId) > 0) {
    updateFee('MP41826', 'MP_CONSTRUCTION', 'FINAL', Avo_GetTotalNumberOfHeadsQuantity(capId), 'Y');
}

if (appMatch('*/*/Sprinkler/Commercial TI') && AInfo['Heads'] > 20) {
    updateFee('MP41828', 'MP_CONSTRUCTION', 'FINAL', AInfo['Heads'], 'Y');
}

if (appMatch('*/*/Sprinkler/Residential Modification') && AInfo['Heads'] > 50) {
    updateFee('MP41867', 'MP_CONSTRUCTION', 'FINAL', Math.ceil(AInfo['Heads'] / 50) - 1, 'Y');
}

if (appMatch('*/*/Sprinkler/Residential New System') && AInfo['Heads Fee'] > 0) {
    updateFee('MP41865', 'MP_CONSTRUCTION', 'FINAL', AInfo['Heads Fee'], 'Y');
}

if (appMatch('*/*/Tent/*') && AInfo['Number of Structures'] > 0) {
    updateFee('MP41380', 'MP_EVENT', 'FINAL', Math.ceil(AInfo['Number of Structures'] / 5), 'Y');
}

if (appMatch('*/*/Underground Piping/*') && AInfo['Linear Ft'] > 250) {
    updateFee('MP41805', 'MP_CONSTRUCTION', 'FINAL', Math.ceil(AInfo['Linear Ft'] / 250) - 1, 'Y');
}

if (appMatch('*/*/Hazardous Material Tank/*') && AInfo['Number of Tanks'] > 1) {
    updateFee('MP41345', 'MP_CONSTRUCTION', 'FINAL', AInfo['Number of Tanks'] - 1, 'Y');
}

if (appMatch('*/*/Floor Finishing/*') && AInfo['Total Floor Area'] > 350) {
    updateFee('MP41365', 'MP_CONSTRUCTION', 'FINAL', 1, 'Y');
}

if (appMatch('*/*/Alarm/*') && AInfo['Group Care Facility?'] == 'CHECKED') {
    updateFee('MP41565', 'MP_CONSTRUCTION', 'FINAL', 1, 'Y');
}

if (appMatch('*/*/Hazardous Material/Medical Building') && AInfo['Number of Systems'] > 0) {
    updateFee('MP41622', 'MP_CONSTRUCTION', 'FINAL', 1, 'Y');
}

if (appMatch('*/*/Hazardous Material/Medical Building') && AInfo['Number of Systems'] > 1) {
    updateFee('MP41623', 'MP_CONSTRUCTION', 'FINAL', AInfo['Number of Systems'] - 1, 'Y');
}

if ((appMatch('*/*/Hazardous Material/Industrial') || appMatch('*/*/Hazardous Material/Manufacturing') || appMatch('*/*/Hazardous Material/R&D Building')) && AInfo['Number of Systems'] > 0) {
    updateFee('MP41620', 'MP_CONSTRUCTION', 'FINAL', 1, 'Y');
}

if ((appMatch('*/*/Hazardous Material/Industrial') || appMatch('*/*/Hazardous Material/Manufacturing') || appMatch('*/*/Hazardous Material/R&D Building')) && AInfo['Number of Systems'] > 1) {
    updateFee('MP41621', 'MP_CONSTRUCTION', 'FINAL', AInfo['Number of Systems'] - 1, 'Y');
}

if (appMatch('*/*/Radio Signal Amplification Sys/*')) {
    updateFee('MP41570', 'MP_CONSTRUCTION', 'FINAL', 1, 'Y');
}

if (appMatch('*/Plan Review/*/*') && AInfo['Sub Type'] == 'Comm Demo') {
    updateFee('MP41745D', 'MP_CONSTRUCTION', 'FINAL', 1, 'Y');
}

if (appMatch('*/Plan Review/*/*') && AInfo['Sub Type'] == 'Res Site Access/Water +óGé¼GÇ£ Subdivision' && AInfo['Number of Parcels'] > 0) {
    updateFee('MP41750', 'MP_CONSTRUCTION', 'FINAL', Math.ceil(AInfo['Number of Parcels'] / 25), 'Y');
}

if (appMatch('*/*/Fire Pump/Commercial New')) {
    updateFee('MP41875', 'MP_CONSTRUCTION', 'FINAL', 1, 'Y');
}

if (appMatch('*/*/Fire Pump/Commercial Modification')) {
    updateFee('MP41880', 'MP_CONSTRUCTION', 'FINAL', 1, 'Y');
}

if (appMatch('*/*/2-Way Communication/*')) {
    updateFee('MP41796', 'MP_CONSTRUCTION', 'FINAL', 1, 'Y');
}

if (appMatch('*/*/Standpipe/*')) {
    updateFee('MP41795', 'MP_CONSTRUCTION', 'FINAL', AInfo['Number of Systems'], 'Y');
}

if (appMatch('*/*/Fume/Lab Hood')) {
    updateFee('MP41696', 'MP_CONSTRUCTION', 'FINAL', AInfo['Number of Units'], 'Y');
}

if (appMatch('*/*/FF Rescue Air System/*')) {
    updateFee('MP41576', 'MP_CONSTRUCTION', 'FINAL', 1, 'Y');
}

if (appMatch('*/*/Smoke Control/Smoke Exhaust')) {
    updateFee('MP41753', 'MP_CONSTRUCTION', 'FINAL', AInfo['Number of Systems'], 'Y');
}

if (AInfo['Expedite?'] == 'Yes') {
    updateFee('MP41810', 'MP_CONSTRUCTION', 'FINAL', 1, 'Y');
}

if (appMatch('*/*/Open Flames/Candles')) {
    updateFee('MP41445', 'MP_EVENT', 'FINAL', 1, 'Y');
}
