try {
    if (publicUser) {
        if (!appMatch("Planning/Zoning Violation/NA/NA"))
            addActiveViolationCondition(capId);
    }    
} catch (err) {
    logDebug("An error occurred in ASA;PLANNING!~!~!~: " + err.message);
    logDebug(err.stack);
}