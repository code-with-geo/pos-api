import express from "express";
import { authenticateToken } from "../middleware/Authentication.js";
import {
  addProductType,
  removeProductType,
  updateProductType,
} from "../controller/ProductType.js";

const router = express.Router();

router.post("/add", authenticateToken, addProductType);
router.put("/update", authenticateToken, updateProductType);
router.delete("/remove", authenticateToken, removeProductType);

export { router as ProductTypeRouter };
