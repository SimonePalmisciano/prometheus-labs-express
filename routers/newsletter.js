// Router per la gestione della newsletter
import express from "express";
import newsletterController from "../controllers/newsletter.js";

const newsletterRouter = express.Router();

newsletterRouter.post("/", newsletterController.store);

export default newsletterRouter;