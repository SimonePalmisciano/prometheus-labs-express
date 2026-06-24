import connection from "../data/db.js";
import { validateSlug } from "../utils_js/validation/validateSlug.js";

export async function checkProductSlugExists(request, response, next) {
    const { slug: productSlug } = request.params;
    const validatedSlug = validateSlug(productSlug);
    console.log("products slug check: ", productSlug);
    

    if (validatedSlug === null) {
        return response.status(400).json({
            error: `Slug "${slug}" not valid`,
            result: null,
        });
    }

    try {
        const sql = `SELECT id, name, slug FROM products WHERE slug = ? LIMIT 1`;
        const [rows] = await connection.query(sql, [validatedSlug]);
        if (rows.length === 0) {
            return response.status(404).json({
                error: `Product with sug "${slug}" not found`,
                result: null
            });
        }

        request.productSlug = validatedSlug;
        request.product = rows[0];

        return next();
    } catch (error) {
        return response.status(500).json({
            error: `Internal Server Error when checking product slug: "${slug}"`,
            result: null
        });
    }

}