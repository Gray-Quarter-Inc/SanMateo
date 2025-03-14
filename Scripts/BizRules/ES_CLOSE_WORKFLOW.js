/*
Subscript Name: ES_CLOSE_WORKFLOW.js
Converted from Std Choice: ES_CLOSE_WORKFLOW
Called From Scripts:
ApplicationStatusUpdateAfter
 */

if (appMatch('Building/Permit/*/*')) {
    deactivateTask('Application Submittal');
    deactivateTask('Resubmittal or Revision');
    deactivateTask('Building Review');
    deactivateTask('Planning Review');
    deactivateTask('Fire Review');
    deactivateTask('Geo Tech Review');
    deactivateTask('Geotechnical Review');
    deactivateTask('Environmental Health Review');
    deactivateTask('Public Works Review');
    deactivateTask('Sewer Review');
    deactivateTask('Misc Agency Review');
    deactivateTask('Water District Review');
    deactivateTask('C3 C6 Review');
    deactivateTask('Waste Management Review');
    deactivateTask('Ready Letter');
    deactivateTask('Ready to Issue');
    deactivateTask('Inspections');
    deactivateTask('Project Close Out');
}

if (appMatch('Building/OTC/*/*')) {
    deactivateTask('Application Submittal');
    deactivateTask('Inspections');
}

if (appMatch('Building/Stop Work Notice/*/*')) {
    deactivateTask('Complaint Received');
    deactivateTask('Investigation');
    deactivateTask('Enforcement');
    deactivateTask('Voluntary Compliance');
    deactivateTask('Court');
    deactivateTask('Final Processing');
}

if (appMatch('PublicWorks/Permit/NA/NA')) {
    deactivateTask('Application Submitted');
    deactivateTask('Pre-Site Inspection');
    deactivateTask('Map or Plan Check');
    deactivateTask('Issue Permit');
    deactivateTask('Inspections');
    deactivateTask('Final Processing');
}

if ((appMatch('Planning/Public Records Request/NA/NA') || appMatch('Planning/Research and Survey/*/*'))) {
    deactivateTask('Application Submitted');
}

if (appMatch('Planning/Zoning Violation/NA/NA')) {
    deactivateTask('Complaint Received');
    deactivateTask('Investigation');
    deactivateTask('Enforcement');
    deactivateTask('Compliance');
    deactivateTask('Court');
    deactivateTask('Final Processing');
}

if (appMatch('Planning/Project/*/*')) {
    deactivateTask('Application Submitted');
    deactivateTask('Application Completeness Review');
    deactivateTask('Agricultural Advisory Committee');
    deactivateTask('Airport Land Use Commission');
    deactivateTask('Airports');
    deactivateTask('Building Department');
    deactivateTask('CA Department of Fish and Game');
    deactivateTask('Home Owners Association');
    deactivateTask('CalTrans');
    deactivateTask('California Coastal Commission');
    deactivateTask('Certificate of Need Cmmittee');
    deactivateTask('Code Compliance');
    deactivateTask('County Counsel');
    deactivateTask('County Housing');
    deactivateTask('Department of Public Works');
    deactivateTask('Environmental Health');
    deactivateTask('Fire Department');
    deactivateTask('Geotechnical Department');
    deactivateTask('Graphics');
    deactivateTask('Historical Resources Advisory Board');
    deactivateTask('Local Agency Formation Commission');
    deactivateTask('Midcoast Community Council');
    deactivateTask('Midpeninsula Regional Open Space District');
    deactivateTask('North Fair Oaks Community Council');
    deactivateTask('Other Agency');
    deactivateTask('Parks Department');
    deactivateTask('Pescadero Municipal Advisory Council');
    deactivateTask('Planning Department');
    deactivateTask('Real Property');
    deactivateTask('Sewer Districts - Multiple');
    deactivateTask('Sonoma State');
    deactivateTask('Sphere of Influence - Multiple');
    deactivateTask('US Fish and Wildlife Service');
    deactivateTask('Water Districts - Multiple');
    deactivateTask('Project Analysis');
    deactivateTask('CEQA Preparation');
    deactivateTask('Required Advisory Committee');
    deactivateTask('Staff Decision - Hearings');
    deactivateTask('Appeals');
    deactivateTask('Project Decision');
}
