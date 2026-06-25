import connection from "../data/db.js";
import queries from "../utils_js/queries/queries.js";
import { validateSlug } from "../utils_js/validation/validateSlug.js";

export async function checkCategorySlugExists(request, response, next) {
    const { categorySlug } = request.params;
    const validatedCatSlug = validateSlug(categorySlug);
    

    if (validatedCatSlug === null) {
        return response.status(400).json({
            error: `Slug "${categorySlug}" is not valid`,
            result: null
        });
    }
    const { result: rows, error } = await connection.execute(queries.querySelectCategoriesBySlug, [validatedCatSlug]);

    if (error === 404) {
        return response.status(404).json({
            error: `Category with slug "${categorySlug}" not found`,
            result: null
        });
    }
    if (error === 500) {
        return response.status(500).json({
            error: `Internal Server Error when checking category slug: "${categorySlug}"`,
            result: null
        });
    }

    request.categorySlug = validatedCatSlug;

    return next();
}