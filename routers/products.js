import { Router } from 'express';
import productsController from '../controllers/products.js';
import { checkProductSlugExists } from '../middlewares/checkProductSlugExist.js';
const productsRouter = Router();

// index di products
productsRouter.get('/', productsController.index);

// endpoint custom per latest 10 products
productsRouter.get('/latest', productsController.showLatestTen);

// endpoint custom per all bestsellers
productsRouter.get('/bestsellers', productsController.showBestsellers);

// endpoint per parametro filtro category
productsRouter.get('/category/:category', productsController.showProductsFiltererdByCatName);

// endpoint per parametro filtro powertype
productsRouter.get('/power/:power', productsController.showProductsFiltererdByPowerType);

// show by slug
productsRouter.get('/:slug', [checkProductSlugExists ,productsController.show]);


export default productsRouter;