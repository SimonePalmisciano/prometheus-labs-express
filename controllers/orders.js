import connection from "../data/db.js";
import queries from "../utils_js/queries/queries.js";
import { sendUserEmail, sendAdminEmail } from "../utils_js/mailer/mailer.js";

const {
    queryGetAllOrders,
    queryGetOrderById,
    queryGetOrderItems
} = queries;


const index = async (request, response) => {
    try {
        const [orders] = await connection.execute(queryGetAllOrders);
        response.json(orders);
    } catch (error) {
        console.error("An error occurred while fetching orders in the database:", error);
        response.status(500).json({ error: "Internal Server Error while getting order list" });
    }
};

const show = async (request, response) => {
    const { orderId } = request.params;


    try {
        const [[order]] = await connection.execute(queryGetOrderById, [orderId]);

        if (!order) {
            return response.status(404).json({ error: `order wtih ID ${orderId} not found` });
        }

        const [items] = await connection.execute(queryGetOrderItems, [orderId]);

        response.json({
            ...order,
            items
        });
    } catch (error) {
        console.error(`Internal Server Error while looking for order witrh ID ${orderId}`, error.message);
        response.status(500).json({ error: `Internal Server Error while looking with the order wtih ID ${orderId}` });
    }
};

const store = async (request, response) => {
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

    const conn = connection;

    try {
        await conn.beginTransaction();


        const validatedItems = [];
        let total_amount = 0;

        // mi restituisce array con slug di prodotto
        const slugs = items.map(item => {
            return item.slug.trim();
        })
        // sostituisce nella query dinamica gli slug
        const placeholders = slugs.map(() => '?').join(',');

        // mostra dettagli prodotto il cui slug è compreso nella lista degli slug
        // ricavati in modo dinamico dalla map fatta sugli slug estratti da items
        // NON può essere separata dalla def di placeholders generato dalla map!
        const querySelectProductBySlugInItemsSlugs = `
        SELECT id, slug, price_full FROM products WHERE slug IN (${placeholders})
        `;

        // INTERROGA DB con quetry dinamica costruita con il map
        // mi serve qui e non in queries??
        // INTANTO VEDIAMO SE FUNZION DOTTOR FRANKENSTEIN
        const [products] = await conn.execute(
            querySelectProductBySlugInItemsSlugs, // questa mi crea i placeholder del numero esatto degli slugs
            slugs // devo fare si che tutti gli slug venano aggiunti come parametro [?, ?, ?]
        );

        // creare un oggetto per ciascun prodotto
        // il for of associare slug a prodotto
        const productLookup = {};
        for (const p of products) {
            productLookup[p.slug] = p;
        }
        console.log(productLookup);
        

        for (const item of items) {
            const slug = item.slug.trim();
            const quantity = Number(item.quantity);

            // cerchiamo nell'oggetto lookup la fetch che abbiamo gia fatto a priori
            const product = productLookup[slug]; 
            console.log(product);

            if (!product) {
                const error = new Error(`Product with slug "${slug}" not found`);
                error.statusCode = 404;
                throw error;
            }

            const price_at_purchase = Number(product.price_full);

            total_amount += price_at_purchase * quantity;

            validatedItems.push({
                product_id: product.id,
                slug: product.slug,
                quantity,
                price_at_purchase
            });
        }

        total_amount = Number(total_amount.toFixed(2));

        const [orderResult] = await conn.execute(
            `INSERT INTO orders
            (
                guest_email,
                guest_name,
                guest_surname,
                phone_number,
                city,
                address,
                house_number,
                postal_code,
                country,
                total_amount
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                guest_email,
                guest_name,
                guest_surname,
                phone_number,
                city,
                address,
                house_number,
                postal_code,
                country,
                total_amount
            ]
        );

        const orderId = orderResult.insertId;

        for (const item of validatedItems) {
            await conn.execute(
                `INSERT INTO order_products
                (order_id, product_id, quantity, price_at_purchase)
                VALUES (?, ?, ?, ?)`,
                [
                    orderId,
                    item.product_id,
                    item.quantity,
                    item.price_at_purchase
                ]
            );
        }

        await conn.commit();

        const orderData = { orderId, guest_email, guest_name, guest_surname, total_amount, address, house_number, country, city, phone_number, validatedItems };
        // invio email all'utente e all'admin dopo la creazione dell'ordine
        await sendUserEmail(orderData);
        await sendAdminEmail(orderData);

        return response.status(201).json({
            message: "Ordine creato con successo",
            order_id: orderId,
            total_amount
        });
    } catch (error) {
        await conn.rollback();

        console.error("Errore nella creazione dell'ordine:", error);

        return response.status(error.statusCode || 500).json({
            error: error.message || "Internal Server Error while getting the order"
        });
    }
};

const destroy = async (req, res) => {
    const { orderId } = req.params;

    const conn = connection;

    try {
        await conn.beginTransaction();

        await conn.execute(queries.queryDeleteOrderProductsByOrderId, [orderId]);
        const [result] = await conn.execute(queries.queryDeleteOrderByOrderId, [orderId]);

        await conn.commit();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `order with ID ${orderId} not found` });
        }

        res.json({ message: `Order with id ${orderId}successfully deleted from datatbase` });
    } catch (error) {
        await conn.rollback();
        console.error(`An error occurred while deleting Order with id ${orderId} from datatbase`, error);
        res.status(500).json({ error: `Internal Server Error while deleting order with ID ${orderId}` });
    } finally {
        conn.release();
    }
};


const ordersController = {
    index,
    show,
    store,
    destroy
};

export default ordersController;