import express from 'express';
import { Router } from 'express';
import productsController from '../controllers/products.js';
import { checkProductSlugExists } from '../middlewares/checkProductSlugExist.js';
const productsRouter = express.Router();

productsRouter.get('/', productsController.index);

// endpoint custom per latest 10 products
productsRouter.get('/latest', productsController.showLatestTen);

// endpoint custom per all bestsellers
productsRouter.get('/bestsellers', productsController.showBestsellers);


productsRouter.get('/:slug', [checkProductSlugExists ,productsController.show]);


export default productsRouter;