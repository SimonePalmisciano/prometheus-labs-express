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
            error: "Request body non valido",
            result: null
        });
    }

    if (typeof guest_email !== "string" || guest_email.trim().length === 0) {
        return response.status(400).json({
            error: "Email obbligatoria",
            result: null
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guest_email.trim())) {
        return response.status(400).json({
            error: "Email non valida",
            result: null
        });
    }

    if (typeof guest_name !== "string" || guest_name.trim().length === 0) {
        return response.status(400).json({
            error: "Nome obbligatorio",
            result: null
        });
    }

    if (typeof guest_surname !== "string" || guest_surname.trim().length === 0) {
        return response.status(400).json({
            error: "Cognome obbligatorio",
            result: null
        });
    }

    if (typeof phone_number !== "string" || phone_number.trim().length === 0) {
        return response.status(400).json({
            error: "Numero di telefono obbligatorio",
            result: null
        });
    }

    const normalizedPhone = phone_number.replace(/[\s\-()+]/g, "");
    if (!/^\d+$/.test(normalizedPhone) || normalizedPhone.length < 6 || normalizedPhone.length > 15) {
        return response.status(400).json({
            error: "Numero di telefono non valido",
            result: null
        });
    }

    if (typeof city !== "string" || city.trim().length === 0) {
        return response.status(400).json({
            error: "Città obbligatoria",
            result: null
        });
    }

    if (typeof address !== "string" || address.trim().length === 0) {
        return response.status(400).json({
            error: "Indirizzo obbligatorio",
            result: null
        });
    }

    if (typeof house_number !== "string" || house_number.trim().length === 0) {
        return response.status(400).json({
            error: "Numero civico obbligatorio",
            result: null
        });
    }

    if (typeof postal_code !== "string" || postal_code.trim().length === 0) {
        return response.status(400).json({
            error: "CAP obbligatorio",
            result: null
        });
    }

    if (postal_code.trim().length < 3 || postal_code.trim().length > 12) {
        return response.status(400).json({
            error: "CAP non valido",
            result: null
        });
    }

    if (typeof country !== "string" || country.trim().length === 0) {
        return response.status(400).json({
            error: "Paese obbligatorio",
            result: null
        });
    }

    if (!Array.isArray(items)) {
        return response.status(400).json({
            error: "items deve essere un array",
            result: null
        });
    }

    if (items.length === 0) {
        return response.status(400).json({
            error: "L'ordine deve contenere almeno un prodotto",
            result: null
        });
    }

    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (!item || typeof item !== "object" || Array.isArray(item)) {
            return response.status(400).json({
                error: `items[${i}] non è valido`,
                result: null
            });
        }

        if (typeof item.slug !== "string" || item.slug.trim().length === 0) {
            return response.status(400).json({
                error: `items[${i}].slug obbligatorio`,
                result: null
            });
        }

        if (
            item.quantity === undefined ||
            !Number.isInteger(Number(item.quantity)) ||
            Number(item.quantity) <= 0
        ) {
            return response.status(400).json({
                error: `items[${i}].quantity non valida`,
                result: null
            });
        }
    }

    next();
}

export default validateOrders;