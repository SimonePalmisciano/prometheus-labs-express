function validateOrders(request, response, next) {
    const {
        guest_email,
        guest_name,
        guest_surname,
        phone_number,
        city,
        address,
        house_number,
        postal_code,
        country,
        items
    } = request.body;

    if (!request.body || typeof request.body !== "object" || Array.isArray(request.body)) {
        return response.status(400).json({
            error: "Request body is not valid",
            result: null
        });
    }

    if (typeof guest_email !== "string" || guest_email.trim().length === 0) {
        return response.status(400).json({
            error: "Email required: add a valid email address",
            result: null
        });
    }

    // RegEx validazione email: controlla che la stringa segua il pattern "stringa@stringa.stringa"
    // ^[^\s@]+ : inizia con uno o più caratteri che NON sono spazi o @
    // @        : contiene il simbolo @
    // [^\s@]+  : seguito da uno o più caratteri che NON sono spazi o @
    // \.       : contiene un punto (.)
    // [^\s@]+$ : termina con uno o più caratteri che NON sono spazi o @

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guest_email.trim())) {
        return response.status(400).json({
            error: "Email not valid: add a valid email address",
            result: null
        });
    }

    if (typeof guest_name !== "string" || guest_name.trim().length === 0) {
        return response.status(400).json({
            error: "Guest Name required: add a valid name",
            result: null
        });
    }

    if (typeof guest_surname !== "string" || guest_surname.trim().length === 0) {
        return response.status(400).json({
            error: "Guest Surname required: add a valid surname",
            result: null
        });
    }

    if (typeof phone_number !== "string" || phone_number.trim().length === 0) {
        return response.status(400).json({
            error: "Phone number is required: add a valid phone number",
            result: null
        });
    }

    // LA REGEX: pulisce il numero sostituendo con stringa vuota
    // qualsiasi tipo di spazio , il trattino -, parentesi tonde (), il +
    //  per tutte le occorrenze 

    const normalizedPhone = phone_number.replace(/[\s\-()+]/g, "");
    if (!/^\d+$/.test(normalizedPhone) || normalizedPhone.length < 6 || normalizedPhone.length > 15) {
        return response.status(400).json({
            error: "Numero di telefono non valido",
            result: null
        });
    }

    if (typeof city !== "string" || city.trim().length === 0) {
        return response.status(400).json({
            error: "City required: add a valid City",
            result: null
        });
    }

    if (typeof address !== "string" || address.trim().length === 0) {
        return response.status(400).json({
            error: "Address is quired: add a valid address",
            result: null
        });
    }

    if (typeof house_number !== "string" || house_number.trim().length === 0) {
        return response.status(400).json({
            error: "House number required: add a valid house number",
            result: null
        });
    }

    if (typeof postal_code !== "string" || postal_code.trim().length === 0) {
        return response.status(400).json({
            error: "Postal Code is required: add a valid postal code",
            result: null
        });
    }

    if (postal_code.trim().length < 3 || postal_code.trim().length > 12) {
        return response.status(400).json({
            error: "Postal Code not valid: add a valid postal code",
            result: null
        });
    }

    if (typeof country !== "string" || country.trim().length === 0) {
        return response.status(400).json({
            error: "Country field is required: add a valid Country",
            result: null
        });
    }

    if (!Array.isArray(items)) {
        return response.status(400).json({
            error: "items must be an array",
            result: null
        });
    }

    if (items.length === 0) {
        return response.status(400).json({
            error: "Order must include at least 1 product!",
            result: null
        });
    }

    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (!item || typeof item !== "object" || Array.isArray(item)) {
            return response.status(400).json({
                error: `${item} not valid`,
                result: null
            });
        }

        if (typeof item.slug !== "string" || item.slug.trim().length === 0) {
            return response.status(400).json({
                error: `${item.slug} is required`,
                result: null
            });
        }

        if (
            item.quantity === undefined ||
            !Number.isInteger(Number(item.quantity)) ||
            Number(item.quantity) <= 0
        ) {
            return response.status(400).json({
                error: `${item.quantity} not valid`,
                result: null
            });
        }
    }

    next();
}

export default validateOrders;