/*
Subscript Name: ES_ENTITLEMENT_LOOP.js
Converted from Std Choice: ES_ENTITLEMENT_LOOP
Called From Scripts:
ApplicationSpecificInfoUpdateAfter
ApplicationSubmitAfter
 */

entShortNotes = '';
if (typeof(PROJECT) == 'object') {
    for (eachrow in PROJECT)
        include('ES_ENTITLEMENTS'); /* replaced branch(ES_ENTITLEMENTS) */
}

comment('This is the length of the variable = ' + entShortNotes.length);
if (entShortNotes.length <= 120) {
    updateShortNotes(entShortNotes);
}

if (entShortNotes.length > 120) {
    updateShortNotes(entShortNotes.substring(0, 119));
}

if (entShortNotes.length > 0) {
    include('ES_PLN_DEFAULT_FEES'); /* replaced branch(ES_PLN_DEFAULT_FEES) */
}
