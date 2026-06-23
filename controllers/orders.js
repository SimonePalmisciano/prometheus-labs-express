import connection from "../data/db.js";
import queries from "../utils_js/queries/queries.js";

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
        res.status(500).json({ error: "Errore nel server" });
    }
};

const show = async (req, res) => {
    const { orderId } = req.params;
    console.log("id ordine: ", orderId);
    

    try {
        const [[order]] = await connection.execute(queryGetOrderById, [orderId]);
        console.log(order);
        

        if (!order) {
            return res.status(404).json({ error: "Ordine non trovato" });
        }

        const [items] = await connection.execute(queryGetOrderItems, [orderId]);

        res.json({
            ...order,
            items
        });
    } catch (error) {
        console.error("Errore nel recupero dell'ordine:", error.message);
        res.status(500).json({ error: "Errore nel server" });
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
        total_amount,
        items
    } = req.body;

    const conn = connection;

    try {
        await conn.beginTransaction();

        const [orderResult] = await conn.execute(
            `INSERT INTO orders 
            (guest_email, guest_name, guest_surname, phone_number, city, address, house_number, postal_code, country, total_amount)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [guest_email, guest_name, guest_surname, phone_number, city, address, house_number, postal_code, country, total_amount]
        );

        const orderId = orderResult.insertId;

        for (const item of items) {
            await conn.execute(
                `INSERT INTO order_products 
                (order_id, product_id, quantity, price_at_purchase)
                VALUES (?, ?, ?, ?)`,
                [orderId, item.product_id, item.quantity, item.price_at_purchase]
            );
        }

        await conn.commit();

        res.status(201).json({
            message: "Ordine creato con successo",
            order_id: orderId
        });
    } catch (error) {
        await conn.rollback();
        console.error("Errore nella creazione dell'ordine:", error);
        res.status(500).json({ error: "Errore nel server" });
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
            return res.status(404).json({ error: "Ordine non trovato" });
        }

        res.json({ message: "Ordine eliminato con successo" });
    } catch (error) {
        await conn.rollback();
        console.error("Errore nell'eliminazione dell'ordine:", error);
        res.status(500).json({ error: "Errore nel server" });
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