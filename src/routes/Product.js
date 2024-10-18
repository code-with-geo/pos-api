import express from "express";
import { addProduct } from "../controller/Products.js";
import { authenticateToken } from "../middleware/Authentication.js";

const router = express.Router();

router.post("/add", authenticateToken, addProduct);

export { router as ProductRouter };
