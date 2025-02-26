import express from "express";
import {
  createOrder,
  cancelOrder,
  getOrderByInvoiceNumber,
  getPendingOrders,
  getOrderProductsByOrderId,
  getAllOrders,
  getTodayTransactionCount,
  getTop10TodaySales,
  getTodaySales,
  updateOrderStatus,
  updatePaymentStatus,
} from "../controller/Orders.js";
import { authenticateToken } from "../middleware/Authentication.js";

const router = express.Router();

router.post("/create", authenticateToken, createOrder);
router.put("/cancel/:invoiceNumber", authenticateToken, cancelOrder);
router.put(
  "/order-status/:invoiceNumber",
  authenticateToken,
  updateOrderStatus
);
router.put(
  "/payment-status/:invoiceNumber",
  authenticateToken,
  updatePaymentStatus
);
router.get(
  "/invoice/:invoiceNumber",
  authenticateToken,
  getOrderByInvoiceNumber
);
router.get("/pending", authenticateToken, getPendingOrders);
router.get(
  "/order-products/:orderID",
  authenticateToken,
  getOrderProductsByOrderId
);
router.get("/all-orders", authenticateToken, getAllOrders);
router.get(
  "/today/transaction-count",
  authenticateToken,
  getTodayTransactionCount
);
router.get("/today/top-products", authenticateToken, getTop10TodaySales);
router.get("/today/sales", authenticateToken, getTodaySales);

export { router as OrderRouter };
