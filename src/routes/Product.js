import express from "express";
import {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductUnits,
  increaseProductUnits,
  decreaseProductUnits,
} from "../controller/Products.js";
import { authenticateToken } from "../middleware/Authentication.js";

const router = express.Router();

router.post("/add", authenticateToken, addProduct);
router.get("/all", authenticateToken, getAllProducts);
router.get("/:productId", authenticateToken, getProductById);
router.put("/update/:productId", authenticateToken, updateProduct);
router.put("/update-units/:productId", authenticateToken, updateProductUnits);
router.put(
  "/increase-units/:productId",
  authenticateToken,
  increaseProductUnits
);
router.put(
  "/decrease-units/:productId",
  authenticateToken,
  decreaseProductUnits
);
router.delete("/delete/:productId", authenticateToken, deleteProduct);

export { router as ProductRouter };
