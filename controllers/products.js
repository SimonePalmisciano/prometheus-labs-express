import connection from "../data/db.js";
import { validateSlug } from "../utils_js/validation/validateSlug.js";
import queries from "../utils_js/queries/queries.js";
import utils from "../utils_js/utils.js";

async function index(request, response) {

    try {
        const { search } = request.query;
        let rows = [];

        if (search) {
            const searchParamFormatted = `%${search}%`;
            [rows] = await connection.execute(queries.querySelectProductBySearchString, [searchParamFormatted, searchParamFormatted, searchParamFormatted, searchParamFormatted, searchParamFormatted]);

        } else {
            [rows] = await connection.execute(queries.querySelectAllProducts);
        }
    
        if (!rows || rows.length === 0) {
            return response.status(404)
                .json({
                    results: null,
                    error: 'No product available in the database'
                });
        }

        const groupedRows = utils.groupBy(rows);
        
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
                error: 'Internal Server Error when looking for Products'
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
                    error: `No Product in the database with slug "${slug}" available in the database`
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
                error: `Internal Server Error when looking for product with slug  "${slug}"`
            });
    }

}

async function showLatestTen(request, response) {

    try {
        const [rows] = await connection.execute(queries.querySelectLatestTenProducts);
        const groupedRows = utils.groupBy(rows);
    
        if (!rows || rows.length === 0) {
            return response.status(404)
                .json({
                    results: null,
                    error: 'No Product available in the database'
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
                error: 'Internal Server Error when looking for Products'
            });
    }
}

async function showBestsellers(request, response) {

    try {
        const [rows] = await connection.execute(queries.querySelectBestsellerProducts);
        const groupedRows = utils.groupBy(rows);
    
        if (!rows || rows.length === 0) {
            return response.status(404)
                .json({
                    results: null,
                    error: 'No Product available in the database'
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
                error: 'Internal Server Error when looking for Products'
            });
    }
}

async function showProductsFiltererdByCatName(request, response) {

    try {
        const  { category } = request.params;
        const [rows] = await connection.execute(queries.querySelectProductsByCategoryName,[category]);
        const groupedRows = utils.groupBy(rows);
    
        if (!rows || rows.length === 0) {
            return response.status(404)
                .json({
                    results: null,
                    error: 'No Product available in the database'
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
                error: 'Internal Server Error when looking for Products'
            });
    }
}

async function showProductsFiltererdByPowerType(request, response) {

    try {
        const  { power } = request.params;
        const [rows] = await connection.execute(queries.querySelectProductByPowerType, [power]);
        const groupedRows = utils.groupBy(rows);
    
        if (!rows || rows.length === 0) {
            return response.status(404)
                .json({
                    results: null,
                    error: 'No Product available in the database'
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
                error: 'Internal Server Error when looking for Products'
            });
    }
}


const productsController = {
    index, show, showLatestTen, showBestsellers, showProductsFiltererdByCatName,showProductsFiltererdByPowerType,
};

export default productsController;