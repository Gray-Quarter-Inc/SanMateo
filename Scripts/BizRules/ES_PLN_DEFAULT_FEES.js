/*
Subscript Name: ES_PLN_DEFAULT_FEES.js
Converted from Std Choice: ES_PLN_DEFAULT_FEES
Called From Scripts:
ES_ENTITLEMENT_LOOP
 */

feeRow = PROJECT[0]; // added this line to just add fees for the first project in the table;
if (feeRow['Project Type'] == 'Agricultural Preserve Contract' && feeRow['Subtype'] == 'Less Than 40 Acres' && !feeExists('P004')) {
    addFee('P004', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Agricultural Preserve Contract' && feeRow['Subtype'] == 'Greater Than or Equal to 40 Acres' && !feeExists('P005')) {
    addFee('P005', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Agricultural Preserve Contract' && feeRow['Subtype'] == 'Non Renewal' && !feeExists('P006')) {
    addFee('P006', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Agricultural Preserve Contract' && feeRow['Subtype'] == 'Cancellation' && !feeExists('P003')) {
    addFee('P003', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Agricultural Preserve Contract' && feeRow['Subtype'] == 'Amendment' && !feeExists('P002')) {
    addFee('P002', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Archeological or Historical Research' && feeRow['Subtype'] == 'Permit' && !feeExists('P011')) {
    addFee('P011', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Architectural Review' && feeRow['Subtype'] == 'Exemption' && !feeExists('P008')) {
    addFee('P008', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Architectural Review' && feeRow['Subtype'] == 'New Use' && !feeExists('P009')) {
    addFee('P009', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Architectural Review' && feeRow['Subtype'] == 'Addition to Existing Use' && !feeExists('P010')) {
    addFee('P010', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Coastal Development Permit' && feeRow['Subtype'] == 'Exemption' && !feeExists('P013')) {
    addFee('P013', 'P_PLN', 'FINAL', 1, 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Coastal Development Permit' && feeRow['Subtype'] == 'Staff Level' && !feeExists('P015')) {
    addFee('P015', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Coastal Development Permit' && feeRow['Subtype'] == 'Biological Report Review' && !feeExists('P012')) {
    addFee('P012', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Coastal Development Permit' && feeRow['Subtype'] == 'Public Hearing' && !feeExists('P014')) {
    addFee('P014', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Coastal Development Permit' && feeRow['Subtype'] == 'with Lot Line Adjustment' && !feeExists('P016')) {
    addFee('P016', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Confined Animal Permit' && feeRow['Subtype'] == 'Review' && !feeExists('P027')) {
    addFee('P027', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Confined Animal Permit' && feeRow['Subtype'] == 'Staff Level' && !feeExists('P028')) {
    addFee('P028', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Confined Animal Permit' && feeRow['Subtype'] == 'Hearing Required' && !feeExists('P029')) {
    addFee('P029', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Confined Animal Permit' && feeRow['Subtype'] == 'Exemption' && !feeExists('P030')) {
    addFee('P030', 'P_PLN', 'FINAL', 1, 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Density Analysis' && feeRow['Subtype'] == 'Initial' && !feeExists('P033')) {
    addFee('P033', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Density Analysis' && feeRow['Subtype'] == 'in S-11 RH or S-104' && !feeExists('P036')) {
    addFee('P036', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Bayside Design Review Permit' && feeRow['Subtype'] == 'Initial' && !feeExists('P038')) {
    addFee('P038', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Bayside Design Review Permit' && feeRow['Subtype'] == 'Addition to Existing Use' && !feeExists('P037')) {
    addFee('P037', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Bayside Design Review Permit' && feeRow['Subtype'] == 'Major Revision' && !feeExists('P040')) {
    addFee('P040', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Bayside Design Review Permit' && feeRow['Subtype'] == 'Second Dwelling Unit' && !feeExists('P041')) {
    addFee('P041', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Bayside Design Review Permit' && feeRow['Subtype'] == 'Exemption' && !feeExists('P039')) {
    addFee('P039', 'P_PLN', 'FINAL', 1, 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Coastside Design Review Permit' && feeRow['Subtype'] == 'Initial' && !feeExists('P038')) {
    addFee('P038', 'P_PLN', 'FINAL', 1, 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Coastside Design Review Permit' && feeRow['Subtype'] == 'Addition to Existing Use' && !feeExists('P037')) {
    addFee('P037', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Coastside Design Review Permit' && feeRow['Subtype'] == 'Major Revision' && !feeExists('P040')) {
    addFee('P040', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Coastside Design Review Permit' && feeRow['Subtype'] == 'Second Dwelling Unit' && !feeExists('P041')) {
    addFee('P041', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('081', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Coastside Design Review Permit' && feeRow['Subtype'] == 'Exemption' && !feeExists('P039')) {
    addFee('P039', 'P_PLN', 'FINAL', 1, 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Fence Height Exception' && feeRow['Subtype'] == 'Permit' && !feeExists('P050')) {
    addFee('P050', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Off-Street Parking Exception' && feeRow['Subtype'] == 'Hearing Required' && !feeExists('P077')) {
    addFee('P077', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Off-Street Parking Exception' && feeRow['Subtype'] == 'Staff Level' && !feeExists('P078')) {
    addFee('P078', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Home Improvement Exception' && feeRow['Subtype'] == 'Staff Level' && !feeExists('P061')) {
    addFee('P061', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    // addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Home Improvement Exception' && feeRow['Subtype'] == 'Hearing Required' && !feeExists('P062')) {
    addFee('P062', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'General Plan Conformity' && feeRow['Subtype'] == 'Permit' && !feeExists('P054')) {
    addFee('P054', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Text Amendment' && feeRow['Subtype'] == 'Permit' && !feeExists('P112')) {
    addFee('P112', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Grading Permit' && feeRow['Subtype'] == 'Exemption' && !feeExists('P060')) {
    addFee('P060', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Grading Permit' && feeRow['Subtype'] == 'Initial' && !feeExists('P059')) {
    addFee('P059', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Land Clearing Permit' && feeRow['Subtype'] == 'State or County Scenic Road' && !feeExists('P066')) {
    addFee('P066', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Land Clearing Permit' && feeRow['Subtype'] == 'Other' && !feeExists('P067')) {
    addFee('P067', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Certificate of Compliance' && feeRow['Subtype'] == 'Type A' && !feeExists('P025')) {
    addFee('P025', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Certificate of Compliance' && feeRow['Subtype'] == 'Type B' && !feeExists('P026')) {
    addFee('P026', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Lot Line Adjustment' && feeRow['Subtype'] == 'Major' && !feeExists('P072')) {
    addFee('P072', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Lot Line Adjustment' && feeRow['Subtype'] == 'Minor' && !feeExists('P073')) {
    addFee('P073', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Subdivision' && feeRow['Subtype'] == 'Minor' && !feeExists('P095')) {
    addFee('P095', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Subdivision' && feeRow['Subtype'] == 'Major' && !feeExists('P094')) {
    addFee('P094', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Merger' && feeRow['Subtype'] == 'Permit' && !feeExists('P075')) {
    addFee('P075', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'UnMerger' && feeRow['Subtype'] == 'Permit' && !feeExists('P119')) {
    addFee('P119', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Landscape Plan Review' && feeRow['Subtype'] == 'Permit' && !feeExists('P068')) {
    addFee('P068', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Large Family Day Care Facility Permit' && feeRow['Subtype'] == 'Permit' && !feeExists('P071')) {
    addFee('P071', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Large Family Day Care Facility Permit' && feeRow['Subtype'] == 'Staff Level with CDP' && !feeExists('P070')) {
    addFee('P070', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Major Development Pre-Application' && feeRow['Subtype'] == 'Permit' && !feeExists('P074')) {
    addFee('P074', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Drilling Permit' && feeRow['Subtype'] == 'Exploratory' && !feeExists('P042')) {
    addFee('P042', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Drilling Permit' && feeRow['Subtype'] == 'Inspection' && !feeExists('P043')) {
    addFee('P043', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Drilling Permit' && feeRow['Subtype'] == 'Production' && !feeExists('P044')) {
    addFee('P044', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    addFee('081', 'P_PLN', 'FINAL', '1', 'N');
}

if (feeRow['Project Type'] == 'Surface Mining Permit' && feeRow['Subtype'] == 'Permit' && !feeExists('P102')) {
    addFee('P102', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Timber Harvesting Permit' && feeRow['Subtype'] == 'Initial' && !feeExists('P110')) {
    addFee('P110', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Timber Harvesting Permit' && feeRow['Subtype'] == 'Concept Plan Review' && !feeExists('P107')) {
    addFee('P107', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Timber Harvesting Permit' && feeRow['Subtype'] == 'Development and Timber Mngmt Review' && !feeExists('P108')) {
    addFee('P108', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    addFee('081', 'P_PLN', 'FINAL', '1', 'N');
}

if (feeRow['Project Type'] == 'Timber Harvesting Permit' && feeRow['Subtype'] == 'Time Management Plan Review' && !feeExists('P109')) {
    addFee('P109', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Topsoil Permit' && feeRow['Subtype'] == 'Permit' && !feeExists('P114')) {
    addFee('P114', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Noise Report Review' && feeRow['Subtype'] == 'Permit' && !feeExists('P076')) {
    addFee('P076', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Planned Agricultural District Permit' && feeRow['Subtype'] == 'Permit' && !feeExists('P055')) {
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('P081','P_PLN','FINAL',1,'N');
}

if (feeRow['Project Type'] == 'Resource Management District Permit' && feeRow['Subtype'] == 'Overall Development Scheme' && !feeExists('P087')) {
    addFee('P087', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Resource Management District Permit' && feeRow['Subtype'] == 'Minor Development' && !feeExists('P088')) {
    addFee('P088', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Resource Management District Permit' && feeRow['Subtype'] == 'No Previous ESS' && !feeExists('P089')) {
    addFee('P089', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Resource Management District Permit' && feeRow['Subtype'] == 'Previous ESS Application' && !feeExists('P090')) {
    addFee('P090', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Resource Management-Coastal Zone District Permit' && feeRow['Subtype'] == 'Previous ESS Application' && !feeExists('P090')) {
    addFee('P090', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Resource Management-Coastal Zone District Permit' && feeRow['Subtype'] == 'Overall Development Scheme' && !feeExists('P087')) {
    addFee('P087', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Resource Management-Coastal Zone District Permit' && feeRow['Subtype'] == 'Minor Development' && !feeExists('P088')) {
    addFee('P088', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Resource Management-Coastal Zone District Permit' && feeRow['Subtype'] == 'No Previous ESS' && !feeExists('P089')) {
    addFee('P089', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Rezoning' && feeRow['Subtype'] == 'Permit' && !feeExists('P093')) {
    addFee('P093', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Second Dwelling Unit Administrative Review' && feeRow['Subtype'] == 'Permit' && !feeExists('P041')) {
    addFee('P041', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Sewage Capacity Transfer' && feeRow['Subtype'] == 'Permit' && !feeExists('P096')) {
    addFee('P096', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Specific Plan - BART' && feeRow['Subtype'] == 'Permit' && !feeExists('P127')) {
    addFee('P127', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Stormwater Pollution Prevention Program' && feeRow['Subtype'] == 'Permit' && !feeExists('P098')) {
    addFee('P098', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Street Name Change' && feeRow['Subtype'] == 'Permit' && !feeExists('P100')) {
    addFee('P100', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Timberland Preserve Zone' && feeRow['Subtype'] == 'Minor Development' && !feeExists('P110')) {
    addFee('P110', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Timberland Preserve Zone' && feeRow['Subtype'] == 'Concept Plan' && !feeExists('P107')) {
    addFee('P107', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Timberland Preserve Zone' && feeRow['Subtype'] == 'Development and Timber Mngmt Plan' && !feeExists('P108')) {
    addFee('P108', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Timberland Preserve Zone' && feeRow['Subtype'] == 'Timber Management Plan Review' && !feeExists('P109')) {
    addFee('P109', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Timberland Preserve Zone - Coastal' && feeRow['Subtype'] == 'Minor Development' && !feeExists('P110')) {
    addFee('P110', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Timberland Preserve Zone - Coastal' && feeRow['Subtype'] == 'Concept Plan' && !feeExists('P107')) {
    addFee('P107', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Timberland Preserve Zone - Coastal' && feeRow['Subtype'] == 'Development and Timber Mngmt Plan' && !feeExists('P108')) {
    addFee('P108', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Timberland Preserve Zone - Coastal' && feeRow['Subtype'] == 'Timber Management Plan Review' && !feeExists('P109')) {
    addFee('P109', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Tree Trimming Permit' && feeRow['Subtype'] == 'Heritage' && !feeExists('P117')) {
    addFee('P117', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Tree Trimming Permit' && feeRow['Subtype'] == 'Significant' && !feeExists('P118')) {
    addFee('P118', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Use Permit' && feeRow['Subtype'] == 'Initial' && !feeExists('P120')) {
    addFee('P120', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Use Permit' && feeRow['Subtype'] == 'Inspection' && !feeExists('P122')) {
    addFee('P122', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Use Permit' && feeRow['Subtype'] == 'Renewal or Amendment' && !feeExists('P123')) {
    addFee('P123', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Use Permit' && feeRow['Subtype'] == 'Second Dwelling Unit' && !feeExists('P121')) {
    addFee('P121', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Auto Wrecking Permit' && feeRow['Subtype'] == 'Initial' && !feeExists('P128')) {
    addFee('P128', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Auto Wrecking Permit' && feeRow['Subtype'] == 'Inspection' && !feeExists('P130')) {
    addFee('P130', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Auto Wrecking Permit' && feeRow['Subtype'] == 'Inspection' && !feeExists('P129')) {
    addFee('P129', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Kennel/Cattery Permit' && feeRow['Subtype'] == 'Inspection' && !feeExists('P063')) {
    addFee('P063', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Kennel/Cattery Permit' && feeRow['Subtype'] == 'Renewal or Amendment' && !feeExists('P064')) {
    addFee('P064', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Kennel/Cattery Permit' && feeRow['Subtype'] == 'Initial' && !feeExists('P065')) {
    addFee('P065', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Variance' && feeRow['Subtype'] == 'Staff Level' && !feeExists('P124')) {
    addFee('P124', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}

if (feeRow['Project Type'] == 'Variance' && feeRow['Subtype'] == 'Hearing Required' && !feeExists('P125')) {
    addFee('P125', 'P_PLN', 'FINAL', 1, 'N');
    addFee('P055', 'P_PLN', 'FINAL', '1', 'N');
    addFee('082', 'P_PLN', 'FINAL', '1', 'N');
    //addFee('081','P_PLN','FINAL','1','N');
}
