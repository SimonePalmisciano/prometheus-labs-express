export function validateSlug(value) {
    if (typeof value !== "string") {
        return null;
    }

    const trimmedValue = value.trim();

    if (trimmedValue.length === 0) {
        return null;
    }

    if (/^\d+$/.test(trimmedValue)) {
        return null;
    }

    return trimmedValue;
}