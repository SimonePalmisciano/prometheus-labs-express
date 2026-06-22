import connection from "../data/db.js";
import { validateSlug } from "../utils_js/validation/validateSlug.js";

export async function checkProductSlugExists(request, response, next) {
    const { slug: productSlug } = request.params;
    const validatedSlug = validateSlug(productSlug);

    if (validatedSlug === null) {
        return response.status(400).json({
            error: "Slug non valida",
            result: null,
        });
    }

    try {
        const sql = `SELECT id, name, slug FROM products WHERE slug = ? LIMIT 1`;
        const [rows] = await connection.query(sql, [validatedSlug]);
        if (rows.length === 0) {
            return response.status(404).json({
                error: "Prodotto non trovato",
                result: null
            });
        }

        request.productSlug = validatedSlug;
        request.product = rows[0];

        return next();
    } catch (error) {
        return response.status(500).json({
            error: "C'è stato un problema nel recuperare i dati dal db",
            result: null
        });
    }

}