function validateString(string) {
        if (typeof string !== "string" || string.trim().length === 0) {
        return null;
    }

    return string.trim();
}
export default validateString;