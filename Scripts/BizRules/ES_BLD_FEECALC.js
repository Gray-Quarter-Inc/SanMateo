/*
Subscript Name: ES_BLD_FEECALC.js
Converted from Std Choice: ES_BLD_FEECALC
Called From Scripts:
ApplicationSpecificInfoUpdateAfter
 */

if (AInfo['Building Sq Ft'] > 1 && !feeExists('B006', 'NEW', 'INVOICED')) {
    addFee('B006', 'B_BLD', 'FINAL', 1, 'N');
}

if (AInfo['Plumbing Sq Ft'] > 1 && !feeExists('B008', 'NEW', 'INVOICED')) {
    addFee('B008', 'B_BLD', 'FINAL', 1, 'N');
}

if (AInfo['Plumbing Valuation Fee'] > 1 && !feeExists('PLV001', 'NEW', 'INVOICED')) {
    addFee('PLV001', 'B_BLD', 'FINAL', 1, 'N');
}

if (AInfo['Mechanical Sq Ft'] > 1 && !feeExists('B004', 'NEW', 'INVOICED')) {
    addFee('B004', 'B_BLD', 'FINAL', 1, 'N');

}

if (AInfo['Mechanical Valuation Fee'] > 1 && !feeExists('MEV001', 'NEW', 'INVOICED')) {
    addFee('MEV001', 'B_BLD', 'FINAL', 1, 'N');
}

if (AInfo['Electrical - House Amt'] > 1 && !feeExists('B007', 'NEW', 'INVOICED')) {
    addFee('B007', 'B_BLD', 'FINAL', 1, 'N');
}

if (AInfo['Electrical - Attached Garage Amt'] > 1 && !feeExists('B010', 'NEW', 'INVOICED')) {
    addFee('B010', 'B_BLD', 'FINAL', 1, 'N');
}

if (AInfo['Electrical Valuation Fee'] > 1 && !feeExists('ELV001', 'NEW', 'INVOICED')) {
    addFee('ELV001', 'B_BLD', 'FINAL', 1, 'N');
}

if (AInfo['Plan Check Fee'] > 1 && !feeExists('B009', 'NEW', 'INVOICED')) {
    addFee('B009', 'B_BLD', 'FINAL', 1, 'N');
}

if (AInfo['Geotechnical Plan Check Fee'] == 622 && !feeExists('P056', 'NEW', 'INVOICED')) {
    addFee('P056', 'B_BLD', 'FINAL', 1, 'N');
}

if (AInfo['Geotechnical Plan Check Fee'] == 940 && !feeExists('P058', 'NEW', 'INVOICED')) {
    addFee('P058', 'B_BLD', 'FINAL', 1, 'N');
}

if (AInfo['Geotechnical Plan Check Fee'] == 2656 && !feeExists('P057', 'NEW', 'INVOICED')) {
    addFee('P057', 'B_BLD', 'FINAL', 1, 'N');
}

if (AInfo['Energy Code Compliance Plan Check Fee'] > 1 && !feeExists('B019', 'NEW', 'INVOICED')) {
    addFee('B019', 'B_BLD', 'FINAL', 1, 'N');
}

if (AInfo['Public Works Plan Check Fee'] > 1 && !feeExists('B047', 'NEW', 'INVOICED')) {
    addFee('B047', 'B_BLD', 'FINAL', 1, 'N');
}

if (AInfo['Filing Fee'] > 1 && !feeExists('B001', 'NEW', 'INVOICED')) {
    addFee('B001', 'B_BLD', 'FINAL', 1, 'N');
}

if (AInfo['Microfilm Fee'] > 1 && !feeExists('B003', 'NEW', 'INVOICED')) {
    addFee('B003', 'B_BLD', 'FINAL', 1, 'N');
}

if (AInfo['CDF Plan Check Fee'] > 1 && !feeExists('B049', 'NEW', 'INVOICED')) {
    addFee('B049', 'B_BLD', 'FINAL', 1, 'N');
}

if (AInfo['CDF Remodel Valuation Fee'] > 1 && !feeExists('B050', 'NEW', 'INVOICED')) {
    addFee('B050', 'B_BLD', 'FINAL', 1, 'N');
}

if (AInfo['Health Department Review Fee'] == 765 && !feeExists('B020', 'NEW', 'INVOICED')) {
    addFee('B020', 'B_BLD', 'FINAL', 1, 'N');
}

if (AInfo['Health Department Review Fee'] == 157 && !feeExists('B077', 'NEW', 'INVOICED')) {
    addFee('B077', 'B_BLD', 'FINAL', 1, 'N');
}

if (AInfo['Addressing Fee'] != null && !feeExists('B027', 'NEW', 'INVOICED')) {
    addFee('B027', 'B_BLD', 'FINAL', 1, 'N');
}

if (AInfo['Other Housing Fees'] == 752 && !feeExists('B022', 'NEW', 'INVOICED')) {
    addFee('B022', 'B_BLD', 'FINAL', 1, 'N');
}

if (AInfo['Temp Power Pole'] > 1 && !feeExists('B074', 'NEW', 'INVOICED')) {
    addFee('B074', 'B_BLD', 'FINAL', 1, 'N');
}

if (AInfo['Demolition'] == 85 && !feeExists('B046', 'NEW', 'INVOICED')) {
    addFee('B046', 'B_BLD', 'FINAL', 1, 'N');
}

if (AInfo['Demolition'] == 266 && !feeExists('B045', 'NEW', 'INVOICED')) {
    addFee('B045', 'B_BLD', 'FINAL', 1, 'N');
}

if (AInfo['Road Mitigation Fee'] > 1 && !feeExists('PW007', 'NEW', 'INVOICED')) {
    addFee('PW007', 'B_BLD', 'FINAL', 1, 'N');
}

if (AInfo['Mid Coast Park and Rec Fee'] > 1 && !feeExists('PW012', 'NEW', 'INVOICED')) {
    addFee('PW012', 'B_BLD', 'FINAL', 1, 'N');
}

if (AInfo['Manual Valuation'] > 1 && !feeExists('B005', 'NEW')) {
    editAppSpecific('Building Valuation Fee', feeAmount('B005', 'NEW'));
}

if (AInfo['Attached Garage Sq Ft'] > 1 && !feeExists('B006', 'NEW', 'INVOICED')) {
    addFee('B006', 'B_BLD', 'FINAL', 1, 'N');
}

if (AInfo['Stormwater Pollution Fee'] > 1 && !feeExists('DX001', 'NEW', 'INVOICED')) {
    addFee('DX001', 'DX_PRIVATEPROPERTY', 'FINAL', 1, 'N');
}
