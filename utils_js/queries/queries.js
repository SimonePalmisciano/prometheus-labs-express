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

// mostra i primi 10  bestseller in ordine di id

const querySelectBestsellerProducts = `
select p.id, p.name, p.slug, po.name as power, po.power_type, p.short_description as shortDescription, p.marketing_description as mktgDescription, c.name as category, p.price_full as price, p.ingredients, p.created_at as createdAt, p.updated_at as updatedAt,
p.image_main_url as imgMain, p.image_lifestyle as imgLifestyle, p.image_ksp as imgKsp
from products p
join category_product cp on p.id = cp.product_id
join categories c on c.id = cp.category_id
join powers po on p.power_id = po.id
where c.name = 'bestseller'
`;

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
