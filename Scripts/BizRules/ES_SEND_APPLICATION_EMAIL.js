/*
Subscript Name: ES_SEND_APPLICATION_EMAIL.js
Converted from Std Choice: ES_SEND_APPLICATION_EMAIL
Called From Scripts:
ES_BLD_WORKFLOWTASKUPDATEAFTER
 */

var subject = 'Online Permit Issued';
thePerId1 = capId.getID1();
thePerId2 = capId.getID2();
thePerId3 = capId.getID3();
var t1 = 'The County of San Mateo would like to thank you for submitting your request on-line. Your permit has been issued.<br><br>';
var t2 = 'Record or Case Number: ' + capIDString + '<br>Date Submitted: ' + fileDate + '<br>Address: ' + CapAddress + '<br><br>';
var t3 = "To check the status of your permit go to <a href='https://aca-prod.accela.com/SMCGOV/Cap/CapDetail.aspx?type=1000&Module=Building&capID1='+thePerId1+'&capID2='+thePerId2+'&capID3='+thePerId3+'&agencyCode=SMCGOV'> San Mateo County - Citizen Access.</a>. To print out your permit you will need to login. Post the permit on the job site where it is clearly visible and follow the instructions to schedule an inspection.<br> The inspector must be able to see the permit when they arrive at the job site. Page 3 of the permit must be available for the inspector to sign. <br> ";
var t5 = '<br><br>Thank You,<br>County of San Mateo<br><br>[This message is automatically generated, please do not reply]';
emailContact(subject, t1 + t2 + t3 + t5);
