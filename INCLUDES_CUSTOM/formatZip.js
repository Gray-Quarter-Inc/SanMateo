function formatZip(zip) {
    zip = String(zip);

    if (zip.length == 5) {
        zip += "-0000";
    }
    if (zip.length == 9) {
        var prefix = zip.substring(0, 5);
        var suffix = zip.substring(5);

        zip = prefix + "-" + suffix;
    }

    logDebug("Zip(" + zip + ")");	//debug
    return zip;
}
