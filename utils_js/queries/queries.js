/*======== PRODUCTS ========*/

const querySelectAllProducts = `
select p.id, p.name, p.slug, po.name as power, po.power_type, p.short_description as shortDescription, p.marketing_description as mktgDescription, c.name as category, p.price_full as price, p.ingredients, p.created_at as createdAt, p.updated_at as updatedAt, p.image_main_url as imgMain, p.image_lifestyle as imgLifestyle, p.image_ksp as imgKsp
from products p
join category_product cp on p.id = cp.product_id
join categories c on c.id = cp.category_id
join powers po on p.power_id = po.id;
`;

const querySelectProductBySlug = `
select p.id, p.name, p.slug, po.name as power, po.power_type, p.short_description as shortDescription, p.marketing_description as mktgDescription, c.name as category, p.price_full as price, p.ingredients, p.created_at as createdAt, p.updated_at as updatedAt, p.image_main_url as imgMain, p.image_lifestyle as imgLifestyle, p.image_ksp as imgKsp
from products p
join category_product cp on p.id = cp.product_id
join categories c on c.id = cp.category_id
join powers po on p.power_id = po.id
where p.slug = ?;
`;

// per controllare se product con slug = ? esiste a DB
// teniamo limit 1 per cintura di sicurezza
const queryCheckIfProductBySlug = `SELECT name, slug FROM products WHERE slug = ? LIMIT 1`;

// per le info minime di prodotto da passare in orderData
const queryProductInfoForOrderData = `
SELECT id, slug, price_full
FROM products
WHERE slug = ?
LIMIT 1
`;


/* seleziona gli ultimi 10 prodotti per data di release (latest 5)
==== NILDE SAYS:===
vi spiego perchè questa scelta - ho alzato la soglia perchè la
groupBy agisce a posteriori della ricerca della query, quindi 
depenna i risultati: avendo 10 prodotti a disposizione dalla query,
anche se un prodotto appartiene a piu categorie e viene deduplicato 
dalla groupBy, abbiamo abbastanza rows per popolare 3-5 prodotti nella
selection in home */

const querySelectLatestTenProducts = `
select p.id, p.name, p.slug, po.name as power, po.power_type, p.short_description as shortDescription, p.marketing_description as mktgDescription, c.name as category, p.price_full as price, p.ingredients, p.created_at as createdAt, p.updated_at as updatedAt, p.image_main_url as imgMain
from products p
join category_product cp on p.id = cp.product_id
join categories c on c.id = cp.category_id
join powers po on p.power_id = po.id
order by p.created_at DESC
limit 10
`;


/* mostra i primi 10  bestseller in ordine di numero di pezzi ordinati
* CHI HA INSERITO I NUMERI COME STRINGA NELLE QUANTITY DEGLI ORDINI??? 
* CHI????
* CHI È STATO???
*
* Che fa sta query?
* COME FUNZIONA QUESTA QUERY (PASSO DOPO PASSO):
  * 1. TOTALI ISOLATI: Legge 'order_products' per calcolare le somme reali dei prodotti.
  * L'uso di CAST(... AS SIGNED) garantisce che total_quantity sia un numero e non una stringa.
  *
  * 2. INNER JOIN: Unisce i prodotti con i totali appena calcolati.
  * Esclude automaticamente i prodotti con 0 ordini.
  *
  * 3. LEFT JOIN POWERS: Collega i dati dei poteri (relazione 1:1, nessun duplicato).
  *
  * 4. CATEGORIE IN LINEA: Esegue una sottoquery interna usando GROUP_CONCAT().
  * Unisce le categorie multiple in un'unica stringa (es: "bestseller,powershot").
  *
  * 5. CLASSIFICA E LIMIT: Ordina le righe uniche per quantità numerica (Dal più venduto in giù)
  * e taglia il risultato ai primi 15.
*/


const querySelectBestsellerProducts = `
SELECT 
    p.id, p.name, p.slug, 
    COALESCE(product_totals.total_quantity, 0) AS total_quantity, 
    po.name AS power, po.power_type, 
    p.short_description AS shortDescription, p.marketing_description AS mktgDescription, 
    (
        SELECT GROUP_CONCAT(c.name) 
        FROM category_product cp
        JOIN categories c ON c.id = cp.category_id
        WHERE cp.product_id = p.id
    ) AS categories,
    p.price_full AS price, p.ingredients, 
    p.created_at AS createdAt, p.updated_at AS updatedAt,
    p.image_main_url AS imgMain, p.image_lifestyle AS imgLifestyle, p.image_ksp AS imgKsp
FROM products p
INNER JOIN (
    SELECT product_id, CAST(SUM(quantity) AS SIGNED) AS total_quantity
    FROM order_products
    GROUP BY product_id
) product_totals ON product_totals.product_id = p.id
LEFT JOIN powers po ON p.power_id = po.id
ORDER BY total_quantity DESC
LIMIT 10`;

