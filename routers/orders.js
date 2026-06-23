import express from "express";
import ordersController from "../controllers/orders.js";
import validateOrders from "../middlewares/validateOrders.js";

const ordersRouter = express.Router();

ordersRouter.get("/", ordersController.index);
ordersRouter.get("/:orderId", ordersController.show);
ordersRouter.post("/", [ validateOrders, ordersController.store]);
ordersRouter.delete("/:orderId", ordersController.destroy);

export default ordersRouter;
