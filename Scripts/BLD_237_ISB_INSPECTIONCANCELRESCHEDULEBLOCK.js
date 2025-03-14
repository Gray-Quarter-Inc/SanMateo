/*******************************************************
| Script/Function: inspectionCancelRescheduleBlock() - (ID237)
| Created by: Jei Yang
| Created on: 16Mar21
| Usage: On inspection scheduled, block inspection schedule request from ACA with the message
| "Inspection cannot be scheduled because there is a balance due on the record. The balance due is " + balanceDue + "."
| Modified by: ()
*********************************************************/
(function () {
    try {
        if (!publicUser && !matches(currentUserID, "IVRUSER") && !matches(currentUserID, "AVOCETTE")) {
            Avo_LogDebug('User is not "IVRUSER" nor a public user.', 2);   //debug
            return;
        }

        var cutoffTime = 18;
        //cutoffTime = 9; //testing

        var currentDateTime = new Date();
        var currentDateTimeStr = aa.util.formatDate(currentDateTime, "MM/dd/yyyy");

        var nextWorkDayStr = dateAdd(currentDateTimeStr, 1, "Y");
        var nextWorkDay = Avo_GetDateFromAccelaDateString(nextWorkDayStr);

        Avo_LogDebug("Current datetime hour: " + currentDateTime.getHours(), 2); //debug
        Avo_LogDebug("Next Work Day(" + nextWorkDay + ")", 2);	//debug
        Avo_LogDebug("Next Work Day Str(" + nextWorkDayStr + ")", 2);	//debug
        Avo_LogDebug("vEventName(" + vEventName + ")", 2);	//debug

        var idNumber;
        //helperObjectInfo(inspectionModel);
        if (vEventName == "InspectionCancelBefore") {
            if (inspectionModel.inspectionStatus != "Scheduled") {
                return;
            }
            //Cancellation

            idNumber = inspectionModel.idNumber;
            Avo_LogDebug("idNumber: " + idNumber, 2);

            var inspDate = Avo_GetDateFromAccelaDateString(inspectionModel.activityDate);
            var inspDateStr = aa.util.formatDate(inspDate, "MM/dd/yyyy");
            Avo_LogDebug("Insp Date(" + inspDate + ")", 2);   //debug
            Avo_LogDebug("Insp Date Str(" + inspDateStr + ")", 2);   //debug

            if (nextWorkDay < inspDate) {
                Avo_LogDebug("Inspection can be scheduled at this date.", 2);	//debug
                return;
            } else if (nextWorkDay > inspDate) {
                //empty condition
            } else if (currentDateTime.getHours() < cutoffTime) {
                Avo_LogDebug("Inspection can be scheduled before 4PM.", 2);	//debug
                return;
            }

            cancel = true;
            showMessage = true;
            Avo_LogDebug("inspectionCancelRescheduleBlock", 1);

            var message = "Inspections cannot be cancelled after 4PM, 1 business day prior to the inspection date. Please call the office: 650-599-7311";
            comment(message);
            if (publicUser) {
                throw new Error(message);
            }
            return;
        } else if (typeof inspId !== 'undefined') { //Inspection Reschedule or Schedule.
            idNumber = inspId;
            //Rescheduled
            var result = aa.inspection.getInspection(capId, idNumber);
            if (result.getSuccess() != true) {
                Avo_LogDebug("Failed to get Inspection " + idNumber + ". " + result.errorType + ": " + result.errorMessage, 1);
                return;
            }

            var inspection = result.getOutput();

            var inspType = inspection.inspectionType;
            Avo_LogDebug("Insp(" + inspType + ")", 2);  //debug

            var status = String(insp.documentDescription);
            Avo_LogDebug("Status(" + status + ")", 2);  //debug

            var inspResult = inspection.inspectionStatus;
            Avo_LogDebug("Insp Result(" + inspResult + ")", 2);   //debug

            //Only pending or scheduled inspections can be re-scheduled
            if (status != 'Insp Pending' && status != 'Insp Scheduled') {
                return;
            }

            // Get Scheduled date
            var inspDate, inspDateStr;

            if (publicUser) {
                inspDate = new Date(InspectionDate.time);
                inspDate.setHours(0, 0, 0, 0);
                inspDateStr = aa.util.formatDate(inspDate, "MM/dd/yyyy");
            } else {
                inspDateStr = inspSchedDate;
                inspDate = Avo_GetDateFromAccelaDateString(inspDateStr);
            }
        } else {
            //In ACA, inspId can be undefined.
            Avo_LogDebug("Inspection ID is undefined yet", 2); //Inspection Schedule Before

            Avo_LogDebug("Insp Date Obj(" + InspectionDate + ")", 2);   //debug
            //Avo_LogDebug("Insp Date Class(" + InspectionDate.class + ")", 2);   //debug

            if (InspectionDate.class == 'class java.lang.String') {
                inspDate = Avo_GetDateFromAccelaDateString(InspectionDate);
            } else {
                inspDate = new Date(InspectionDate.time);
                inspDate.setHours(0, 0, 0, 0);
            }

            inspDateStr = aa.util.formatDate(inspDate, "MM/dd/yyyy");
        }

        Avo_LogDebug("Insp Date(" + inspDate + ")", 2);   //debug
        Avo_LogDebug("Scheduled Date(" + inspDateStr + ")", 2);	//debug

        if (nextWorkDay < inspDate) {
            Avo_LogDebug("Inspection can be scheduled at this date.", 2);	//debug
            return;
        } else if (nextWorkDay > inspDate) {
            Avo_LogDebug("empty condition", 2); //debug
        } else if (currentDateTime.getHours() < cutoffTime) {
            Avo_LogDebug("Inspection can be scheduled before 4PM.", 2);	//debug
            return;
        }

        cancel = true;
        showMessage = true;
        Avo_LogDebug("inspectionCancelRescheduleBlock", 1);

        comment("Inspections cannot be scheduled after 4PM, 1 business day prior to the inspection date. \
Please call the office: 650-599-7311");
    } catch (ex) {
        Avo_LogDebug("**Error in inspectionCancelRescheduleBlock(): " + ex.message, 1);
    }
})();

//aa.sendMail("noreply@smcgov.org", "PI_Test@avocette.com", "", "SMC Prod: BLD_237_ISB_InspectionCancelRescheduleBlock", debug); //debug