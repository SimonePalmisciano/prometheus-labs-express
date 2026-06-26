import { Router } from "express";
import powersController from "../controllers/powers.js";

const powersRouter = Router();

powersRouter.get("/", powersController.index);

powersRouter.get("/:powerId", powersController.show);

export default powersRouter;