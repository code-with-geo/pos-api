import express from "express";
import { authenticateToken } from "../middleware/Authentication.js";
import {
  addSubProduct,
  updateSubProduct,
  removeSubProduct,
  getAllSubProduct,
  getSubProductByID,
} from "../controller/SubProduct.js";

const router = express.Router();

router.post("/add", authenticateToken, addSubProduct);
router.put("/update", authenticateToken, updateSubProduct);
router.delete("/remove", authenticateToken, removeSubProduct);
router.get("/", authenticateToken, getAllSubProduct);
router.post("/get-by-id", authenticateToken, getSubProductByID);

export { router as SubProductRouter };
