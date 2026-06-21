import connection from "../data/db.js";
import { validateSlug } from "../utils_js/validation/validateSlug.js";
import { querySelectAllProducts } from "../utils_js/queries.js";

async function index(request, response) {
    // per ora la query è una stringa di placeholder, da fixare quando abbiamo real db connection
    try {
        const [rows] = await connection.execute(querySelectAllProducts);
        if (!rows || rows.length === 0) {
            return response.status(404)
                .json({
                    results: null,
                    error: 'nessun prodotto trovato a database!'
                });
        }
        return response.status(200)
            .json({
                results: rows,
                error: null
            });
    } catch (error) {
        console.error('errore durante il recupero dei prodotti:', error);

        return response.status(500)
            .json({
                results: null,
                error: 'errore interno del server'
            });
    }
}

const productsController = {
    index
};

export default productsController;