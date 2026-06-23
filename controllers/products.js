import connection from "../data/db.js";
import { validateSlug } from "../utils_js/validation/validateSlug.js";
import queries from "../utils_js/queries/queries.js";
import utils from "../utils_js/utils.js";

async function index(request, response) {

    try {
        const [rows] = await connection.execute(queries.querySelectAllProducts);
        const groupedRows = utils.groupBy(rows);
    
        if (!rows || rows.length === 0) {
            return response.status(404)
                .json({
                    results: null,
                    error: 'nessun prodotto trovato a database!'
                });
        }
        return response.status(200)
            .json({
                results: groupedRows,
                error: null
            });
    } catch (error) {
        console.error('errore durante il recupero dei prodotti:', error);

        return response.status(500)
            .json({
                results: null,
                error: 'errore interno del server nel recuperare i prodotti'
            });
    }
}

async function show(request, response) {
    const slug = request.productSlug;
    console.log('lo slug del prodotto:', slug); // riga per check funzionamento da console

    try {

        const [rows] = await connection.execute(queries.querySelectProductBySlug, [slug]);
        const groupedRows = utils.groupBy(rows);
    

        if (!rows || rows.length === 0) {
            return response.status(404)
                .json({
                    results: null,
                    error: `Il database non presenta alcun prodotto con slug ${slug}!`
                });
        }

        return response.status(200)
            .json({
                results: groupedRows,
                error: null
            });

    } catch (error) {
        return response.status(500)
            .json({
                results: null,
                error: `errore interno del server nel recuperare il prodotto con slug ${slug}`
            });
    }

}

const productsController = {
    index, show
};

export default productsController;