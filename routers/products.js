import express from 'express';
import { Router } from 'express';
import productsController from '../controllers/products.js';
import { checkProductSlugExists } from '../middlewares/checkProductSlugExist.js';
const productsRouter = express.Router();

productsRouter.get('/', productsController.index);

// endpoint custom per latest 5 products
productsRouter.get('/latest', productsController.showLatestFive);


productsRouter.get('/:slug', [checkProductSlugExists ,productsController.show]);


export default productsRouter;