/* NON CANCELLARE - È GIA PRONTA PER POST MIGRAZIONE
 * VA SOLO SOSTITUITO 'BESTSELLERS' CON 'ICONIC'
 * 
 * const querySelectBestsellerProducts = `
select p.id, p.name, p.slug, po.name as power, po.power_type, p.short_description as shortDescription, p.marketing_description as mktgDescription, c.name as category, p.price_full as price, p.ingredients, p.created_at as createdAt, p.updated_at as updatedAt,
p.image_main_url as imgMain, p.image_lifestyle as imgLifestyle, p.image_ksp as imgKsp
from products p
join category_product cp on p.id = cp.product_id
join categories c on c.id = cp.category_id
join powers po on p.power_id = po.id
where c.name = 'bestseller'
`;
 */


/* ======= QUERY PRODUCTS PER FILTER ======= */

// restituisce tutti i dati dei prodotti associati ad una data categoria (novamorph, DailySUPer, PowerSHOT, bestseller)
const querySelectProductsByCategoryName = `
select p.id, p.name, p.slug, po.name as power, po.power_type, p.short_description as shortDescription, p.marketing_description as mktgDescription, c.name as category, p.price_full as price, p.ingredients, p.created_at as createdAt, p.updated_at as updatedAt, p.image_main_url as imgMain, p.image_lifestyle as imgLifestyle, p.image_ksp as imgKsp
from products p
join category_product cp on p.id = cp.product_id
join categories c on c.id = cp.category_id
join powers po on p.power_id = po.id
where c.name = ?;
`;

// restituisce tutti i dati dei prodotti associati ad un power type (physical, psychic)
const querySelectProductByPowerType = `
select p.id, p.name, p.slug, po.name as power, po.power_type, p.short_description as shortDescription, p.marketing_description as mktgDescription, c.name as category, p.price_full as price, p.ingredients, p.created_at as createdAt, p.updated_at as updatedAt, p.image_main_url as imgMain, p.image_lifestyle as imgLifestyle, p.image_ksp as imgKsp
from products p
join category_product cp on p.id = cp.product_id
join categories c on c.id = cp.category_id
join powers po on p.power_id = po.id
where po.power_type = ?;
`;

/* ======= QUERY PRODUCTS PER SEARCHSTRING ======= */

// consente di trovare prodotti dove ? è contenuto (anche in mezzo alla 
// parola, non solo inizio e fine) in uno dei seguenti elementi:
// product name, short description, marketing description
// category name (nome linea o bestseller)
// power name 
// power type

const querySelectProductBySearchString = `
select p.id, p.name, p.slug, po.name as power, po.power_type, p.short_description as shortDescription, p.marketing_description as mktgDescription, c.name as category, p.price_full as price, p.ingredients, p.created_at as createdAt, p.updated_at as updatedAt, p.image_main_url as imgMain, p.image_lifestyle as imgLifestyle, p.image_ksp as imgKsp
from products p
join category_product cp on p.id = cp.product_id
join categories c on c.id = cp.category_id
join powers po on p.power_id = po.id
where po.power_type like ?
or p.name like ?
or p.short_description like ?
or p.marketing_description like ?
or po.name like ?;
`;


/*======== CATEGORIES ========*/

const querySelectAllCategories = `
select c.id, c.name, c.slug
from categories c;
`;

const querySelectCategoriesBySlug = `
select c.id, c.name, c.slug
from categories c
where slug = ?;
`;

/*======== POWERS ========*/

const querySelectAllPowers = `
select p.id, p.name, p.power_type as powerType
from powers p;
`;

const querySelectPowerById = `
select p.id, p.name, p.power_type as powerType
from powers p
where p.id = ?;
`;

/*======== ORDERS ========*/

const queryGetAllOrders = `
SELECT id, guest_email, total_amount, created_at,
guest_name, guest_surname, city, country
FROM orders
ORDER BY created_at DESC
`;

// limit 1 lo teniamo per cintura di sicurezza anche se id è chiave univoca
const queryGetOrderById = `
SELECT *
FROM orders
WHERE id = ?
LIMIT 1 
`;

const queryGetOrderItems = `
SELECT
    op.product_id,
    op.quantity,
    op.price_at_purchase,
    p.name,
    p.slug,
    p.image_main_url
FROM order_products op
JOIN products p ON p.id = op.product_id
WHERE op.order_id = ?
`;

const queryDeleteOrderProductsByOrderId = `
DELETE FROM order_products 
WHERE order_id = ?;
`;

const queryDeleteOrderByOrderId = `
DELETE FROM orders 
WHERE id = ?;
`;

/*======== EXPORT ========*/

const queries = {
    // Products
    querySelectAllProducts,
    querySelectProductBySlug,
    queryCheckIfProductBySlug,
    querySelectLatestTenProducts,
    querySelectBestsellerProducts,
    querySelectProductsByCategoryName,
    querySelectProductByPowerType,
    querySelectProductBySearchString,
    queryProductInfoForOrderData,
    queryDeleteOrderProductsByOrderId,
    queryDeleteOrderByOrderId,

    // Categories
    querySelectAllCategories,
    querySelectCategoriesBySlug,

    // Powers
    querySelectAllPowers,
    querySelectPowerById,

    // Orders
    queryGetAllOrders,
    queryGetOrderById,
    queryGetOrderItems
};

export default queries;
