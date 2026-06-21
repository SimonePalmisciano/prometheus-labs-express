import express from 'express';
import { Router } from 'express';
import productsController from '../controllers/products';

const productsRouter = express.Router();

productsRouter.get('/', [ index ]);

export default productsRouter;