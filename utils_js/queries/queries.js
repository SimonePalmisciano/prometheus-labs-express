/*======== PRODUCTS ========*/

const querySelectAllProducts = `
select p.id, p.name, p.slug, p.short_description as shortDescription, p.marketing_description as mktgDescription, 
  p.price_full as price, p.ingredients, p.created_at as createdAt, p.updated_at as updatedAt,
    p.image_main_url as imgMain, p.image_lifestyle as imgLifestyle, p.image_ksp as imgKsp
from products p
`;

const querySelectProductBySlug = `
select p.id, p.name, p.slug, p.short_description as shortDescription,
  p.marketing_description as mktgDescription, p.price_full as price, 
    p.ingredients, p.created_at as createdAt, p.updated_at as updatedAt, p.image_main_url as imgMain, p.image_lifestyle as imgLifestyle, p.image_ksp as imgKsp
from products p
where p.slug = ?;
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
