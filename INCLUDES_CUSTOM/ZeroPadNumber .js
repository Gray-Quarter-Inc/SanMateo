function ZeroPadNumber (nValue) {
    if (nValue < 10) {
        return '00' + nValue.toString();
    } else if (nValue < 100) {
        return '0' + nValue.toString();
    } else {
        return nValue;
    }
}
