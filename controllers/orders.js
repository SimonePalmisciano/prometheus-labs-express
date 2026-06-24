import connection from "../data/db.js";
import queries from "../utils_js/queries/queries.js";
import { sendUserEmail, sendAdminEmail } from "../utils_js/mailer/mailer.js";

const {
    queryGetAllOrders,
    queryGetOrderById,
    queryGetOrderItems
} = queries;


const index = async (req, res) => {
    try {
        const [orders] = await connection.execute(queryGetAllOrders);
        res.json(orders);
    } catch (error) {
        console.error("Errore nel recupero degli ordini:", error);
        res.status(500).json({ error: "Internal Server Error while getting order list" });
    }
};

const show = async (req, res) => {
    const { orderId } = req.params;
    console.log("id ordine: ", orderId);


    try {
        const [[order]] = await connection.execute(queryGetOrderById, [orderId]);
        console.log(order);


        if (!order) {
            return res.status(404).json({ error: `order wtih ID ${orderId} not found` });
        }

        const [items] = await connection.execute(queryGetOrderItems, [orderId]);

        res.json({
            ...order,
            items
        });
    } catch (error) {
        console.error(`Internal Server Error while looking for order witrh ID ${orderId}`, error.message);
        res.status(500).json({ error: `Internal Server Error while looking with the order wtih ID ${orderId}` });
    }
};

const store = async (req, res) => {
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
    } = req.body;

    const conn = connection;

    try {
        await conn.beginTransaction();

        const validatedItems = [];
        let total_amount = 0;

        for (const item of items) {
            const slug = item.slug.trim();
            const quantity = Number(item.quantity);

            const [products] = await conn.execute(
                `SELECT id, slug, price_full
                FROM products
                WHERE slug = ?
                LIMIT 1`,
                [slug]
            );

            if (products.length === 0) {
                const error = new Error(`Product with slug "${slug}" not found`);
                error.statusCode = 404;
                throw error;
            }

            const product = products[0];
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
        // invio email all'utente e all'admin dopo la creazione dell'ordine
        await sendUserEmail({ guest_email, guest_name, total_amount });
        await sendAdminEmail({ guest_name, guest_surname, guest_email, city, country, total_amount });

        return res.status(201).json({
            message: "Ordine creato con successo",
            order_id: orderId,
            total_amount
        });
    } catch (error) {
        await conn.rollback();

        console.error("Errore nella creazione dell'ordine:", error);

        return res.status(error.statusCode || 500).json({
            error: error.message || "Internal Server Error while getting the order"
        });
    }
};

const destroy = async (req, res) => {
    const { orderId } = req.params;

    const conn = connection;

    try {
        await conn.beginTransaction();

        await conn.execute(`DELETE FROM order_products WHERE order_id = ?`, [orderId]);
        const [result] = await conn.execute(`DELETE FROM orders WHERE id = ?`, [orderId]);

        await conn.commit();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `order with ID ${orderId} not found` });
        }

        res.json({ message: "Ordine eliminato con successo" });
    } catch (error) {
        await conn.rollback();
        console.error("Errore nell'eliminazione dell'ordine:", error);
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