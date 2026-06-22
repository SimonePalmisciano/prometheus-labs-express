import express from 'express';
import { Router } from 'express';
import productsController from '../controllers/products.js';
const productsRouter = express.Router();

productsRouter.get('/', productsController.index);

productsRouter.get('/:slug', productsController.show);

export default productsRouter;