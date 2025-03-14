/*******************************************************
| Script/Function: getInspLimitForDate(calendarName, dateStr)
| Created by: Nicolaj Bunting
| Created on: 3Feb21
| Usage: get inspection limit as int for date dateStr (formatted as MM/dd/YYYY) from calendar with calendarName
| Modified by:  24Jan22 Jei Yang - Updated the getConnection codes as per Accela's recent update request. (DevOps #12668)
|               Made changes so the function returns 0 when no record is returned but there was no error.
| Modified by: Sheryll Tabamo  - April 25 2022 - cleaning up Java Classes code and Java instance. 
*********************************************************/
function getInspLimitForDate(calendarName, dateStr) {
    Avo_LogDebug("getInspLimitForDate(" + calendarName + ', ' + dateStr + ")", 1);

    var selectString = "SELECT\
    C.CALENDAR_ID,\
    C.CALENDAR_NAME,\
    CE.START_DATE,\
    CE.ALLOCATED_UNITS,\
    CE.SCHEDULE_ALLOCATED_UNITS,\
    CE.MAX_UNITS \
FROM CALENDAR C \
INNER JOIN CALENDAR_EVENT CE\
	ON	C.CALENDAR_ID = CE.CALENDAR_ID \
WHERE c.Serv_Prov_Code = '" + aa.getServiceProviderCode() + "'\
	And C.CALENDAR_NAME = '" + calendarName + "'\
	AND Cast(CE.START_DATE as date) = Convert(date, '" + dateStr + "', 101)";

    try {
        var conn = aa.db.getConnection();
        var sqlStatement = aa.db.prepareStatement(conn, selectString);

        var resultSet = sqlStatement.executeQuery();
        //var metadata = resultSet.getMetaData();
        //var totalColumns = metadata.getColumnCount();
        //Avo_LogDebug("Total columns(" + totalColumns + ")", 2);	//debug

        var returnVal = 0;

        while (resultSet.next()) {
            var allocUnits = resultSet.getInt("ALLOCATED_UNITS");
            //Avo_LogDebug("Alloc Units(" + allocUnits + ")", 2); //debug

            var schedAllocUnits = resultSet.getInt("SCHEDULE_ALLOCATED_UNITS");
            //Avo_LogDebug("Scheduled Alloc Units(" + schedAllocUnits + ")", 2); //debug

            var maxUnits = resultSet.getInt("MAX_UNITS");
            //Avo_LogDebug("Max Units(" + maxUnits + ")", 2);   //debug

            returnVal = maxUnits;
        }
    }
    catch (e) {
        Avo_LogDebug("Exception getting data from CALENDAR: " + e.message, 1);
        returnVal = -1;
    }
    finally {
        if (sqlStatement) {
            sqlStatement.close();

            if (resultSet) {
                resultSet.close();
            }
        }

        conn.close();
    }

    return returnVal;
}