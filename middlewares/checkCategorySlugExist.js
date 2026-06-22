import connection from "../data/db.js";
import queries from "../data/queries/queries.js";
import { validateSlug } from "../utils_js/validation/validateSlug.js";

export async function checkCategorySlugExists(request, response, next) {
    const { categorySlug } = request.params;
    const validatedCatSlug = validateSlug(categorySlug);

    if (validatedCatSlug === null) {
        return response.status(400).json({
            error: "Slug non valida",
            result: null
        });
    }
    const { result: rows, error } = awquerySelectCategoriesBySlugait (validatedCatSlug); // cambiare con il nome della queries che cerca categorie per slug

    if (error === 404) {
        return response.status(404).json({
            error: "Category non trovata",
            result: null
        });
    }
    if (error === 500) {
        return response.status(500).json({
            error: "C'è stato un problema nel recuperare i dati dal db",
            result: null
        });
    }

    request.categorySlug = validatedCatSlug;

    return next();
}