export const isNumber = (value: string) => {
    let i = value.length;
    while (i--) {
        if (value.charCodeAt(i) < 48 || value.charCodeAt(i) > 57) {
            return false;
        }
    }
    return true;
}
