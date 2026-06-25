import connection from "../data/db.js";
import queries from "../utils_js/queries/queries.js";
import utils from "../utils_js/utils.js";

async function index(request, response) {

    try {
        const { search } = request.query;
        let rows = [];

        if (search) {
            const searchParamFormatted = `%${search}%`;
            [rows] = await connection.execute(queries.querySelectProductBySearchString, [
                searchParamFormatted,
                searchParamFormatted,
                searchParamFormatted,
                searchParamFormatted,
                searchParamFormatted
            ]);

        } else {
            [rows] = await connection.execute(queries.querySelectAllProducts);
        }

        if (!rows || rows.length === 0) {
            return response.status(404)
                .json({
                    result: null,
                    error: 'No product available in the database'
                });
        }

        const groupedRows = utils.groupBy(rows);

        return response.status(200)
            .json({
                result: groupedRows,
                error: null
            });
    } catch (error) {
        console.error('Error retrieving products:', error);

        return response.status(500)
            .json({
                result: null,
                error: 'Internal Server Error when looking for Products'
            });
    }
}

async function show(request, response) {
    const slug = request.productSlug;

    try {

        const [rows] = await connection.execute(queries.querySelectProductBySlug, [slug]);
        const groupedRows = utils.groupBy(rows);

        if (!rows || rows.length === 0) {
            return response.status(404)
                .json({
                    result: null,
                    error: `No Product in the database with slug "${slug}" available in the database`
                });
        }

        return response.status(200)
            .json({
                result: groupedRows,
                error: null
            });

    } catch (error) {
        return response.status(500)
            .json({
                result: null,
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
                    result: null,
                    error: 'No Product available in the database'
                });
        }
        return response.status(200)
            .json({
                result: groupedRows,
                error: null
            });
    } catch (error) {
        console.error('Error retrieving products:', error);

        return response.status(500)
            .json({
                result: null,
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
                    result: null,
                    error: 'No Product available in the database'
                });
        }
        return response.status(200)
            .json({
                result: groupedRows,
                error: null
            });
    } catch (error) {
        console.error('Error retrieving products:', error);

        return response.status(500)
            .json({
                result: null,
                error: 'Internal Server Error when looking for Products'
            });
    }
}

async function showProductsFilteredByCatName(request, response) {

    try {
        const { category } = request.params;
        const [rows] = await connection.execute(queries.querySelectProductsByCategoryName, [category]);
        const groupedRows = utils.groupBy(rows);

        if (!rows || rows.length === 0) {
            return response.status(404)
                .json({
                    result: null,
                    error: 'No Product available in the database'
                });
        }
        return response.status(200)
            .json({
                result: groupedRows,
                error: null
            });
    } catch (error) {
        console.error('Error retrieving products:', error);

        return response.status(500)
            .json({
                result: null,
                error: 'Internal Server Error when looking for Products'
            });
    }
}

async function showProductsFilteredByPowerType(request, response) {

    try {
        const { power } = request.params;
        const [rows] = await connection.execute(queries.querySelectProductByPowerType, [power]);
        const groupedRows = utils.groupBy(rows);

        if (!rows || rows.length === 0) {
            return response.status(404)
                .json({
                    result: null,
                    error: 'No Product available in the database'
                });
        }
        return response.status(200)
            .json({
                result: groupedRows,
                error: null
            });
    } catch (error) {
        console.error('Error retrieving products:', error);

        return response.status(500)
            .json({
                result: null,
                error: 'Internal Server Error when looking for Products'
            });
    }
}


const productsController = {
    index,
    show,
    showLatestTen,
    showBestsellers,

    // alias temporanei per compatibilità con eventuali route già esistenti
    showProductsFiltererdByCatName: showProductsFilteredByCatName,
    showProductsFiltererdByPowerType: showProductsFilteredByPowerType
};

export default productsController;