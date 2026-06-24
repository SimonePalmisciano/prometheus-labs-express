import connection from "../data/db.js";
import { validateSlug } from "../utils_js/validation/validateSlug.js";
import queries from "../utils_js/queries/queries.js";

async function index(request, response) {

    try {
        const [results] = await connection.execute(queries.querySelectAllCategories);
        if (results.length === 0) {
            return response.status(404)
                .json({
                    result: null,
                    error: 'Categories not found'
                });
        }
        return response.status(200)
            .json({
                result: results,
                error: null
            });
    } catch (error) {
        return response.status(500)
            .json({
                result: null,
                error: 'Internal Server Errors when fetching Categories'
            });
    }
}

async function show(request, response) {
    const slug = request.categorySlug;
    console.log("slugcat val: ", slug);

    try {

        const [results] = await connection.execute(queries.querySelectCategoriesBySlug, [slug]);

        if (results.length === 0) {
            return response.status(404)
                .json({
                    result: null,
                    error: `Category with slug "${slug} not found`
                });
        }
        return response.status(200)
            .json({
                result: results[0],
                error: null
            });
    } catch (error) {
        return response.status(500)
            .json({
                result: null,
                error: `Internal Server Error when looking for Category with slug "${slug}`
            });
    }
}

const categoriesController = {
    index,
    show
}

export default categoriesController;